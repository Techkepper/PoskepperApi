import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { AuthController } from '../../controllers/auth.controller'
import { IAuthRepository } from '../../interfaces/IAuthRepository'

describe('AuthController - solicitarTokenRecuperacion', () => {
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
   * Prueba: debería devolver un error 400 si no se proporciona el correo electrónico.
   */
  it('debería devolver un error 400 si no se proporciona el correo electrónico', async () => {
    const req = {
      body: {},
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await authController.solicitarTokenRecuperacion(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'El correo es requerido para recuperar la contraseña',
    })
  })

  /**
   * Prueba: debería devolver un error 404 si el correo electrónico no está registrado.
   */
  it('debería devolver un error 404 si el correo electrónico no está registrado', async () => {
    const req = {
      body: {
        correo: 'correo@ejemplo.com',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(authRepository.existeCorreo as jest.Mock).mockResolvedValue(false)

    await authController.solicitarTokenRecuperacion(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Correo no encontrado',
    })
  })

  /**
   * Prueba: debería devolver un estado 200 indicando que se envió el código de recuperación al correo.
   */
  it('debería devolver un estado 200 indicando que se envió el código de recuperación al correo', async () => {
    const req = {
      body: {
        correo: 'correo@ejemplo.com',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(authRepository.existeCorreo as jest.Mock).mockResolvedValue(true)
    ;(authRepository.generarTokenRecuperacion as jest.Mock).mockResolvedValue({
      token: '1234',
      tokenExpiracion: new Date(),
    })

    await authController.solicitarTokenRecuperacion(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Código de 4 dígitos enviado al correo',
    })
  })

  /**
   * Prueba: debería devolver un estado 500 si hay un error interno del servidor al verificar el correo.
   */
  it('debería devolver un estado 500 si hay un error interno del servidor al verificar el correo', async () => {
    const req = {
      body: {
        correo: 'correo@ejemplo.com',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(authRepository.existeCorreo as jest.Mock).mockRejectedValue(
      new Error('Error interno del servidor'),
    )

    await authController.solicitarTokenRecuperacion(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })

  /**
   * Prueba: debería devolver un estado 500 si hay un error interno del servidor al generar el token de recuperación.
   */
  it('debería devolver un estado 500 si hay un error interno del servidor al generar el token de recuperación', async () => {
    const req = {
      body: {
        correo: 'correo@ejemplo.com',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(authRepository.existeCorreo as jest.Mock).mockResolvedValue(true)
    ;(authRepository.generarTokenRecuperacion as jest.Mock).mockRejectedValue(
      new Error('Error interno del servidor'),
    )

    await authController.solicitarTokenRecuperacion(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
