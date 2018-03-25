// @flow

export type IpfsFile = {
  content?: Uint8Array,
  hash: Uint8Array | string,
  depth?: number,
  name?: string,
  path: string,
  size: number,
  type?: 'dir' | 'file'
}
