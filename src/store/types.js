
export type ActionType = {
  type: string,
  payload: any,
};
export type KeyValue = { [key: string]: any };

export type IPFSFileUploader = {
  uploadArrayBuffer: (fileArrayBuffer: ArrayBuffer) => Promise<Buffer>,
  uploadFile(file: File): Promise<Buffer>
}