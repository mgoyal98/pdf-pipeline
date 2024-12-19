import { PDFOptions } from 'puppeteer';

export interface IPDFGenerateOpts {
  templatePath: string;
  data: any;
  pdfOptions?: PDFOptions;
}
