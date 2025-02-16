export interface IOrden {
  fechaOrden: string
  idUsuario: number
  idCliente: number
  comentario: string
  estado: string
  idMesa: number
  productos: IDetalleOrden[]
  nombreMesa?: string
}

interface IDetalleOrden {
  idProducto: number
  cantidad: number
  comentario: string
  precioUnitario: number
  total: number
}
