export interface IUploadPDFOpts {
  bucket: string;
  key: string;
  pdf: Uint8Array;
}

export interface IUploadPDFResponse {
  bucket: string;
  key: string;
  url: string;
}
