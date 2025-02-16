import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CategoriaController } from '../../controllers/categorias.controller'
import { ICategoriaRepository } from '../../interfaces/ICategoriaRepository'

describe('CategoriaController - eliminarCategoria', () => {
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
      existeDescripcionCategoria: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn(),
      existeCategoriaEnProductos: jest.fn(),
      existeIdCategoria: jest.fn(),
    }

    container.clearInstances()
    container.registerInstance<ICategoriaRepository>(
      'CategoriaRepository',
      categoriaRepository,
    )

    categoriaController = container.resolve(CategoriaController)
  })

  /**
   * Prueba: debería eliminar una categoría correctamente.
   */
  it('debería eliminar una categoría correctamente', async () => {
    const req = {
      params: { id: '1' },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(categoriaRepository.existeIdCategoria as jest.Mock).mockResolvedValue(
      true,
    )
    ;(
      categoriaRepository.existeCategoriaEnProductos as jest.Mock
    ).mockResolvedValue(false)
    ;(categoriaRepository.eliminar as jest.Mock).mockResolvedValue(true)

    await categoriaController.eliminarCategoria(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Categoría eliminada correctamente',
    })
  })

  /**
   * Prueba: debería devolver un error 400 si la identificación no es un número entero válido.
   */
  it('debería devolver un error 400 si la identificación no es un número entero válido', async () => {
    const req = {
      params: { id: 'abc' },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await categoriaController.eliminarCategoria(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'La identificación no debe ser un número entero válido',
    })
  })

  /**
   * Prueba: debería devolver un error 404 si no se encuentra la categoría con la identificación proporcionada.
   */
  it('debería devolver un error 404 si no se encuentra la categoría', async () => {
    const req = {
      params: { id: '1' },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(categoriaRepository.existeIdCategoria as jest.Mock).mockResolvedValue(
      false,
    )

    await categoriaController.eliminarCategoria(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'No se encontró la categoría con la identificación proporcionada',
    })
  })

  /**
   * Prueba: debería devolver un error 400 si la categoría está asociada a productos y no se puede eliminar.
   */
  it('debería devolver un error 400 si la categoría está asociada a productos', async () => {
    const req = {
      params: { id: '1' },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(categoriaRepository.existeIdCategoria as jest.Mock).mockResolvedValue(
      true,
    )
    ;(
      categoriaRepository.existeCategoriaEnProductos as jest.Mock
    ).mockResolvedValue(true)

    await categoriaController.eliminarCategoria(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error:
        'No se puede eliminar una categoría que está asociada a productos. Elimine los productos asociados primero',
    })
  })

  /**
   * Prueba: debería devolver un error 500 si ocurre un error al eliminar la categoría.
   */
  it('debería devolver un error 500 si ocurre un error al eliminar la categoría', async () => {
    const req = {
      params: { id: '1' },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(categoriaRepository.existeIdCategoria as jest.Mock).mockResolvedValue(
      true,
    )
    ;(
      categoriaRepository.existeCategoriaEnProductos as jest.Mock
    ).mockResolvedValue(false)
    ;(categoriaRepository.eliminar as jest.Mock).mockRejectedValue(
      new Error('Error de prueba'),
    )

    await categoriaController.eliminarCategoria(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
