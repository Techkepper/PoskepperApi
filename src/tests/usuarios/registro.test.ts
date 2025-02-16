import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UsuarioController } from '../../controllers/usuarios.controller'
import { IUsuarioRepository } from '../../interfaces/IUsuarioRepository'

describe('UsuarioController - registrarUsuario', () => {
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

  /*
   * Prueba: debería registrar un nuevo usuario correctamente
   */
  it('debería registrar un nuevo usuario correctamente', async () => {
    const req = {
      body: {
        nombreUsuario: 'nuevoUsuario',
        contrasenna: 'Password1234',
        nombre: 'Nuevo',
        apellidos: 'Usuario',
        idRol: 1,
        comentarios: 'Nuevo usuario registrado',
        correo: 'nuevousuario@example.com',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(usuarioRepository.existeNombreUsuario as jest.Mock).mockResolvedValue(
      false,
    )
    ;(usuarioRepository.existeCorreo as jest.Mock).mockResolvedValue(false)
    ;(usuarioRepository.registrar as jest.Mock).mockResolvedValue(true)

    await usuarioController.registrarUsuario(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Usuario registrado correctamente',
    })
  })

  /*
   * Prueba: debería devolver un error 400 si falta algún campo requerido.
   */
  it('debería devolver un error 400 si falta algún campo requerido', async () => {
    const req = {
      body: {
        contrasenna: 'Password1234',
        nombre: 'Nuevo',
        apellidos: 'Usuario',
        idRol: 1,
        comentarios: 'Nuevo usuario registrado',
        correo: 'nuevousuario@example.com',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await usuarioController.registrarUsuario(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Todos los campos son requeridos para registrar un usuario',
    })
  })

  it('debería devolver un error 400 si la contraseña no cumple con los requisitos', async () => {
    // Mock de datos de solicitud con contraseña no válida
    const req = {
      body: {
        nombreUsuario: 'nuevoUsuario',
        contrasenna: 'abc123', // Contraseña que no cumple con los requisitos
        nombre: 'Nuevo',
        apellidos: 'Usuario',
        idRol: 1,
        comentarios: 'Nuevo usuario registrado',
        correo: 'nuevousuario@example.com',
      },
    } as unknown as Request

    // Mock de respuesta
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    // Llamar al método del controlador
    await usuarioController.registrarUsuario(req, res)

    // Verificar el estado y el mensaje de error
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error:
        'La contraseña debe tener al menos 4 letras y 4 números en cualquier orden',
    })
  })

  /*
   * Prueba: debería devolver un error 400 si el nombre de usuario ya está en uso.
   */
  it('debería devolver un error 400 si el nombre de usuario ya está en uso', async () => {
    const req = {
      body: {
        nombreUsuario: 'usuarioExistente',
        contrasenna: 'Password1234',
        nombre: 'Nuevo',
        apellidos: 'Usuario',
        idRol: 1,
        comentarios: 'Nuevo usuario registrado',
        correo: 'nuevousuario@example.com',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(usuarioRepository.existeNombreUsuario as jest.Mock).mockResolvedValue(
      true,
    )

    await usuarioController.registrarUsuario(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'El nombre de usuario ya está en uso',
    })
  })

  /*
   * Prueba: debería devolver un error 400 si el correo electrónico no es válido.
   */
  it('debería devolver un error 400 si el correo electrónico no es válido', async () => {
    const req = {
      body: {
        nombreUsuario: 'nuevoUsuario',
        contrasenna: 'Password1234',
        nombre: 'Nuevo',
        apellidos: 'Usuario',
        idRol: 1,
        comentarios: 'Nuevo usuario registrado',
        correo: 'correo_invalido',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await usuarioController.registrarUsuario(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error:
        'El correo electrónico debe tener el siguiente formato: nombre@ejemplo.com',
    })
  })

  /*
   * Prueba: debería devolver un error 400 si el correo electrónico ya está en uso.
   */
  it('debería devolver un error 400 si el correo electrónico ya está en uso', async () => {
    const req = {
      body: {
        nombreUsuario: 'nuevoUsuario',
        contrasenna: 'Password1234',
        nombre: 'Nuevo',
        apellidos: 'Usuario',
        idRol: 1,
        comentarios: 'Nuevo usuario registrado',
        correo: 'correoexistente@example.com',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(usuarioRepository.existeCorreo as jest.Mock).mockResolvedValue(true)

    await usuarioController.registrarUsuario(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'El correo electrónico ya está en uso',
    })
  })

  /*
   * Prueba: debería devolver un error 500 si ocurre un error en el servidor al registrar.
   */
  it('debería devolver un error 500 si ocurre un error en el servidor al registrar', async () => {
    const req = {
      body: {
        nombreUsuario: 'nuevoUsuario',
        contrasenna: 'Password1234',
        nombre: 'Nuevo',
        apellidos: 'Usuario',
        idRol: 1,
        comentarios: 'Nuevo usuario registrado',
        correo: 'nuevousuario@example.com',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(usuarioRepository.registrar as jest.Mock).mockRejectedValue(
      new Error('Error en el servidor'),
    )

    await usuarioController.registrarUsuario(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
