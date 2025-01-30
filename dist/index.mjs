import {
  NativePamReactNative_default
} from "./chunk-MKLAQXMO.mjs";
import {
  NativeStorageProvider
} from "./chunk-YQZRJM34.mjs";
import {
  PamAPI
} from "./chunk-JC36NV3G.mjs";

// src/index.tsx
import PamTracker from "pamtag";
import "pamtag/build/types/interface/consent_message";
import { NativeEventEmitter, NativeModules } from "react-native";
var { EventEmitter } = NativeModules;
var eventEmitter = new NativeEventEmitter(EventEmitter);
eventEmitter.addListener("OnBannerClick", (event) => {
  console.log("Received event from native:", event);
});
var Pam = class _Pam {
  static _instance;
  static pamApi;
  constructor() {
  }
  static get shared() {
    if (!_Pam._instance) {
      console.log("Pam not initialize yet.");
      return void 0;
    }
    return _Pam._instance;
  }
  static initialize(config) {
    const baseApi = config.baseApi.endsWith("/") ? config.baseApi.slice(0, -1) : config.baseApi;
    const newConfig = {
      baseApi,
      trackingConsentMessageId: config.trackingConsentMessageId,
      publicDBAlias: config.publicDBAlias,
      loginDBAlias: config.loginDBAlias,
      loginKey: config.loginKey,
      autoTrackPageview: false,
      gtmConsentMode: false,
      facebookConsentMode: false,
      preferLanguage: "th",
      displayCookieConsentBarOnStartup: false,
      mobileAppMode: true
    };
    const storageProvider = new NativeStorageProvider();
    console.log("Pam create", newConfig);
    _Pam.pamApi = new PamAPI(baseApi);
    _Pam._instance = new PamTracker(newConfig, storageProvider);
  }
  static async appAttention(pageName) {
    console.log("appAttention", pageName);
    const banner = {
      title: "title",
      description: "description",
      image: "https://s3-ap-southeast-1.amazonaws.com/pam4-sansiri/ecom/public/2sFQrLjdyBbXkHkAMV03HrNtbhC.jpg",
      size: "large"
    };
    NativePamReactNative_default.displayPopup(banner);
  }
  static async track(event, payload) {
    return await _Pam.shared?.track(event, payload);
  }
  static async allowAllContactConsent(consentId, flushEventBefore, cookieLess, extrasPayload) {
    return _Pam.shared?.allowAllContactConsent(
      consentId,
      flushEventBefore,
      cookieLess,
      extrasPayload
    );
  }
  static async allowAllTrackingConsent(consentId, flushEventBefore, cookieLess, extrasPayload) {
    return _Pam.shared?.allowAllTrackingConsent(
      consentId,
      flushEventBefore,
      cookieLess,
      extrasPayload
    );
  }
  static async userLogin(loginId) {
    return _Pam.shared?.userLogin(loginId);
  }
  static async userLogout() {
    return _Pam.shared?.userLogout();
  }
  static async loadConsentStatus(consentMessageId) {
    return _Pam.shared?.loadConsentStatus(consentMessageId);
  }
  static eventBucket(callBack) {
    return _Pam.shared?.eventBucket(callBack);
  }
  static async cleanPamCookies() {
    return _Pam.shared?.cleanPamCookies();
  }
  static async submitConsent(consent, flushEventBefore, cookieLess, extrasPayload) {
    return _Pam.shared?.submitConsent(
      consent,
      flushEventBefore,
      cookieLess,
      extrasPayload
    );
  }
  static async loadConsentDetails(consentMessageIDs) {
    return _Pam.shared?.loadConsentDetails(consentMessageIDs);
  }
  static async loadConsentDetail(consentMessageID) {
    return _Pam.shared?.loadConsentDetail(consentMessageID);
  }
};
function multiply(a, b) {
  return NativePamReactNative_default.multiply(a, b);
}
export {
  Pam,
  multiply
};
