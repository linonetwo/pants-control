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

// eslint-disable-next-line global-require
const fileUtils: FileUtils = isElectron() ? require('./electron') : require('./web');
export default fileUtils;
