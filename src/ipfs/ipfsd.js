// @flow
const DaemonFactory = require('ipfsd-ctl');

let _ipfsd = null;
const ipfsDaemon = DaemonFactory.create({ type: 'proc', exec: require('ipfs') });

function initIPFSD(repoPath = '/Users/dongwu/Desktop/ipfsRepo') {
  console.log(repoPath);
  return new Promise((resolve, reject) => {
    ipfsDaemon.spawn({ repoPath }, (err, ipfsd) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      _ipfsd = ipfsd;

      ipfsd.api.id((error, ipfsdID) => {
        if (error) {
          console.error(error);
          reject(error);
        }

        /* { id: 'QmNLqHu',
            publicKey: 'CAASpgIE=',
            addresses:
            [ '/ip4/127.0.0.1/tcp/51216/ipfs/QmNLqHu',
              '/ip4/192.168.1.3/tcp/42097/ipfs/QmNLqHu' ],
            agentVersion: 'go-ipfs/0.4.13/',
            protocolVersion: 'ipfs/0.1.0' }
        */
        const { id, publicKey, addresses, agentVersion, protocolVersion } = ipfsdID;
        console.log(`IPFS Daemon Started, agentVersion: ${agentVersion}, protocolVersion: ${protocolVersion}`);
        resolve({
          ipfsd,
          id,
          publicKey,
          addresses,
          agentVersion,
          protocolVersion,
        });
      });
    });
  });
}

function killIPFSD() {
  if (_ipfsd) {
    _ipfsd.stop();
  }
}

module.exports = { initIPFSD, killIPFSD };
