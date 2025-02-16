import { injectable } from 'tsyringe'
import { type IMerma } from '../interfaces/IMerma'
import { type IMermaRepository } from '../interfaces/IMermaRepository'
import prisma from '../libs/prisma'

/**
 * Repositorio de mermas que implementa la interfaz IMermaRepository.
 * Utiliza Prisma para interactuar con la base de datos.
 */
@injectable()
export class MermaRepository implements IMermaRepository {
  /**
   * Registra una nueva merma en la base de datos.
   * @param merma - Datos de la merma a registrar.
   * @returns La merma registrada o null si hubo un error.
   */
  async registrar(merma: IMerma): Promise<IMerma | null> {
    try {
      const result = await prisma.$queryRaw<IMerma>`
        EXEC sp_RegistrarMerma
          @idProducto = ${merma.idProducto},
          @cantidad = ${merma.cantidad},
          @comentario = ${merma.comentario},
          @estado = ${merma.estado}`
      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Obtiene todas las mermas de la base de datos.
   * @returns Una lista de mermas o null si hubo un error.
   */
  async obtenerTodos(): Promise<IMerma[] | null> {
    try {
      return await prisma.$queryRaw<IMerma[]>`EXEC sp_ObtenerTodasLasMermas`
    } catch (error) {
      return null
    }
  }
}
