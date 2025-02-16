import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { type IUsuarioRepository } from '../interfaces/IUsuarioRepository'
import {
  generateReportComisionesMesero,
  Comision,
} from '../../utils/generarReporteComisiones'

/**
 * Controlador para manejar las operaciones relacionadas con los usuarios.
 */
export class UsuarioController {
  private usuarioRepository: IUsuarioRepository

  /**
   * Constructor del controlador.
   * Se encarga de inicializar la instancia del repositorio de usuarios.
   */
  constructor() {
    this.usuarioRepository =
      container.resolve<IUsuarioRepository>('UsuarioRepository')
  }

  /**
   * Registra un nuevo usuario en la base de datos.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  registrarUsuario = async (req: Request, res: Response) => {
    try {
      const {
        nombreUsuario,
        contrasenna,
        nombre,
        apellidos,
        idRol,
        comentarios,
        correo,
        comision,
      } = req.body

      if (
        !nombreUsuario ||
        !contrasenna ||
        !nombre ||
        !apellidos ||
        !idRol ||
        !correo
      ) {
        res.status(400).json({
          error: 'Todos los campos son requeridos para registrar un usuario',
        })
        return
      }

      if (comision) {
        if (
          isNaN(comision) ||
          comision < 0 ||
          comision.toString().includes('.') ||
          comision.toString().includes(',')
        ) {
          res.status(400).json({
            error: 'La comisión debe ser un número positivo sin decimales',
          })
          return
        }
      }

      const contrasennaValida = /^(?=.*[a-z]{4,})(?=.*[0-9]{4,})/.test(
        contrasenna,
      )
      if (!contrasennaValida) {
        res.status(400).json({
          error:
            'La contraseña debe tener al menos 4 letras y 4 números en cualquier orden',
        })
        return
      }

      const usuarioExistente =
        await this.usuarioRepository.existeNombreUsuario(nombreUsuario)
      if (usuarioExistente) {
        res.status(400).json({ error: 'El nombre de usuario ya está en uso' })
        return
      }

      const correoValido =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(correo)

      if (!correoValido) {
        res.status(400).json({
          error:
            'El correo electrónico debe tener el siguiente formato: nombre@ejemplo.com',
        })
        return
      }

      const correoExistente = await this.usuarioRepository.existeCorreo(correo)
      if (correoExistente) {
        res.status(400).json({ error: 'El correo electrónico ya está en uso' })
        return
      }

      const nuevoUsuario = await this.usuarioRepository.registrar({
        nombreUsuario,
        contrasenna,
        nombre,
        apellidos,
        idRol,
        comentarios,
        correo,
        comision,
      })

      if (!nuevoUsuario)
        throw new Error('No se pudo registrar el nuevo usuario')

      res.status(201).json({ mensaje: 'Usuario registrado correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene un listado de todos los usuarios registrados.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta
   */
  obtenerTodosLosUsuarios = async (req: Request, res: Response) => {
    try {
      const listaUsuarios = await this.usuarioRepository.obtenerTodos()

      if (!listaUsuarios || listaUsuarios.length === 0) {
        res.status(404).json({ error: 'No se encontraron usuarios' })
        return
      }

      res.status(200).json(listaUsuarios)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene un usuario por su identificación.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  obtenerUsuarioPorIdentificacion = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const idUsuario = parseInt(id, 10)

      if (isNaN(idUsuario)) {
        res.status(400).json({ error: 'La identificación debe ser un número' })
        return
      }

      const usuario = await this.usuarioRepository.obtenerPorId(idUsuario)
      if (!usuario) {
        res
          .status(404)
          .json({ error: 'No se encontró el usuario ' + idUsuario })
        return
      }

      res.status(200).json(usuario)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Elimina un usuario por su identificación.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  eliminarUsuario = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const idUsuario = parseInt(id, 10)

      if (isNaN(idUsuario)) {
        res
          .status(400)
          .json({ error: 'El ID de usuario debe ser un número entero válido' })
        return
      }

      const usuarioExistente =
        await this.usuarioRepository.existeIdUsuario(idUsuario)
      if (!usuarioExistente) {
        res
          .status(404)
          .json({ error: 'No se encontró el usuario con el ID proporcionado' })
        return
      }

      const eliminado = await this.usuarioRepository.eliminar(idUsuario)
      if (!eliminado) throw new Error('No se pudo eliminar el usuario')

      res.status(200).json({ mensaje: 'Usuario eliminado correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Actualiza un usuario por su identificación.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  actualizarUsuario = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const idUsuario = parseInt(id, 10)
      const usuarioData = req.body

      if (isNaN(idUsuario)) {
        res
          .status(400)
          .json({ error: 'El ID de usuario debe ser un número entero válido' })
        return
      }
      if (usuarioData.correo) {
        const correoValido =
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
            usuarioData.correo,
          )

        if (!correoValido) {
          res.status(400).json({
            error:
              'El correo electrónico debe tener el siguiente formato: nombre@ejemplo.com',
          })
          return
        }
      }

      const usuarioExistente =
        await this.usuarioRepository.existeIdUsuario(idUsuario)
      if (!usuarioExistente) {
        res
          .status(404)
          .json({ error: 'No se encontró el usuario con el ID proporcionado' })
        return
      }

      if (usuarioData.nombreUsuario) {
        const nombreUsuarioEnUso =
          await this.usuarioRepository.existeNombreUsuario(
            usuarioData.nombreUsuario,
          )
        if (nombreUsuarioEnUso) {
          res.status(400).json({ error: 'El nombre de usuario ya está en uso' })
          return
        }
      }

      if (usuarioData.correo) {
        const correoEnUso = await this.usuarioRepository.existeCorreo(
          usuarioData.correo,
        )
        if (correoEnUso) {
          res
            .status(400)
            .json({ error: 'El correo electrónico ya está en uso' })
          return
        }
      }

      const usuarioActualizado = await this.usuarioRepository.actualizar(
        idUsuario,
        usuarioData,
      )
      if (!usuarioActualizado) {
        res.status(500).json({ error: 'No se pudo actualizar el usuario' })
        return
      }

      res.status(200).json({ mensaje: 'Usuario actualizado correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene un listado de roles de usuario disponibles.
   * @param res - Objeto de respuesta Express.
   */
  obtenerRoles = async (req: Request, res: Response) => {
    try {
      const roles = await this.usuarioRepository.obtenerRoles()

      if (!roles || roles.length === 0) {
        res.status(404).json({ error: 'No se encontraron roles de usuario' })
        return
      }

      res.status(200).json(roles)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene las comisiones de los usuarios meseros entre dos fechas.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  obtenerComisionesMeseros = async (req: Request, res: Response) => {
    try {
      const { fechaInicio, fechaFin } = req.body

      if (!fechaInicio || !fechaFin) {
        res.status(400).json({
          error: 'Se requieren las fechas de inicio y fin para la consulta',
        })
        return
      }

      const comisiones = await this.usuarioRepository.obtenerComisionesMeseros(
        fechaInicio as string,
        fechaFin as string,
      )

      if (!comisiones || comisiones.length === 0) {
        res.status(404).json({ error: 'No se encontraron comisiones' })
        return
      }

      res.status(200).json(comisiones)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene un reporte de comisiones de un mesero en un rango de fechas.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  obtenerReporteComisionesMesero = async (req: Request, res: Response) => {
    try {
      const { id, fechaInicio, fechaFin } = req.body

      if (isNaN(id)) {
        res.status(400).json({ error: 'El ID de usuario debe ser un número' })
        return
      }

      if (!fechaInicio || !fechaFin) {
        res.status(400).json({
          error: 'Se requieren las fechas de inicio y fin para la consulta',
        })
        return
      }

      const comisiones =
        await this.usuarioRepository.obtenerReporteComisionesMesero(
          id as number,
          fechaInicio as string,
          fechaFin as string,
        )

      if (!comisiones || comisiones.length === 0) {
        res.status(404).json({ error: 'No se encontraron comisiones' })
        return
      }

      res.setHeader(
        'Content-disposition',
        'attachment; filename=reporte-comisiones.pdf',
      )
      res.setHeader('Content-type', 'application/pdf')

      generateReportComisionesMesero(comisiones as Comision[], res)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene un listado de los usuarios meseros con sus ordenes.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  obtenerMeserosConOrdenes = async (req: Request, res: Response) => {
    try {
      const meseros = await this.usuarioRepository.obtenerMeserosConOrdenes()

      if (!meseros || meseros.length === 0) {
        res.status(404).json({ error: 'No se encontraron meseros' })
        return
      }

      res.status(200).json(meseros)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
