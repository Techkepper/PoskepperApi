import { IProducto } from './IProducto'
import { type IToma } from './IToma'

export interface ITomaRepository {
  registrar(toma: IToma): Promise<IToma | null>
  existeNombreProducto(nombre: string): Promise<boolean>
  agregarProductoAToma(nombre: string, cantidad: number): Promise<IToma | null>
  obtenerTodosProductosReporteDatos(): Promise<IProducto[] | null>
}
