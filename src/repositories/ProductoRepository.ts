import { injectable } from 'tsyringe'
import { type IProducto } from '../interfaces/IProducto'
import { type IProductoRepository } from '../interfaces/IProductoRepository'
import prisma from '../libs/prisma'

/**
 * Repositorio de productos que implementa la interfaz IProductoRepository.
 * Utiliza Prisma para interactuar con la base de datos.
 */
@injectable()
export class ProductoRepository implements IProductoRepository {
  /**
   * Obtiene los 3 productos más vendidos de la base de datos.
   * @returns Una lista de productos o null si hubo un error
   */
  async obtenerTopProductosMasVendidos(): Promise<IProducto[] | null> {
    try {
      return await prisma.$queryRaw<IProducto[]>`
        EXEC sp_Top3ProductosMasOrdenados`
    } catch (error) {
      return null
    }
  }
  /**
   * Obtiene todos los productos productos de la base de datos.
   * @returns Una lista de platos o null si hubo un error.
   */

  async obtenerTodosProductos(): Promise<IProducto[] | null> {
    try {
      return await prisma.$queryRaw<
        IProducto[]
      >`EXEC sp_ObtenerProductosProductos`
    } catch (error) {
      return null
    }
  }
  /**
   * Obtiene todos los platos de la base de datos.
   * @returns Una lista de platos o null si hubo un error.
   */
  async obtenerTodosPlatos(): Promise<IProducto[] | null> {
    try {
      return await prisma.$queryRaw<IProducto[]>`EXEC sp_ObtenerProductosPlatos`
    } catch (error) {
      return null
    }
  }

  /**
   * Registra un nuevo producto en la base de datos.
   * @param producto - Datos del producto a registrar.
   * @returns El producto registrado o null si hubo un error.
   */
  async registrar(producto: IProducto): Promise<IProducto | null> {
    try {
      const result = await prisma.$queryRaw<IProducto>`
        EXEC sp_RegistrarProducto
          @nombre = ${producto.nombre},
          @descripcion = ${producto.descripcion},
          @foto = ${producto.foto},
          @idCategoria = ${producto.idCategoria},
          @precio = ${producto.precio},
          @cantidad = ${producto.cantidad},
          @comentario = ${producto.comentario},
          @estado = ${producto.estado}`
      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Obtiene todos los usuarios de la base de datos.
   * @returns Una lista de usuarios o null si hubo un error.
   */
  async obtenerTodos(): Promise<IProducto[] | null> {
    try {
      return await prisma.$queryRaw<IProducto[]>`EXEC sp_ObtenerProductos`
    } catch (error) {
      return null
    }
  }

  /**
   * Obtiene un usuario por su ID.
   * @param id - ID del usuario a obtener.
   * @returns El usuario encontrado o null si no se encontró o hubo un error.
   */
  async obtenerPorId(id: number): Promise<IProducto | null> {
    try {
      const result = await prisma.$queryRaw<IProducto>`
        EXEC sp_ObtenerProductoPorId @idProducto = ${id}`
      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Actualiza un usuario en la base de datos.
   * @param producto - Datos del producto a actualizar.
   * @returns True si el producto fue actualizado, false en caso contrario.
   */
  async actualizar(id: number, producto: IProducto): Promise<IProducto | null> {
    try {
      const result = await prisma.$queryRaw<IProducto>`
      EXEC sp_ActualizarProducto
        @idProducto = ${id},
        @nombre = ${producto.nombre},  
        @descripcion = ${producto.descripcion},
        @foto = ${producto.foto},
        @idCategoria = ${producto.idCategoria},
        @precio = ${producto.precio},
        @cantidad = ${producto.cantidad},
        @comentario = ${producto.comentario},
        @estado = ${producto.estado}`
      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Elimina un usuario de la base de datos.
   * @param id - ID del usuario a eliminar.
   * @returns True si el usuario fue eliminado, false en caso contrario.
   */
  async eliminar(id: number): Promise<boolean> {
    try {
      await prisma.$queryRaw`EXEC sp_EliminarProductoPorId @idProducto = ${id}`
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Verifica si un ID de producto ya existe en la base de datos.
   * @param id - ID de producto a verificar.
   * @returns True si el ID de producto existe, false en caso contrario.
   */
  async existeIdProducto(id: number): Promise<boolean> {
    try {
      const result = await prisma.$queryRaw<{ existeProducto: number }[]>`
        EXEC sp_existeIdProducto @idProducto = ${id}`
      return result[0].existeProducto === 1
    } catch (error) {
      return false
    }
  }

  /**
   * Obtiene todos los productos de una categoría específica.
   * @param nombreCategoria - Nombre de la categoría de la que se desean obtener los productos.
   * @returns Una lista de productos o null si hubo un error.
   */

  async obtenerTodosPorNombreCategoria(
    nombreCategoria: string,
  ): Promise<IProducto[] | null> {
    try {
      return await prisma.$queryRaw<IProducto[]>`
        EXEC sp_ObtenerProductosPorCategoria @nombreCategoria = ${nombreCategoria}`
    } catch (error) {
      return null
    }
  }
}
