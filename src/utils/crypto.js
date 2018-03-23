/* eslint-disable new-cap */
// @flow
import aesjs from 'aes-js';
import scrypt from 'scrypt-async-modern';

const ctrCounter = 7;

export const encrypt = async (name: string, password: string, value: string): string => {
  const key: Array<number> = await scrypt(password, name);
  const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(ctrCounter));
  return aesjs.utils.hex.fromBytes(aesCtr.encrypt(aesjs.utils.utf8.toBytes(value)));
};

export const decrypt = async (name: string, password: string, value: string): string => {
  const key: Array<number> = await scrypt(password, name);
  const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(ctrCounter));
  return aesjs.utils.hex.fromBytes(aesCtr.encrypt(aesjs.utils.utf8.toBytes(value)));
};
