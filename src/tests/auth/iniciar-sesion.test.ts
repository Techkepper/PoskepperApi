import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { AuthController } from '../../controllers/auth.controller'
import { IAuthRepository } from '../../interfaces/IAuthRepository'

describe('AuthController - iniciarSesion', () => {
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
   * Prueba: debería devolver un error 400 si no se proporciona nombre de usuario o contraseña.
   */
  it('debería devolver un error 400 si no se proporciona nombre de usuario o contraseña', async () => {
    const req = {
      body: {},
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await authController.iniciarSesion(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Nombre de usuario y contraseña son requeridos',
    })
  })

  /**
   * Prueba: debería devolver un error 401 si el nombre de usuario o contraseña es incorrecto.
   */
  it('debería devolver un error 401 si el nombre de usuario o contraseña es incorrecto', async () => {
    const req = {
      body: {
        nombreUsuario: 'usuario',
        contrasenna: 'contrasenna',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(authRepository.iniciarSesion as jest.Mock).mockResolvedValue({
      sesionIniciada: 0,
    })

    await authController.iniciarSesion(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Nombre de usuario o contraseña incorrectos',
    })
  })

  /**
   * Prueba: debería devolver un estado 200 y un token si las credenciales son válidas.
   */
  it('debería devolver un estado 200 y un token si las credenciales son válidas', async () => {
    const req = {
      body: {
        nombreUsuario: 'usuario',
        contrasenna: 'contrasenna',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    } as unknown as Response

    const usuarioMock = {
      sesionIniciada: 1,
      idUsuario: 24,
      fechaIngreso: '2024-05-29T18:41:40.560Z',
      nombre: 'User',
      apellidos: 'User LastName',
      nombreUsuario: 'appUser',
      comentarios: 'no hay comentarios',
      estado: true,
      correo: 'user@gmail.com',
      rolDescripcion: 'Administrador',
      rolEstado: true,
    }

    ;(authRepository.iniciarSesion as jest.Mock).mockResolvedValue(usuarioMock)

    await authController.iniciarSesion(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(usuarioMock)
    expect(res.cookie).toHaveBeenCalled()
  })

  /**
   * Prueba: debería devolver un estado 500 si hay un error interno del servidor.
   */
  it('debería devolver un estado 500 si hay un error interno del servidor', async () => {
    const req = {
      body: {
        nombreUsuario: 'usuario',
        contrasenna: 'contrasenna',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(authRepository.iniciarSesion as jest.Mock).mockRejectedValue(
      new Error('Error interno del servidor'),
    )

    await authController.iniciarSesion(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
