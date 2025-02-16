import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { type IUtilRepository } from '../src/interfaces/IUtilRepository'

/**
 * Archivo de utilidades para manejar las operaciones relacionadas con la base de datos.
 */
export class UtilController {
  private utilRepository: IUtilRepository

  /**
   * Constructor del controlador.
   * Se encarga de inicializar la instancia del repositorio de utilidades.
   */
  constructor() {
    this.utilRepository = container.resolve<IUtilRepository>('UtilRepository')
  }

  /**
   * Obtiene la hora actual de la base de datos.
   * @param res - Objeto de respuesta Express.
   */
  obtenerHoraBD = async (req: Request, res: Response) => {
    try {
      // 1. Obtener la hora actual de la base de datos.
      // const hora = await this.utilRepository.obtenerHoraBD()

      // 2. Obtener la hora actual del servidor.
      const hora = new Date().toISOString()

      if (!hora) {
        res
          .status(404)
          .json({ error: 'No se pudo obtener la hora de la base de datos' })
        return
      }

      res.status(200).json(hora)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
