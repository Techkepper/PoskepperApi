export interface IFactura {
  idFactura?: number
  idOrden: number
  idUsuario: number
  fecha: Date
  total: number
  estadoFactura?: number
}

export interface IDetails {
  idDetails?: number
  idFactura: number
  invoiceLogo: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  currency: string
  language: string
  taxDetails: string
  discountDetails: string
  shippingDetails: string
  paymentInformation: string
  additionalNotes: string
  paymentTerms: string
  totalAmountInWords: string
  pdfTemplate: number
  subTotal: number
  totalAmount: number
  signature: string
  updatedAt: string
}

export interface IReceiver {
  idReceiver?: number
  idFactura: number
  name: string
  email: string
  address: string
  city: string
  zipCode: string
  country: string
  phone: string
  customInputs: string
}

export interface ISender {
  idSender?: number
  idFactura: number
  name: string
  email: string
  address: string
  city: string
  zipCode: string
  country: string
  phone: string
  customInputs: string
}
