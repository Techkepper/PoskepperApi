import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UsuarioController } from '../../controllers/usuarios.controller'
import { IUsuarioRepository } from '../../interfaces/IUsuarioRepository'

describe('UsuarioController - eliminarUsuario', () => {
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

    await usuarioController.eliminarUsuario(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'El ID de usuario debe ser un número entero válido',
    })
  })

  /**
   * Prueba: debería devolver un error 404 si no se encuentra el usuario.
   */
  it('debería devolver 404 si no se encuentra el usuario', async () => {
    const req = {
      params: {
        id: '999',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(usuarioRepository.existeIdUsuario as jest.Mock).mockResolvedValue(false)

    await usuarioController.eliminarUsuario(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'No se encontró el usuario con el ID proporcionado',
    })
  })

  /**
   * Prueba: debería devolver un estado 200 indicando que el usuario fue eliminado correctamente.
   */
  it('debería devolver 200 indicando que el usuario fue eliminado correctamente', async () => {
    const req = {
      params: {
        id: '1',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(usuarioRepository.existeIdUsuario as jest.Mock).mockResolvedValue(true)
    ;(usuarioRepository.eliminar as jest.Mock).mockResolvedValue(true)

    await usuarioController.eliminarUsuario(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Usuario eliminado correctamente',
    })
  })

  /**
   * Prueba: debería devolver un estado 500 si hay un problema con el servidor.
   */
  it('debería devolver 500 en caso de error del servidor', async () => {
    const req = {
      params: {
        id: '1',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(usuarioRepository.existeIdUsuario as jest.Mock).mockResolvedValue(true)
    ;(usuarioRepository.eliminar as jest.Mock).mockRejectedValue(
      new Error('Error del servidor'),
    )

    await usuarioController.eliminarUsuario(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
