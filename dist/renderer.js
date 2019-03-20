'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
var react_1 = __importDefault(require('react'))
var renderer_1 = require('@react-pdf/renderer')
var ts_optchain_1 = require('ts-optchain')
// Create Document Component
var GeneratePDF = function(invoice, options) {
  renderer_1.Font.register(__dirname + '/fonts/RobotoMono-Regular.ttf', {
    family: 'Roboto-Mono',
  })
  var ocColors = ts_optchain_1.oc(options.colors)
  var colors = {
    primary: ocColors.primary('#F07F3C'),
    text: ocColors.text('#033243'),
    lighterText: ocColors.lighterText('#476976'),
    footerText: ocColors.footerText('#8CA1A9'),
    lighterGray: ocColors.lighterGray('#E8ECED'),
    tableHeader: ocColors.tableHeader('#D1D9DC'),
  }
  var locale = options.locale || 'it-IT'
  // Create styles
  var styles = renderer_1.StyleSheet.create({
    page: {
      backgroundColor: '#fff',
      fontSize: 10,
      color: colors.text,
      paddingBottom: 30,
      paddingTop: 30,
    },
    section: {
      flexGrow: 1,
      marginTop: 10,
    },
    invoiceData: {
      color: colors.lighterText,
    },
    companyLine: {
      marginBottom: 1.2,
    },
    line: {
      padding: 6,
      paddingBottom: 7,
      paddingTop: 10,
    },
    tableFormat: [
      { width: '10%' },
      { width: '32%' },
      { width: '10%', textAlign: 'right' },
      { width: '20%', textAlign: 'right' },
      { width: '20%', textAlign: 'right' },
      { width: '8%', textAlign: 'right' },
    ],
    numbers: {
      fontFamily: 'Roboto-Mono',
      textAlign: 'right',
    },
    recapBox: {
      width: '50%',
      backgroundColor: colors.primary,
      textAlign: 'right',
      color: 'white',
      paddingTop: 7,
      paddingBottom: 7,
    },
    recap: {
      row: {
        flexDirection: 'row',
        paddingLeft: 5,
        paddingRight: 15,
        paddingTop: 3,
        paddingBottom: 3,
        alignContent: 'baseline',
      },
      label: {
        width: '40%',
        paddingTop: 3,
        fontSize: 9,
      },
      value: {
        width: '60%',
        textAlign: 'right',
        fontFamily: 'Roboto-Mono',
        paddingRight: 34,
      },
    },
    title: {
      fontFamily: 'Helvetica-Bold',
      marginBottom: 7,
      fontSize: 14,
    },
    lineHeader: {
      backgroundColor: colors.tableHeader,
      flexDirection: 'row',
      fontFamily: 'Helvetica-Bold',
    },
    lineRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: colors.lighterGray,
    },
  })
  var currencySymbol = function(currency) {
    switch (currency) {
      case 'EUR':
        return '€'
      case 'USD':
        return '$'
      case 'BGP':
        return '£'
      default:
        return ' ' + currency
    }
  }
  var Company = function(_a) {
    var company = _a.company,
      role = _a.role
    var office = company.office,
      contacts = company.contacts
    return react_1.default.createElement(
      renderer_1.View,
      { style: [styles.section, { maxWidth: '50%', paddingRight: 10 }] },
      react_1.default.createElement(
        renderer_1.Text,
        { style: { fontFamily: 'Helvetica-Bold', marginBottom: 3 } },
        role
      ),
      react_1.default.createElement(
        renderer_1.Text,
        { style: { fontSize: 12, color: colors.primary } },
        company.name
      ),
      react_1.default.createElement(
        renderer_1.Text,
        { style: styles.companyLine },
        'P. IVA: ',
        company.vat
      ),
      office &&
        react_1.default.createElement(
          react_1.default.Fragment,
          null,
          react_1.default.createElement(
            renderer_1.Text,
            { style: styles.companyLine },
            office.address,
            ' ',
            office.number
          ),
          react_1.default.createElement(
            renderer_1.Text,
            { style: styles.companyLine },
            office.cap,
            ' ',
            office.city,
            ' ',
            office.country
          )
        ),
      contacts &&
        react_1.default.createElement(
          react_1.default.Fragment,
          null,
          contacts.tel &&
            react_1.default.createElement(
              renderer_1.Text,
              { style: styles.companyLine },
              'tel: ',
              contacts.tel
            ),
          react_1.default.createElement(
            renderer_1.Text,
            { style: styles.companyLine },
            contacts.email
          )
        )
    )
  }
  var HR = function() {
    return react_1.default.createElement(renderer_1.View, {
      style: {
        backgroundColor: colors.tableHeader,
        height: 1,
        marginTop: 15,
        marginBottom: 15,
      },
    })
  }
  var LineHeader = function() {
    return react_1.default.createElement(
      renderer_1.View,
      { style: styles.lineHeader },
      react_1.default.createElement(
        renderer_1.Text,
        { style: [styles.line, styles.tableFormat[0]] },
        'Numero'
      ),
      react_1.default.createElement(
        renderer_1.Text,
        { style: [styles.line, styles.tableFormat[1]] },
        'Descrizione'
      ),
      react_1.default.createElement(
        renderer_1.Text,
        { style: [styles.line, styles.tableFormat[2]] },
        'Quantit\u00E0'
      ),
      react_1.default.createElement(
        renderer_1.Text,
        { style: [styles.line, styles.tableFormat[3]] },
        'Prezzo'
      ),
      react_1.default.createElement(
        renderer_1.Text,
        { style: [styles.line, styles.tableFormat[4]] },
        'Importo'
      ),
      react_1.default.createElement(
        renderer_1.Text,
        { style: [styles.line, styles.tableFormat[5]] },
        'IVA'
      )
    )
  }
  var Line = function(_a) {
    var line = _a.line,
      currency = _a.currency
    return react_1.default.createElement(
      renderer_1.View,
      { style: styles.lineRow },
      react_1.default.createElement(
        renderer_1.Text,
        { style: [styles.line, styles.tableFormat[0]] },
        line.number
      ),
      react_1.default.createElement(
        renderer_1.Text,
        { style: [styles.line, styles.tableFormat[1]] },
        line.description
      ),
      react_1.default.createElement(
        renderer_1.Text,
        { style: [styles.line, styles.numbers, styles.tableFormat[2]] },
        line.quantity
      ),
      react_1.default.createElement(
        renderer_1.Text,
        { style: [styles.line, styles.numbers, styles.tableFormat[3]] },
        line.singlePrice.toLocaleString(locale),
        currencySymbol(currency)
      ),
      react_1.default.createElement(
        renderer_1.Text,
        { style: [styles.line, styles.numbers, styles.tableFormat[4]] },
        line.amount.toLocaleString(locale),
        currencySymbol(currency)
      ),
      react_1.default.createElement(
        renderer_1.Text,
        { style: [styles.line, styles.numbers, styles.tableFormat[5]] },
        line.tax,
        '%'
      )
    )
  }
  var InvoiceData = function(_a) {
    var number = _a.number,
      issueDate = _a.issueDate
    return react_1.default.createElement(
      renderer_1.View,
      { style: { textAlign: 'right', marginTop: 10 } },
      react_1.default.createElement(
        renderer_1.Text,
        { style: styles.invoiceData },
        react_1.default.createElement(
          renderer_1.Text,
          { style: { fontSize: 10 } },
          'numero:'
        ),
        ' ',
        number
      ),
      react_1.default.createElement(
        renderer_1.Text,
        { style: styles.invoiceData },
        react_1.default.createElement(
          renderer_1.Text,
          { style: { fontSize: 10 } },
          'data:'
        ),
        ' ',
        issueDate.toLocaleDateString(locale, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      )
    )
  }
  var Payment = function(_a) {
    var payment = _a.payment,
      currency = _a.currency
    return react_1.default.createElement(
      renderer_1.View,
      { style: { lineHeight: 1.5, color: colors.lighterText } },
      payment.method &&
        react_1.default.createElement(
          renderer_1.View,
          null,
          react_1.default.createElement(
            renderer_1.Text,
            null,
            'Metodo di pagamento: ',
            payment.method
          )
        ),
      payment.bank &&
        react_1.default.createElement(
          renderer_1.View,
          null,
          react_1.default.createElement(
            renderer_1.Text,
            null,
            'Banca: ',
            payment.bank
          )
        ),
      react_1.default.createElement(
        renderer_1.View,
        null,
        react_1.default.createElement(
          renderer_1.Text,
          null,
          'IBAN: ',
          payment.iban
        )
      ),
      payment.regularPaymentDate &&
        react_1.default.createElement(
          renderer_1.View,
          null,
          react_1.default.createElement(
            renderer_1.Text,
            null,
            'Scadenza:',
            ' ',
            payment.regularPaymentDate.toLocaleDateString(locale, {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })
          )
        ),
      react_1.default.createElement(
        renderer_1.View,
        null,
        react_1.default.createElement(
          renderer_1.Text,
          null,
          'Importo: ',
          payment.amount.toLocaleString(locale),
          currency
        )
      )
    )
  }
  var Recap = function(_a) {
    var installment = _a.installment
    return react_1.default.createElement(
      renderer_1.View,
      { style: styles.recapBox },
      react_1.default.createElement(
        renderer_1.View,
        { style: styles.recap.row },
        react_1.default.createElement(
          renderer_1.Text,
          { style: styles.recap.label },
          'Totale prodotti e servizi'
        ),
        react_1.default.createElement(
          renderer_1.Text,
          { style: styles.recap.value },
          installment.taxSummary.paymentAmount.toLocaleString(locale),
          currencySymbol(installment.currency)
        )
      ),
      react_1.default.createElement(
        renderer_1.View,
        { style: styles.recap.row },
        react_1.default.createElement(
          renderer_1.Text,
          { style: styles.recap.label },
          'Totale IVA'
        ),
        react_1.default.createElement(
          renderer_1.Text,
          { style: styles.recap.value },
          installment.taxSummary.taxAmount.toLocaleString(locale),
          currencySymbol(installment.currency)
        )
      ),
      react_1.default.createElement(
        renderer_1.View,
        { style: styles.recap.row },
        react_1.default.createElement(
          renderer_1.Text,
          { style: styles.recap.label },
          react_1.default.createElement(
            renderer_1.Text,
            { style: { fontFamily: 'Helvetica-Bold', fontSize: 12 } },
            'Totale'
          )
        ),
        react_1.default.createElement(
          renderer_1.Text,
          { style: [styles.recap.value, { fontSize: 11 }] },
          installment.totalAmount.toLocaleString(locale),
          currencySymbol(installment.currency)
        )
      )
    )
  }
  return react_1.default.createElement(
    renderer_1.Document,
    null,
    invoice.installments.map(function(installment, index) {
      return react_1.default.createElement(
        renderer_1.Page,
        { size: 'A4', style: styles.page, key: index },
        react_1.default.createElement(
          renderer_1.View,
          {
            style: {
              paddingLeft: 30,
              paddingRight: 30,
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'space-between',
            },
          },
          react_1.default.createElement(
            renderer_1.View,
            null,
            react_1.default.createElement(renderer_1.View, {
              style: {
                backgroundColor: colors.primary,
                height: 15,
                width: '100% ',
                marginTop: -35,
              },
            }),
            react_1.default.createElement(InvoiceData, {
              number: installment.number,
              issueDate: installment.issueDate,
            }),
            react_1.default.createElement(
              renderer_1.View,
              { style: { flexDirection: 'row', flexWrap: 'wrap' } },
              react_1.default.createElement(Company, {
                company: invoice.invoicer,
                role: 'Dati fornitore',
              }),
              react_1.default.createElement(Company, {
                company: invoice.invoicee,
                role: 'Dati cliente',
              }),
              invoice.thirdParty &&
                react_1.default.createElement(Company, {
                  company: invoice.thirdParty,
                  role: 'Intermediario',
                })
            ),
            installment.description &&
              react_1.default.createElement(
                react_1.default.Fragment,
                null,
                react_1.default.createElement(HR, null),
                react_1.default.createElement(
                  renderer_1.Text,
                  { style: styles.title },
                  'Causale'
                ),
                react_1.default.createElement(
                  renderer_1.Text,
                  null,
                  installment.description
                )
              ),
            react_1.default.createElement(HR, null),
            react_1.default.createElement(
              renderer_1.Text,
              { style: styles.title },
              'Prodotti e servizi'
            ),
            react_1.default.createElement(LineHeader, null),
            installment.lines.map(function(line) {
              return react_1.default.createElement(Line, {
                line: line,
                currency: installment.currency,
                key: line.number,
              })
            }),
            react_1.default.createElement(
              renderer_1.View,
              { style: { flexDirection: 'row', alignItems: 'flex-start' } },
              react_1.default.createElement(
                renderer_1.View,
                { style: { width: '50%' } },
                installment.payment &&
                  react_1.default.createElement(
                    react_1.default.Fragment,
                    null,
                    react_1.default.createElement(
                      renderer_1.Text,
                      { style: [styles.title, { marginTop: 10 }] },
                      'Dettagli pagamento'
                    ),
                    react_1.default.createElement(Payment, {
                      payment: installment.payment,
                      currency: currencySymbol(installment.currency),
                    })
                  )
              ),
              react_1.default.createElement(Recap, { installment: installment })
            ),
            installment.attachments &&
              react_1.default.createElement(
                react_1.default.Fragment,
                null,
                react_1.default.createElement(
                  renderer_1.Text,
                  { style: [styles.title, { marginTop: 15 }] },
                  'Documenti allegati'
                ),
                react_1.default.createElement(
                  renderer_1.View,
                  { style: styles.lineHeader },
                  react_1.default.createElement(
                    renderer_1.Text,
                    { style: [styles.line, { width: '50%' }] },
                    'Nome'
                  ),
                  react_1.default.createElement(
                    renderer_1.Text,
                    { style: [styles.line, { width: '50%' }] },
                    'Descrizione'
                  )
                ),
                installment.attachments.map(function(attachment, i) {
                  return react_1.default.createElement(
                    renderer_1.View,
                    { style: styles.lineRow, key: i },
                    react_1.default.createElement(
                      renderer_1.Text,
                      { style: [styles.line, { width: '50%' }] },
                      attachment.name
                    ),
                    react_1.default.createElement(
                      renderer_1.Text,
                      { style: [styles.line, { width: '50%' }] },
                      attachment.description
                    )
                  )
                })
              )
          ),
          options.footer &&
            react_1.default.createElement(
              renderer_1.View,
              {
                style: {
                  color: colors.footerText,
                  textAlign: 'center',
                  fontSize: 8,
                  padding: 5,
                  marginBottom: -20,
                },
              },
              react_1.default.createElement(
                renderer_1.Text,
                null,
                'Fattura digitale generata da',
                ' ',
                react_1.default.createElement(
                  renderer_1.Link,
                  {
                    style: { color: colors.primary },
                    src: 'https://www.credimi.com/',
                  },
                  'Credimi.com'
                )
              )
            )
        )
      )
    })
  )
}
exports.default = GeneratePDF
