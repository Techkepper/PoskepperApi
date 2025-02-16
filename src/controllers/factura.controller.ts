import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { type IFacturaRepository } from '../interfaces/IFacturaRepository'
import { IOrdenRepository } from '../interfaces/IOrdenRepository'

/**
 * Controlador para manejar las operaciones relacionadas con las facturas.
 */
export class FacturaController {
  private facturaRepository: IFacturaRepository
  private ordenRepository: IOrdenRepository

  /**
   * Constructor del controlador.
   * Se encarga de inicializar la instancia del repositorio de facturas.
   */
  constructor() {
    this.facturaRepository =
      container.resolve<IFacturaRepository>('FacturaRepository')
    this.ordenRepository =
      container.resolve<IOrdenRepository>('OrdenRepository')
  }

  /**
   * Registra un nueva factura en la base de datos.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  registrarFactura = async (req: Request, res: Response) => {
    try {
      const { idOrden, fecha, total, idUsuario } = req.body

      if (!idOrden || !fecha || !total || !idUsuario) {
        res.status(400).json({
          error: 'Todos los campos son requeridos para registrar una factura',
        })
        return
      }

      const orden = await this.ordenRepository.obtenerOrden(idOrden)

      if (!orden) {
        res.status(404).json({ error: 'Orden no encontrada' })
        return
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const idCliente = orden[0].idCliente

      const facturaPendiente =
        await this.facturaRepository.obtenerFacturaPendiente(idCliente)

      if (facturaPendiente) {
        if (facturaPendiente.idFactura === undefined) {
          return res
            .status(400)
            .json({ error: 'Factura pendiente sin idFactura' })
        }

        const actualizarFactura = await this.facturaRepository.actualizar(
          facturaPendiente.idFactura,
        )

        if (!actualizarFactura) {
          return res
            .status(400)
            .json({ error: 'No se pudo actualizar la factura pendiente' })
        }
        res.status(200).json({
          mensaje: 'Factura pendiente actualizada correctamente',
          idFactura: facturaPendiente.idFactura,
        })
        return
      } else {
        const factura = await this.facturaRepository.registrar({
          idOrden,
          fecha,
          total,
          idUsuario,
        })

        if (!factura) {
          res.status(400).json({ error: 'No se pudo registrar la factura' })
          return
        }

        res.status(201).json({ mensaje: 'Factura registrada correctamente' })
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene todas las facturas registradas en la base de datos.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  obtenerFacturas = async (_: Request, res: Response) => {
    try {
      const facturas = await this.facturaRepository.obtenerFacturas()

      if (!facturas) {
        res.status(404).json({ error: 'No se encontraron facturas' })
        return
      }
      res.status(200).json(facturas)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene una factura por su identificador.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  obtenerFacturaPorId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params

      if (!id) {
        res.status(400).json({ error: 'El identificador es requerido' })
        return
      }

      const factura = await this.facturaRepository.obtenerFacturaPorId(+id)

      if (!factura) {
        res.status(404).json({ error: 'Factura no encontrada' })
        return
      }

      res.status(200).json(factura)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Registrar un Details.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  registrarDetails = async (req: Request, res: Response) => {
    try {
      if (!req.body) {
        res.status(400).json({
          error: 'Todos los campos son requeridos para registrar un detalle',
        })
        return
      }
      const detailsRegistrado = await this.facturaRepository.registrarDetails(
        req.body,
      )
      if (!detailsRegistrado) throw new Error('No se pudo registrar el detalle')

      res.status(201).json({ mensaje: 'Detalles registrado correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Registrar un Receiver.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  registrarReceiver = async (req: Request, res: Response) => {
    try {
      if (!req.body) {
        res.status(400).json({
          error: 'Todos los campos son requeridos para registrar un receiver',
        })
        return
      }
      const receiverRegistrado = await this.facturaRepository.registrarReceiver(
        req.body,
      )

      if (!receiverRegistrado)
        throw new Error('No se pudo registrar el receiver')

      res.status(201).json({ mensaje: 'Receiver registrado correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Registrar un Sender.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  registrarSender = async (req: Request, res: Response) => {
    try {
      if (!req.body) {
        res.status(400).json({
          error: 'Todos los campos son requeridos para registrar un sender',
        })
        return
      }
      const senderRegistrado = await this.facturaRepository.registrarSender(
        req.body,
      )

      if (!senderRegistrado) throw new Error('No se pudo registrar el sender')

      res.status(201).json({ mensaje: 'Sender registrado correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Actualiza una factura pendiente.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  actualizarFacturaPendiente = async (req: Request, res: Response) => {
    try {
      if (!req.params.id) {
        res.status(400).json({ error: 'El idFactura es requerido' })
        return
      }

      const facturaActualizada =
        await this.facturaRepository.actualizarFacturaPendiente(
          Number(req.params.id),
        )

      if (!facturaActualizada) {
        res.status(400).json({ error: 'No se pudo actualizar la factura' })
        return
      }

      res.status(200).json({ mensaje: 'Factura actualizada correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
