import { type ICaja } from './ICaja'

export interface ICajaRepository {
  registrar(caja: ICaja): Promise<ICaja | null>
  existeNombreCaja(nombre: string): Promise<boolean>
  obtenerCajas(): Promise<ICaja[] | null>
  existeIdCaja(idCaja: number): Promise<boolean>
  eliminar(idCaja: number): Promise<boolean>
  actualizar(id: number, caja: Partial<ICaja>): Promise<ICaja | null>
  estaAsignada(idCaja: number): Promise<boolean>
  obtenerCajasDisponibles(): Promise<ICaja[] | null>
  asignarCaja(
    idCaja: number,
    idUsuario: number,
    montoInicial: number,
  ): Promise<boolean>
  cambiarEstado(idCaja: number, estaAsignada: number): Promise<ICaja | null>
  obtenerCajaPorUsuario(idUsuario: number): Promise<ICaja[] | null>
}
