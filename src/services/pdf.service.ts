import puppeteer, { PDFOptions } from 'puppeteer';
import Mustache from 'mustache';
import fs from 'fs/promises';
import { config } from '../config';
import { logger } from '../utils/logger';
import { IPDFGenerateOpts } from 'src/interfaces/pdf';

export class PDFService {
  async generatePDF(opts: IPDFGenerateOpts): Promise<Uint8Array> {
    try {
      logger.info(`[PDFService] Generating PDF`);
      const template = await fs.readFile(opts.templatePath, 'utf-8');
      const rendered = Mustache.render(template, opts.data);

      const browser = await puppeteer.launch(config.puppeteer);
      const page = await browser.newPage();
      await page.setContent(rendered, { waitUntil: 'domcontentloaded' });

      if (!opts.pdfOptions) {
        opts.pdfOptions = {
          format: 'A4',
          printBackground: true,
          margin: {
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
          },
        };
      }

      const pdf = await page.pdf(opts.pdfOptions);

      await browser.close();
      return pdf;
    } catch (error) {
      logger.error('[PDFService] Error generating PDF:', error);
      throw error;
    }
  }
}
