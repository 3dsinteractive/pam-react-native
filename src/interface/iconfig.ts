export default interface IConfig {
  webPushPublicKey?: string;
  baseApi: string;
  trackingConsentMessageId: string;
  contactingConsentMessageIds?: string[];
  publicDBAlias: string;
  loginDBAlias: string;
  loginKey?: string;
  autoTrackPageview?: boolean;
  sessionExpireTimeMinutes?: number; // default 60 min
  displayCookieConsentBarOnStartup?: boolean;
  preferLanguage?: string;
  gtmConsentMode?: boolean;
  facebookConsentMode?: boolean;
  block_events_if_no_consent?: boolean;
}
