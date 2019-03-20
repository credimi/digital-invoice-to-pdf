import React from 'react'
import {
  Company,
  Line,
  Payment,
  Invoice,
  Installment,
} from './types/DigitalInvoice'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
} from '@react-pdf/renderer'
import { Options } from './types/Options'
import { oc } from 'ts-optchain'

// Create Document Component
const GeneratePDF = (invoice: Invoice, options: Options) => {
  Font.register(`${__dirname}/fonts/RobotoMono-Regular.ttf`, {
    family: 'Roboto-Mono',
  })

  const ocColors = oc(options.colors)
  const colors = {
    primary: ocColors.primary('#F07F3C'),
    text: ocColors.text('#033243'),
    lighterText: ocColors.lighterText('#476976'),
    footerText: ocColors.footerText('#8CA1A9'),
    lighterGray: ocColors.lighterGray('#E8ECED'),
    tableHeader: ocColors.tableHeader('#D1D9DC'),
  }

  const locale = options.locale || 'it-IT'

  // Create styles
  const styles = StyleSheet.create({
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

  const currencySymbol = (currency: string): string => {
    switch (currency) {
      case 'EUR':
        return '€'

      case 'USD':
        return '$'

      case 'BGP':
        return '£'

      default:
        return ` ${currency}`
    }
  }

  const Company = ({
    company,
    role,
  }: {
    company: Company
    role: string
  }): React.ReactElement => {
    const { office, contacts } = company
    return (
      <View style={[styles.section, { maxWidth: '50%', paddingRight: 10 }]}>
        <Text style={{ fontFamily: 'Helvetica-Bold', marginBottom: 3 }}>
          {role}
        </Text>
        <Text style={{ fontSize: 12, color: colors.primary }}>
          {company.name}
        </Text>
        <Text style={styles.companyLine}>P. IVA: {company.vat}</Text>
        {office && (
          <React.Fragment>
            <Text style={styles.companyLine}>
              {office.address} {office.number}
            </Text>
            <Text style={styles.companyLine}>
              {office.cap} {office.city} {office.country}
            </Text>
          </React.Fragment>
        )}
        {contacts && (
          <React.Fragment>
            {contacts.tel && (
              <Text style={styles.companyLine}>tel: {contacts.tel}</Text>
            )}
            <Text style={styles.companyLine}>{contacts.email}</Text>
          </React.Fragment>
        )}
      </View>
    )
  }

  const HR = (): React.ReactElement => (
    <View
      style={{
        backgroundColor: colors.tableHeader,
        height: 1,
        marginTop: 15,
        marginBottom: 15,
      }}
    />
  )

  const LineHeader = (): React.ReactElement => (
    <View style={styles.lineHeader}>
      <Text style={[styles.line, styles.tableFormat[0]]}>Numero</Text>
      <Text style={[styles.line, styles.tableFormat[1]]}>Descrizione</Text>
      <Text style={[styles.line, styles.tableFormat[2]]}>Quantità</Text>
      <Text style={[styles.line, styles.tableFormat[3]]}>Prezzo</Text>
      <Text style={[styles.line, styles.tableFormat[4]]}>Importo</Text>
      <Text style={[styles.line, styles.tableFormat[5]]}>IVA</Text>
    </View>
  )

  const Line = ({
    line,
    currency,
  }: {
    line: Line
    currency: string
  }): React.ReactElement => (
    <View style={styles.lineRow}>
      <Text style={[styles.line, styles.tableFormat[0]]}>{line.number}</Text>
      <Text style={[styles.line, styles.tableFormat[1]]}>
        {line.description}
      </Text>
      <Text style={[styles.line, styles.numbers, styles.tableFormat[2]]}>
        {line.quantity}
      </Text>
      <Text style={[styles.line, styles.numbers, styles.tableFormat[3]]}>
        {line.singlePrice.toLocaleString(locale)}
        {currencySymbol(currency)}
      </Text>
      <Text style={[styles.line, styles.numbers, styles.tableFormat[4]]}>
        {line.amount.toLocaleString(locale)}
        {currencySymbol(currency)}
      </Text>
      <Text style={[styles.line, styles.numbers, styles.tableFormat[5]]}>
        {line.tax}%
      </Text>
    </View>
  )

  const InvoiceData = ({
    number,
    issueDate,
  }: {
    number: string
    issueDate: Date
  }): React.ReactElement => (
    <View style={{ textAlign: 'right', marginTop: 10 }}>
      <Text style={styles.invoiceData}>
        <Text style={{ fontSize: 10 }}>numero:</Text> {number}
      </Text>
      <Text style={styles.invoiceData}>
        <Text style={{ fontSize: 10 }}>data:</Text>{' '}
        {issueDate.toLocaleDateString(locale, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })}
      </Text>
    </View>
  )

  const Payment = ({
    payment,
    currency,
  }: {
    payment: Payment
    currency: string
  }): React.ReactElement => (
    <View style={{ lineHeight: 1.5, color: colors.lighterText }}>
      {payment.method && (
        <View>
          <Text>Metodo di pagamento: {payment.method}</Text>
        </View>
      )}
      {payment.bank && (
        <View>
          <Text>Banca: {payment.bank}</Text>
        </View>
      )}
      <View>
        <Text>IBAN: {payment.iban}</Text>
      </View>
      {payment.regularPaymentDate && (
        <View>
          <Text>
            Scadenza:{' '}
            {payment.regularPaymentDate.toLocaleDateString(locale, {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </Text>
        </View>
      )}
      <View>
        <Text>
          Importo: {payment.amount.toLocaleString(locale)}
          {currency}
        </Text>
      </View>
    </View>
  )

  const Recap = ({
    installment,
  }: {
    installment: Installment
  }): React.ReactElement => (
    <View style={styles.recapBox}>
      <View style={styles.recap.row}>
        <Text style={styles.recap.label}>Totale prodotti e servizi</Text>
        <Text style={styles.recap.value}>
          {installment.taxSummary.paymentAmount.toLocaleString(locale)}
          {currencySymbol(installment.currency)}
        </Text>
      </View>
      <View style={styles.recap.row}>
        <Text style={styles.recap.label}>Totale IVA</Text>
        <Text style={styles.recap.value}>
          {installment.taxSummary.taxAmount.toLocaleString(locale)}
          {currencySymbol(installment.currency)}
        </Text>
      </View>
      <View style={styles.recap.row}>
        <Text style={styles.recap.label}>
          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 12 }}>
            Totale
          </Text>
        </Text>
        <Text style={[styles.recap.value, { fontSize: 11 }]}>
          {installment.totalAmount.toLocaleString(locale)}
          {currencySymbol(installment.currency)}
        </Text>
      </View>
    </View>
  )

  return (
    <Document>
      {invoice.installments.map((installment, index: number) => (
        <Page size="A4" style={styles.page} key={index}>
          <View
            style={{
              paddingLeft: 30,
              paddingRight: 30,
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <View
                style={{
                  backgroundColor: colors.primary,
                  height: 15,
                  width: '100% ',
                  marginTop: -35,
                }}
              />
              <InvoiceData
                number={installment.number}
                issueDate={installment.issueDate}
              />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <Company company={invoice.invoicer} role="Dati fornitore" />
                <Company company={invoice.invoicee} role="Dati cliente" />
                {invoice.thirdParty && (
                  <Company company={invoice.thirdParty} role="Intermediario" />
                )}
              </View>
              {installment.description && (
                <React.Fragment>
                  <HR />
                  <Text style={styles.title}>Causale</Text>
                  <Text>{installment.description}</Text>
                </React.Fragment>
              )}
              <HR />
              <Text style={styles.title}>Prodotti e servizi</Text>
              <LineHeader />
              {installment.lines.map(line => (
                <Line
                  line={line}
                  currency={installment.currency}
                  key={line.number}
                />
              ))}
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ width: '50%' }}>
                  {installment.payment && (
                    <React.Fragment>
                      <Text style={[styles.title, { marginTop: 10 }]}>
                        Dettagli pagamento
                      </Text>
                      <Payment
                        payment={installment.payment}
                        currency={currencySymbol(installment.currency)}
                      />
                    </React.Fragment>
                  )}
                </View>
                <Recap installment={installment} />
              </View>
              {installment.attachments && (
                <React.Fragment>
                  <Text style={[styles.title, { marginTop: 15 }]}>
                    Documenti allegati
                  </Text>
                  <View style={styles.lineHeader}>
                    <Text style={[styles.line, { width: '50%' }]}>Nome</Text>
                    <Text style={[styles.line, { width: '50%' }]}>
                      Descrizione
                    </Text>
                  </View>
                  {installment.attachments.map((attachment, i) => (
                    <View style={styles.lineRow} key={i}>
                      <Text style={[styles.line, { width: '50%' }]}>
                        {attachment.name}
                      </Text>
                      <Text style={[styles.line, { width: '50%' }]}>
                        {attachment.description}
                      </Text>
                    </View>
                  ))}
                </React.Fragment>
              )}
            </View>
            {options.footer && (
              <View
                style={{
                  color: colors.footerText,
                  textAlign: 'center',
                  fontSize: 8,
                  padding: 5,
                  marginBottom: -20,
                }}
              >
                <Text>
                  Fattura digitale generata da{' '}
                  <Link
                    style={{ color: colors.primary }}
                    src="https://www.credimi.com/"
                  >
                    Credimi.com
                  </Link>
                </Text>
              </View>
            )}
          </View>
        </Page>
      ))}
    </Document>
  )
}

export default GeneratePDF
