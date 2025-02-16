import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ClienteController } from '../../controllers/clientes.controller'
import { IClienteRepository } from '../../interfaces/IClienteRepository'

describe('ClienteController - eliminarCliente', () => {
  let clienteController: ClienteController
  let clienteRepository: IClienteRepository

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
    }

    // Resolver el controlador con el repositorio mockeado
    container.clearInstances()
    container.registerInstance<IClienteRepository>(
      'ClienteRepository',
      clienteRepository,
    )
    clienteController = container.resolve(ClienteController)
  })

  /**
   * Prueba: debería devolver un error 400 si la identificación no es un número.
   */
  it('debería devolver 400 si la identificación no es un número', async () => {
    const req = {
      params: {
        id: 'notanumber',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await clienteController.eliminarCliente(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'La identificación debe ser un número entero válido',
    })
  })

  /**
   * Prueba: debería devolver un error 404 si no se encuentra el cliente.
   */
  it('debería devolver 404 si no se encuentra el cliente', async () => {
    const req = {
      params: {
        id: 1,
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(clienteRepository.existeIdCliente as jest.Mock).mockResolvedValue(false)

    await clienteController.eliminarCliente(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'No se encontró el cliente con el ID proporcionado',
    })
  })

  /**
   * Prueba: debería devolver un estado 200 indicando que el cliente fue eliminado correctamente.
   */
  it('debería devolver 200 indicando que el cliente fue eliminado correctamente', async () => {
    const req = {
      params: {
        id: 1,
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(clienteRepository.existeIdCliente as jest.Mock).mockResolvedValue(true)
    ;(clienteRepository.eliminar as jest.Mock).mockResolvedValue(true)

    await clienteController.eliminarCliente(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Cliente eliminado correctamente',
    })
  })

  /**
   * Prueba: debería devolver un error 500 si hay un problema con el servidor.
   */
  it('debería devolver 500 si hay un problema con el servidor', async () => {
    const req = {
      params: {
        id: 1,
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(clienteRepository.existeIdCliente as jest.Mock).mockRejectedValue(true)
    ;(clienteRepository.eliminar as jest.Mock).mockRejectedValue(
      new Error('Error del servidor'),
    )

    await clienteController.eliminarCliente(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
