// @flow
import { Buffer } from 'buffer';
import streamBuffers from 'stream-buffers';
import str2arr from 'string-to-arraybuffer';

import IPFSNode from './IPFSNode';
import type { IpfsFile } from './types';

export default class IPFSFileUploader extends IPFSNode {
  stream: any;

  uploadObject = someStringifiableObject => {
    try {
      const fileString = JSON.stringify(someStringifiableObject);
      return this.uploadString(fileString);
    } catch (error) {
      throw new Error('Receiving Object that is not able to JSON.stringify');
    }
  };

  uploadString = (fileString: string) => {
    const fileBuffer = str2arr(fileString);
    return this.uploadArrayBuffer(fileBuffer);
  };

  /** 2.把文件丢进 IPFS 里 */
  uploadArrayBuffer = (fileArrayBuffer: ArrayBuffer): Promise<IpfsFile> =>
    new Promise((resolve, reject) => {
      if (!this.isOnline) {
        return reject('IPFS node is not online, please wait.');
      }
      const myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
        chunkSize: 25000, // 决定了传输速率
      });
      myReadableStreamBuffer.on('data', (chunk: Buffer) => {
        myReadableStreamBuffer.resume();
      });

      // 创建 IPFS 读写文件的流，这是一个 Duplex 流，可读可写
      this.stream = IPFSFileUploader.prototype.node.files.addReadableStream();
      // 文件上传完毕后 resolve 这个 Promise
      this.stream.on('data', (file: IpfsFile) => resolve(file));

      // 对接好两个流，并开始上传
      this.stream.write(myReadableStreamBuffer);
      myReadableStreamBuffer.put(Buffer.from(fileArrayBuffer));

      // 上传完毕后关闭流
      myReadableStreamBuffer.on('end', () => this.stream.end());
      myReadableStreamBuffer.stop();
    });

  /** 1.中转文件，准备丢进 IPFS */
  uploadFile(file: File) {
    return new Promise((resolve, reject) => {
      if (!this.isOnline) {
        return reject('IPFS node is not online, please wait.');
      }
      const fileReader = new FileReader();
      fileReader.onload = event => resolve(this.uploadArrayBuffer(event.target.result));
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(file);
    });
  }
}
