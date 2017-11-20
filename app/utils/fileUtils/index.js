// @flow
import isElectron from 'is-electron';

type FileUtils = {
  openFileUploadWindow(): Promise<{
    file: File,
    companyCode: string,
  }>,
  getMostRecentFileName(dir: string, type: string): string,
  readTextFile(filePath: string): Promise<string[]>,
  openFile(filePath: string): void,
};
if (isElectron()) {
  const fileUtils: FileUtils = require('./electron'); // eslint-disable-line global-require
  module.exports = fileUtils;
} else {
  const fileUtils: FileUtils = require('./web'); // eslint-disable-line global-require
  module.exports = fileUtils;
}
