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

// src/NativeStorageProvider.ts
var NativeStorageProvider_exports = {};
__export(NativeStorageProvider_exports, {
  NativeStorageProvider: () => NativeStorageProvider
});
module.exports = __toCommonJS(NativeStorageProvider_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NativeStorageProvider
});
