/// <reference types="node" />
import { InvoiceJSON } from './types/DigitalInvoiceJson'
declare interface Options {
  styles?: any
  locale?: string
}
declare const xmlToJson: (
  xml: string,
  options?: Options
) => Promise<InvoiceJSON>
declare const xmlToCompactJson: (
  xml: string,
  options?: Options
) => Promise<import('./types/DigitalInvoice').Invoice>
declare const xmlToPDF: (
  xml: string,
  options?: Options
) => Promise<NodeJS.ReadableStream>
export { xmlToJson, xmlToCompactJson, xmlToPDF }
