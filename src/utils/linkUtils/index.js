// @flow
import isElectron from 'is-electron';

type LinkUtils = {
  open(url: string): void,
};

// eslint-disable-next-line
const linkUtils: LinkUtils = isElectron() ? require('./electron') : require('./web');
export const { open } = linkUtils;
