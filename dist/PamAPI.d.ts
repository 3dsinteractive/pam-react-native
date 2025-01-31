declare class PamAPI {
    baseApiPath: string;
    constructor(baseApiPath: string);
    loadAppAttention(pageName: string, contactID: string): Promise<Record<string, any> | undefined>;
}

export { PamAPI };
