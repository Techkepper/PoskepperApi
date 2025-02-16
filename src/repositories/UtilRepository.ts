import { injectable } from 'tsyringe'
import { type IUtilRepository } from '../interfaces/IUtilRepository'
import prisma from '../libs/prisma'

/**
 * Repositorio de utilidades que implementa la interfaz IUtilRepository.
 * Utiliza Prisma para interactuar con la base de datos.
 */
@injectable()
export class UtilRepository implements IUtilRepository {
  /**
   * Obtiene la hora actual de la base de datos.
   * @returns La hora actual de la base de datos o null si hubo un error.
   * @throws Error si no se pudo obtener la hora de la base de datos.
   */
  async obtenerHoraBD(): Promise<string | null> {
    try {
      const result = await prisma.$queryRaw<string[]>`
        EXEC sp_ObtenerHora`
      return result[0]
    } catch (error) {
      return null
    }
  }
}
