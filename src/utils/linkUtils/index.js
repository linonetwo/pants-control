// @flow
import isElectron from 'is-electron';

if (isElectron()) {
  const linkUtils: {
    open(url: string): void,
  } = require('./electron'); // eslint-disable-line global-require
  module.exports = linkUtils;
} else {
  const linkUtils: {
    open(url: string): void,
  } = require('./web'); // eslint-disable-line global-require
  module.exports = linkUtils;
}
