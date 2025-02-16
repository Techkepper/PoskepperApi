import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IMovimientoInventarioRepository } from '../interfaces/IMovimientoInventarioRepository'
import { generateReportMovimiento } from '../../utils/generarReporteMovimientoInventario'
import {
  IDetalleMovimientoInventario,
  IMovimientoInventario,
} from '../interfaces/IMovimientoInventario'

/**
 * Controlador para manejar los movimientos de inventario de la aplicacion
 */
export class MovimientoInventarioController {
  private movimientoRepository: IMovimientoInventarioRepository
  // private mermaRepository: IMermaRepository
  /**
   * Constructor del controlador
   * Se encarga de inicializar el repositorio de movimientos de inventario y el servidor de Socket.IO
   */
  constructor() {
    this.movimientoRepository =
      container.resolve<IMovimientoInventarioRepository>(
        'MovimientoInventarioRepository',
      )
  }

  /**
   * Metodo para registrar un movimiento de inventario en la base de datos
   * @param req Request
   * @param res Response
   */

  registrarMovimiento = async (req: Request, res: Response) => {
    try {
      const { fecha, motivo, tipoMovimiento, idUsuario, movimientos } = req.body

      if (!fecha || !motivo || !tipoMovimiento || !idUsuario || !movimientos) {
        res.status(400).json({
          error:
            'Todos los campos son requeridos para registrar un movimiento de inventario',
        })
        return
      }

      if (!Array.isArray(movimientos) || movimientos.length === 0) {
        res.status(400).json({
          error: 'Movimientos debe ser un array con al menos un elemento',
        })
        return
      }

      for (const movimiento of movimientos) {
        if (
          typeof movimiento.idProducto !== 'number' ||
          typeof movimiento.cantidadMovimiento !== 'number' ||
          movimiento.cantidadMovimiento < 0 ||
          movimiento.cantidadMovimiento.toString().includes('.') ||
          movimiento.cantidadMovimiento.toString().includes(',')
        ) {
          res.status(400).json({
            error:
              'Cada movimiento debe tener un idProducto y una cantidadMovimiento válida. La cantidad debe ser un número positivo sin decimales',
          })
          return
        }
      }

      const movimientoInventario: IMovimientoInventario[] | null =
        await this.movimientoRepository.registrar({
          fecha,
          motivo,
          tipoMovimiento,
          idUsuario,
          movimientos,
        })

      if (!movimientoInventario || movimientoInventario.length === 0) {
        res.status(500).json({ error: 'No se pudo registrar el movimiento' })
        return
      }

      res.status(201).json({
        mensaje: 'Movimiento de inventario registrado correctamente',
        idMovimiento: movimientoInventario[0].idMovimiento,
      })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Metodo para obtener todos los movimientos de inventario registrados en la base de datos
   * @param req Request
   * @param res Response
   */
  obtenerMovimientos = async (req: Request, res: Response) => {
    try {
      const movimientos = await this.movimientoRepository.obtenerMovimientos()

      if (!movimientos)
        res.status(404).json({ error: 'No hay movimientos registrados' })
      else res.status(200).json(movimientos)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Metodo para obtener un movimiento de inventario por su id
   * @param req Request
   * @param res Response
   */
  obtenerMovimiento = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const idMovimiento = parseInt(id, 10)

      if (isNaN(idMovimiento)) {
        res.status(400).json({ error: 'La identificación debe ser un número' })
        return
      }

      const movimiento = await this.movimientoRepository.obtenerMovimiento(
        Number(idMovimiento),
      )

      if (!movimiento)
        res.status(404).json({ error: 'Movimiento no encontrado' })
      else res.status(200).json(movimiento)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Metodo para obtener un reporte de un movimiento de inventario por su id
   * @param req Request
   * @param res Response
   */
  obtenerReporteMovimientoPorId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const idMovimiento = parseInt(id, 10)

      if (!idMovimiento || isNaN(idMovimiento)) {
        res.status(400).json({ error: 'ID de movimiento inválido' })
        return
      }

      const movimientos =
        await this.movimientoRepository.obtenerMovimientoInventarioPorIdReporte(
          idMovimiento,
        )

      if (!movimientos) {
        res.status(404).json({ error: 'No se encontraron movimientos' })
        return
      }

      const movimiento = movimientos[0]

      let movimientosDeserializados: IDetalleMovimientoInventario[] = []

      if (movimiento.movimientos) {
        if (typeof movimiento.movimientos === 'string') {
          movimientosDeserializados = JSON.parse(movimiento.movimientos)
        } else {
          movimientosDeserializados = movimiento.movimientos
        }
      } else {
        movimientosDeserializados = []
      }

      const movimientoConDetalles: IMovimientoInventario = {
        ...movimiento,
        movimientos: movimientosDeserializados,
      }

      res.setHeader(
        'Content-disposition',
        'attachment; filename=reporte-movimientoInventario.pdf',
      )
      res.setHeader('Content-type', 'application/pdf')

      generateReportMovimiento([movimientoConDetalles], res)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
