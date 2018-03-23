// @flow
export default class IPFSNode {
  node: any;
  isOnline: boolean = false;

  constructor(onReady: Function = () => {}) {
    // 用随机的仓库地址（IPFS 在本地缓存数据的地方）来初始化 IPFS 节点
    const repoPath = `ipfs-${Math.random()}`;
    this.node = new Ipfs({
      repo: repoPath,
      config: {
        Addresses: {
          API: '/ip4/127.0.0.1/tcp/0',
          Swarm: ['/ip4/0.0.0.0/tcp/0'],
          Gateway: '/ip4/0.0.0.0/tcp/0',
        },
      },
    });

    // 节点完成初始化并开始连接其他节点后会触发 ready 事件
    this.node.on('ready', () => {
      console.log('Online status: ', this.node.isOnline() ? 'online' : 'offline');
      if (this.node.isOnline()) {
        this.isOnline = true;
        onReady();
      }
    });
  }

  ready = () => {
    return new Promise(resolve => {
      this.node.on('ready', () => {
        if (this.node.isOnline()) {
          resolve();
        }
      });
    });
  }
}
