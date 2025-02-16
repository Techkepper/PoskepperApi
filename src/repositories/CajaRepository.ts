import { injectable } from 'tsyringe'
import { type ICaja } from '../interfaces/ICaja'
import { type ICajaRepository } from '../interfaces/ICajaRepository'
import prisma from '../libs/prisma'

/**
 * Repositorio de cajas que implementa la interfaz ICajaRepository.
 * Utiliza Prisma para interactuar con la base de datos.
 */
@injectable()
export class CajaRepository implements ICajaRepository {
  /**
   * Asigna una caja a un usuario.
   * @param idCaja - ID de la caja a asignar.
   * @param idUsuario - ID del usuario a asignar.
   * @param montoApertura - Monto de apertura de la caja.
   * @returns True si la caja se asignó correctamente, false si no.
   */
  async asignarCaja(
    idCaja: number,
    idUsuario: number,
    montoInicial: number,
  ): Promise<boolean> {
    try {
      await prisma.$queryRaw`
            EXEC sp_AsignarCaja
                @idCaja = ${idCaja},
                @idUsuario = ${idUsuario},
                @montoInicial = ${montoInicial}`
      return true
    } catch (error) {
      return false
    }
  }
  /**
   * Obtiene un listado de cajas disponibles.
   * @returns Listado de cajas disponibles.
   */
  async obtenerCajasDisponibles(): Promise<ICaja[] | null> {
    try {
      return await prisma.$queryRaw<ICaja[]>`
            EXEC sp_CajasDisponibles`
    } catch (error) {
      return null
    }
  }
  /**
   * Verifica si un usuario está asignado a una caja.
   * @param idUsuario - ID del usuario a verificar.
   * @returns True si el usuario está asignado a una caja, false si no.
   */
  async estaAsignada(idCaja: number): Promise<boolean> {
    try {
      const result = await prisma.$queryRaw<{ tieneCaja: number }[]>`
            EXEC sp_ValidarUsuarioTieneCaja @idUsuario = ${idCaja}`
      return result[0].tieneCaja === 1
    } catch (error) {
      return false
    }
  }

  /**
   * Actualiza una caja en la base de datos.
   * @params caja - Datos de la caja a actualizar.
   * @return True si la caja se actualizó correctamente, false si no.
   */
  async actualizar(id: number, caja: Partial<ICaja>): Promise<ICaja | null> {
    try {
      const result = await prisma.$queryRaw<ICaja>`
                EXEC sp_ActualizarCaja
                    @idCaja = ${id},
                    @nombre = ${caja.nombre},
                    @montoApertura = ${caja.montoApertura},
                    @montoCierre = ${caja.montoCierre},
                    @estaAsignada = ${caja.estaAsignada}`
      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Elimina una caja de la base de datos.
   * @param idCaja - ID de la caja a eliminar.
   * @returns True si la caja se eliminó correctamente, false si no.
   */
  async eliminar(idCaja: number): Promise<boolean> {
    try {
      await prisma.$queryRaw`EXEC sp_EliminarCajaPorId @idCaja = ${idCaja}`
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Verifica si una caja ya existe en la base de datos.
   * @param idCaja - ID de la caja a verificar.
   * @returns True si la caja ya existe, false si no.
   */
  async existeIdCaja(idCaja: number): Promise<boolean> {
    try {
      const result = prisma.$queryRaw<{ existeCaja: number }[]>`
            EXEC sp_ExisteIdCaja @idCaja = ${idCaja}`
      return result.then((res) => res[0].existeCaja === 1)
    } catch (error) {
      return false
    }
  }

  /**
   * Obtiene un listado de cajas.
   * @returns Listado de cajas.
   */
  async obtenerCajas(): Promise<ICaja[] | null> {
    try {
      return await prisma.$queryRaw<ICaja[]>`
            EXEC sp_ObtenerCajas`
    } catch (error) {
      return null
    }
  }

  /**
   * Registra una caja en la base de datos.
   * @param caja - Datos de la caja a registrar.
   * @returns La caja registrada o null si hubo un error.
   */
  async registrar(caja: ICaja): Promise<ICaja | null> {
    try {
      const result = await prisma.$queryRaw<ICaja>`
                EXEC sp_RegistrarCaja
                    @nombre = ${caja.nombre},
                    @montoApertura = ${caja.montoApertura},
                    @montoCierre = ${caja.montoCierre},
                    @estaAsignada = ${caja.estaAsignada}`
      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Verifica si una caja ya existe en la base de datos.
   * @param nombre - Nombre de la caja a verificar.
   * @returns True si la caja ya existe, false si no.
   */
  async existeNombreCaja(nombre: string): Promise<boolean> {
    try {
      const result = await prisma.$queryRaw<{ existeCaja: number }[]>`
            EXEC sp_ExisteNombreCaja @nombre = ${nombre}`
      return result[0].existeCaja === 1
    } catch (error) {
      return false
    }
  }

  /**
   * Metodo para cambiar el estado de una caja
   * @param idCaja number
   * @param estaAsignado string
   * @returns Promise<IOrden | null>
   */
  async cambiarEstado(
    idCaja: number,
    estaAsignada: number,
  ): Promise<ICaja | null> {
    try {
      return await prisma.$queryRaw<ICaja>`
          EXEC sp_ActualizarEstadoCaja
            @idCaja = ${idCaja},
            @nuevoEstado = ${estaAsignada}
        `
    } catch (error) {
      return null
    }
  }

  /**
   * Obtiene una caja por su IdUsuario.
   * @param idUsuario - ID del usuario para obtener la caja.
   * @returns La caja o null si no se encontró.
   */
  async obtenerCajaPorUsuario(idUsuario: number): Promise<ICaja[] | null> {
    try {
      return await prisma.$queryRaw<ICaja[]>`
            EXEC sp_ObtenerCajaPorUsuario @idUsuario = ${idUsuario}`
    } catch (error) {
      return null
    }
  }
}
