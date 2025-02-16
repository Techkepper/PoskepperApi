import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CategoriaController } from '../../controllers/categorias.controller'
import { ICategoriaRepository } from '../../interfaces/ICategoriaRepository'

describe('CategoriasController - obtenerCategorias', () => {
  let categoriaController: CategoriaController
  let categoriaRepository: ICategoriaRepository

  /**
   * Configuración inicial antes de cada prueba.
   * Se encarga de inicializar el repositorio de categorías simulado (mock)
   * y resolver la instancia del controlador con dicho repositorio.
   */
  beforeEach(() => {
    categoriaRepository = {
      obtenerCategorias: jest.fn(),
      registrar: jest.fn(),
      eliminar: jest.fn(),
      actualizar: jest.fn(),
      existeDescripcionCategoria: jest.fn(),
      existeCategoriaEnProductos: jest.fn(),
      existeIdCategoria: jest.fn(),
    }

    // Resolver el controlador con el repositorio mockeado
    container.clearInstances()
    container.registerInstance<ICategoriaRepository>(
      'CategoriaRepository',
      categoriaRepository,
    )
    categoriaController = container.resolve(CategoriaController)
  })

  /**
   * Prueba: debería devolver un estado 200 con una lista de categorías de productos.
   */
  it('debería devolver 200 con una lista de categorías de productos', async () => {
    const categorias = [
      { idCategoria: 1, descripcion: 'Bebidas' },
      { idCategoria: 2, descripcion: 'Platos' },
      { idCategoria: 3, descripcion: 'Postres' },
    ]

    const req = {} as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(categoriaRepository.obtenerCategorias as jest.Mock).mockResolvedValue(
      categorias,
    )

    await categoriaController.obtenerCategorias(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(categorias)
  })

  /**
   * Prueba: debería devolver un estado 404 si no se encuentran categorías de productos.
   */
  it('debería devolver 404 si no se encuentran categorías de productos', async () => {
    const req = {} as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(categoriaRepository.obtenerCategorias as jest.Mock).mockResolvedValue(
      null,
    )

    await categoriaController.obtenerCategorias(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'No se encontraron categorías de productos',
    })
  })

  /**
   * Prueba: debería devolver un estado 500 si ocurre un error al obtener las categorías de productos.
   */
  it('debería devolver 500 si ocurre un error al obtener las categorías de productos', async () => {
    const req = {} as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(categoriaRepository.obtenerCategorias as jest.Mock).mockRejectedValue(
      new Error('Error de prueba'),
    )

    await categoriaController.obtenerCategorias(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
