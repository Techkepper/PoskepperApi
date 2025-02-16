import 'reflect-metadata'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { AuthController } from '../../controllers/auth.controller'
import { IAuthRepository } from '../../interfaces/IAuthRepository'

describe('AuthController - actualizarContrasennaMiCuenta', () => {
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
    } as jest.Mocked<IAuthRepository> // Utilizamos jest.Mocked para tipar el repositorio

    // Resolver el controlador con el repositorio mockeado
    container.clearInstances()
    container.registerInstance<IAuthRepository>(
      'AuthRepository',
      authRepository,
    )
    authController = container.resolve(AuthController)
  })

  /*
   * Prueba: debería devolver un 200 si la contraseña se actualiza correctamente.
   */
  it('debería actualizar la contraseña correctamente cuando se proporciona la contraseña actual y la nueva contraseña', async () => {
    const req = {
      body: {
        id: 1,
        contrasenna: 'password123',
        nuevaContrasenna: 'newPassword456',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    authRepository.verificarContrasenna.mockResolvedValue(true)
    authRepository.actualizarContrasenna.mockResolvedValue()

    await authController.actualizarContrasennaMiCuenta(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Contraseña actualizada exitosamente',
    })
  })

  /*
   * Prueba: debería devolver un error 400 si el ID de usuario no se proporciona.
   */
  it('debería devolver un error 400 si el ID de usuario no se proporciona', async () => {
    const req = {
      body: {
        contrasenna: 'password123',
        nuevaContrasenna: 'newPassword456',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await authController.actualizarContrasennaMiCuenta(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'ID de usuario es requerido',
    })
  })

  /*
   * Prueba: debería devolver un error 400 si la contraseña actual o la nueva contraseña no se proporcionan.
   */
  it('debería devolver un error 400 si la contraseña actual o la nueva contraseña no se proporcionan', async () => {
    const req = {
      body: {
        id: 1,
        nuevaContrasenna: 'newPassword456',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await authController.actualizarContrasennaMiCuenta(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Contraseña actual y nueva contraseña son requeridas',
    })
  })

  /*
   * Prueba: debería devolver un error 401 si la contraseña actual proporcionada es incorrecta.
   */
  it('debería devolver un error 401 si la contraseña actual proporcionada es incorrecta', async () => {
    const req = {
      body: {
        id: 1,
        contrasenna: 'wrongPassword',
        nuevaContrasenna: 'newPassword456',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    authRepository.verificarContrasenna.mockResolvedValue(false)

    await authController.actualizarContrasennaMiCuenta(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      error: 'La contraseña actual es incorrecta',
    })
  })

  /*
   * Prueba: debería devolver un error 500 si ocurre un error interno del servidor.
   */
  it('debería manejar un error interno del servidor correctamente', async () => {
    const req = {
      body: {
        id: 1,
        contrasenna: 'password123',
        nuevaContrasenna: 'newPassword456',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    authRepository.verificarContrasenna.mockRejectedValue(
      new Error('Error interno del servidor'),
    )

    await authController.actualizarContrasennaMiCuenta(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
