import { IUsuario } from './IUsuario'

export interface IAuthRepository {
  iniciarSesion(
    nombreUsuario: string,
    contrasenna: string,
  ): Promise<IUsuario | null>
  obtenerUsuarioPorNombreUsuario(
    nombreUsuario: string,
  ): Promise<IUsuario | null>
  cambiarContrasenna(correo: string, nuevaContrasenna: string): Promise<void>
  existeCorreo(correo: string): Promise<boolean>
  generarTokenRecuperacion(
    correo: string,
  ): Promise<{ token: string; tokenExpiracion: Date }>
  verificarTokenRecuperacion(correo: string, token: string): Promise<boolean>
  eliminarMiCuenta(id: number, contrasenna: string): Promise<boolean>
  verificarContrasenna(id: number, contrasenna: string): Promise<boolean>
  actualizarContrasenna(id: number, nuevaContrasenna: string): Promise<void>
}
