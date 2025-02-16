import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UsuarioController } from '../../controllers/usuarios.controller'
import { IUsuarioRepository } from '../../interfaces/IUsuarioRepository'

describe('UsuarioController - obtenerRoles', () => {
  let usuarioController: UsuarioController
  let usuarioRepository: IUsuarioRepository

  /**
   * Configuración inicial antes de cada prueba.
   * Se encarga de inicializar el repositorio de usuarios simulado (mock)
   * y resolver la instancia del controlador con dicho repositorio.
   */
  beforeEach(() => {
    usuarioRepository = {
      obtenerTodos: jest.fn(),
      existeNombreUsuario: jest.fn(),
      existeCorreo: jest.fn(),
      obtenerPorId: jest.fn(),
      registrar: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn(),
      existeIdUsuario: jest.fn(),
      obtenerRoles: jest.fn(),
      obtenerComisionesMeseros: jest.fn(),
      obtenerReporteComisionesMesero: jest.fn(),
      obtenerMeserosConOrdenes: jest.fn(),
    }

    // Resolver el controlador con el repositorio mockeado
    container.clearInstances()
    container.registerInstance<IUsuarioRepository>(
      'UsuarioRepository',
      usuarioRepository,
    )
    usuarioController = container.resolve(UsuarioController)
  })

  /**
   * Prueba: debería devolver un estado 200 con una lista de roles de usuario.
   */
  it('debería devolver 200 con una lista de roles de usuario', async () => {
    const roles = [
      { idRol: 1, descripcion: 'Administrador' },
      { idRol: 2, descripcion: 'Cocinero' },
      { idRol: 3, descripcion: 'Mesero' },
      { idRol: 4, descripcion: 'Cajero' },
    ]

    const req = {} as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(usuarioRepository.obtenerRoles as jest.Mock).mockResolvedValue(roles)

    await usuarioController.obtenerRoles(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(roles)
  })

  /**
   * Prueba: debería devolver un estado 404 si no se encuentran roles de usuario.
   */
  it('debería devolver 404 si no se encuentran roles de usuario', async () => {
    const req = {} as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(usuarioRepository.obtenerRoles as jest.Mock).mockResolvedValue([])

    await usuarioController.obtenerRoles(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'No se encontraron roles de usuario',
    })
  })

  /**
   * Prueba: debería devolver un estado 500 si hay un problema con el servidor.
   */
  it('debería devolver 500 en caso de error del servidor', async () => {
    const req = {} as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(usuarioRepository.obtenerRoles as jest.Mock).mockRejectedValue(
      new Error('Error del servidor'),
    )

    await usuarioController.obtenerRoles(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
