import { injectable } from 'tsyringe'
import {
  IDetails,
  IReceiver,
  ISender,
  type IFactura,
} from '../interfaces/IFactura'
import { type IFacturaRepository } from '../interfaces/IFacturaRepository'
import prisma from '../libs/prisma'

/**
 * Repositorio de facturas que implementa la interfaz IFacturaRepository.
 * Utiliza Prisma para interactuar con la base de datos.
 */
@injectable()
export class FacturaRepository implements IFacturaRepository {
  /**
   * Obtiene una factura por su ID.
   * @param id - ID de la factura a obtener.
   * @returns La factura encontrada o null si no existe.
   */
  async obtenerFacturaPorId(id: number): Promise<IFactura | null> {
    try {
      const result = await prisma.$queryRaw<IFactura>`
        EXEC sp_ObtenerFacturaPorId @id = ${id}`
      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Obtiene todas las facturas registradas en la base de datos.
   * @returns Un arreglo con todas las facturas registradas.
   * @throws Error si hubo un error al obtener las facturas.
   * @returns Un arreglo con todas las facturas registradas.
   */
  async obtenerFacturas(): Promise<IFactura[]> {
    try {
      const facturas = await prisma.$queryRaw<
        IFactura[]
      >`EXEC sp_ObtenerDetallesFactura`
      return facturas
    } catch (error) {
      throw new Error('Error al obtener las facturas')
    }
  }
  /**
   * Registra una nueva factura en la base de datos.
   * @param factura - Datos de la factura a registrar.
   * @returns La factura registrada o null si hubo un error.
   */
  async registrar(factura: IFactura): Promise<IFactura | null> {
    try {
      const result = await prisma.$queryRaw<IFactura>`
        EXEC sp_CrearFactura
           @idOrden = ${factura.idOrden},
           @fecha = ${factura.fecha},
           @total = ${factura.total},
           @idUsuario = ${factura.idUsuario}`
      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Valida si un cliente tiene una factura pendiente.
   * @param idCliente - ID del cliente a validar.
   * @returns La factura pendiente del cliente o null si no tiene.
   */
  async validarFacturaPendiente(idCliente: number): Promise<boolean> {
    try {
      const result = await prisma.$queryRaw<
        { existeFacturaPendiente: number }[]
      >`
        EXEC sp_ValidarFacturaPendiente @idCliente = ${idCliente}`
      return result[0]?.existeFacturaPendiente === 1
    } catch (error) {
      return false
    }
  }

  /**
   * Actualiza una factura en la base de datos.
   * @param idFactura - ID de la factura a actualizar.
   * @param factura - Datos de la factura a actualizar.
   * @returns La factura actualizada o null si hubo un error.
   */
  async actualizar(idFactura: number): Promise<IFactura | null> {
    try {
      const result = await prisma.$queryRaw<IFactura>`
        EXEC sp_ActualizarFactura
          @idFactura = ${idFactura}`
      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Obtiene la factura pendiente de un cliente.
   * @param idCliente - ID del cliente a obtener la factura pendiente.
   * @returns La factura pendiente del cliente o null si no tiene.
   */
  async obtenerFacturaPendiente(idCliente: number): Promise<IFactura | null> {
    try {
      const result = await prisma.$queryRaw<IFactura[]>`
        EXEC sp_ObtenerFacturaPendiente @idCliente = ${idCliente}`

      return result.length > 0 ? result[0] : null
    } catch (error) {
      return null
    }
  }

  async registrarReceiver(receiver: IReceiver): Promise<IReceiver | null> {
    try {
      const result = await prisma.$queryRaw<IReceiver>`
        EXEC sp_RegistrarReceiver
          @idFactura = ${receiver.idFactura},
          @name = ${receiver.name},
          @email = ${receiver.email},
          @address = ${receiver.address},
          @city = ${receiver.city},
          @zipCode = ${receiver.zipCode},
          @country = ${receiver.country},
          @phone = ${receiver.phone},
          @customInputs = ${receiver.customInputs}`

      return result
    } catch (error) {
      return null
    }
  }

  async registrarSender(sender: ISender): Promise<ISender | null> {
    try {
      const result = await prisma.$queryRaw<ISender>`
        EXEC sp_RegistrarSender
          @idFactura = ${sender.idFactura},
          @name = ${sender.name},
          @email = ${sender.email},
          @address = ${sender.address},
          @city = ${sender.city},
          @zipCode = ${sender.zipCode},
          @country = ${sender.country},
          @phone = ${sender.phone},
          @customInputs = ${sender.customInputs}`

      return result
    } catch (error) {
      return null
    }
  }

  async registrarDetails(details: IDetails): Promise<IDetails | null> {
    try {
      const result = await prisma.$queryRaw<IDetails>`
        EXEC sp_RegistrarDetails
          @idFactura = ${details.idFactura},
          @invoiceNumber = ${details.invoiceNumber},
          @invoiceDate = ${details.invoiceDate},
          @invoiceLogo = ${details.invoiceLogo},
          @dueDate = ${details.dueDate},
          @currency = ${details.currency},
          @language = ${details.language},
          @taxDetails = ${details.taxDetails},
          @discountDetails = ${details.discountDetails},
          @shippingDetails = ${details.shippingDetails},
          @paymentInformation = ${details.paymentInformation},
          @additionalNotes = ${details.additionalNotes},
          @paymentTerms = ${details.paymentTerms},
          @totalAmountInWords = ${details.totalAmountInWords},
          @pdfTemplate = ${details.pdfTemplate},
          @subTotal = ${details.subTotal},
          @totalAmount = ${details.totalAmount},
          @signature = ${details.signature},
          @updatedAt = ${details.updatedAt}`

      return result
    } catch (error) {
      return null
    }
  }

  async actualizarFacturaPendiente(
    idFactura: number,
  ): Promise<IFactura | null> {
    try {
      const result = await prisma.$queryRaw<IFactura>`
        EXEC sp_ActualizarEstadoFactura
          @idFactura = ${idFactura}`

      return result
    } catch (error) {
      return null
    }
  }
}
