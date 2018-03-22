// @flow
import isElectron from 'is-electron';

type NativeUtils = {
  copy(content: any): void,
  notif(message: string): Notification,
  exec(
    script: string,
  ): Promise<{
    stdout: string[],
    stderr: string[],
  }>,
  saveStorage(key: string, value: string): Promise<void>,
  loadStorage(key: string): Promise<void>,
};

// eslint-disable-next-line
const nativeUtils: NativeUtils = isElectron() ? require('./electron') : require('./web');
export default nativeUtils;
