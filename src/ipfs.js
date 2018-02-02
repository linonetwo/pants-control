// @flow
const IPFS = require('ipfs');
const DaemonFactory = require('ipfsd-ctl');

// Create
const repoPath = '/Users/dongwu/Desktop/ipfsRepo';

let _ipfsd = null;
const ipfsDaemon = DaemonFactory.create();

function initIPFS() {
  ipfsDaemon.spawn({ repoPath }, (err, ipfsd) => {
    if (err) {
      throw err;
    }
    _ipfsd = ipfsd;

    ipfsd.api.id((err, id) => {
      if (err) {
        throw err;
      }

      console.log(id);

      const ipfsNode = new IPFS({
        repo: repoPath,
        EXPERIMENTAL: {
          // enable experimental features
          pubsub: true,
          sharding: true, // enable dir sharding
          dht: true, // enable KadDHT, currently not interopable with go-ipfs
        },
        // config: {
        //   // overload the default IPFS node config, find defaults at https://github.com/ipfs/js-ipfs/tree/master/src/core/runtime
        //   Addresses: {
        //     Swarm: ['/ip4/127.0.0.1/tcp/1337'],
        //   },
        // },
        libp2p: {
          // add custom modules to the libp2p stack of your node
          modules: {},
        },
      });

      // Node is ready to use when you first create it
      ipfsNode.on('ready', () => {
        console.log('ready');
      });
      // Node has hit some error while initing/starting
      ipfsNode.on('error', error => {
        console.error(error);
      });

      // Node has successfully finished initing the repo
      ipfsNode.on('init', () => {
        console.log('init');
      });
      // Node has started
      ipfsNode.on('start', () => {
        console.log('start');
      });
      // Node has stopped
      ipfsNode.on('stop', () => {
        console.log('stop');
      });
    });
  });
}

function killIPFSD() {
  if (_ipfsd) {
    _ipfsd.stop();
  }
}

module.exports = { initIPFS, killIPFSD };
