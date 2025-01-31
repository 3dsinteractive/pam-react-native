import { IStorageProvider } from 'pamtag/build/types/storage_provider';

declare class NativeStorageProvider implements IStorageProvider {
    setLocalStorage(key: string, value: string): Promise<void>;
    getLocalStorage(key: string): Promise<string | null>;
    deleteLocalStorage(key: string): void;
    setCookie(name: string, value: string, hours?: number): void;
    getCookie(name: string): Promise<string | null>;
    deleteCookie(name: string): void;
}

export { NativeStorageProvider };
