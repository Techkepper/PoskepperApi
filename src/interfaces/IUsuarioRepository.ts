import { type IUsuario } from './IUsuario'

export interface IUsuarioRepository {
  registrar(usuario: IUsuario): Promise<IUsuario | null>
  obtenerTodos(): Promise<IUsuario[] | null>
  obtenerPorId(id: number): Promise<IUsuario | null>
  actualizar(id: number, usuario: Partial<IUsuario>): Promise<IUsuario | null>
  eliminar(id: number): Promise<boolean>
  existeNombreUsuario(nombreUsuario: string): Promise<boolean>
  existeCorreo(correo: string): Promise<boolean>
  existeIdUsuario(id: number): Promise<boolean>
  obtenerRoles(): Promise<{ idRol: number; nombre: string }[] | null>
  obtenerComisionesMeseros(
    fechaInicio: string,
    fechaFin: string,
  ): Promise<IUsuario[] | null>
  obtenerReporteComisionesMesero(
    idUsuario: number,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<unknown[] | null>
  obtenerMeserosConOrdenes(): Promise<IUsuario[] | null>
}
