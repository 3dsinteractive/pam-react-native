import PamReactNative from './NativePamReactNative';
import PamTracker from 'pamtag';
import type IConfig from 'pamtag/build/types/interface/iconfig';
import { NativeStorageProvider } from './NativeStorageProvider';
import { ConsentMessage } from 'pamtag/build/types/interface/consent_message';
import { PamAPI } from './PamAPI';
import { NativeEventEmitter, NativeModules } from 'react-native';

const { EventEmitter } = NativeModules;
const eventEmitter = new NativeEventEmitter(EventEmitter);

// const subscription =
eventEmitter.addListener('OnBannerClick', (event) => {
  console.log('Received event from native:', event);
});

interface PamConfig {
  baseApi: string;
  trackingConsentMessageId: string;
  publicDBAlias: string;
  loginDBAlias: string;
  loginKey?: string;
}

export type { PamConfig };

export class Pam {
  static _instance: PamTracker;
  static pamApi: PamAPI;

  constructor() {}

  static get shared(): PamTracker | undefined {
    if (!Pam._instance) {
      console.log('Pam not initialize yet.');
      return undefined;
    }
    return Pam._instance;
  }

  static initialize(config: PamConfig) {
    const baseApi = config.baseApi.endsWith('/')
      ? config.baseApi.slice(0, -1)
      : config.baseApi;

    const newConfig: IConfig = {
      baseApi: baseApi,
      trackingConsentMessageId: config.trackingConsentMessageId,
      publicDBAlias: config.publicDBAlias,
      loginDBAlias: config.loginDBAlias,
      loginKey: config.loginKey,
      autoTrackPageview: false,
      gtmConsentMode: false,
      facebookConsentMode: false,
      preferLanguage: 'th',
      displayCookieConsentBarOnStartup: false,
      mobileAppMode: true,
    };

    const storageProvider = new NativeStorageProvider();

    console.log('Pam create', newConfig);
    Pam.pamApi = new PamAPI(baseApi);
    Pam._instance = new PamTracker(newConfig, storageProvider);
  }

  static async appAttention(pageName: string) {
    console.log('appAttention', pageName);

    // const banner = {
    //   title: 'title',
    //   description: 'description',
    //   image:
    //     'https://s3-ap-southeast-1.amazonaws.com/pam4-sansiri/ecom/public/2sFQrLjdyBbXkHkAMV03HrNtbhC.jpg',
    //   size: 'large',
    // };

    // PamReactNative.displayPopup(banner);
    const contectID = Pam._instance.contactState.getContactId();
    const appAttention = await Pam.pamApi.loadAppAttention(pageName, contectID);
    if (appAttention) {
      PamReactNative.displayPopup(appAttention);
    } else {
      console.log('appAttention is undefined');
    }
  }

  static async track(event: string, payload: Record<string, any>) {
    return await Pam.shared?.track(event, payload);
  }

  static async allowAllContactConsent(
    consentId: string,
    flushEventBefore?: boolean,
    cookieLess?: boolean,
    extrasPayload?: Record<string, any>
  ) {
    return Pam.shared?.allowAllContactConsent(
      consentId,
      flushEventBefore,
      cookieLess,
      extrasPayload
    );
  }

  static async allowAllTrackingConsent(
    consentId: string,
    flushEventBefore?: boolean,
    cookieLess?: boolean,
    extrasPayload?: Record<string, any>
  ) {
    return Pam.shared?.allowAllTrackingConsent(
      consentId,
      flushEventBefore,
      cookieLess,
      extrasPayload
    );
  }

  static async userLogin(loginId: string) {
    return Pam.shared?.userLogin(loginId);
  }

  static async userLogout() {
    return Pam.shared?.userLogout();
  }

  static async loadConsentStatus(consentMessageId: string) {
    return Pam.shared?.loadConsentStatus(consentMessageId);
  }

  static eventBucket(callBack: () => void) {
    return Pam.shared?.eventBucket(callBack);
  }

  static async cleanPamCookies() {
    return Pam.shared?.cleanPamCookies();
  }

  static async submitConsent(
    consent: ConsentMessage,
    flushEventBefore?: boolean,
    cookieLess?: boolean,
    extrasPayload?: Record<string, any>
  ) {
    return Pam.shared?.submitConsent(
      consent,
      flushEventBefore,
      cookieLess,
      extrasPayload
    );
  }

  static async loadConsentDetails(consentMessageIDs: string[]) {
    return Pam.shared?.loadConsentDetails(consentMessageIDs);
  }

  static async loadConsentDetail(consentMessageID: string) {
    return Pam.shared?.loadConsentDetail(consentMessageID);
  }
}

export function multiply(a: number, b: number): number {
  return PamReactNative.multiply(a, b);
}

// export function displayPopup(): void {
//   PamReactNative.displayPopup();
// }
