// @flow
import isElectron from 'is-electron';

type FileUtils = {
  openFileUploadWindow(): Promise<File>,
  getMostRecentFileName(dir: string, type: string): string,
  readTextFile(filePath: string): Promise<string[]>,
  openFile(filePath: string): void,
};

// eslint-disable-next-line
const fileUtils: FileUtils = isElectron() ? require('./electron') : require('./web');
export const { openFileUploadWindow, readTextFile, getMostRecentFileName, openFile } = fileUtils;
