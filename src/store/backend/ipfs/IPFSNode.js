// @flow

export default class IPFSNode {
  isOnline: boolean = false;

  constructor(onReady: Function = () => {}) {
    if (!IPFSNode.prototype.node) {
      // 用随机的仓库地址（IPFS 在本地缓存数据的地方）来初始化 IPFS 节点
      const repoPath = `ipfs-${Math.random()}`;
      IPFSNode.prototype.node = new Ipfs({
        repo: repoPath,
        config: {
          Addresses: {
            API: '/ip4/127.0.0.1/tcp/0',
            Swarm: ['/ip4/0.0.0.0/tcp/0'],
            Gateway: '/ip4/0.0.0.0/tcp/0',
          },
        },
      });
    }

    if (IPFSNode.prototype.node.isOnline()) {
      this.isOnline = true;
      onReady();
    } else {
      // 节点完成初始化并开始连接其他节点后会触发 ready 事件
      IPFSNode.prototype.node.on('ready', () => {
        console.log('Online status: ', IPFSNode.prototype.node.isOnline() ? 'online' : 'offline');
        if (IPFSNode.prototype.node.isOnline()) {
          this.isOnline = true;
          onReady();
        }
      });
    }
  }

  ready = () =>
    new Promise(resolve => {
      if (IPFSNode.prototype.node.isOnline()) {
        resolve();
      } else {
        IPFSNode.prototype.node.on('ready', () => {
          if (node.isOnline()) {
            resolve();
          }
        });
      }
    });

  /** Create new instance and await till node is ready
   * (which should only happen once
   * since it's a singleton) */
  static async create() {
    const nodeSingleton = new this();
    await nodeSingleton.ready();
    return nodeSingleton;
  }
}
