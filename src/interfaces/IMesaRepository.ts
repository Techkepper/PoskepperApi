import { type IMesa } from './IMesa'

export interface IMesaRepository {
  registrar(mesa: IMesa): Promise<IMesa | null>
  existeNombreMesa(nombre: string): Promise<boolean>
  obtenerMesas(): Promise<IMesa[] | null>
  existeIdMesa(idMesa: number): Promise<boolean>
  eliminar(idMesa: number): Promise<boolean>
  actualizar(id: number, mesa: Partial<IMesa>): Promise<IMesa | null>
  obtenerMesaOcupada(idMesa: number): Promise<IMesa | null>
}
