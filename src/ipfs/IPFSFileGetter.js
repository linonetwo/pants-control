// @flow
import IPFSNode from './IPFSNode';

export type IpfsFile = {
  content?: Uint8Array,
  hash: Uint8Array | string,
  depth?: number,
  name?: string,
  path: string,
  size: number,
  type?: 'dir' | 'file'
}
export default class IPFSFileGetter extends IPFSNode {
  getFile(hash: string): Promise<IpfsFile[]> {
    return new Promise((resolve, reject) => {
      this.node.files.get(hash, (err, files) => {
        if (err) {
          return reject(err)
        }
        if (files) {
          resolve(files);
        }
      });
    })
  }
}
