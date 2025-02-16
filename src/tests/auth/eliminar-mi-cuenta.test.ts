import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { AuthController } from '../../controllers/auth.controller'
import { IAuthRepository } from '../../interfaces/IAuthRepository'

describe('AuthController - eliminarMiCuenta', () => {
  let authController: AuthController
  let authRepository: jest.Mocked<IAuthRepository>

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
    } as jest.Mocked<IAuthRepository>

    // Resuelve el controlador con el repositorio simulado (mock).
    container.clearInstances()
    container.registerInstance<IAuthRepository>(
      'AuthRepository',
      authRepository,
    )
    authController = container.resolve(AuthController)
  })

  /**
   * Prueba: debería devolver un estado 200 y un mensaje de éxito si la cuenta se elimina correctamente.
   */
  it('debería eliminar la cuenta correctamente cuando se proporciona la contraseña correcta', async () => {
    const req = {
      body: {
        id: 1,
        contrasenna: 'password123',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    authRepository.verificarContrasenna.mockResolvedValue(true)
    authRepository.eliminarMiCuenta.mockResolvedValue(true)

    await authController.eliminarMiCuenta(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Cuenta eliminada exitosamente',
    })
  })

  /**
   * Prueba: debería devolver un error 400 si la contraseña no se proporciona.
   */
  it('debería devolver un error 400 si la contraseña no se proporciona', async () => {
    const req = {
      body: {
        id: 1,
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await authController.eliminarMiCuenta(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'La contraseña es requerida para eliminar la cuenta',
    })
  })

  /**
   * Prueba: debería devolver un error 401 si la contraseña proporcionada es incorrecta.
   */
  it('debería devolver un error 401 si la contraseña proporcionada es incorrecta', async () => {
    const req = {
      body: {
        id: 1,
        contrasenna: 'wrongPassword',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    authRepository.verificarContrasenna.mockResolvedValue(false)

    await authController.eliminarMiCuenta(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      error: 'La contraseña actual es incorrecta',
    })
  })

  /**
   * Prueba: debería devolver un error 500 si ocurre un error interno del servidor.
   */
  it('debería manejar un error interno del servidor correctamente', async () => {
    const req = {
      body: {
        id: 1,
        contrasenna: 'password123',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    authRepository.verificarContrasenna.mockRejectedValue(
      new Error('Error interno del servidor'),
    )

    await authController.eliminarMiCuenta(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
