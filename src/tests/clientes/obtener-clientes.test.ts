import 'reflect-metadata'

import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ClienteController } from '../../controllers/clientes.controller'
import { IClienteRepository } from '../../interfaces/IClienteRepository'
import { ICliente } from '../../interfaces/ICliente'

describe('ClienteController - obtenerListadoClientes', () => {
  let clienteController: ClienteController
  let clienteRepository: jest.Mocked<IClienteRepository>

  /**
   * Configuración inicial antes de cada prueba.
   * Se encarga de inicializar el repositorio de clientes simulado (mock)
   * y resolver la instancia del controlador con dicho repositorio.
   */
  beforeEach(() => {
    clienteRepository = {
      registrar: jest.fn(),
      obtenerTodos: jest.fn(),
      obtenerPorId: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn(),
      existeIdCliente: jest.fn(),
      existeCedulaCliente: jest.fn(),
      existeCorreo: jest.fn(),
    } as jest.Mocked<IClienteRepository>

    // Resolver el controlador con el repositorio mockeado
    container.clearInstances()
    container.registerInstance<IClienteRepository>(
      'ClienteRepository',
      clienteRepository,
    )
    clienteController = container.resolve(ClienteController)
  })

  /*
   * Prueba: debería devolver un 200 si se obtiene un listado de clientes exitosamente.
   */
  it('debería obtener un listado de clientes exitosamente', async () => {
    const clientesMock: ICliente[] = [
      {
        idCliente: 1,
        nombre: 'Cliente 1',
        cedula: 123456789,
        correoElectronico: 'cliente1@example.com',
        apellidos: 'Apellidos 1',
        telefono: 12345678,
        direccion: 'Dirección 1',
        comentario: 'Comentario 1',
        estado: true,
        fechaCreacion: new Date(),
      },
      {
        idCliente: 2,
        nombre: 'Cliente 2',
        cedula: 987654321,
        correoElectronico: 'cliente2@example.com',
        apellidos: 'Apellidos 2',
        telefono: 87654321,
        direccion: 'Dirección 2',
        comentario: 'Comentario 2',
        estado: true,
        fechaCreacion: new Date(),
      },
    ]

    const req = {} as unknown as Request
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    clienteRepository.obtenerTodos.mockResolvedValue(clientesMock)

    await clienteController.obtenerListadoClientes(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(clientesMock)
  })

  /*
   * Prueba: debería devolver un error 404 si no se encontraron clientes.
   */
  it('debería devolver un error 404 si no se encontraron clientes', async () => {
    const clientesMock: ICliente[] = []

    const req = {} as unknown as Request
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    clienteRepository.obtenerTodos.mockResolvedValue(clientesMock)

    await clienteController.obtenerListadoClientes(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'No se encontraron clientes',
    })
  })

  /*
   * Prueba: debería manejar un error interno del servidor correctamente.
   */
  it('debería manejar un error interno del servidor correctamente', async () => {
    const error = new Error('Error de base de datos')

    const req = {} as unknown as Request
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    clienteRepository.obtenerTodos.mockRejectedValue(error)

    await clienteController.obtenerListadoClientes(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
