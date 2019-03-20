export interface Company {
  name?: string
  vat: string
  contacts?: {
    tel?: string
    email?: string
  }
  office?: {
    address?: string
    number?: string
    cap?: string
    city?: string
    district?: string
    country?: string
  }
}
export interface Line {
  number: number
  description: string
  quantity: number
  singlePrice: number
  amount: number
  tax: number
}
export interface Payment {
  amount: number
  iban: string
  method?: string
  type?: string
  regularPaymentDate?: Date
  bank?: string
}
export interface Installment {
  number: string
  currency: string
  totalAmount: number
  issueDate: Date
  description?: string
  lines: Line[]
  payment?: Payment
  taxSummary: TaxSummary
  delay?: number
  attachments?: Array<{
    name: string
    description: string
  }>
}
export interface Invoice {
  invoicer: Company
  invoicee: Company
  thirdParty?: Company
  installments: Installment[]
}
export interface TaxSummary {
  taxPercentage: number
  taxAmount: number
  paymentAmount: number
  legalRef?: string
}
