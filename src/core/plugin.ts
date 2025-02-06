import PamTracker from '../PamTracker';

export interface Plugin {
  initPlugin(pam: PamTracker): void;
}
