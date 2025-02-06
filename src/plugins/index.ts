import { type Plugin } from '../core/plugin';
import { LoginState } from './login_state';
import type IConfig from '../interface/iconfig';

export class PluginRegistration {
  static getPlugins(_: IConfig): Plugin[] {
    let plugins: Plugin[] = [new LoginState()];
    return plugins;
  }
}
