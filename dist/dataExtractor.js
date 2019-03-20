'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
var ts_optchain_1 = require('ts-optchain')
var generateLine = function(line) {
  return {
    number: line.NumeroLinea,
    description: line.Descrizione,
    quantity: line.Quantita || 1,
    singlePrice: line.PrezzoUnitario,
    amount: line.PrezzoTotale,
    tax: line.AliquotaIVA,
  }
}
var generateCompany = function(company) {
  var ocCompany = ts_optchain_1.oc(company)
  var result = {
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
function dataExtractor(json) {
  var invoice = ts_optchain_1.oc(json).FatturaElettronica
  var body = Array.isArray(json.FatturaElettronica.FatturaElettronicaBody)
    ? json.FatturaElettronica.FatturaElettronicaBody
    : [json.FatturaElettronica.FatturaElettronicaBody]
  var header = invoice.FatturaElettronicaHeader
  var thirdParty = header.TerzoIntermediarioOSoggettoEmittente()
  var result = {
    invoicer: generateCompany(
      json.FatturaElettronica.FatturaElettronicaHeader.CedentePrestatore
    ),
    invoicee: generateCompany(
      json.FatturaElettronica.FatturaElettronicaHeader.CessionarioCommittente
    ),
    installments: body.map(function(installmentJson) {
      var installment = ts_optchain_1.oc(installmentJson)
      var attachments = installment.Allegati()
      var payment = installment.DatiPagamento.DettaglioPagamento
      var taxSummary = installment.DatiBeniServizi.DatiRiepilogo
      var lines = installment.DatiBeniServizi.DettaglioLinee([])
      var generalData = installment.DatiGenerali.DatiGeneraliDocumento
      var returnedInstallment = {
        number: generalData.Numero('Numero non presente'),
        currency: generalData.Divisa('EUR'),
        totalAmount:
          generalData.ImportoTotaleDocumento() || payment.ImportoPagamento(0),
        issueDate: new Date(generalData.Data(new Date())),
        description: generalData.Causale(),
        lines: Array.isArray(lines)
          ? lines.map(function(line) {
              return generateLine(line)
            })
          : [lines].map(function(line) {
              return generateLine(line)
            }),
        taxSummary: {
          taxPercentage: taxSummary.AliquotaIVA(0),
          taxAmount: taxSummary.Imposta(0),
          paymentAmount: taxSummary.ImponibileImporto(0),
          legalRef: taxSummary.RiferimentoNormativo(),
        },
      }
      if (attachments) {
        returnedInstallment.attachments = Array.isArray(attachments)
          ? attachments.map(function(attachment) {
              return {
                name: attachment.NomeAttachment,
                description: attachment.DescrizioneAttachment,
              }
            })
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
    }),
  }
  if (thirdParty) {
    result.thirdParty = generateCompany(thirdParty)
  }
  return result
}
exports.default = dataExtractor
