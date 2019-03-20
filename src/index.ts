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

declare interface Options {
  styles?: any
  locale?: string
}

const defaultOptions: Options = { locale: 'it-IT' }

const xmlToJson = async (xml: string, options: Options = defaultOptions) => {
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
    return parsedJson
  } catch (error) {
    return Promise.reject(new Error(error))
  }
}

const xmlToCompactJson = async (
  xml: string,
  options: Options = defaultOptions
) => {
  try {
    const parsedJson = await xmlToJson(xml, options)
    return dataExtractor(parsedJson)
  } catch (error) {
    return Promise.reject(new Error(error))
  }
}

const xmlToPDF = async (xml: string, options: Options = defaultOptions) => {
  try {
    const parsedJson = await xmlToCompactJson(xml, options)
    return ReactPDF.renderToStream(GeneratePDF(parsedJson))
  } catch (error) {
    return Promise.reject(new Error(error))
  }
}

export { xmlToJson, xmlToCompactJson, xmlToPDF }
