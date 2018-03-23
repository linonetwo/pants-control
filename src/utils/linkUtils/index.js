// @flow
import isElectron from 'is-electron';

type LinkUtils = {
  open(url: string): void,
};

// eslint-disable-next-line global-require
const linkUtils: LinkUtils = isElectron() ? require('./electron') : require('./web');
export default linkUtils;
