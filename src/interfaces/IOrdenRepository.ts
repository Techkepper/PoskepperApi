import { type IOrden } from './IOrden'

export interface IOrdenRepository {
  registrar(orden: IOrden): Promise<IOrden | null>
  obtenerOrdenes(): Promise<IOrden[] | null>
  cambiarEstado(idOrden: number, estado: string): Promise<IOrden | null>
  obtenerOrden(idOrden: number): Promise<IOrden | null>
  actualizar(idOrden: number, orden: IOrden): Promise<IOrden | null>
  agregarDetalle(idOrden: number, orden: IOrden): Promise<IOrden | null>
  obtenerDetalle(idOrden: number): Promise<IOrden[] | null>
}
