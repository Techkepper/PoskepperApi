import { type IMovimientoInventario } from './IMovimientoInventario'

export interface IMovimientoInventarioRepository {
  registrar(
    movimiento: IMovimientoInventario,
  ): Promise<IMovimientoInventario[] | null>
  obtenerMovimientos(): Promise<IMovimientoInventario[] | null>
  obtenerMovimiento(idMovimiento: number): Promise<IMovimientoInventario | null>
  obtenerMovimientoInventarioPorIdReporte(
    idMovimiento: number,
  ): Promise<IMovimientoInventario[] | null>
  obtenerTodosLosMovimientosInventarioReporte(): Promise<
    IMovimientoInventario[] | null
  >
}
