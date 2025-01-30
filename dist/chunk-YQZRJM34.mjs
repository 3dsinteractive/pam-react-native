// src/NativeStorageProvider.ts
import "pamtag/build/types/storage_provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
var NativeStorageProvider = class {
  async setLocalStorage(key, value) {
    try {
      await AsyncStorage.setItem(`lc_${key}`, value);
      console.log("Data saved successfully");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }
  async getLocalStorage(key) {
    try {
      const value = await AsyncStorage.getItem(`lc_${key}`);
      if (value !== null) {
        return value;
      }
    } catch (error) {
    }
    return null;
  }
  deleteLocalStorage(key) {
    AsyncStorage.removeItem(`lc_${key}`);
  }
  setCookie(name, value, hours) {
    const expireDate = /* @__PURE__ */ new Date();
    if (hours) {
      expireDate.setHours(expireDate.getHours() + hours);
    }
    AsyncStorage.setItem(`ck_${name}`, value);
    AsyncStorage.setItem(`ck_${name}_expires`, expireDate.getTime().toString());
  }
  async getCookie(name) {
    console.log("getCookie", name);
    try {
      const value = await AsyncStorage.getItem(`ck_${name}`);
      const expireTimestampStr = await AsyncStorage.getItem(
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
    AsyncStorage.removeItem(`ck_${name}`);
    AsyncStorage.removeItem(`ck_${name}_expires`);
  }
};

export {
  NativeStorageProvider
};
