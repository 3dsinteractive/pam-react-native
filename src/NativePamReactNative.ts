import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): number;
  displayPopup(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('PamReactNative');
