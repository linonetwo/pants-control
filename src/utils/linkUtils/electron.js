// @flow
import { shell } from 'electron';

const linkUtils = {
  open(url: string) {
    shell.openExternal(url);
  },
};
export default linkUtils;
