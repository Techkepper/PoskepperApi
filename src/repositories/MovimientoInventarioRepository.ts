import { injectable } from 'tsyringe'
import { type IMovimientoInventario } from '../interfaces/IMovimientoInventario'
import { type IMovimientoInventarioRepository } from '../interfaces/IMovimientoInventarioRepository'
import prisma from '../libs/prisma'

/**
 * Repositorio de movimientos de inventario que implementa la interfaz IMovimientoInventarioRepository.
 * Utiliza Prisma para interactuar con la base de datos.
 */

@injectable()
export class MovimientoInventarioRepository
  implements IMovimientoInventarioRepository
{
  /**
   * Metodo para obtener un movimiento de inventario por su id
   * @param idMovimiento number
   * @returns Promise<IMovimientoInventario | null>
   */
  async obtenerMovimiento(
    idMovimiento: number,
  ): Promise<IMovimientoInventario | null> {
    try {
      return await prisma.$queryRaw<IMovimientoInventario>`
            EXEC sp_ObtenerMovimientoInventarioConDetalles @idMovimiento = ${idMovimiento}
        `
    } catch (error) {
      return null
    }
  }

  /**
   * Metodo para obtener todos los movimientos de inventario registrados en la base de datos
   * @returns Promise<IMovimientoInventario[]>
   */
  async obtenerMovimientos(): Promise<IMovimientoInventario[] | null> {
    try {
      return await prisma.$queryRaw<
        IMovimientoInventario[]
      >`EXEC sp_ObtenerTodosMovimientosConDetalles`
    } catch (error) {
      return []
    }
  }
  /**
   * Metodo para registrar un movimiento de inventario en la base de datos
   * @param movimiento IMovimientoInventario
   * @returns Promise<IMovimientoInventario | null
   */
  async registrar(
    movimiento: IMovimientoInventario,
  ): Promise<IMovimientoInventario[] | null> {
    try {
      const { fecha, motivo, tipoMovimiento, idUsuario, movimientos } =
        movimiento

      const movimientosJson = JSON.stringify(movimientos)

      return await prisma.$queryRaw<IMovimientoInventario[]>`
            EXEC sp_RegistrarMovimientoInventario
            @fecha = ${fecha},
            @motivo = ${motivo},
            @tipoMovimiento = ${tipoMovimiento},
            @idUsuario = ${idUsuario},
            @movimientos = ${movimientosJson}
        `
    } catch (error) {
      return null
    }
  }

  /**
   * Metodo para obtener todos los movimientos de inventario registrados en la base de datos
   * @returns Promise<IMovimientoInventario[]>
   */
  async obtenerTodosLosMovimientosInventarioReporte(): Promise<
    IMovimientoInventario[] | null
  > {
    try {
      return await prisma.$queryRaw<
        IMovimientoInventario[]
      >`EXEC sp_ObtenerTodosLosMovimientosInventarioReporte`
    } catch (error) {
      return []
    }
  }

  /**
   * Metodo para obtener un reporte de un movimiento de inventario por su id
   * @param idMovimiento number
   * @returns Promise<any>
   */
  async obtenerMovimientoInventarioPorIdReporte(
    idMovimiento: number,
  ): Promise<IMovimientoInventario[] | null> {
    try {
      return await prisma.$queryRaw<IMovimientoInventario[]>`
              EXEC sp_ObtenerMovimientoInventarioPorIdReporte @idMovimiento = ${idMovimiento}
          `
    } catch (error) {
      return null
    }
  }
}
