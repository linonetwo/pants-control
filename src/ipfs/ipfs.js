import ipfsAPI from 'ipfs-api';

export function initIPFS() {
  let swarmAddress: ?string = undefined
  const hasSwarmAddress = window.__args__ && window.__args__.addresses && window.__args__.addresses[0];
  if (!hasSwarmAddress) {
    console.error(`No swarm addresses passed from window.__args__: ${JSON.stringify(window.__args__)}`);
  } else {
    swarmAddress = window.__args__.addresses[0]
    console.log(`Init IPFS-API using swarm addresses ${swarmAddress}`);
  }
  const ipfs = ipfsAPI(swarmAddress);
  return ipfs;
}
