import { NativeModules, Platform } from 'react-native';
import { NativeStorageProvider } from './NativeStorageProvider';
import { PamAPI } from './api';
import type IConfig from './interface/iconfig';
import PamTracker from './PamTracker';
import type { ConsentMessage } from './interface/consent_message';
import { type AppAttentionStyle } from './interface/app_attention_style';
import { Linking } from 'react-native';

const LINKING_ERROR =
  `The package 'pam-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const openURL = async (url: string) => {
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    console.log(`Don't know how to open URL: ${url}`);
  }
};

const PamReactNative = NativeModules.PamReactNative
  ? NativeModules.PamReactNative
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return PamReactNative.multiply(a, b);
}

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
  static appAttentionStyle?: AppAttentionStyle;

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
    };

    const storageProvider = new NativeStorageProvider();
    Pam.pamApi = new PamAPI(baseApi);
    Pam._instance = new PamTracker(newConfig, storageProvider);
  }

  static setAppAttentionStyle(appAttentionStyle: AppAttentionStyle) {
    Pam.appAttentionStyle = appAttentionStyle;
  }

  static async appAttention(
    pageName: string,
    onClickBanner?:
      | ((banner: any) => boolean)
      | ((banner: any) => Promise<boolean>)
  ) {
    // console.log('appAttention', pageName);

    // const banner = {
    //   title: 'title',
    //   description: 'description',
    //   image:
    //     'https://s3-ap-southeast-1.amazonaws.com/pam4-sansiri/ecom/public/2sFQrLjdyBbXkHkAMV03HrNtbhC.jpg',
    //   size: 'large',
    // };

    // PamReactNative.displayPopup(banner, btnColor, btnLabel, btnLabelColor);

    const contectID = Pam._instance.contactState?.getContactId();
    if (contectID) {
      const appAttention = await Pam.pamApi.loadAppAttention(
        pageName,
        contectID
      );
      console.log('appAttention', JSON.stringify(appAttention, null, 2));
      if (appAttention && Object.keys(appAttention).length > 0) {
        const btnColor = Pam.appAttentionStyle?.buttonColor ?? '';
        const btnLabel = Pam.appAttentionStyle?.buttonLabel ?? '';
        const btnLabelColor = Pam.appAttentionStyle?.buttonLabelColor ?? '';

        await PamReactNative.displayPopup(
          appAttention,
          btnColor,
          btnLabel,
          btnLabelColor
        );
        let defaultMethod = true;
        if (onClickBanner) {
          if (onClickBanner.constructor.name === 'AsyncFunction') {
            const takeAction = await onClickBanner(appAttention);
            defaultMethod = !takeAction;
          } else {
            const takeAction = onClickBanner(appAttention);
            defaultMethod = !takeAction;
          }
        }

        if (defaultMethod) {
          openURL(appAttention.url);
        }
      } else {
        console.log('appAttention is undefined');
      }
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
