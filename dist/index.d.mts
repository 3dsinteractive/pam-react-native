import * as pamtag_build_types_interface_iconsent_status from 'pamtag/build/types/interface/iconsent_status';
import * as pamtag_build_types_interface_itracker_response from 'pamtag/build/types/interface/itracker_response';
import PamTracker from 'pamtag';
import { ConsentMessage } from 'pamtag/build/types/interface/consent_message';
import { PamAPI } from './PamAPI.mjs';

interface PamConfig {
    baseApi: string;
    trackingConsentMessageId: string;
    publicDBAlias: string;
    loginDBAlias: string;
    loginKey?: string;
}

declare class Pam {
    static _instance: PamTracker;
    static pamApi: PamAPI;
    constructor();
    static get shared(): PamTracker | undefined;
    static initialize(config: PamConfig): void;
    static appAttention(pageName: string): Promise<void>;
    static track(event: string, payload: Record<string, any>): Promise<pamtag_build_types_interface_itracker_response.ITrackerResponse | undefined>;
    static allowAllContactConsent(consentId: string, flushEventBefore?: boolean, cookieLess?: boolean, extrasPayload?: Record<string, any>): Promise<pamtag_build_types_interface_itracker_response.ITrackerResponse | undefined>;
    static allowAllTrackingConsent(consentId: string, flushEventBefore?: boolean, cookieLess?: boolean, extrasPayload?: Record<string, any>): Promise<pamtag_build_types_interface_itracker_response.ITrackerResponse | undefined>;
    static userLogin(loginId: string): Promise<pamtag_build_types_interface_itracker_response.ITrackerResponse | undefined>;
    static userLogout(): Promise<pamtag_build_types_interface_itracker_response.ITrackerResponse | undefined>;
    static loadConsentStatus(consentMessageId: string): Promise<pamtag_build_types_interface_iconsent_status.ICustomerConsentStatus | undefined>;
    static eventBucket(callBack: () => void): void | undefined;
    static cleanPamCookies(): Promise<void | undefined>;
    static submitConsent(consent: ConsentMessage, flushEventBefore?: boolean, cookieLess?: boolean, extrasPayload?: Record<string, any>): Promise<pamtag_build_types_interface_itracker_response.ITrackerResponse | undefined>;
    static loadConsentDetails(consentMessageIDs: string[]): Promise<Record<string, ConsentMessage> | undefined>;
    static loadConsentDetail(consentMessageID: string): Promise<ConsentMessage | undefined>;
}
declare function multiply(a: number, b: number): number;

export { Pam, type PamConfig, multiply };
