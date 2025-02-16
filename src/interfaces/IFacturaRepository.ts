import { IDetails, IReceiver, ISender, type IFactura } from './IFactura'

export interface IFacturaRepository {
  registrar(factura: IFactura): Promise<IFactura | null>
  obtenerFacturas(): Promise<IFactura[]>
  obtenerFacturaPorId(id: number): Promise<IFactura | null>
  validarFacturaPendiente(idCliente: number): Promise<boolean>
  obtenerFacturaPendiente(idCliente: number): Promise<IFactura | null>
  actualizar(idFactura: number): Promise<IFactura | null>
  registrarReceiver(receiver: IReceiver): Promise<IReceiver | null>
  registrarSender(sender: ISender): Promise<ISender | null>
  registrarDetails(details: IDetails): Promise<IDetails | null>
  actualizarFacturaPendiente(idFactura: number): Promise<IFactura | null>
}
