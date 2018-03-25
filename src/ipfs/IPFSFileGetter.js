// @flow
import IPFSNode from './IPFSNode';
import type { IpfsFile } from './types';

export default class IPFSFileGetter extends IPFSNode {
  getFile(hash: string): Promise<IpfsFile[]> {
    return new Promise((resolve, reject) => {
      IPFSFileGetter.prototype.node.files.get(hash, (err, files) => {
        if (err) {
          return reject(err);
        }
        if (files) {
          resolve(files);
        }
      });
    });
  }
}
