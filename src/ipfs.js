// @flow
const IPFS = require('ipfs');
const DaemonFactory = require('ipfsd-ctl');

// Create
const repo = '/Users/dongwu/Desktop/ipfsRepo';

const ipfsDaemon = DaemonFactory.create()
ipfsDaemon.spawn(function (err, ipfsd) {
  if (err) { throw err }

  ipfsd.api.id(function (err, id) {
    if (err) { throw err }

    console.log(id)
    ipfsd.stop()
  })
})

// export const ipfsNode = new IPFS({
//   repo,
//   EXPERIMENTAL: { // enable experimental features
//     pubsub: true,
//     sharding: true, // enable dir sharding
//     dht: true // enable KadDHT, currently not interopable with go-ipfs
//   },
//   config: { // overload the default IPFS node config, find defaults at https://github.com/ipfs/js-ipfs/tree/master/src/core/runtime
//     Addresses: {
//       Swarm: [
//         '/ip4/127.0.0.1/tcp/1337'
//       ]
//     }
//   },
//   libp2p: { // add custom modules to the libp2p stack of your node
//     modules: {}
//   }
// })
// ipfsNode.on('ready', () => {})    // Node is ready to use when you first create it
// ipfsNode.on('error', (err) => {}) // Node has hit some error while initing/starting

// ipfsNode.on('init', () => {})     // Node has successfully finished initing the repo
// ipfsNode.on('start', () => {})    // Node has started
// ipfsNode.on('stop', () => {})     // Node has stopped

function initIPFS() {}
module.exports = initIPFS;
