// @flow

export function openFile(filePath: string): void {}
export function openFileUploadWindow() {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    const handleFiles = event => {
      const fileName = event.target.value.replace('fakepath', '...');
      const file = event.target.files[0];
      resolve(file);
    };
    input.addEventListener('change', handleFiles, false);
    input.click();
  });
}
export function getMostRecentFileName(dir: string, type: string): string {
  return '';
}
export async function readTextFile(filePath: string): Promise<string[]> {
  return [];
}
