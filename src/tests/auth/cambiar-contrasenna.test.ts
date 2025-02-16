import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { AuthController } from '../../controllers/auth.controller'
import { IAuthRepository } from '../../interfaces/IAuthRepository'

describe('AuthController - cambiarContrasenna', () => {
  let authController: AuthController
  let authRepository: IAuthRepository

  /**
   * Configuración inicial antes de cada prueba.
   * Se encarga de inicializar el repositorio de autenticación simulado (mock)
   * y resolver la instancia del controlador con dicho repositorio.
   */
  beforeEach(() => {
    authRepository = {
      iniciarSesion: jest.fn(),
      obtenerUsuarioPorNombreUsuario: jest.fn(),
      cambiarContrasenna: jest.fn(),
      existeCorreo: jest.fn(),
      generarTokenRecuperacion: jest.fn(),
      verificarTokenRecuperacion: jest.fn(),
      eliminarMiCuenta: jest.fn(),
      verificarContrasenna: jest.fn(),
      actualizarContrasenna: jest.fn(),
    }

    // Resuelve el controlador con el repositorio simulado (mock).
    container.clearInstances()
    container.registerInstance<IAuthRepository>(
      'AuthRepository',
      authRepository,
    )
    authController = container.resolve(AuthController)
  })

  /**
   * Prueba: debería devolver un estado 400 si el correo o la nueva contraseña no se proporcionan.
   */
  it('debería devolver un estado 400 si el correo o la nueva contraseña no se proporcionan', async () => {
    const req = {
      body: {},
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await authController.cambiarContrasenna(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Correo y nueva contraseña son requeridos',
    })
  })

  /**
   * Prueba: debería devolver un estado 500 si ocurre un error al cambiar la contraseña.
   */
  it('debería devolver un estado 500 si ocurre un error al cambiar la contraseña', async () => {
    const req = {
      body: {
        correo: 'correo@ejemplo.com',
        nuevaContrasenna: 'nuevaContrasenna',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(authRepository.cambiarContrasenna as jest.Mock).mockRejectedValue(
      new Error('Error al cambiar la contraseña'),
    )

    await authController.cambiarContrasenna(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })

  /**
   * Prueba: debería devolver un estado 200 si la contraseña se cambia correctamente.
   */
  it('debería devolver un estado 200 si la contraseña se cambia correctamente', async () => {
    const req = {
      body: {
        correo: 'correo@ejemplo.com',
        nuevaContrasenna: 'nuevaContrasenna',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await authController.cambiarContrasenna(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Contraseña cambiada exitosamente',
    })
  })

  /**
   * Prueba: debería devolver un estado 500 si ocurre un error interno del servidor.
   */
  it('debería devolver un estado 500 si ocurre un error interno del servidor', async () => {
    const req = {
      body: {
        correo: 'correo@ejemplo.com',
        nuevaContrasenna: 'nuevaContrasenna',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(authRepository.cambiarContrasenna as jest.Mock).mockRejectedValue(
      new Error('Error interno del servidor'),
    )

    await authController.cambiarContrasenna(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
