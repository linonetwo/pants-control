const IPFS = require('ipfs');

export function initIPFS(swarmAddress) {
  return new Promise((resolve, reject) => {
    const memoryRepoPath = `ipfsrepo-${Math.random()}-${Date.now().toString()}`;
    const ipfsNode = new IPFS({
      repo: memoryRepoPath,
      EXPERIMENTAL: {
        pubsub: true,
        sharding: true,
        dht: false, // enable KadDHT, currently not interopable with go-ipfs
      },
      config: {
        // overload the default IPFS node config, find defaults at https://github.com/ipfs/js-ipfs/tree/master/src/core/runtime
        Addresses: {
          Swarm: swarmAddress,
        },
      },
      libp2p: {
        // add custom modules to the libp2p stack of your node
        modules: {},
      },
    });

    // Node has successfully finished initing the repo
    ipfsNode.on('init', () => {
      console.log('init');
    });
    // Node is ready to use when you first create it
    ipfsNode.on('ready', () => {
      console.log('ready');
    });
    // Node has started
    ipfsNode.on('start', () => {
      console.log('start');
      resolve(ipfsNode);
    });
    // Node has hit some error while initing/starting
    ipfsNode.on('error', error => {
      console.error(error);
      reject(error);
    });

    // Node has stopped
    ipfsNode.on('stop', () => {
      console.log('stop');
    });
  });
}
