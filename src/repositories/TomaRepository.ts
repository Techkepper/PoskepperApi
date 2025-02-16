import { injectable } from 'tsyringe'
import { IToma } from '../interfaces/IToma'
import { ITomaRepository } from '../interfaces/ITomaRepository'
import prisma from '../libs/prisma'
import { IProducto } from '../interfaces/IProducto'

/**
 * Repositorio de tomas que implementa la interfaz ITomaRepository.
 * Utiliza Prisma para interactuar con la base de datos.
 */
@injectable()
export class TomaRepository implements ITomaRepository {
  /**
   * Agrega un producto a una toma física existente.
   * @param nombre - Nombre del producto a agregar.
   * @param cantidad - Cantidad del producto a agregar.
   * @returns true si el producto se agregó correctamente, false si no.
   */
  async agregarProductoAToma(
    nombre: string,
    cantidad: number,
  ): Promise<IToma | null> {
    try {
      const result = await prisma.$queryRaw<IToma>`
      EXEC sp_ActualizarCantidadProducto
        @nombre = ${nombre},
        @cantidad = ${cantidad}`
      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Verifica si un producto con el nombre especificado ya existe en la base de datos.
   * @param nombre - Nombre del producto a verificar.
   * @returns true si el producto existe, false si no.
   */
  async existeNombreProducto(nombre: string): Promise<boolean> {
    try {
      const result = await prisma.$queryRaw<{ existeProducto: number }[]>`
      EXEC sp_existeNombreProducto
        @nombre = ${nombre}`
      return result[0].existeProducto === 1
    } catch (error) {
      return false
    }
  }

  /**
   * Registra una nueva toma física.
   * @param toma - Datos de la toma a registrar.
   * @returns La toma registrada o null si hubo un error.
   */
  async registrar(toma: IToma): Promise<IToma | null> {
    try {
      const result = await prisma.$queryRaw<IToma>`
        EXEC sp_RegistrarToma
           @fechaToma = ${toma.fechaToma},
           @motivo = ${toma.motivo},
           @idUsuario = ${toma.idUsuario}`
      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Obtiene todas las tomas físicas registradas para un reporte.
   * @returns Un arreglo con todas las tomas registradas o null si hubo un error.
   */
  async obtenerTodosProductosReporteDatos(): Promise<IProducto[] | null> {
    try {
      return await prisma.$queryRaw<
        IProducto[]
      >`EXEC sp_ObtenerProductosProductosReporte`
    } catch (error) {
      return null
    }
  }
}
