import PamReactNative from './NativePamReactNative';
import PamTracker from 'pamtag';
import type IConfig from 'pamtag/build/types/interface/iconfig';

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
  constructor() {}

  static get shared(): PamTracker | undefined {
    if (!Pam._instance) {
      console.log('Pam not initialize yet.');
      return undefined;
    }
    return Pam._instance;
  }

  static initialize(config: PamConfig) {
    const newConfig: IConfig = {
      baseApi: config.baseApi,
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

    Pam._instance = new PamTracker(newConfig);
  }

  static async track(event: string, payload: Record<string, any>) {
    return await Pam.shared?.track(event, payload);
  }
}

export function multiply(a: number, b: number): number {
  return PamReactNative.multiply(a, b);
}
