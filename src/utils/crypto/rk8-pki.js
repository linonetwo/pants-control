const forge = require('node-forge');
const LRU = require('lru-cache');

function initToPem(settings) {
  let forge = settings.forge,
    pki = forge.pki;

  const cacheSettings = settings.cache || {};

  const memoizedKeyMaps = {
    public: LRU(cacheSettings.public || 50),
    private: LRU(cacheSettings.private || 50),
  };

  function publicKeyToPem(pubKey) {
    // generate the pem encoded public key for future lookup for transfer and storage
    const pubPem = pki.publicKeyToPem(pubKey);

    // store a mapping from the pem encoded key to the forge public key
    memoizedKeyMaps.public.set(pubPem, pubKey);
    return pubPem;
  }

  function privateKeyToPem(privKey) {
    // generate the pem encoded private key for future lookup for transfer and storage
    const privPem = pki.privateKeyToPem(privKey);

    // store a mapping from the pem encoded key to the forge public key
    memoizedKeyMaps.private.set(privPem, privKey);
    return privPem;
  }

  function publicKeyFromPem(pubPem) {
    // only recalculate the forge public key if we have to
    const pubKey = memoizedKeyMaps.public.get(pubPem) || pki.publicKeyFromPem(pubPem);

    // store a mapping from the pem encoded key to the forge public key
    memoizedKeyMaps.public.set(pubKey, pubPem);
    return pubKey;
  }

  function privateKeyFromPem(privPem) {
    // only recalculate the forge private key if we have to
    const privKey = memoizedKeyMaps.private.get(privPem) || pki.privateKeyFromPem(privPem);

    // store a mapping from the pem encoded key to the forge public key
    memoizedKeyMaps.private.set(privPem, privKey);
    return privKey;
  }

  return {
    publicKeyToPem,
    publicKeyFromPem,
    privateKeyToPem,
    privateKeyFromPem,
  };
}

/*
This function is exported when we are used as a module, but not
when we load ourself as a child process.
*/

const pki = forge.pki;

const toPem = initToPem({
  forge,
});

export function encrypt(msg, pemPublicKey) {
  // convert a PEM-formatted public key to a Forge public key
  const publicKey = toPem.publicKeyFromPem(pemPublicKey);

  // Use RSA-KEM to encrypt the msg with a randomly
  // generated one time password and AES-256
  const kdf1 = new forge.kem.kdf1(forge.md.sha256.create());
  const kem = forge.kem.rsa.create(kdf1);
  const otp = kem.encrypt(publicKey, 32);
  const iv = forge.random.getBytesSync(12);
  const cipher = forge.cipher.createCipher('AES-GCM', otp.key);
  let aesCipherText;
  let encryptedOTP;

  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(msg));
  cipher.finish();
  aesCipherText = cipher.output;

  return {
    k: otp.encapsulation,
    iv,
    m: aesCipherText,
    t: cipher.mode.tag,
  };
}

export function decrypt(cipherObj, pemPrivateKey) {
  // convert a PEM-formatted private key to a Forge private key
  const privateKey = toPem.privateKeyFromPem(pemPrivateKey);

  const kdf1 = new forge.kem.kdf1(forge.md.sha256.create());
  const kem = forge.kem.rsa.create(kdf1);
  const key = kem.decrypt(privateKey, cipherObj.k, 32);
  let decipher;
  let success;

  decipher = forge.cipher.createDecipher('AES-GCM', key);
  decipher.start({
    iv: cipherObj.iv,
    tag: cipherObj.t,
  });
  decipher.update(forge.util.createBuffer(cipherObj.m));
  success = decipher.finish();
  if (success) {
    return decipher.output.getBytes();
  }
  return null;
}
