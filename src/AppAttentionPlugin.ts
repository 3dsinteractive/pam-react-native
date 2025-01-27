import PamTracker from 'pamtag';
import { Plugin } from 'pamtag/build/types/core/plugin';

export class AppAttentionPlugin extends Plugin {
  override initPlugin(pam: PamTracker): void {
    console.log('AppAttentionPlugin initPlugin', pam);
    // pam.hook.onStartup(async (config) => {});
  }
}
