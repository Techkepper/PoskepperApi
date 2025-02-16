export interface IMovimientoInventario {
  idMovimiento?: number
  fecha: string
  motivo: string
  tipoMovimiento: string
  idUsuario: number
  movimientos: IDetalleMovimientoInventario[]
  tipoMovimientoNombre?: string
  nombreCompleto?: string
}

export interface IDetalleMovimientoInventario {
  idDetalleMovimiento?: number
  idProducto: number
  cantidadMovimiento: number
  comentario: string
  nombreProducto?: string
  cantidadActual?: number
  cantidadVieja?: number
  tipoMovimientoNombre?: string
}
