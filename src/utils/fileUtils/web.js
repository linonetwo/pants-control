// @flow
import { getCompanyCodeFromFileName } from '../fileName';

export default {
  openFile(filePath: string): void {},
  openFileUploadWindow() {
    return new Promise(resolve => {
      const input = document.createElement('input');
      input.type = 'file';
      const handleFiles = event => {
        const fileName = event.target.value.replace('fakepath', '...');
        const file = event.target.files[0];
        const companyCode: ?string = getCompanyCodeFromFileName(fileName);
        resolve({ file, companyCode });
      };
      input.addEventListener('change', handleFiles, false);
      input.click();
    });
  },
  getMostRecentFileName(dir: string, type: string): string {
    return '';
  },
  async readTextFile(filePath: string): Promise<string[]> {
    return [];
  },
};
