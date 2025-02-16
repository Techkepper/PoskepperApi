import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { type IMesaRepository } from '../interfaces/IMesaRepository'

/**
 * Controlador para manejar las operaciones relacionadas con las mesas.
 */
export class MesasController {
  private mesaRepository: IMesaRepository

  /**
   * Constructor del controlador.
   * Se encarga de inicializar la instancia del repositorio de mesas.
   */
  constructor() {
    this.mesaRepository = container.resolve<IMesaRepository>('MesaRepository')
  }

  /**
   * Registra una nueva mesa.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  registrarMesa = async (req: Request, res: Response) => {
    try {
      const { nombre, estado } = req.body
      if (!nombre || !estado) {
        res.status(400).json({
          error: 'Todos los campos son requeridos para registrar una mesa',
        })
        return
      }

      const existeNombreMesa =
        await this.mesaRepository.existeNombreMesa(nombre)
      if (existeNombreMesa) {
        res.status(400).json({ error: 'Ya existe una mesa con ese nombre' })
        return
      }

      const mesa = await this.mesaRepository.registrar({ nombre, estado })
      if (!mesa) throw new Error('No se pudo registrar la mesa')

      res.status(201).json({ mensaje: 'Mesa registrada correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene un listado de mesas.
   * @param res - Objeto de respuesta Express.
   */
  obtenerMesas = async (req: Request, res: Response) => {
    try {
      const mesas = await this.mesaRepository.obtenerMesas()

      if (!mesas || mesas.length === 0) {
        res.status(404).json({ error: 'No se encontraron mesas' })
        return
      }

      res.status(200).json(mesas)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Elimina una mesa.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  eliminarMesa = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const idMesa = parseInt(id, 10)

      if (isNaN(idMesa)) {
        res
          .status(400)
          .json({ error: 'El ID de la mesa debe ser un número entero válido' })
        return
      }

      const existeMesa = await this.mesaRepository.existeIdMesa(idMesa)
      if (!existeMesa) {
        res.status(404).json({
          error: 'No se encontró la mesa con la identificación proporcionada',
        })
        return
      }

      const eliminado = await this.mesaRepository.eliminar(idMesa)
      if (!eliminado) {
        res
          .status(404)
          .json({ error: 'No se pudo eliminar la mesa seleccionada' })
        return
      }

      res.status(200).json({ mensaje: 'Mesa eliminada correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Actualiza una mesa.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  actualizarMesa = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const idMesa = parseInt(id, 10)
      const mesaData = req.body

      if (isNaN(idMesa)) {
        res.status(400).json({
          error: 'La identificación debe ser un número entero válido',
        })
        return
      }

      const existeIdMesa = await this.mesaRepository.existeIdMesa(idMesa)
      if (!existeIdMesa) {
        res.status(404).json({
          error: 'No se encontró la mesa con la identificación proporcionada',
        })
        return
      }

      const existeNombreMesa = await this.mesaRepository.existeNombreMesa(
        mesaData.nombre,
      )
      if (existeNombreMesa) {
        res.status(400).json({
          error: 'Ya existe una mesa con el nombre proporcionado',
        })
        return
      }

      const mesa = await this.mesaRepository.actualizar(idMesa, mesaData)
      if (!mesa) {
        res.status(400).json({
          error: 'No se pudo actualizar la mesa seleccionada',
        })
        return
      }

      res.status(200).json({ mensaje: 'Mesa actualizada correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene una mesaOcupada.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */

  obtenerMesaOcupada = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const idMesa = parseInt(id, 10)

      if (isNaN(idMesa)) {
        res.status(400).json({
          error: 'La identificación debe ser un número entero válido',
        })
        return
      }

      const mesa = await this.mesaRepository.obtenerMesaOcupada(idMesa)
      if (!mesa) {
        res.status(404).json({
          error: 'No se encontró la mesa con la identificación proporcionada',
        })
        return
      }

      res.status(200).json(mesa)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
