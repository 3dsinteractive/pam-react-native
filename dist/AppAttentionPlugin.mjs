// src/AppAttentionPlugin.ts
import "pamtag";
import { Plugin } from "pamtag/build/types/core/plugin";
var AppAttentionPlugin = class extends Plugin {
  initPlugin(pam) {
    console.log("AppAttentionPlugin initPlugin", pam);
  }
};
export {
  AppAttentionPlugin
};
