/// <reference types="node" />
import { InvoiceJSON } from './types/DigitalInvoiceJson'
declare type Output = 'json' | 'compactJson' | 'pdf'
declare interface Options {
  styles?: any
  output?: Output
}
declare const xmlto: (
  xml: string,
  options?: Options
) => Promise<
  | import('./types/DigitalInvoice').Invoice
  | InvoiceJSON
  | NodeJS.ReadableStream
  | undefined
>
export default xmlto
