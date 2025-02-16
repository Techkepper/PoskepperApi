import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { type IMermaRepository } from '../interfaces/IMermaRepository'

/**
 * Controlador para manejar las operaciones relacionadas con las mermas.
 */
export class MermaController {
  private mermaRepository: IMermaRepository

  /**
   * Constructor del controlador.
   * Se encarga de inicializar la instancia del repositorio de mermas.
   */
  constructor() {
    this.mermaRepository =
      container.resolve<IMermaRepository>('MermaRepository')
  }

  /**
   * Registra una nueva merma en la base de datos.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */

  registrar = async (req: Request, res: Response) => {
    try {
      const { idProducto, cantidad, fecha, comentario, estado } = req.body

      if (!idProducto || !cantidad || !fecha || !estado) {
        res.status(400).json({
          error: 'Todos los campos son requeridos para registrar una merma',
        })
        return
      }
      const merma = await this.mermaRepository.registrar({
        idProducto,
        cantidad,
        fecha,
        comentario,
        estado,
      })

      if (!merma) {
        res.status(500).json({
          error: 'No se pudo registrar la merma',
        })
        return
      }

      res.status(201).json({ mensaje: 'Merma registrada correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene todas las mermas de la base de datos.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */

  obtenerTodos = async (req: Request, res: Response) => {
    try {
      const listaMermas = await this.mermaRepository.obtenerTodos()

      if (!listaMermas || listaMermas.length === 0) {
        res.status(404).json({ error: 'No se encontraron mermas' })
        return
      }

      res.status(200).json(listaMermas)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
