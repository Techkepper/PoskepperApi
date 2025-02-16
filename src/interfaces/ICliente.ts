export interface ICliente {
  idCliente?: number
  fechaCreacion?: Date
  cedula: number
  nombre: string
  apellidos: string
  correoElectronico: string
  telefono: number
  direccion: string
  comentario: string
  estado: boolean
}
