import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

// export interface BannerData {
//   video: string;
//   image: string;
//   title: string;
//   description: string;
//   url: string;
//   type: string;
//   json_data: Object; // ✅ Use Object instead of any
//   size: string;
//   tracking_pixel_url: string;
// }

export interface Spec extends TurboModule {
  multiply(a: number, b: number): number;
  displayPopup(banner: Object): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('PamReactNative');
