import puppeteer, { PDFOptions } from 'puppeteer';
import Mustache from 'mustache';
import fs from 'fs/promises';
import { config } from '../config';
import { logger } from '../utils/logger';

export class PDFService {
  async generatePDF(
    templatePath: string,
    data: any,
    pdfOptions: PDFOptions = {
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    }
  ): Promise<Uint8Array> {
    try {
      const template = await fs.readFile(templatePath, 'utf-8');
      const rendered = Mustache.render(template, data);

      const browser = await puppeteer.launch(config.puppeteer);
      const page = await browser.newPage();
      await page.setContent(rendered, { waitUntil: 'domcontentloaded' });

      const pdf = await page.pdf(pdfOptions);

      await browser.close();
      return pdf;
    } catch (error) {
      logger.error('Error generating PDF:', error);
      throw error;
    }
  }
}
