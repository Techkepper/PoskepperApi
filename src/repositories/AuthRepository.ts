import { Usuario } from '@prisma/client'
import crypto from 'crypto'
import { injectable } from 'tsyringe'
import { IAuthRepository } from '../interfaces/IAuthRepository'
import prisma from '../libs/prisma'

/**
 * Repositorio de autenticación que implementa la interfaz IAuthRepository.
 * Utiliza Prisma para interactuar con la base de datos.
 */
@injectable()
export class AuthRepository implements IAuthRepository {
  /**
   * Inicia sesión de un usuario en el sistema.
   * @param nombreUsuario - Nombre de usuario del usuario.
   * @param contrasenna - Contraseña del usuario.
   * @returns El usuario que inició sesión o null si no se encontró.
   */
  async iniciarSesion(
    nombreUsuario: string,
    contrasenna: string,
  ): Promise<Usuario | null> {
    try {
      const resultado = await prisma.$queryRaw<Usuario[]>`
        EXEC sp_IniciarSesion
          @nombreUsuario = ${nombreUsuario},
          @contrasenna = ${contrasenna}`
      return resultado[0] || null
    } catch (error) {
      throw new Error(`Error al iniciar sesión: ${error}`)
    }
  }

  /**
   * Obtiene un usuario por su nombre de usuario.
   * @param nombreUsuario - Nombre de usuario del usuario.
   * @returns El usuario encontrado o null si no se encontró.
   */
  async obtenerUsuarioPorNombreUsuario(
    nombreUsuario: string,
  ): Promise<Usuario | null> {
    try {
      const resultado = await prisma.$queryRaw<Usuario[]>`
        EXEC sp_ObtenerUsuarioPorNombreUsuario @nombreUsuario = ${nombreUsuario}`
      return resultado[0] || null
    } catch (error) {
      throw new Error(`Error al obtener el usuario: ${error}`)
    }
  }

  /**
   * Cambia la contraseña de un usuario.
   * @param correo - Correo electrónico del usuario.
   * @param nuevaContrasenna - Nueva contraseña del usuario.
   */
  async cambiarContrasenna(
    correo: string,
    nuevaContrasenna: string,
  ): Promise<void> {
    try {
      await prisma.$executeRaw`
        EXEC sp_CambiarContrasenna
          @correo = ${correo},
          @nuevaContrasenna = ${nuevaContrasenna};
      `
    } catch (error) {
      throw new Error(`Error al cambiar la contraseña: ${error}`)
    }
  }

  /**
   * Verifica si un correo electrónico ya está registrado en la base de datos.
   * @param correo - Correo electrónico a verificar.
   * @returns true si el correo ya está registrado, de lo contrario false.
   */
  async existeCorreo(correo: string): Promise<boolean> {
    try {
      const resultado = await prisma.$queryRaw<{ existeCorreo: number }[]>`
        EXEC sp_existeCorreoUsuario @correo = ${correo}`
      return resultado[0].existeCorreo === 1
    } catch (error) {
      throw new Error(`Error al verificar el correo: ${error}`)
    }
  }

  /**
   * Genera un token de recuperación de contraseña para un usuario.
   * @param correo - Correo electrónico del usuario.
   * @returns Un objeto con el token generado y la fecha de expiración.
   */
  async generarTokenRecuperacion(
    correo: string,
  ): Promise<{ token: string; tokenExpiracion: Date }> {
    try {
      const token = crypto.randomInt(1000, 9999).toString()
      const tokenExpiracion = new Date(Date.now() + 5 * 60 * 1000)

      await prisma.$executeRaw`
        EXEC sp_ActualizarTokenUsuario
          @correo = ${correo},
          @token = ${token},
          @tokenExpiracion = ${tokenExpiracion};
      `
      return { token, tokenExpiracion }
    } catch (error) {
      throw new Error(`Error al generar token de recuperación: ${error}`)
    }
  }

  /**
   * Verifica si un token de recuperación es válido.
   * @param correo - Correo electrónico del usuario.
   * @param token - Token a verificar.
   * @returns true si el token es válido, de lo contrario false.
   */
  async verificarTokenRecuperacion(
    correo: string,
    token: string,
  ): Promise<boolean> {
    try {
      const resultado = await prisma.$queryRaw<{ TokenValido: number }[]>`
        EXEC sp_VerificarTokenRecuperacion @correo = ${correo}, @token = ${token};
      `
      return resultado[0].TokenValido === 1
    } catch (error) {
      throw new Error(`Error al verificar el token de recuperación: ${error}`)
    }
  }
  /**
   * Elimina la cuenta de un usuario.
   * @param id - ID del usuario.
   * @param contrasenna - Contraseña del usuario.
   */
  async eliminarMiCuenta(id: number, contrasenna: string): Promise<boolean> {
    try {
      await prisma.$executeRaw`EXEC sp_EliminarMiCuenta @id = ${id}, @contrasenna = ${contrasenna}`
      return true
    } catch (error) {
      throw new Error(`Error al eliminar la cuenta: ${error}`)
    }
  }

  /**
   * Verifica si la contraseña de un usuario es correcta.
   * @param id - ID del usuario.
   * @returns El usuario encontrado o null si no se encontró.
   */
  async verificarContrasenna(
    id: number,
    contrasenna: string,
  ): Promise<boolean> {
    try {
      const resultado = await prisma.$queryRaw<
        { ContrasennaCorrecta: number }[]
      >`
      EXEC sp_VerificarContrasennaMiCuenta @id = ${id}, @contrasenna = ${contrasenna}`
      return resultado[0].ContrasennaCorrecta === 1
    } catch (error) {
      throw new Error(`Error al verificar la contraseña: ${error}`)
    }
  }

  /**
   * Actualiza la contraseña de un usuario.
   * @param id - ID del usuario.
   * @param nuevaContrasenna - Nueva contraseña del usuario.
   */
  async actualizarContrasenna(
    id: number,
    nuevaContrasenna: string,
  ): Promise<void> {
    try {
      await prisma.$executeRaw`
      EXEC sp_ActualizarContrasenna
        @id = ${id},
        @nuevaContrasenna = ${nuevaContrasenna};
    `
    } catch (error) {
      throw new Error(`Error al actualizar la contraseña: ${error}`)
    }
  }
}
