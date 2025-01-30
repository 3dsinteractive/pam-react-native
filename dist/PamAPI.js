"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/PamAPI.ts
var PamAPI_exports = {};
__export(PamAPI_exports, {
  PamAPI: () => PamAPI
});
module.exports = __toCommonJS(PamAPI_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PamAPI
});
