const DaemonFactory = require('ipfsd-ctl');
const fs = require('fs');
const path = require('path');

let _ipfsd = null;

const port = 43134;

function initIPFSD(repoPath = '/Users/linonetwo/Desktop/ipfsRepo') {
  console.log(`Start IPFS Daemon with repo: ${repoPath}`);
  return new Promise((resolve, reject) => {
    DaemonFactory.create({ type: 'proc', exec: require('ipfs'), port }).spawn(
      {
        repoPath,
        disposable: false,
        init: false,
        start: false,
      },
      (err, ipfsd) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        _ipfsd = ipfsd;

        const repoExists = fs.existsSync(path.join(repoPath, 'config'));
        if (!repoExists) {
          console.log("Repo don't exist, creating");
          ipfsd.init(
            {
              directory: repoPath,
              keySize: 4096,
            },
            err => {
              if (err) {
                console.error(err);
              }

              startDaemon(ipfsd, repoPath, resolve, reject);
            },
          );
        } else {
          startDaemon(ipfsd, repoPath, resolve, reject);
        }
      },
    );
  });
}

function startDaemon(node, repoPath, resolve, reject) {
  /* Tries to remove the repo.lock file if it already exists.
      This fixes a bug on Windows, where the daemon seems
      not to be exiting correctly, hence the file is not
      removed.
  */
  const lockPath = path.join(repoPath, 'repo.lock');
  if (fs.existsSync(lockPath)) {
    try {
      fs.unlinkSync(lockPath);
    } catch (err) {
      console.error(err);
      return reject(err);
    }
  }

  node.start((err, api) => {
    if (err) {
      console.error(err);
      return reject(err);
    }
    api.id((error, ipfsdID) => {
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
        node,
        api,
        id,
        publicKey,
        addresses,
        agentVersion,
        protocolVersion,
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
