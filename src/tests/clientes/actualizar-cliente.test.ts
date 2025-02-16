import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ClienteController } from '../../controllers/clientes.controller'
import { IClienteRepository } from '../../interfaces/IClienteRepository'

describe('ClienteController - actualizarCliente', () => {
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

    await clienteController.actualizarCliente(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'La identificación debe ser un número entero válido',
    })
  })

  /**
   * Prueba: debería devolver un error 400 si la cédula ya está registrada.
   */
  it('debería devolver 400 si la cédula ya está registrada', async () => {
    const req = {
      params: {
        id: '1',
      },
      body: {
        cedula: '1234567890',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(clienteRepository.existeIdCliente as jest.Mock).mockResolvedValue(true)
    ;(clienteRepository.existeCedulaCliente as jest.Mock).mockResolvedValue(
      true,
    )

    await clienteController.actualizarCliente(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'La cedula del cliente ya está en uso',
    })
  })

  /**
   * Prueba: debería devolver un error 400 si el correo electrónico ya está registrado.
   */
  it('debería devolver 400 si el correo electrónico ya está registrado', async () => {
    const req = {
      params: {
        id: '1',
      },
      body: {
        correoElectronico: 'correoexistente@example.com',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(clienteRepository.existeIdCliente as jest.Mock).mockResolvedValue(true)
    ;(clienteRepository.existeCorreo as jest.Mock).mockResolvedValue(true)

    await clienteController.actualizarCliente(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'El correo electrónico ya está en uso',
    })
  })

  /**
   * Prueba: debería devolver un estado 200 indicando que el cliente fue actualizado correctamente.
   */
  it('debería devolver 200 indicando que el cliente fue actualizado correctamente', async () => {
    const req = {
      params: {
        id: '1',
      },
      body: {
        cedula: '1234567890',
        nombre: 'Cliente 1',
        correoElectronico: 'correo@example.com',
        telefono: '1234567890',
        direccion: 'Dirección de cliente 1',
        comentario: 'Comentario de cliente 1',
        estado: 'activo',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(clienteRepository.existeIdCliente as jest.Mock).mockResolvedValue(true)
    ;(clienteRepository.existeCedulaCliente as jest.Mock).mockResolvedValue(
      false,
    )
    ;(clienteRepository.existeCorreo as jest.Mock).mockResolvedValue(false)
    ;(clienteRepository.actualizar as jest.Mock).mockResolvedValue(true)

    await clienteController.actualizarCliente(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Cliente actualizado correctamente',
    })
  })
})
