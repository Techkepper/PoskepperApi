import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IOrdenRepository } from '../interfaces/IOrdenRepository'
import { Server } from 'socket.io'
import { IFacturaRepository } from '../interfaces/IFacturaRepository'
import { IMesaRepository } from '../interfaces/IMesaRepository'

/**
 * Controlador para manejar las ordenes de la aplicacion
 */
export class OrdenController {
  private ordenRepository: IOrdenRepository
  private facturaRepository: IFacturaRepository
  private mesaRepository: IMesaRepository
  private io: Server

  /**
   * Constructor del controlador
   * Se encarga de inicializar el repositorio de ordenes y el servidor de Socket.IO
   */
  constructor(io: Server) {
    this.ordenRepository =
      container.resolve<IOrdenRepository>('OrdenRepository')
    this.facturaRepository =
      container.resolve<IFacturaRepository>('FacturaRepository')
    this.mesaRepository = container.resolve<IMesaRepository>('MesaRepository')
    this.io = io
  }

  /**
   * Metodo para registrar una orden en la base de datos
   * @param req Request
   * @param res Response
   */

  registrarOrden = async (req: Request, res: Response) => {
    try {
      const orden = req.body

      const facturaPendiente =
        await this.facturaRepository.obtenerFacturaPendiente(orden.idCliente)

      const mesaOcupada = await this.mesaRepository.obtenerMesaOcupada(
        orden.idMesa,
      )

      if (facturaPendiente) {
        const ordenExistente = await this.ordenRepository.obtenerOrden(
          facturaPendiente.idOrden,
        )

        if (!ordenExistente) {
          return res.status(400).json({
            error:
              'No se encontró una orden para la factura pendiente. Verifique los datos e intente nuevamente.',
          })
        }

        if (ordenExistente) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          if (ordenExistente[0].idMesa !== orden.idMesa) {
            return res.status(400).json({
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-expect-error
              error: `La mesa no coincide con el usuario. La mesa correcta es: ${ordenExistente[0].nombreMesa}`,
            })
          }

          const detalleAgregado = await this.ordenRepository.agregarDetalle(
            facturaPendiente.idOrden,
            orden.productos,
          )

          if (!detalleAgregado) {
            return res
              .status(500)
              .json({ error: 'Error al agregar el detalle a la orden' })
          }

          const detallesActualizados =
            await this.ordenRepository.obtenerDetalle(facturaPendiente.idOrden)

          if (detallesActualizados) {
            this.io.emit('nuevaOrden', detallesActualizados)
            this.io.emit('ordenActualizada', {
              idOrden: facturaPendiente.idOrden,
              detalles: detallesActualizados,
            })
          }

          res.status(200).json({
            mensaje: 'Detalle añadido a la orden existente correctamente',
            idOrden: facturaPendiente.idOrden,
          })
        } else {
          return res.status(400).json({
            error: 'La orden asociada a la factura pendiente no existe',
          })
        }
      } else {
        if (mesaOcupada) {
          return res.status(400).json({
            error:
              'La mesa ya está ocupada por otro cliente. Por favor escoja otra mesa o la correspondiente',
          })
        }

        const ordenCreated = await this.ordenRepository.registrar(orden)

        if (!ordenCreated) {
          return res.status(400).json({ error: 'Error al registrar la orden' })
        }

        const nuevaOrden = await this.ordenRepository.obtenerOrden(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          ordenCreated[0].idOrden,
        )

        this.io.emit('nuevaOrden', nuevaOrden)

        res.status(201).json({
          mensaje: 'Orden registrada correctamente',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          idOrden: ordenCreated[0].idOrden,
        })
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Metodo para obtener todas las ordenes registradas en la base de datos
   * @param req Request
   * @param res Response
   */
  obtenerOrdenes = async (req: Request, res: Response) => {
    try {
      const ordenes = await this.ordenRepository.obtenerOrdenes()

      if (!ordenes)
        res.status(404).json({ error: 'No hay ordenes registradas' })
      else res.status(200).json(ordenes)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Metodo para cambiar el estado de una orden
   * @param req Request
   * @param res Response
   */
  cambiarEstadoOrden = async (req: Request, res: Response) => {
    try {
      const { idOrden } = req.params
      const { estado } = req.body
      const ordenUpdated = await this.ordenRepository.cambiarEstado(
        +idOrden,
        estado,
      )

      if (!ordenUpdated)
        res
          .status(400)
          .json({ error: 'Error al cambiar el estado de la orden' })
      else res.status(200).json({ mensaje: 'Estado de la orden actualizado' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
