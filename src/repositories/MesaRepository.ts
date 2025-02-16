import { injectable } from 'tsyringe'
import { type IMesa } from '../interfaces/IMesa'
import { type IMesaRepository } from '../interfaces/IMesaRepository'
import prisma from '../libs/prisma'

/**
 * Repositorio de mesas que implementa la interfaz IMesaRepository.
 * Utiliza Prisma para interactuar con la base de datos.
 */
@injectable()
export class MesaRepository implements IMesaRepository {
  /**
   * Actualiza una mesa en la base de datos.
   * @params mesa - Datos de la mesa a actualizar.
   * @return True si la mesa se actualizó correctamente, false si no.
   */
  async actualizar(id: number, mesa: Partial<IMesa>): Promise<IMesa | null> {
    try {
      const result = await prisma.$queryRaw<IMesa>`
            EXEC sp_ActualizarMesa
                @idMesa = ${id},
                @nombre = ${mesa.nombre},
                @estado = ${mesa.estado}`
      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Elimina una mesa de la base de datos.
   * @param idMesa - ID de la mesa a eliminar.
   * @returns True si la mesa se eliminó correctamente, false si no.
   */
  async eliminar(idMesa: number): Promise<boolean> {
    try {
      await prisma.$queryRaw`EXEC sp_EliminarMesaPorId @idMesa = ${idMesa}`
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Verifica si una mesa ya existe en la base de datos.
   * @param idMesa - ID de la mesa a verificar.
   * @returns True si la mesa ya existe, false si no.
   */
  async existeIdMesa(idMesa: number): Promise<boolean> {
    try {
      const result = prisma.$queryRaw<{ existeMesa: number }[]>`
        EXEC sp_ExisteIdMesa @idMesa = ${idMesa}`
      return result.then((res) => res[0].existeMesa === 1)
    } catch (error) {
      return false
    }
  }

  /**
   * Obtiene un listado de mesas.
   * @returns Una lista de mesas o null si hubo un error.
   */
  async obtenerMesas(): Promise<IMesa[] | null> {
    try {
      return await prisma.$queryRaw<IMesa[]>`
            EXEC sp_ObtenerMesas`
    } catch (error) {
      return null
    }
  }

  /**
   * Registra una nueva mesa.
   * @param mesa - Datos de la mesa a registrar.
   * @returns La mesa registrada o null si hubo un error.
   */
  async registrar(mesa: IMesa): Promise<IMesa | null> {
    try {
      const result = await prisma.$queryRaw<IMesa>`
            EXEC sp_RegistrarMesa
                @nombre = ${mesa.nombre},
                @estado = ${mesa.estado}`
      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Verifica si una mesa ya existe en la base de datos.
   * @param nombre - Nombre de la mesa a verificar.
   * @returns True si la mesa ya existe, false
   */
  async existeNombreMesa(nombre: string): Promise<boolean> {
    try {
      const result = await prisma.$queryRaw<{ existeMesa: number }[]>`
        EXEC sp_ExisteNombreMesa @nombre = ${nombre}`
      return result[0].existeMesa === 1
    } catch (error) {
      return false
    }
  }

  /**
   * Obtiene una mesa ocupada.
   * @param idMesa - ID de la mesa a verificar.
   * @returns La mesa ocupada o null si no hay una mesa ocupada.
   */
  async obtenerMesaOcupada(idMesa: number): Promise<IMesa | null> {
    try {
      const result = await prisma.$queryRaw<IMesa>`
            EXEC sp_ObtenerMesaOcupada @idMesa = ${idMesa}`

      return result
    } catch (error) {
      return null
    }
  }
}
