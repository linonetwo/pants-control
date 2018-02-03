import ipfsAPI from 'ipfs-api';

export function initIPFS(swarmAddress: string[] = []) {
    const ipfs = ipfsAPI(swarmAddress[0]);
    return ipfs;
}
