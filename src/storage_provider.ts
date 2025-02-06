// Base class interface for storage providers
export interface IStorageProvider {
  setLocalStorage(key: string, value: string): void | Promise<void>;

  getLocalStorage(key: string): string | null | Promise<string | null>;

  deleteLocalStorage(key: string): void | Promise<void>;

  setCookie(name: string, value: string, hours?: number): void | Promise<void>;

  getCookie(name: string): string | null | Promise<string | null>;

  deleteCookie(name: string): void | Promise<void>;
}
