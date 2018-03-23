// @flow
import { shell } from 'electron';

export function open(url: string) {
  shell.openExternal(url);
}
