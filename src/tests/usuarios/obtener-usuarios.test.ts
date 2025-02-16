import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UsuarioController } from '../../controllers/usuarios.controller'
import { IUsuarioRepository } from '../../interfaces/IUsuarioRepository'

describe('UsuarioController - obtenerListadoUsuarios', () => {
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
      obtenerReporteComisionesMesero : jest.fn(),
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
   * Prueba: debería devolver un estado 200 y una lista de usuarios.
   */
  it('debería devolver 200 y una lista de usuarios', async () => {
    const listaUsuarios = [
      { id: 1, nombreUsuario: 'usuario1', nombre: 'Usuario 1' },
      { id: 2, nombreUsuario: 'usuario2', nombre: 'Usuario 2' },
    ]

    const req = {} as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(usuarioRepository.obtenerTodos as jest.Mock).mockResolvedValue(
      listaUsuarios,
    )

    await usuarioController.obtenerTodosLosUsuarios(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(listaUsuarios)
  })

  /**
   * Prueba: debería devolver un estado 404 si no se encuentran usuarios.
   */
  it('debería devolver 404 si no se encuentran usuarios', async () => {
    const req = {} as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(usuarioRepository.obtenerTodos as jest.Mock).mockResolvedValue(null)

    await usuarioController.obtenerTodosLosUsuarios(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'No se encontraron usuarios',
    })
  })

  /**
   * Prueba: debería devolver un estado 500 si ocurre un error al obtener los usuarios.
   */
  it('debería devolver 500 si ocurre un error al obtener los usuarios', async () => {
    const req = {} as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(usuarioRepository.obtenerTodos as jest.Mock).mockRejectedValue(
      new Error('Error de prueba'),
    )

    await usuarioController.obtenerTodosLosUsuarios(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
