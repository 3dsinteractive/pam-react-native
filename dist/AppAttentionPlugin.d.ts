import PamTracker from 'pamtag';
import { Plugin } from 'pamtag/build/types/core/plugin';

declare class AppAttentionPlugin extends Plugin {
    initPlugin(pam: PamTracker): void;
}

export { AppAttentionPlugin };
