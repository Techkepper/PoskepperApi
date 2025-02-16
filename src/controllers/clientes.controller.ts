import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { type IClienteRepository } from '../interfaces/IClienteRepository'

/**
 * Controlador para manejar las operaciones relacionadas con los clientes.
 */
export class ClienteController {
  private clienteRepository: IClienteRepository

  /**
   * Constructor del controlador.
   * Se encarga de inicializar la instancia del repositorio de clientes.
   */
  constructor() {
    this.clienteRepository =
      container.resolve<IClienteRepository>('ClienteRepository')
  }

  /**
   * Registra un nuevo cliente en la base de datos.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  registrarCliente = async (req: Request, res: Response) => {
    try {
      const {
        cedula,
        nombre,
        apellidos,
        correoElectronico,
        telefono,
        direccion,
        comentario,
        estado,
      } = req.body
      if (
        !cedula ||
        !nombre ||
        !apellidos ||
        !correoElectronico ||
        !telefono ||
        !direccion
      ) {
        res.status(400).json({
          error: 'Todos los campos son requeridos para registrar un cliente',
        })
        return
      }

      const cedulaValida = /^[0-9]{7,9}$/.test(cedula)
      if (!cedulaValida) {
        res.status(400).json({
          error: 'La cédula debe tener 7 o 9 dígitos',
        })
        return
      }

      const correoValido =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
          correoElectronico,
        )

      if (!correoValido) {
        res.status(400).json({
          error:
            'El correo electrónico debe tener el siguiente formato: nombre@ejemplo.com',
        })
        return
      }

      const telefonoValido = /^[0-9]{8}$/.test(telefono)
      if (!telefonoValido) {
        res.status(400).json({
          error: 'El número de teléfono debe tener 8 dígitos',
        })
        return
      }

      const clienteExistente =
        await this.clienteRepository.existeCedulaCliente(cedula)
      if (clienteExistente) {
        res.status(400).json({ error: 'La cedula del cliente ya está en uso' })
        return
      }

      const correoExistente =
        await this.clienteRepository.existeCorreo(correoElectronico)
      if (correoExistente) {
        res.status(400).json({
          error: 'El correo electrónico ya está en uso',
        })
        return
      }

      const nuevoCliente = await this.clienteRepository.registrar({
        cedula,
        nombre,
        apellidos,
        correoElectronico,
        telefono,
        direccion,
        comentario,
        estado,
      })

      if (!nuevoCliente)
        throw new Error('No se pudo registrar el nuevo cliente')

      res.status(201).json({ mensaje: 'Cliente registrado correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene un listado de todos los clientes registrados en la base de datos con paginación.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  obtenerListadoClientes = async (req: Request, res: Response) => {
    try {
      const listaClientes = await this.clienteRepository.obtenerTodos()

      if (!listaClientes || listaClientes.length === 0) {
        res.status(404).json({ error: 'No se encontraron clientes' })
        return
      }
      res.status(200).json(listaClientes)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene un cliente por su identificación.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  obtenerClientePorIdentificacion = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const idCliente = parseInt(id, 10)

      if (isNaN(idCliente)) {
        res.status(400).json({ error: 'La identificación debe ser un número' })
        return
      }

      const cliente = await this.clienteRepository.obtenerPorId(idCliente)
      if (!cliente) {
        res
          .status(404)
          .json({ error: 'No se encontró el cliente ' + idCliente })
        return
      }

      res.status(200).json(cliente)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Elimina un cliente por su identificación.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  eliminarCliente = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const idCliente = parseInt(id, 10)

      if (isNaN(idCliente)) {
        res
          .status(400)
          .json({ error: 'La identificación debe ser un número entero válido' })
        return
      }

      const clienteExistente =
        await this.clienteRepository.existeIdCliente(idCliente)
      if (!clienteExistente) {
        res
          .status(404)
          .json({ error: 'No se encontró el cliente con el ID proporcionado' })
        return
      }

      const eliminado = await this.clienteRepository.eliminar(idCliente)
      if (!eliminado) throw new Error('No se pudo eliminar el cliente')

      res.status(200).json({ mensaje: 'Cliente eliminado correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Actualiza un cliente por su identificación.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  actualizarCliente = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const idCliente = parseInt(id, 10)
      const clienteData = req.body

      if (isNaN(idCliente)) {
        res
          .status(400)
          .json({ error: 'La identificación debe ser un número entero válido' })
        return
      }

      if (clienteData.correoElectronico) {
        const correoValido =
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
            clienteData.correoElectronico,
          )
        if (!correoValido) {
          res.status(400).json({
            error:
              'El correo electrónico debe tener el siguiente formato: nombre@ejemplo.com',
          })
          return
        }
      }

      const clienteExistente =
        await this.clienteRepository.existeIdCliente(idCliente)
      if (!clienteExistente) {
        res
          .status(404)
          .json({ error: 'No se encontró el cliente con el ID proporcionado' })
        return
      }

      if (clienteData.cedula) {
        const cedulaUsuarioEnUso =
          await this.clienteRepository.existeCedulaCliente(clienteData.cedula)
        if (cedulaUsuarioEnUso) {
          res
            .status(400)
            .json({ error: 'La cedula del cliente ya está en uso' })
          return
        }
      }

      if (clienteData.correoElectronico) {
        const correoEnUso = await this.clienteRepository.existeCorreo(
          clienteData.correoElectronico,
        )
        if (correoEnUso) {
          res
            .status(400)
            .json({ error: 'El correo electrónico ya está en uso' })
          return
        }
      }

      const clienteActualizado = await this.clienteRepository.actualizar(
        idCliente,
        clienteData,
      )

      if (!clienteActualizado) {
        res.status(500).json({ error: 'No se pudo actualizar el cliente' })
        return
      }

      res.status(200).json({ mensaje: 'Cliente actualizado correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
