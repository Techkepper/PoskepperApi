import { injectable } from 'tsyringe'
import { type IUsuario } from '../interfaces/IUsuario'
import { type IUsuarioRepository } from '../interfaces/IUsuarioRepository'
import prisma from '../libs/prisma'

/**
 * Repositorio de usuarios que implementa la interfaz IUsuarioRepository.
 * Utiliza Prisma para interactuar con la base de datos.
 */
@injectable()
export class UsuarioRepository implements IUsuarioRepository {
  /**
   * Obtiene los meseros que tienen órdenes.
   * @returns Una lista de usuarios o null si hubo un error.
   */
  async obtenerMeserosConOrdenes(): Promise<IUsuario[] | null> {
    try {
      return await prisma.$queryRaw<IUsuario[]>`
      EXEC sp_ContarOrdenesPorUsuario`
    } catch (error) {
      return null
    }
  }
  async obtenerReporteComisionesMesero(
    idUsuario: number,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<unknown[] | null> {
    try {
      return await prisma.$queryRaw<unknown[]>`
        EXEC sp_CalcularComisionesPorUsuario
          @FechaInicio = ${fechaInicio},
          @FechaFin = ${fechaFin},
          @idUsuario = ${idUsuario}`
    } catch (error) {
      return null
    }
  }
  /**
   * Obtiene las comisiones de los meseros en un rango de fechas.
   * @param fechaInicio - Fecha de inicio del rango.
   * @param fechaFin - Fecha de fin del rango.
   * @returns Una lista de usuarios o null si hubo un error
   */
  async obtenerComisionesMeseros(
    fechaInicio: string,
    fechaFin: string,
  ): Promise<IUsuario[] | null> {
    try {
      return await prisma.$queryRaw<IUsuario[]>`
        EXEC sp_CalcularComisionesPorFecha
          @FechaInicio = ${fechaInicio},
          @FechaFin = ${fechaFin}`
    } catch (error) {
      return null
    }
  }
  /**
   * Registra un nuevo usuario en la base de datos.
   * @param usuario - Datos del usuario a registrar.
   * @returns El usuario registrado o null si hubo un error.
   */
  async registrar(usuario: IUsuario): Promise<IUsuario | null> {
    try {
      const result = await prisma.$queryRaw<IUsuario>`
        EXEC sp_RegistrarUsuario
          @nombreUsuario = ${usuario.nombreUsuario},
          @contrasenna = ${usuario.contrasenna},
          @nombre = ${usuario.nombre},
          @apellidos = ${usuario.apellidos},
          @idRol = ${usuario.idRol},
          @comentarios = ${usuario.comentarios},
          @correo = ${usuario.correo},
          @comision = ${usuario.comision}`

      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Obtiene todos los usuarios de la base de datos con paginación.
   * @param offset - Número de registros a omitir (para paginación).
   * @param limit - Número máximo de registros a devolver.
   * @returns Una lista de usuarios o null si hubo un error.
   */
  // async obtenerTodos(
  //   offset: number,
  //   limit: number,
  // ): Promise<IUsuario[] | null> {
  //   try {
  //     return await prisma.$queryRaw<IUsuario[]>`
  //       EXEC sp_ObtenerUsuarios @offset = ${offset}, @limit = ${limit}`
  //   } catch (error) {
  //     return null
  //   }
  // }

  /**
   * Obtiene todos los usuarios de la base de datos.
   * @returns Una lista de usuarios o null si hubo un error.
   */
  async obtenerTodos(): Promise<IUsuario[] | null> {
    try {
      return await prisma.$queryRaw<IUsuario[]>`EXEC sp_ObtenerTodosLosUsuarios`
    } catch (error) {
      return null
    }
  }

  /**
   * Obtiene un usuario por su ID.
   * @param id - ID del usuario a obtener.
   * @returns El usuario encontrado o null si no se encontró o hubo un error.
   */
  async obtenerPorId(id: number): Promise<IUsuario | null> {
    try {
      const result = await prisma.$queryRaw<IUsuario>`
        EXEC sp_ObtenerUsuarioPorId @idUsuario = ${id}`
      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Actualiza un usuario en la base de datos.
   * @param id - ID del usuario a actualizar.
   * @param usuario - Datos del usuario a actualizar.
   * @returns El usuario actualizado o null si hubo un error.
   */
  async actualizar(
    id: number,
    usuario: Partial<IUsuario>,
  ): Promise<IUsuario | null> {
    try {
      const result = await prisma.$queryRaw<IUsuario>`
        EXEC sp_ActualizarUsuario
          @idUsuario = ${id},
          @nombreUsuario = ${usuario.nombreUsuario || null},
          @contrasenna = ${usuario.contrasenna || null},
          @nombre = ${usuario.nombre || null},
          @apellidos = ${usuario.apellidos || null},
          @idRol = ${usuario.idRol || null},
          @comentarios = ${usuario.comentarios || null},
          @correo = ${usuario.correo || null},
          @comision = ${usuario.comision || null}`
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
      await prisma.$queryRaw`EXEC sp_EliminarUsuarioPorId @idUsuario = ${id}`
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Verifica si un nombre de usuario ya existe en la base de datos.
   * @param nombreUsuario - Nombre de usuario a verificar.
   * @returns True si el nombre de usuario existe, false en caso contrario.
   */
  async existeNombreUsuario(nombreUsuario: string): Promise<boolean> {
    try {
      const result = await prisma.$queryRaw<{ existeUsuario: number }[]>`
        EXEC sp_existeNombreUsuario @nombreUsuario = ${nombreUsuario}`
      return result[0].existeUsuario === 1
    } catch (error) {
      return false
    }
  }

  /**
   * Verifica si un correo ya existe en la base de datos.
   * @param correo - Correo a verificar.
   * @returns True si el correo existe, false en caso contrario.
   */
  async existeCorreo(correo: string): Promise<boolean> {
    try {
      const result = await prisma.$queryRaw<{ existeCorreo: number }[]>`
        EXEC sp_existeCorreoUsuario @correo = ${correo}`
      return result[0].existeCorreo === 1
    } catch (error) {
      return false
    }
  }

  /**
   * Verifica si un ID de usuario ya existe en la base de datos.
   * @param id - ID de usuario a verificar.
   * @returns True si el ID de usuario existe, false en caso contrario.
   */
  async existeIdUsuario(id: number): Promise<boolean> {
    try {
      const result = await prisma.$queryRaw<{ existeUsuario: number }[]>`
        EXEC sp_existeIdUsuario @idUsuario = ${id}`
      return result[0].existeUsuario === 1
    } catch (error) {
      return false
    }
  }

  /**
   * Obtiene un listado de roles de usuario.
   * @returns Una lista de roles de usuario o null si hubo un error.
   */
  async obtenerRoles(): Promise<{ idRol: number; nombre: string }[] | null> {
    try {
      return await prisma.$queryRaw<{ idRol: number; nombre: string }[]>`
        EXEC sp_ObtenerRoles`
    } catch (error) {
      return null
    }
  }
}
