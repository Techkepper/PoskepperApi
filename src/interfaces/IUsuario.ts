export interface IUsuario {
  sesionIniciada?: number
  idUsuario?: number
  nombreUsuario: string
  contrasenna: string
  nombre: string
  apellidos: string
  idRol: number
  comentarios?: string
  correo: string
  comision?: number
}
