import ipfsAPI from 'ipfs-api';

export function initIPFS(swarmAddress: string[]) {
  return new Promise((resolve, reject) => {
    const ipfs = ipfsAPI(swarmAddress[0]);
    resolve(ipfs);
  });
}
