import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UsuarioController } from '../../controllers/usuarios.controller'
import { IUsuarioRepository } from '../../interfaces/IUsuarioRepository'

describe('UsuarioController - actualizarUsuario', () => {
  let usuarioController: UsuarioController
  let usuarioRepository: jest.Mocked<IUsuarioRepository>

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
    } as jest.Mocked<IUsuarioRepository>

    // Resolver el controlador con el repositorio mockeado
    container.clearInstances()
    container.registerInstance<IUsuarioRepository>(
      'UsuarioRepository',
      usuarioRepository,
    )
    usuarioController = container.resolve(UsuarioController)
  })

  /*
   * Prueba: debería devolver un error 400 si el ID de usuario no es un número entero válido.
   */
  it('debería devolver un error 400 si el ID de usuario no es un número entero válido', async () => {
    const req = {
      params: { id: 'abc' },
      body: {
        nombreUsuario: 'usuarioActualizado',
        contrasenna: 'Nuevo1234',
        nombre: 'Usuario Actualizado',
        apellidos: 'Apellido Actualizado',
        idRol: 2,
        comentarios: 'Usuario actualizado',
        correo: 'usuario.actualizado@example.com',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await usuarioController.actualizarUsuario(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'El ID de usuario debe ser un número entero válido',
    })
  })

  /*
   * Prueba: debería devolver un error 404 si no se encuentra el usuario con el ID proporcionado.
   */
  it('debería devolver un error 404 si no se encuentra el usuario con el ID proporcionado', async () => {
    const idUsuario = 1
    const req = {
      params: { id: idUsuario.toString() },
      body: {
        nombreUsuario: 'usuarioActualizado',
        contrasenna: 'Nuevo1234',
        nombre: 'Usuario Actualizado',
        apellidos: 'Apellido Actualizado',
        idRol: 2,
        comentarios: 'Usuario actualizado',
        correo: 'usuario.actualizado@example.com',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    usuarioRepository.existeIdUsuario.mockResolvedValue(false)

    await usuarioController.actualizarUsuario(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'No se encontró el usuario con el ID proporcionado',
    })
  })

  /*
   * Prueba: debería devolver un error 400 si el nombre de usuario ya está en uso.
   */
  it('debería devolver un error 400 si el nombre de usuario ya está en uso', async () => {
    const idUsuario = 1
    const req = {
      params: { id: idUsuario.toString() },
      body: {
        nombreUsuario: 'usuarioExistente',
        contrasenna: 'Nuevo1234',
        nombre: 'Usuario Actualizado',
        apellidos: 'Apellido Actualizado',
        idRol: 2,
        comentarios: 'Usuario actualizado',
        correo: 'usuario.actualizado@example.com',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    usuarioRepository.existeIdUsuario.mockResolvedValue(true)
    usuarioRepository.existeNombreUsuario.mockResolvedValue(true)

    await usuarioController.actualizarUsuario(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'El nombre de usuario ya está en uso',
    })
  })

  /*
   * Prueba: debería devolver un error 400 si el correo electrónico ya está en uso.
   */
  it('debería devolver un error 400 si el correo electrónico ya está en uso', async () => {
    const idUsuario = 1
    const req = {
      params: { id: idUsuario.toString() },
      body: {
        nombreUsuario: 'usuarioActualizado',
        contrasenna: 'Nuevo1234',
        nombre: 'Usuario Actualizado',
        apellidos: 'Apellido Actualizado',
        idRol: 2,
        comentarios: 'Usuario actualizado',
        correo: 'correo.duplicado@example.com',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    usuarioRepository.existeIdUsuario.mockResolvedValue(true)
    usuarioRepository.existeCorreo.mockResolvedValue(true)

    await usuarioController.actualizarUsuario(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'El correo electrónico ya está en uso',
    })
  })

  /*
   * Prueba: debería devolver un estado 500 si hay un problema con el servidor.
   */
  it('debería devolver 500 en caso de error del servidor', async () => {
    const idUsuario = 1
    const req = {
      params: { id: idUsuario.toString() },
      body: {
        nombreUsuario: 'usuarioActualizado',
        contrasenna: 'Nuevo1234',
        nombre: 'Usuario Actualizado',
        apellidos: 'Apellido Actualizado',
        idRol: 2,
        comentarios: 'Usuario actualizado',
        correo: 'usuarioactualizado@gmail.com',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    usuarioRepository.existeIdUsuario.mockResolvedValue(true)
    usuarioRepository.existeNombreUsuario.mockResolvedValue(false)
    usuarioRepository.existeCorreo.mockResolvedValue(false)
    usuarioRepository.actualizar.mockRejectedValue(
      new Error('Error interno del servidor'),
    )

    await usuarioController.actualizarUsuario(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
