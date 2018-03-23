// @flow
import { maxBy, uniq } from 'lodash';
import fs from 'fs-extra-promise';
import path from 'path';
import { remote, shell } from 'electron';

export function openFile(filePath: string): void {
  shell.openItem(filePath);
}

export async function openFileUploadWindow(): File {
  const filePath = remote.dialog.showOpenDialog({ properties: ['openFile'] })[0];
  const fileBuffer = await fs.readFileAsync(filePath);
  const file = new File([fileBuffer], filePath);
  return file;
}

export function getMostRecentFileName(dir: string, type: string): string {
  const files = fs.readdirSync(dir).filter(name => name.match(`.${type}`));

  const fileName = maxBy(files, f => {
    const fullpath = path.join(dir, f);

    // ctime = creation time is used
    // replace with mtime for modification time
    return fs.statSync(fullpath).ctime;
  });
  return `${dir}/${fileName}`;
}

export function readTextFile(filePath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      return resolve(uniq(data.toString().split('\n')));
    });
  });
}
