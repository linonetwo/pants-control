import IPFS from 'ipfs';
import { Buffer } from 'buffer';
import streamBuffers from 'stream-buffers';

export class IPFSFileUploader {
  node: any;
  stream: any;

  constructor() {
    // 用随机的仓库地址（IPFS 在本地缓存数据的地方）来初始化 IPFS 节点
    const repoPath = `ipfs-${Math.random()}`;
    this.node = new IPFS({ repo: repoPath });

    // 节点完成初始化并开始连接其他节点后会触发 ready 事件
    this.node.on('ready', () => console.log('Online status: ', this.node.isOnline() ? 'online' : 'offline'));
  }

  /** 2.把文件丢进 IPFS 里 */
  uploadArrayBuffer = (fileArrayBuffer: ArrayBuffer): Promise<Buffer> =>
    new Promise(resolve => {
      const myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
        chunkSize: 25000, // 决定了传输速率
      });
      myReadableStreamBuffer.on('data', (chunk: Buffer) => {
        myReadableStreamBuffer.resume();
      });

      // 创建 IPFS 读写文件的流，这是一个 Duplex 流，可读可写
      this.stream = this.node.files.addReadableStream();
      // 文件上传完毕后 resolve 这个 Promise
      this.stream.on('data', (file: Buffer) => resolve(file));

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
      const fileReader = new FileReader();
      fileReader.onload = event => resolve(this.uploadArrayBuffer(event.target.result));
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(file);
    });
  }
}

export default new IPFSFileUploader();
