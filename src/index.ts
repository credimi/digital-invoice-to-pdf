import * as xml2jsSource from 'xml2js'
import { stripPrefix, parseNumbers } from 'xml2js/lib/processors'
import ReactPDF from '@react-pdf/renderer'
import { promisify } from 'util'
import GeneratePDF from './renderer'
import dataExtractor from './dataExtractor'
import { InvoiceJSON } from './types/DigitalInvoiceJson'

const xml2jsPromise = promisify<
  xml2jsSource.convertableToString,
  xml2jsSource.OptionsV2,
  InvoiceJSON
>(xml2jsSource.parseString)

declare type Output = 'json' | 'compactJson' | 'pdf'
declare interface Options {
  styles?: any
  output?: Output
}

const xmlto = async (xml: string, options: Options = { output: 'pdf' }) => {
  try {
    const parsedJson = await xml2jsPromise(xml, {
      async: true,
      trim: true,
      explicitArray: false,
      attrkey: 'attributes',
      tagNameProcessors: [stripPrefix],
      attrNameProcessors: [stripPrefix],
      valueProcessors: [parseNumbers],
    })

    switch (options.output) {
      case 'json':
        return parsedJson

      case 'compactJson':
        return dataExtractor(parsedJson)

      case 'pdf':
        return ReactPDF.renderToStream(GeneratePDF(dataExtractor(parsedJson)))

      default:
        break
    }
  } catch (error) {
    console.log(error)
  }
}

export default xmlto
