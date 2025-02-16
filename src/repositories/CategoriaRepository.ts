import { injectable } from 'tsyringe'
import { type ICategoria } from '../interfaces/ICategoria'
import { type ICategoriaRepository } from '../interfaces/ICategoriaRepository'
import prisma from '../libs/prisma'

/**
 * Repositorio de categorías que implementa la interfaz ICategoriaRepository.
 * Utiliza Prisma para interactuar con la base de datos.
 */
@injectable()
export class CategoriaRepository implements ICategoriaRepository {
  /**
   * Obtiene un listado de categorías de productos.
   * @returns Una lista de categorías o null si hubo un error.
   */
  async obtenerCategorias(): Promise<
    { idCategoria: number; descripcion: string }[] | null
  > {
    try {
      return await prisma.$queryRaw<
        { idCategoria: number; descripcion: string }[]
      >`
      EXEC sp_ObtenerCategorias`
    } catch (error) {
      return null
    }
  }

  /**
   * Registra una nueva categoría de productos.
   * @param categoria - Datos de la categoría a registrar.
   * @returns El cliente registrado o null si hubo un error.
   */
  async registrar(categoria: ICategoria): Promise<ICategoria | null> {
    try {
      const result = await prisma.$queryRaw<ICategoria>`
        EXEC sp_RegistrarCategoria
           @descripcion = ${categoria.descripcion},
           @estado = ${categoria.estado},
           @tipoCategoria = ${categoria.tipoCategoria}`
      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Verifica si una categoría ya existe en la base de datos.
   * @param descripcion - Descripción de la categoría a verificar.
   * @returns True si la categoría ya existe, false si no.
   */
  async existeDescripcionCategoria(descripcion: string): Promise<boolean> {
    try {
      const result = await prisma.$queryRaw<{ existeCategoria: number }[]>`
        EXEC sp_ExisteDescripcionCategoria @descripcion = ${descripcion}`
      return result[0].existeCategoria === 1
    } catch (error) {
      return false
    }
  }

  /**
   * Verifica si una categoría existe en la base de datos.
   * @param idCategoria - ID de la categoría a verificar.
   * @returns True si la categoría existe, false si no.
   */
  async existeIdCategoria(idCategoria: number): Promise<boolean> {
    try {
      const result = await prisma.$queryRaw<{ existeCategoria: number }[]>`
        EXEC sp_ExisteIdCategoria @id = ${idCategoria}`

      return result[0].existeCategoria === 1
    } catch (error) {
      return false
    }
  }

  /**
   * Verifica si una categoría está asociada a algún producto.
   * @param idCategoria - ID de la categoría a verificar.
   * @returns True si la categoría está asociada a algún producto, false si no.
   */
  async existeCategoriaEnProductos(idCategoria: number): Promise<boolean> {
    try {
      const result = await prisma.$queryRaw<{ existeCategoria: number }[]>`
        EXEC sp_ExisteCategoriaEnProducto @idCategoria = ${idCategoria}`
      return result[0].existeCategoria === 1
    } catch (error) {
      return false
    }
  }

  /**
   * Elimina una categoría de productos.
   * @param id - ID de la categoría a eliminar.
   * @returns True si la categoría fue eliminada, false en caso contrario.
   */
  async eliminar(id: number): Promise<boolean> {
    try {
      await prisma.$queryRaw`EXEC sp_EliminarCategoriaPorId @idCategoria = ${id}`
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Actualiza una categoría de productos en la base de datos.
   * @param categoria - Datos de la categoría a actualizar.
   * @returns True si la categoría fue actualizada, false en caso contrario.
   */
  async actualizar(
    id: number,
    categoria: ICategoria,
  ): Promise<ICategoria | null> {
    try {
      const result = await prisma.$queryRaw<ICategoria>`
        EXEC sp_ActualizarCategoria
          @idCategoria = ${id},
          @descripcion = ${categoria.descripcion},
          @estado = ${categoria.estado},
          @tipoCategoria = ${categoria.tipoCategoria}`
      return result
    } catch (error) {
      return null
    }
  }
}
