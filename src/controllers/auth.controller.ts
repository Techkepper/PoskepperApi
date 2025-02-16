import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { sendEmail } from '../config/miler'
import { IAuthRepository } from '../interfaces/IAuthRepository'
import { crearTokenAcceso } from '../libs/jwt'

/**
 * Controlador para manejar las operaciones relacionadas con la autenticación.
 */
export class AuthController {
  private authRepository: IAuthRepository

  /**
   * Constructor del controlador.
   * Se encarga de inicializar la instancia del repositorio de autenticación.
   */
  constructor() {
    this.authRepository = container.resolve<IAuthRepository>('AuthRepository')
  }

  /**
   * Registra un nuevo usuario en la base de datos.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  iniciarSesion = async (req: Request, res: Response) => {
    try {
      const { nombreUsuario, contrasenna } = req.body

      if (!nombreUsuario || !contrasenna) {
        return res
          .status(400)
          .json({ error: 'Nombre de usuario y contraseña son requeridos' })
      }

      const user = await this.authRepository.iniciarSesion(
        nombreUsuario,
        contrasenna,
      )

      if (user && user.sesionIniciada === 1) {
        const token = await crearTokenAcceso(nombreUsuario)
        res.cookie('token', token, {
          secure: true,
          sameSite: 'none',
          maxAge: 24 * 60 * 60 * 1000, // 24 horas
        })
        return res.status(200).json(user)
      } else if (user && user.sesionIniciada === 0) {
        return res
          .status(401)
          .json({ error: 'Nombre de usuario o contraseña incorrectos' })
      } else {
        return res.status(500).json({ error: 'Error interno del servidor' })
      }
    } catch (error) {
      const err = error as Error
      return res.status(500).json({
        error: 'Error interno del servidor', message: err.message, // Include the error message
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      })
    }
  }

  /**
   * Obtiene el perfil del usuario autenticado.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  miPerfil = async (req: Request, res: Response) => {
    try {
      const user = await this.authRepository.obtenerUsuarioPorNombreUsuario(
        req.nombreUsuario,
      )
      if (user) {
        return res.status(200).json(user)
      } else {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Cierra la sesión del usuario autenticado.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  cerrarSesion = async (req: Request, res: Response) => {
    res.clearCookie('token')
    res.status(200).json({ mensaje: 'Sesión cerrada' })
  }

  solicitarTokenRecuperacion = async (req: Request, res: Response) => {
    try {
      const { correo } = req.body

      if (!correo) {
        return res.status(400).json({
          error: 'El correo es requerido para recuperar la contraseña',
        })
      }

      const existeCorreo = await this.authRepository.existeCorreo(correo)
      if (!existeCorreo) {
        return res.status(404).json({ error: 'Correo no encontrado' })
      }

      const { token, tokenExpiracion } =
        await this.authRepository.generarTokenRecuperacion(correo)
      await sendEmail(
        correo,
        'Restablecimiento de Contraseña',
        `Tu token de restablecimiento de contraseña es: ${token}. Este token expirará el: ${tokenExpiracion.toLocaleString()}`,
      )

      return res
        .status(200)
        .json({ mensaje: 'Código de 4 dígitos enviado al correo' })
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Verifica si el token de recuperación es válido.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  verificarToken = async (req: Request, res: Response) => {
    try {
      const { correo, token } = req.body

      if (!correo || !token) {
        return res.status(400).json({ error: 'Correo y token son requeridos' })
      }

      const esTokenValido =
        await this.authRepository.verificarTokenRecuperacion(correo, token)
      if (esTokenValido) {
        return res.status(200).json({ mensaje: 'Código válido' })
      } else {
        return res.status(401).json({ error: 'Código incorrecto o expirado' })
      }
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Cambia la contraseña de un usuario.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  cambiarContrasenna = async (req: Request, res: Response) => {
    try {
      const { correo, nuevaContrasenna } = req.body

      if (!correo || !nuevaContrasenna) {
        return res
          .status(400)
          .json({ error: 'Correo y nueva contraseña son requeridos' })
      }

      await this.authRepository.cambiarContrasenna(correo, nuevaContrasenna)
      return res
        .status(200)
        .json({ mensaje: 'Contraseña cambiada exitosamente' })
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Elimina un usuario de la base de datos, dado su contraseña actual y el id
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  eliminarMiCuenta = async (req: Request, res: Response) => {
    try {
      const { id, contrasenna } = req.body

      if (!contrasenna) {
        return res
          .status(400)
          .json({ error: 'La contraseña es requerida para eliminar la cuenta' })
      }

      const contrasennaCorrecta =
        await this.authRepository.verificarContrasenna(id, contrasenna)
      if (!contrasennaCorrecta) {
        return res
          .status(401)
          .json({ error: 'La contraseña actual es incorrecta' })
      }

      await this.authRepository.eliminarMiCuenta(id, contrasenna)
      return res.status(200).json({ mensaje: 'Cuenta eliminada exitosamente' })
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Actualiza la contraseña de un usuario.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  actualizarContrasennaMiCuenta = async (req: Request, res: Response) => {
    try {
      const { id, contrasenna, nuevaContrasenna } = req.body

      if (!id) {
        return res.status(400).json({ error: 'ID de usuario es requerido' })
      }

      if (!contrasenna || !nuevaContrasenna) {
        return res.status(400).json({
          error: 'Contraseña actual y nueva contraseña son requeridas',
        })
      }

      const contrasennaCorrecta =
        await this.authRepository.verificarContrasenna(id, contrasenna)
      if (!contrasennaCorrecta) {
        return res
          .status(401)
          .json({ error: 'La contraseña actual es incorrecta' })
      }

      await this.authRepository.actualizarContrasenna(id, nuevaContrasenna)
      return res
        .status(200)
        .json({ mensaje: 'Contraseña actualizada exitosamente' })
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
