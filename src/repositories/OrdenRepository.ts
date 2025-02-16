import { injectable } from 'tsyringe'
import { type IOrden } from '../interfaces/IOrden'
import { type IOrdenRepository } from '../interfaces/IOrdenRepository'
import prisma from '../libs/prisma'

/**
 * Repositorio de ordenes que implementa la interfaz IOrdenRepository.
 * Utiliza Prisma para interactuar con la base de datos.
 */
@injectable()
export class OrdenRepository implements IOrdenRepository {
  /**
   * Metodo para obtener una orden por su id
   * @param idOrden number
   * @returns Promise<IOrden | null>
   */
  async obtenerOrden(idOrden: number): Promise<IOrden | null> {
    try {
      return await prisma.$queryRaw<IOrden>`
        EXEC sp_ObtenerOrdenConDetalles @idOrden = ${idOrden}
      `
    } catch (error) {
      return null
    }
  }
  /**
   * Metodo para cambiar el estado de una orden
   * @param idOrden number
   * @param estado string
   * @returns Promise<IOrden | null>
   */
  async cambiarEstado(idOrden: number, estado: string): Promise<IOrden | null> {
    try {
      return await prisma.$queryRaw<IOrden>`
        EXEC sp_ActualizarEstadoOrden
          @idOrden = ${idOrden},
          @nuevoEstado = ${estado}
      `
    } catch (error) {
      return null
    }
  }

  /**
   * Metodo para obtener todas las ordenes registradas en la base de datos
   * @returns Promise<IOrden[]>
   */
  async obtenerOrdenes(): Promise<IOrden[] | null> {
    try {
      return await prisma.$queryRaw<IOrden[]>`EXEC sp_ObtenerOrdenesConDetalles`
    } catch (error) {
      return []
    }
  }

  /**
   * Metodo para registrar una orden en la base de datos
   * @param orden IOrden
   * @returns Promise<IOrden | null
   */
  async registrar(orden: IOrden): Promise<IOrden | null> {
    try {
      const {
        fechaOrden,
        idUsuario,
        idCliente,
        comentario,
        estado,
        idMesa,
        productos,
      } = orden

      const productosJson = JSON.stringify(productos)

      const result = await prisma.$queryRaw<IOrden>`
        EXEC sp_RegistrarOrden
          @fechaOrden = ${fechaOrden},
          @idUsuario = ${idUsuario},
          @idCliente = ${idCliente},
          @comentario = ${comentario},
          @estado = ${estado},
          @idMesa = ${idMesa},
          @productos = ${productosJson}
      `
      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Metodo para actualizar una orden en la base de datos
   * @param idOrden number
   * @param orden IOrden
   * @returns Promise<IOrden | null>
   */
  async actualizar(idOrden: number, orden: IOrden): Promise<IOrden | null> {
    try {
      const {
        fechaOrden,
        idUsuario,
        idCliente,
        comentario,
        estado,
        idMesa,
        productos,
      } = orden

      const productosJson = JSON.stringify(productos)

      const result = await prisma.$queryRaw<IOrden>`
        EXEC sp_ActualizarOrden
          @idOrden = ${idOrden},
          @fechaOrden = ${fechaOrden},
          @idUsuario = ${idUsuario},
          @idCliente = ${idCliente},
          @comentario = ${comentario},
          @estado = ${estado},
          @idMesa = ${idMesa},
          @productos = ${productosJson}
      `
      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Metodo para agregar un detalle a una orden
   * @param idOrden number
   * @param orden IOrden
   * @returns Promise<IOrden | null>
   */
  async agregarDetalle(
    idOrden: number,
    productos: IOrden,
  ): Promise<IOrden | null> {
    try {
      const producto = productos.productos[0]
      const { idProducto, cantidad, comentario, precioUnitario, total } =
        producto

      const result = await prisma.$queryRaw<IOrden[]>`
        EXEC sp_AgregarDetalle
          @idOrden = ${idOrden},
          @idProducto = ${idProducto},
          @cantidad = ${cantidad},
          @comentario = ${comentario},
          @precioUnitario = ${precioUnitario},
          @total = ${total}
      `

      return result.length > 0 ? result[0] : null
    } catch (error) {
      return null
    }
  }

  /**
   * Metodo para obtener un detalle de una orden
   * @param idOrden number
   * @returns Promise<IOrden | null>
   */
  async obtenerDetalle(idOrden: number): Promise<IOrden[] | null> {
    try {
      const result = await prisma.$queryRaw<IOrden[]>`
        EXEC sp_ObtenerDetalle @idOrden = ${idOrden}
      `

      return result.length > 0 ? result : null
    } catch (error) {
      return null
    }
  }
}
