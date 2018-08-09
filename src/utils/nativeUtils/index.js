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
  loadStorage(key: string): Promise<string>,
};

/** 用于判断当前是否在 SSR */
export const isServer = !(typeof window !== 'undefined' && window.document && window.document.createElement);
export const isSSR = isServer && !isElectron();
export function getInitialStateFromServer() {
  // Do we have preloaded state available? Great, save it.
  const initialStateFromServer = !isServer ? window.__PRELOADED_STATE__ : {};
  // Delete it once we have it stored in a variable
  if (!isServer) {
    delete window.__PRELOADED_STATE__;
  }
  return initialStateFromServer;
}

// eslint-disable-next-line
const nativeUtils: NativeUtils = isElectron() ? require('./electron') : require('./web');
export const { copy, notif, exec, saveStorage, loadStorage } = nativeUtils;
