/* eslint-disable new-cap */
// @flow
import { flow } from 'lodash';
import aesjs from 'aes-js';

const ctrCounter = 7;

export const encrypt = (password: string, value: string) =>
  flow([
    aesjs.utils.utf8.toBytes,
    new aesjs.ModeOfOperation.ctr(password, new aesjs.Counter(ctrCounter)).encrypt,
    aesjs.utils.hex.fromBytes,
  ])(value);

export const decrypt = (password: string, value: string) =>
  flow([
    aesjs.utils.hex.toBytes,
    new aesjs.ModeOfOperation.ctr(password, new aesjs.Counter(ctrCounter)).decrypt,
    aesjs.utils.utf8.fromBytes,
  ])(value);
