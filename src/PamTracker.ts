import type IConfig from './interface/iconfig';
import { PamAPI } from './api';
import { QueueManager, type RequestJob } from './queue_manager';
import { type ITrackerResponse } from './interface/itracker_response';
import { ConsentMessage } from './interface/consent_message';
import { Utils } from './utils';
import { Hook } from './core/hook';
import { PluginRegistration } from './plugins/index';
import { ContactStateManager } from './contact_state_manager';
import { HashGenerator } from './crypto/HashGenerator';
import { type LoginOptions } from './options/LoginOptions';
import { type ICustomerConsentStatus } from './interface/iconsent_status';
import type { IStorageProvider } from './storage_provider';

class PamTracker {
  storage?: IStorageProvider;
  config: IConfig;
  api?: PamAPI;
  contactState?: ContactStateManager;
  hook = new Hook();
  ready = false;

  hashGenerator = new HashGenerator();

  queueManager = new QueueManager<ITrackerResponse>(50, async (jobs) => {
    if (jobs.length === 1) {
      const job = jobs[0];
      if (!job) return [];

      let jsonPayload = this.buildEventPayload(job);

      // Hook Pre Event
      const jsonPayload2 = await this.hook.dispatchPreTracking(
        job.event,
        jsonPayload
      );
      if (jsonPayload2) {
        jsonPayload = jsonPayload2;
      }

      if (jsonPayload && jsonPayload.cancel === true) {
        this.hook.dispatchPostTracking(job.event, jsonPayload, {
          cancelled: true,
        });
        return [{ cancelled: true }];
      }
      const response = await this.api?.postTracker(jsonPayload);
      if (response) {
        // Hook Post Event
        this.hook.dispatchPostTracking(job.event, jsonPayload, response);
        return [response];
      }

      return [];
    } else if (jobs.length > 1) {
      let events: Record<string, any>[] = [];

      for (const i in jobs) {
        const job = jobs[i];
        if (job) {
          let jsonPayload = this.buildEventPayload(job);
          const jsonPayload2 = await this.hook.dispatchPreTracking(
            job.event,
            jsonPayload
          );
          if (jsonPayload2) {
            jsonPayload;
          }

          if (jsonPayload && jsonPayload.cancel !== true) {
            events.push(jsonPayload);
          }
        }
      }

      if (events.length === 0) {
        return [];
      }

      events = this.bringAllowConsentToTheFirstOrder(events);

      let useSameContact = true;
      if (events && events.length > 0 && events[0]?._contact_id) {
        useSameContact = false;
      }

      const response = await this.api?.postTrackers(useSameContact, events);

      for (const i in response?.results || []) {
        const r = response?.results[i];
        const e = events[i];
        let evt = '';
        if (!e) {
          continue;
        }

        if (e.hasOwnProperty('event')) {
          evt = e.event;
        } else {
          evt = '__error';
        }
        this.hook.dispatchPostTracking(evt, e, r ?? {});
      }

      return response?.results ?? [];
    }

    return [];
  });

  constructor(config: IConfig, storage?: IStorageProvider) {
    Utils.setConfig(config);
    if (storage) {
      this.storage = storage;
      Utils.setStorageProvider(storage);
    }

    if (!config.preferLanguage) {
      config.preferLanguage = 'th';
    }
    this.config = config;

    this.initialize(config);
  }

  private async initialize(config: IConfig) {
    this.api = new PamAPI(config.baseApi);

    //Contact state will handle the state inside plugins/login_state.ts
    this.contactState = new ContactStateManager(
      config.publicDBAlias,
      config.loginDBAlias,
      config.loginKey ?? ''
    );
    await this.contactState.resumeSession();

    if (!this.config.sessionExpireTimeMinutes) {
      this.config.sessionExpireTimeMinutes = 60;
    }

    const plugins = PluginRegistration.getPlugins(config);

    try {
      for (const i in plugins) {
        if (plugins[i]) {
          plugins[i].initPlugin(this);
        }
      }
    } catch (e) {}

    // Hook StartUp
    this.hook.dispatchOnStartup(config);
    this.ready = true;
  }

  bringAllowConsentToTheFirstOrder(
    events: Record<string, any>[]
  ): Record<string, any>[] {
    const allowConsentObjects = events.filter(
      (obj: any) => obj.event === 'allow_consent'
    );
    events = events.filter((obj: any) => obj.event !== 'allow_consent');
    return [...allowConsentObjects, ...events];
  }

  buildEventPayload(job: RequestJob<ITrackerResponse>) {
    const payload = this.api?.getDefaultPayload() ?? {};
    payload.event = job.event;

    let form_fields = { ...job.data };
    if (!job.data?._consent_message_id) {
      form_fields._consent_message_id = job.trackingConsentMessageId;
    }

    if (job.cookieLess === true) {
      form_fields._cookie_less = true;
    }

    payload.form_fields = {
      ...form_fields,
    };

    return payload;
  }

  async userLogin(loginId: string, options: LoginOptions = {}) {
    const loginKey = this.config.loginKey;
    const data: Record<string, any> = {};

    // Track Login To Public
    let job: RequestJob<ITrackerResponse> = {
      event: 'login',
      trackingConsentMessageId: this.config.trackingConsentMessageId,
      data: data,
      flushEventBefore: false,
    };

    try {
      await this.queueManager.enqueueJob(job);
    } catch (e: any) {}

    // Track Login To Login
    if (options.alternate_key) {
      data._key_name = options.alternate_key;
      data._key_value = loginId;
      data[options.alternate_key] = loginId;
      data._force_create = false;
    } else {
      data[loginKey ?? ''] = loginId;
    }

    job = {
      event: 'login',
      trackingConsentMessageId: this.config.trackingConsentMessageId,
      data: data,
      flushEventBefore: true,
    };

    return await this.queueManager.enqueueJob(job);
  }

  async userLogout() {
    const job: RequestJob<ITrackerResponse> = {
      event: 'logout',
      trackingConsentMessageId: this.config.trackingConsentMessageId,
      data: {},
      flushEventBefore: false,
    };
    return this.queueManager.enqueueJob(job);
  }

  async track(
    event: string,
    payload: Record<string, any> = {},
    flushEventBefore: boolean = false,
    cookieLess: boolean = false
  ) {
    const job: RequestJob<ITrackerResponse> = {
      event: event,
      trackingConsentMessageId: this.config.trackingConsentMessageId,
      data: payload,
      flushEventBefore: flushEventBefore,
      cookieLess: cookieLess,
    };

    return this.queueManager.enqueueJob(job);
  }

  async loadConsentStatus(
    consentMessageId: string
  ): Promise<ICustomerConsentStatus> {
    let contactId = this.contactState?.getContactId();
    if (contactId) {
      return await this.api!.loadConsentStatus(contactId, consentMessageId);
    }
    return {
      need_consent_review: true,
    };
  }

  eventBucket(callBack: () => void) {
    this.queueManager.openBucket();
    callBack();
    this.queueManager.closeBucket();
  }

  async cleanPamCookies() {
    this.hook.dispatchOnClean(this.config);
  }

  async allowAllContactConsent(
    consentId: string,
    flushEventBefore: boolean = false,
    cookieLess: boolean = false,
    extrasPayload: Record<string, any> = {}
  ) {
    const job: RequestJob<ITrackerResponse> = {
      event: 'allow_consent',
      trackingConsentMessageId: consentId,
      data: {
        _version: 'latest',
        _allow_terms_and_conditions: true,
        _allow_privacy_overview: true,
        _allow_email: true,
        _allow_sms: true,
        _allow_line: true,
        _allow_facebook_messenger: true,
        _allow_push_notification: true,
        ...extrasPayload,
      },
      flushEventBefore: flushEventBefore,
      cookieLess: cookieLess,
    };
    return this.queueManager.enqueueJob(job);
  }

  async allowAllTrackingConsent(
    consentId: string,
    flushEventBefore: boolean = false,
    cookieLess: boolean = false,
    extrasPayload: Record<string, any> = {}
  ) {
    const job: RequestJob<ITrackerResponse> = {
      event: 'allow_consent',
      trackingConsentMessageId: consentId,
      data: {
        _version: 'latest',
        _allow_terms_and_conditions: true,
        _allow_privacy_overview: true,
        _allow_necessary_cookies: true,
        _allow_preferences_cookies: true,
        _allow_analytics_cookies: true,
        _allow_marketing_cookies: true,
        _allow_social_media_cookies: true,
        ...extrasPayload,
      },
      flushEventBefore: flushEventBefore,
      cookieLess: cookieLess,
    };
    return this.queueManager.enqueueJob(job);
  }

  async submitConsent(
    consent: ConsentMessage,
    flushEventBefore: boolean = false,
    cookieLess: boolean = false,
    extrasPayload: Record<string, any> = {}
  ) {
    var payload = {
      ...consent.buildFormField(),
      ...extrasPayload,
    };

    const job: RequestJob<ITrackerResponse> = {
      event: 'allow_consent',
      trackingConsentMessageId: consent.data.consent_message_id,
      data: payload,
      flushEventBefore: flushEventBefore,
      cookieLess,
    };

    return this.queueManager.enqueueJob(job);
  }

  async loadConsentDetails(consentMessageIDs: string[]) {
    const result = await this.api!.loadConsentDetails(consentMessageIDs);
    return result;
  }

  async loadConsentDetail(consentMessageID: string) {
    const result = await this.api!.loadConsentDetails([consentMessageID]);
    return result[consentMessageID];
  }
}

export default PamTracker;
