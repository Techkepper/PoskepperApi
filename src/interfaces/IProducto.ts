export interface IProducto {
  idProducto?: number
  fechaCreacion: Date
  nombre: string
  descripcion: string
  foto: Buffer
  idCategoria: number
  precio: number
  cantidad: number
  comentario?: string
  estado: boolean
  nombreCategoria?: string
  cantidadVieja?: number
  totalProductos?: number
  imagenUrl?: string
}
