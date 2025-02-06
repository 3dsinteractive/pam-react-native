import PamTracker from './PamTracker';

export {};

declare global {
  interface Window {
    getPam: () => Promise<PamTracker>;
    pam: PamTracker;
    fbq?: facebook.Pixel.Event;
    gtag?: Gtag.Gtag;
    dataLayer: any[];
  }
}
