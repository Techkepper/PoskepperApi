import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { type ICajaRepository } from '../interfaces/ICajaRepository'

/**
 * Controlador para manejar las operaciones relacionadas con las cajas.
 */
export class CajasController {
  private cajaRepository: ICajaRepository

  /**
   * Constructor del controlador.
   * Se encarga de inicializar la instancia del repositorio de cajas.
   */
  constructor() {
    this.cajaRepository = container.resolve<ICajaRepository>('CajaRepository')
  }

  /**
   * Registra una nueva caja.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  registrarCaja = async (req: Request, res: Response) => {
    try {
      const { nombre, montoApertura, montoCierre, estaAsignada } = req.body

      if (!nombre) {
        res.status(400).json({
          error: 'Todos los campos son requeridos para registrar una caja',
        })
        return
      }

      if (
        isNaN(montoApertura) ||
        montoApertura < 0 ||
        montoApertura.toString().includes('.') ||
        montoApertura.toString().includes(',')
      ) {
        res.status(400).json({
          error:
            'El monto de apertura debe ser un número positivo sin decimales',
        })
        return
      }

      if (
        isNaN(montoCierre) ||
        montoCierre < 0 ||
        montoCierre.toString().includes('.') ||
        montoCierre.toString().includes(',')
      ) {
        res.status(400).json({
          error: 'El monto de cierre debe ser un número positivo sin decimales',
        })
        return
      }

      const existeNombreCaja =
        await this.cajaRepository.existeNombreCaja(nombre)

      if (existeNombreCaja) {
        res.status(400).json({ error: 'Ya existe una caja con ese nombre' })
        return
      }

      const caja = await this.cajaRepository.registrar({
        nombre,
        montoApertura,
        montoCierre,
        estaAsignada,
      })
      if (!caja) throw new Error('No se pudo registrar la caja')

      res.status(201).json({ mensaje: 'Caja registrada correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene un listado de cajas.
   * @param res - Objeto de respuesta Express.
   */
  obtenerCajas = async (req: Request, res: Response) => {
    try {
      const cajas = await this.cajaRepository.obtenerCajas()

      if (!cajas || cajas.length === 0) {
        res.status(404).json({ error: 'No se encontraron cajas' })
        return
      }

      res.status(200).json(cajas)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Elimina una caja.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  eliminarCaja = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const idCaja = parseInt(id, 10)

      if (isNaN(idCaja)) {
        res
          .status(400)
          .json({ error: 'El ID de la caja debe ser un número entero válido' })
        return
      }

      const existeIdCaja = await this.cajaRepository.existeIdCaja(idCaja)
      if (!existeIdCaja) {
        res.status(404).json({
          error: 'No se encontró la caja con la identificación proporcionada',
        })
        return
      }

      const eliminado = await this.cajaRepository.eliminar(idCaja)
      if (!eliminado) {
        res
          .status(404)
          .json({ error: 'No se pudo eliminar la caja seleccionada' })
        return
      }

      res.status(200).json({ mensaje: 'Caja eliminada correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Actualiza una caja.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  actualizarCaja = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const idCaja = parseInt(id, 10)
      const cajaData = req.body

      if (isNaN(idCaja)) {
        res
          .status(400)
          .json({ error: 'La identificación debe ser un número entero válido' })
        return
      }

      if (cajaData.montoApertura) {
        if (
          isNaN(cajaData.montoApertura) ||
          cajaData.montoApertura < 0 ||
          cajaData.montoApertura.toString().includes('.') ||
          cajaData.montoApertura.toString().includes(',')
        ) {
          res.status(400).json({
            error:
              'El monto de apertura debe ser un número positivo sin decimales',
          })
          return
        }
      }

      if (cajaData.montoCierre) {
        if (
          isNaN(cajaData.montoCierre) ||
          cajaData.montoCierre < 0 ||
          cajaData.montoCierre.toString().includes('.') ||
          cajaData.montoCierre.toString().includes(',')
        ) {
          res.status(400).json({
            error:
              'El monto de cierre debe ser un número positivo sin decimales',
          })
          return
        }
      }

      const existeIdCaja = await this.cajaRepository.existeIdCaja(idCaja)
      if (!existeIdCaja) {
        res.status(404).json({
          error: 'No se encontró la caja con la identificación proporcionada',
        })
        return
      }
      const existeNombreCaja = await this.cajaRepository.existeNombreCaja(
        cajaData.nombre,
      )
      if (existeNombreCaja) {
        res.status(400).json({
          error: 'Ya existe una caja con el nombre proporcionado',
        })
        return
      }

      const cajaActualizada = await this.cajaRepository.actualizar(
        idCaja,
        cajaData,
      )
      if (!cajaActualizada) {
        res.status(400).json({
          error: 'No se pudo actualizar la caja seleccionada',
        })
        return
      }

      res.status(200).json({ mensaje: 'Caja actualizada correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Verifica si un usuario tiene una caja asignada.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  verificarCajaAsignada = async (req: Request, res: Response) => {
    try {
      const { idUsuario } = req.params
      const id = parseInt(idUsuario, 10)

      if (isNaN(id)) {
        res
          .status(400)
          .json({ error: 'El ID de usuario debe ser un número entero válido' })
        return
      }

      const cajaAsignada = await this.cajaRepository.estaAsignada(id)
      if (!cajaAsignada) {
        res.status(404).json({ error: 'El usuario no tiene una caja asignada' })
        return
      }

      res.status(200).json({ mensaje: 'El usuario tiene una caja asignada' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene las cajas disponibles para asignar a un usuario.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  obtenerCajasDisponibles = async (req: Request, res: Response) => {
    try {
      const cajas = await this.cajaRepository.obtenerCajasDisponibles()

      if (!cajas || cajas.length === 0) {
        res.status(404).json({ error: 'No se encontraron cajas disponibles' })
        return
      }

      res.status(200).json(cajas)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Asigna una caja a un usuario.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  asignarCaja = async (req: Request, res: Response) => {
    try {
      const { idUsuario, idCaja, montoInicial } = req.body

      if (!idUsuario || !idCaja || !montoInicial) {
        res.status(400).json({
          error: 'Todos los campos son requeridos para asignar una caja',
        })
        return
      }

      if (isNaN(idUsuario) || isNaN(idCaja)) {
        res.status(400).json({
          error: 'Los ID de usuario y caja deben ser números enteros válidos',
        })
        return
      }

      if (
        isNaN(montoInicial) ||
        montoInicial < 0 ||
        montoInicial.toString().includes('.') ||
        montoInicial.toString().includes(',')
      ) {
        res.status(400).json({
          error: 'El monto inicial debe ser un número positivo sin decimales',
        })
        return
      }

      const cajaAsignada = await this.cajaRepository.asignarCaja(
        idCaja,
        idUsuario,
        montoInicial,
      )

      if (!cajaAsignada) {
        res.status(400).json({ error: 'No se pudo asignar la caja al usuario' })
        return
      }

      res.status(200).json({ mensaje: 'Caja asignada correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Metodo para cambiar el estado de una orden
   * @param req Request
   * @param res Response
   */
  cambiarEstado = async (req: Request, res: Response) => {
    try {
      const { idCaja, estaAsignada } = req.body

      if (!idCaja || !estaAsignada) {
        return res.status(400).json({ error: 'Faltan datos en la solicitud' })
      }

      if (!idCaja || !estaAsignada) {
        return res.status(400).json({ error: 'Faltan idCaja o estaAsignada' })
      }

      if (isNaN(idCaja)) {
        return res
          .status(400)
          .json({ error: 'idCaja debe ser un número válido' })
      }

      const cajaActualizada = await this.cajaRepository.cambiarEstado(
        +idCaja,
        estaAsignada,
      )

      if (!cajaActualizada) {
        return res
          .status(400)
          .json({ error: 'Error al cambiar el estado de la caja' })
      }

      res.status(200).json({ mensaje: 'La caja ha sido cerrada' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
  /**
   * Obtiene una caja por su IdUsuario.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  obtenerCajaPorUsuario = async (req: Request, res: Response) => {
    try {
      const { idUsuario } = req.params
      const id = parseInt(idUsuario, 10)

      if (isNaN(id)) {
        res
          .status(400)
          .json({ error: 'El ID de usuario debe ser un número entero válido' })
        return
      }

      const caja = await this.cajaRepository.obtenerCajaPorUsuario(id)
      if (!caja) {
        res
          .status(404)
          .json({ error: 'No se encontró la caja con usuario definido' })
        return
      }

      res.status(200).json(caja)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
