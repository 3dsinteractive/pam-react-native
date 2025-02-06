import { ConsentMessage } from './consent_message';
import { type ITrackerResponse } from './itracker_response';

export interface PopupConsentResult {
  consent?: ConsentMessage;
  response?: ITrackerResponse;
}
