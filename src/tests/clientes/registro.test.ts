import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ClienteController } from '../../controllers/clientes.controller'
import { IClienteRepository } from '../../interfaces/IClienteRepository'

describe('ClienteController - registrarCliente', () => {
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
   * Prueba: debería devolver un error 400 si faltan campos requeridos.
   */
  it('debería devolver 400 si faltan campos requeridos', async () => {
    const req = {
      body: {},
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await clienteController.registrarCliente(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Todos los campos son requeridos para registrar un cliente',
    })
  })
})
