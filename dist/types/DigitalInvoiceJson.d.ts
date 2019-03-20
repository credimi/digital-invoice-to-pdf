export interface Attributes {
  xmlnsxsi: string
  xmlnsp: string
  xmlnsds: string
  versione: string
}
export interface IdFiscaleIVA {
  IdPaese: string
  IdCodice: string
}
export interface DatiTrasmissione {
  IdTrasmittente: IdFiscaleIVA
  ProgressivoInvio: string
  FormatoTrasmissione: string
  CodiceDestinatario: string
  ContattiTrasmittente: Contatti
}
export interface DatiAnagrafici {
  IdFiscaleIVA: IdFiscaleIVA
  CodiceFiscale: string
  Anagrafica: {
    Denominazione: string
  }
  RegimeFiscale: string
}
export interface Sede {
  Indirizzo: string
  NumeroCivico: string
  CAP: string
  Comune: string
  Provincia: string
  Nazione: string
}
export interface IscrizioneREA {
  Ufficio: string
  NumeroREA: string
  CapitaleSociale: string
  SocioUnico: string
  StatoLiquidazione: string
}
export interface Contatti {
  Telefono: string
  Email: string
}
export interface Company {
  DatiAnagrafici: DatiAnagrafici
  Sede: Sede
  IscrizioneREA: IscrizioneREA
  Contatti: Contatti
}
export interface FatturaElettronicaHeader {
  DatiTrasmissione: DatiTrasmissione
  CedentePrestatore: Company
  CessionarioCommittente: Company
  TerzoIntermediarioOSoggettoEmittente?: Company
}
export interface DatiGeneraliDocumento {
  TipoDocumento: string
  Divisa: string
  Data: Date
  Numero: string
  ImportoTotaleDocumento: number
  Causale?: string
}
export interface DatiGenerali {
  DatiGeneraliDocumento: DatiGeneraliDocumento
}
export interface DettaglioLinee {
  NumeroLinea: number
  Descrizione: string
  Quantita: number
  PrezzoUnitario: number
  PrezzoTotale: number
  AliquotaIVA: number
}
export interface DatiRiepilogo {
  AliquotaIVA: number
  ImponibileImporto: number
  Imposta: number
  EsigibilitaIVA: number
  RiferimentoNormativo: string
}
export interface DatiBeniServizi {
  DettaglioLinee: DettaglioLinee[]
  DatiRiepilogo: DatiRiepilogo
}
export interface DettaglioPagamento {
  ModalitaPagamento: string
  DataRiferimentoTerminiPagamento: string
  GiorniTerminiPagamento: string
  DataScadenzaPagamento: string
  ImportoPagamento: number
  IstitutoFinanziario: string
  IBAN: string
}
export interface DatiPagamento {
  CondizioniPagamento: string
  DettaglioPagamento: DettaglioPagamento
}
export interface FatturaElettronicaBody {
  DatiGenerali: DatiGenerali
  DatiBeniServizi: DatiBeniServizi
  DatiPagamento: DatiPagamento
  Allegati: Allegati | Allegati[]
}
export interface FatturaElettronica {
  attributes: Attributes
  FatturaElettronicaHeader: FatturaElettronicaHeader
  FatturaElettronicaBody: FatturaElettronicaBody | FatturaElettronicaBody[]
}
export interface Allegati {
  NomeAttachment: string
  DescrizioneAttachment: string
}
export interface InvoiceJSON {
  FatturaElettronica: FatturaElettronica
}
