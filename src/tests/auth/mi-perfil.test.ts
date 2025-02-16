import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { AuthController } from '../../controllers/auth.controller'
import { IAuthRepository } from '../../interfaces/IAuthRepository'

describe('AuthController - miPerfil', () => {
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
   * Prueba: debería devolver un estado 404 si no se encuentra el usuario.
   */
  it('debería devolver un estado 404 si no se encuentra el usuario', async () => {
    const req = {
      nombreUsuario: 'usuario',
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(
      authRepository.obtenerUsuarioPorNombreUsuario as jest.Mock
    ).mockResolvedValue(null)

    await authController.miPerfil(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Usuario no encontrado',
    })
  })

  /**
   * Prueba: debería devolver un estado 200 y los datos del usuario si se encuentra.
   */
  it('debería devolver un estado 200 y los datos del usuario si se encuentra', async () => {
    const req = {
      nombreUsuario: 'usuario',
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    const usuarioMock = {
      id: 1,
      nombreUsuario: 'usuario',
      nombre: 'Nombre',
      apellidos: 'Apellidos',
      correo: 'ejemplo@gmail.com',
      idRol: 1,
      rol: 'Usuario',
    }

    ;(
      authRepository.obtenerUsuarioPorNombreUsuario as jest.Mock
    ).mockResolvedValue(usuarioMock)

    await authController.miPerfil(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(usuarioMock)
  })

  /**
   * Prueba: debería devolver un estado 500 si hay un error interno del servidor.
   */
  it('debería devolver un estado 500 si hay un error interno del servidor', async () => {
    const req = {
      nombreUsuario: 'usuario',
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(
      authRepository.obtenerUsuarioPorNombreUsuario as jest.Mock
    ).mockRejectedValue(new Error('Error interno del servidor'))

    await authController.miPerfil(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
