// @flow

let node = null;
export default class IPFSNode {
  isOnline: boolean = false;

  constructor(onReady: Function = () => {}) {
    // 用随机的仓库地址（IPFS 在本地缓存数据的地方）来初始化 IPFS 节点
    const repoPath = `ipfs-${Math.random()}`;
    node = new Ipfs({
      repo: repoPath,
      config: {
        Addresses: {
          API: '/ip4/127.0.0.1/tcp/0',
          Swarm: ['/ip4/0.0.0.0/tcp/0'],
          Gateway: '/ip4/0.0.0.0/tcp/0',
        },
      },
    });

    if (node.isOnline()) {
      this.isOnline = true;
      onReady();
    } else {
      // 节点完成初始化并开始连接其他节点后会触发 ready 事件
      node.on('ready', () => {
        console.log('Online status: ', node.isOnline() ? 'online' : 'offline');
        if (node.isOnline()) {
          this.isOnline = true;
          onReady();
        }
      });
    }
  }

  ready = () =>
    new Promise(resolve => {
      if (node.isOnline()) {
        resolve();
      } else {
        node.on('ready', () => {
          if (node.isOnline()) {
            resolve();
          }
        });
      }
    });

  static async create() {
    const nodeSingleton = new IPFSNode();
    await nodeSingleton.ready();
    return nodeSingleton;
  }
}
