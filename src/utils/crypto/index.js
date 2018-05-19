/* eslint-disable new-cap */
// @flow
import aesjs from 'aes-js';
import scrypt from 'scrypt-async-modern';
import * as rk8pki from './rk8-pki';

const ctrCounter = 7;

export const encrypt = async (name: string, password: string, value: string): Promise<string> => {
  const key: Array<number> = await scrypt(password, name);
  const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(ctrCounter));
  return aesjs.utils.hex.fromBytes(aesCtr.encrypt(aesjs.utils.utf8.toBytes(value)));
};

export const decrypt = async (name: string, password: string, value: string): Promise<string> => {
  const key: Array<number> = await scrypt(password, name);
  const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(ctrCounter));
  return aesjs.utils.utf8.fromBytes(aesCtr.decrypt(aesjs.utils.hex.toBytes(value)));
};

export const checkKeyPair = (publicKey: string, privateKey: string): boolean => {
  const dateOption = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const dateString = `${new Date().getTime()}${String(new Date().toLocaleDateString('en-US', dateOption))}`;

  const encrypted = rk8pki.encrypt(dateString, publicKey);
  const decrypted = rk8pki.decrypt(encrypted, privateKey);
  
  return decrypted === dateString;
};
