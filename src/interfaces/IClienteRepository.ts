import { type ICliente } from './ICliente'

export interface IClienteRepository {
  registrar(cliente: ICliente): Promise<ICliente | null>
  existeCedulaCliente(cedula: string): Promise<boolean>
  existeCorreo(correo: string): Promise<boolean>
  obtenerTodos(): Promise<ICliente[] | null>
  obtenerPorId(id: number): Promise<ICliente | null>
  eliminar(id: number): Promise<boolean>
  existeIdCliente(id: number): Promise<boolean>
  actualizar(id: number, usuario: Partial<ICliente>): Promise<ICliente | null>
}
