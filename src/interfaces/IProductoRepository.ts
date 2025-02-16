import { type IProducto } from './IProducto'

export interface IProductoRepository {
  registrar(producto: IProducto): Promise<IProducto | null>
  obtenerTodos(): Promise<IProducto[] | null>
  obtenerTodosPlatos(): Promise<IProducto[] | null>
  obtenerTodosProductos(): Promise<IProducto[] | null>
  obtenerPorId(idProducto: number): Promise<IProducto | null>
  actualizar(
    id: number,
    producto: Partial<IProducto>,
  ): Promise<IProducto | null>
  eliminar(id: number): Promise<boolean>
  existeIdProducto(idProducto: number): Promise<boolean>
  obtenerTodosPorNombreCategoria(
    nombreCategoria: string,
  ): Promise<IProducto[] | null>
  obtenerTopProductosMasVendidos(): Promise<IProducto[] | null>
}
