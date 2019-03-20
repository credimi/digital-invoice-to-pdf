import { oc } from 'ts-optchain'
import { Line, Invoice, Company, Installment } from './types/DigitalInvoice'
import {
  DettaglioLinee,
  Company as Azienda,
  InvoiceJSON,
  FatturaElettronicaBody,
} from './types/DigitalInvoiceJson'

const generateLine = (line: DettaglioLinee): Line => ({
  number: line.NumeroLinea,
  description: line.Descrizione,
  quantity: line.Quantita || 1,
  singlePrice: line.PrezzoUnitario,
  amount: line.PrezzoTotale,
  tax: line.AliquotaIVA,
})

const generateCompany = (company: Azienda): Company => {
  const ocCompany = oc(company)
  let result: Company = {
    vat: ocCompany.DatiAnagrafici.IdFiscaleIVA.IdCodice(''),
    name: ocCompany.DatiAnagrafici.Anagrafica.Denominazione(),
  }

  if (ocCompany.Contatti()) {
    result.contacts = {}
    result.contacts.tel = ocCompany.Contatti.Telefono()
    result.contacts.email = ocCompany.Contatti.Email()
  }

  if (ocCompany.Sede()) {
    result.office = {}
    result.office.address = ocCompany.Sede.Indirizzo()
    result.office.number = ocCompany.Sede.NumeroCivico()
    result.office.cap = ocCompany.Sede.CAP()
    result.office.city = ocCompany.Sede.Comune()
    result.office.district = ocCompany.Sede.Provincia()
    result.office.country = ocCompany.Sede.Nazione()
  }

  return result
}

export default function dataExtractor(json: InvoiceJSON): Invoice {
  const invoice = oc(json).FatturaElettronica

  const body: FatturaElettronicaBody[] = Array.isArray(
    json.FatturaElettronica.FatturaElettronicaBody
  )
    ? json.FatturaElettronica.FatturaElettronicaBody
    : [json.FatturaElettronica.FatturaElettronicaBody]

  const header = invoice.FatturaElettronicaHeader
  const thirdParty = header.TerzoIntermediarioOSoggettoEmittente()

  const result: Invoice = {
    invoicer: generateCompany(
      json.FatturaElettronica.FatturaElettronicaHeader.CedentePrestatore
    ),
    invoicee: generateCompany(
      json.FatturaElettronica.FatturaElettronicaHeader.CessionarioCommittente
    ),
    installments: body.map(
      (installmentJson: FatturaElettronicaBody): Installment => {
        const installment = oc(installmentJson)
        const attachments = installment.Allegati()
        const payment = installment.DatiPagamento.DettaglioPagamento
        const taxSummary = installment.DatiBeniServizi.DatiRiepilogo
        const lines = installment.DatiBeniServizi.DettaglioLinee([])
        const generalData = installment.DatiGenerali.DatiGeneraliDocumento

        const returnedInstallment: Installment = {
          number: generalData.Numero('Numero non presente'),
          currency: generalData.Divisa('EUR'),
          totalAmount:
            generalData.ImportoTotaleDocumento() || payment.ImportoPagamento(0),
          issueDate: new Date(generalData.Data(new Date())),
          description: generalData.Causale(),
          lines: Array.isArray(lines)
            ? lines.map(line => generateLine(line))
            : [lines].map(line => generateLine(line)),
          taxSummary: {
            taxPercentage: taxSummary.AliquotaIVA(0),
            taxAmount: taxSummary.Imposta(0),
            paymentAmount: taxSummary.ImponibileImporto(0),
            legalRef: taxSummary.RiferimentoNormativo(),
          },
        }

        if (attachments) {
          returnedInstallment.attachments = Array.isArray(attachments)
            ? attachments.map(attachment => ({
                name: attachment.NomeAttachment,
                description: attachment.DescrizioneAttachment,
              }))
            : [
                {
                  name: attachments.NomeAttachment,
                  description: attachments.DescrizioneAttachment,
                },
              ]
        }
        if (payment()) {
          returnedInstallment.payment = {
            amount: payment.ImportoPagamento(0),
            iban: payment.IBAN('Iban Mancante'),
            method: payment.ModalitaPagamento(),
            bank: payment.IstitutoFinanziario(),
            regularPaymentDate: new Date(payment.DataScadenzaPagamento('')),
            type: payment.ModalitaPagamento(),
          }
        }
        return returnedInstallment
      }
    ),
  }
  if (thirdParty) {
    result.thirdParty = generateCompany(thirdParty)
  }
  return result
}
