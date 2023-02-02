import { Configs, ConfigsKey } from '../types';

class Config {
  protected static settings: Partial<Configs> = {};

  public static get(key: ConfigsKey): string | undefined {
    return Config.settings[key] ? Config.settings[key] : undefined;
  }

  public static set(key: ConfigsKey, value: Configs[ConfigsKey]): void {
    Config.settings[key] = value;
  }
}

export default Config;
