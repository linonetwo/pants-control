// @flow
import isElectron from 'is-electron';

type NativeUtils = {
  copy(content: any): void,
  notif(message: string): Notification,
  exec(
    script: string
  ): Promise<{
    stdout: string[],
    stderr: string[]
  }>,
  saveStorage(key: string, value: string): Promise<void>,
  loadStorage(key: string): Promise<void>
};
if (isElectron()) {
  const nativeUtils: NativeUtils = require('./electron'); // eslint-disable-line global-require
  module.exports = nativeUtils;
} else {
  const nativeUtils: NativeUtils = require('./web'); // eslint-disable-line global-require
  module.exports = nativeUtils;
}
