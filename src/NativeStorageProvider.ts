import { IStorageProvider } from 'pamtag/build/types/storage_provider';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class NativeStorageProvider implements IStorageProvider {
  async setLocalStorage(key: string, value: string) {
    try {
      await AsyncStorage.setItem(`lc_${key}`, value);
      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  async getLocalStorage(key: string): Promise<string | null> {
    try {
      const value = await AsyncStorage.getItem(`lc_${key}`);
      if (value !== null) {
        return value;
      }
    } catch (error) {}
    return null;
  }

  deleteLocalStorage(key: string): void {
    AsyncStorage.removeItem(`lc_${key}`);
  }

  setCookie(name: string, value: string, hours?: number): void {
    const expireDate = new Date();
    if (hours) {
      expireDate.setHours(expireDate.getHours() + hours); // บวก 5 ชั่วโมง
    }
    AsyncStorage.setItem(`ck_${name}`, value);
    AsyncStorage.setItem(`ck_${name}_expires`, expireDate.getTime().toString());
  }

  async getCookie(name: string): Promise<string | null> {
    try {
      const value = await AsyncStorage.getItem(`ck_${name}`);
      const expireTimestampStr = await AsyncStorage.getItem(
        `ck_${name}_expires`
      );
      if (expireTimestampStr === null) {
        return null;
      }

      const expireDate = new Date(parseInt(expireTimestampStr || '0', 10));
      const now = new Date();
      if (expireDate.getTime() < now.getTime()) {
        this.deleteCookie(name);
        return null;
      }
      if (value !== null) {
        return value;
      }
    } catch (error) {}
    return null;
  }

  deleteCookie(name: string): void {
    AsyncStorage.removeItem(`ck_${name}`);
    AsyncStorage.removeItem(`ck_${name}_expires`);
  }
}
