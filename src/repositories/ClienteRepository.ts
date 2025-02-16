import { injectable } from 'tsyringe'
import { type ICliente } from '../interfaces/ICliente'
import { type IClienteRepository } from '../interfaces/IClienteRepository'
import prisma from '../libs/prisma'

/**
 * Repositorio de clientes que implementa la interfaz IClienteRepository.
 * Utiliza Prisma para interactuar con la base de datos.
 */
@injectable()
export class ClienteRepository implements IClienteRepository {
  /**
   * Registra un nuevo cliente en la base de datos.
   * @param cliente - Datos del cliente a registrar.
   * @returns El cliente registrado o null si hubo un error.
   */
  async registrar(cliente: ICliente): Promise<ICliente | null> {
    try {
      const result = await prisma.$queryRaw<ICliente>`
        EXEC sp_RegistrarCliente
           @cedula = ${cliente.cedula},
           @nombre = ${cliente.nombre},
           @apellidos = ${cliente.apellidos},
           @correoElectronico = ${cliente.correoElectronico},
           @telefono = ${cliente.telefono},
           @direccion = ${cliente.direccion},
           @comentario = ${cliente.comentario},
           @estado = ${cliente.estado}`
      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Verifica si un cliente ya existe en la base de datos.
   * @param cedula - Cédula del cliente a verificar.
   * @returns True si la cédula ya existe, false si no.
   */
  async existeCedulaCliente(cedula: string): Promise<boolean> {
    try {
      const result = await prisma.$queryRaw<{ existeCliente: number }[]>`
        EXEC sp_ExisteCedulaCliente @cedula = ${cedula}`
      return result[0].existeCliente === 1
    } catch (error) {
      return false
    }
  }

  /**
   * Verifica si un correo electrónico ya existe en la base de datos.
   * @param correo - Correo electrónico a verificar.
   * @returns True si el correo ya existe, false si no.
   */
  async existeCorreo(correo: string): Promise<boolean> {
    try {
      const result = await prisma.$queryRaw<{ existeCorreo: number }[]>`
        EXEC sp_ExisteCorreoCliente @correo = ${correo}`
      return result[0].existeCorreo === 1
    } catch (error) {
      return false
    }
  }

  /**
   * Obtiene todos los clientes de la base de datos con paginación.
   * @returns Una lista de clientes o null si hubo un error.
   */
  async obtenerTodos(): Promise<ICliente[] | null> {
    try {
      return await prisma.$queryRaw<ICliente[]>`
        EXEC sp_ObtenerClientes`
    } catch (error) {
      return null
    }
  }

  /**
   * Obtiene un cliente por su ID.
   * @param id - ID del usuario a obtener.
   * @returns El cliente encontrado o null si no se encontró o hubo un error.
   */
  async obtenerPorId(id: number): Promise<ICliente | null> {
    try {
      const result = await prisma.$queryRaw<ICliente>`
        EXEC sp_ObtenerClientePorId @idCliente = ${id}`
      return result
    } catch (error) {
      return null
    }
  }

  /**
   * Elimina un cliente de la base de datos.
   * @param id - ID del cliente a eliminar.
   * @returns True si el cliente fue eliminado, false en caso contrario.
   */
  async eliminar(id: number): Promise<boolean> {
    try {
      await prisma.$queryRaw`EXEC sp_EliminarCliente @idCliente = ${id}`
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Verifica si un ID de cliente ya existe en la base de datos.
   * @param id - ID de cliente a verificar.
   * @returns True si el ID de cliente existe, false en caso contrario.
   */
  async existeIdCliente(id: number): Promise<boolean> {
    try {
      const result = await prisma.$queryRaw<{ existeCliente: number }[]>`
        EXEC sp_ExisteIdCliente @idCliente = ${id}`
      return result[0].existeCliente === 1
    } catch (error) {
      return false
    }
  }

  /**
   * Actualiza un cliente en la base de datos.
   * @param id - ID del cliente a actualizar.
   * @param cliente - Datos del cliente a actualizar.
   * @returns El cliente actualizado o null si hubo un error.
   */

  async actualizar(
    id: number,
    cliente: Partial<ICliente>,
  ): Promise<ICliente | null> {
    try {
      const result = await prisma.$queryRaw<ICliente>`
        EXEC sp_ActualizarCliente
          @idCliente = ${id},
          @cedula = ${cliente.cedula || null},
          @nombre = ${cliente.nombre || null},
          @apellidos = ${cliente.apellidos || null},
          @correoElectronico = ${cliente.correoElectronico || null},
          @telefono = ${cliente.telefono || null},
          @direccion = ${cliente.direccion || null},
          @comentario = ${cliente.comentario || null},
          @estado = ${cliente.estado || null}`
      return result
    } catch (error) {
      return null
    }
  }
}
