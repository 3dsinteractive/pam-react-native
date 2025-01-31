import { TurboModule } from 'react-native';

interface Spec extends TurboModule {
    multiply(a: number, b: number): number;
    displayPopup(banner: Object): void;
}
declare const _default: Spec;

export { type Spec, _default as default };
