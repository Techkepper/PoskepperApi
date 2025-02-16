import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { AuthController } from '../../controllers/auth.controller'
import { IAuthRepository } from '../../interfaces/IAuthRepository'

describe('AuthController - verificarToken', () => {
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
   * Prueba: debería devolver un error 400 si no se proporciona el correo electrónico o el token.
   */
  it('debería devolver un error 400 si no se proporciona el correo electrónico o el token', async () => {
    const req = {
      body: {},
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await authController.verificarToken(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Correo y token son requeridos',
    })
  })

  /**
   * Prueba: debería devolver un error 401 si el token de recuperación es incorrecto o expirado.
   */
  it('debería devolver un error 401 si el token de recuperación es incorrecto o expirado', async () => {
    const req = {
      body: {
        correo: 'correo@ejemplo.com',
        token: '1234',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(authRepository.verificarTokenRecuperacion as jest.Mock).mockResolvedValue(
      false,
    )

    await authController.verificarToken(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Código incorrecto o expirado',
    })
  })

  /**
   * Prueba: debería devolver un estado 200 indicando que el código es válido.
   */
  it('debería devolver un estado 200 indicando que el código es válido', async () => {
    const req = {
      body: {
        correo: 'correo@ejemplo.com',
        token: '1234',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(authRepository.verificarTokenRecuperacion as jest.Mock).mockResolvedValue(
      true,
    )

    await authController.verificarToken(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Código válido',
    })
  })

  /**
   * Prueba: debería devolver un estado 500 si ocurre un error al verificar el token.
   */
  it('debería devolver un estado 500 si ocurre un error al verificar el token', async () => {
    const req = {
      body: {
        correo: 'correo@ejemplo.com',
        token: '1234',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(authRepository.verificarTokenRecuperacion as jest.Mock).mockRejectedValue(
      new Error('Error al verificar el token'),
    )

    await authController.verificarToken(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })

  /**
   * Prueba: debería devolver un estado 500 si ocurre un error interno del servidor.
   */
  it('debería devolver un estado 500 si ocurre un error interno del servidor', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const req = {
      body: {
        correo: 'correo@ejemplo.com',
        token: '1234',
      },
    } as unknown as Request

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(authRepository.verificarTokenRecuperacion as jest.Mock).mockRejectedValue(
      new Error('Error interno del servidor'),
    )
  })
})
