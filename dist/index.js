"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  Pam: () => Pam,
  multiply: () => multiply
});
module.exports = __toCommonJS(index_exports);

// src/NativePamReactNative.ts
var import_react_native = require("react-native");
var NativePamReactNative_default = import_react_native.TurboModuleRegistry.getEnforcing("PamReactNative");

// src/index.tsx
var import_pamtag = __toESM(require("pamtag"));

// src/NativeStorageProvider.ts
var import_storage_provider = require("pamtag/build/types/storage_provider");
var import_async_storage = __toESM(require("@react-native-async-storage/async-storage"));
var NativeStorageProvider = class {
  async setLocalStorage(key, value) {
    try {
      await import_async_storage.default.setItem(`lc_${key}`, value);
      console.log("Data saved successfully");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }
  async getLocalStorage(key) {
    try {
      const value = await import_async_storage.default.getItem(`lc_${key}`);
      if (value !== null) {
        return value;
      }
    } catch (error) {
    }
    return null;
  }
  deleteLocalStorage(key) {
    import_async_storage.default.removeItem(`lc_${key}`);
  }
  setCookie(name, value, hours) {
    const expireDate = /* @__PURE__ */ new Date();
    if (hours) {
      expireDate.setHours(expireDate.getHours() + hours);
    }
    import_async_storage.default.setItem(`ck_${name}`, value);
    import_async_storage.default.setItem(`ck_${name}_expires`, expireDate.getTime().toString());
  }
  async getCookie(name) {
    console.log("getCookie", name);
    try {
      const value = await import_async_storage.default.getItem(`ck_${name}`);
      const expireTimestampStr = await import_async_storage.default.getItem(
        `ck_${name}_expires`
      );
      if (expireTimestampStr === null) {
        return null;
      }
      const expireDate = new Date(parseInt(expireTimestampStr || "0", 10));
      const now = /* @__PURE__ */ new Date();
      if (expireDate.getTime() < now.getTime()) {
        this.deleteCookie(name);
        return null;
      }
      if (value !== null) {
        return value;
      }
    } catch (error) {
      console.log("getCookie error", error);
    }
    return null;
  }
  deleteCookie(name) {
    import_async_storage.default.removeItem(`ck_${name}`);
    import_async_storage.default.removeItem(`ck_${name}_expires`);
  }
};

// src/index.tsx
var import_consent_message = require("pamtag/build/types/interface/consent_message");

// src/PamAPI.ts
var PamAPI = class {
  baseApiPath;
  constructor(baseApiPath) {
    this.baseApiPath = baseApiPath;
  }
  async loadAppAttention(pageName, contactID) {
    if (!contactID) {
      return void 0;
    }
    try {
      const response = await fetch(`${this.baseApiPath}/app-attention`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          page_name: pageName,
          _contact_id: contactID
        })
      });
      console.log("status", response.status);
      if (response.status < 200 || response.status > 299) {
        return void 0;
      }
      const data = await response.json();
      if (Object.keys(data).length === 0) {
        return void 0;
      }
      return data;
    } catch (error) {
      console.error("Error:", error.message);
      return void 0;
    }
  }
};

// src/index.tsx
var import_react_native2 = require("react-native");
var { EventEmitter } = import_react_native2.NativeModules;
var eventEmitter = new import_react_native2.NativeEventEmitter(EventEmitter);
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
    _Pam._instance = new import_pamtag.default(newConfig, storageProvider);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Pam,
  multiply
});
