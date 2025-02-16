import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CategoriaController } from '../../controllers/categorias.controller'
import { ICategoriaRepository } from '../../interfaces/ICategoriaRepository'

describe('CategoriaController - actualizarCategoria', () => {
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

    // Limpiar instancias del contenedor y registrar el mock del repositorio
    container.clearInstances()
    container.registerInstance<ICategoriaRepository>(
      'CategoriaRepository',
      categoriaRepository,
    )

    // Resolver el controlador con el repositorio mockeado
    categoriaController = container.resolve(CategoriaController)
  })

  /**
   * Prueba: debería actualizar una categoría correctamente.
   */
  it('debería actualizar una categoría correctamente', async () => {
    const req = {
      params: { id: '1' },
      body: {
        descripcion: 'Nueva descripción',
        estado: 'activo',
        tipoCategoria: 'principal',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(categoriaRepository.existeIdCategoria as jest.Mock).mockResolvedValue(
      true,
    )
    ;(
      categoriaRepository.existeDescripcionCategoria as jest.Mock
    ).mockResolvedValue(false)
    ;(categoriaRepository.actualizar as jest.Mock).mockResolvedValue(true)

    await categoriaController.actualizarCategoria(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Categoría actualizada correctamente',
    })
  })

  /**
   * Prueba: debería devolver un error 400 si la identificación no es un número entero válido.
   */
  it('debería devolver un error 400 si la identificación no es un número entero válido', async () => {
    const req = {
      params: { id: 'abc' },
      body: {
        descripcion: 'Nueva descripción',
        estado: 'activo',
        tipoCategoria: 'principal',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await categoriaController.actualizarCategoria(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'La identificación debe ser un número entero válido',
    })
  })

  /**
   * Prueba: debería devolver un error 404 si no se encuentra la categoría con la identificación proporcionada.
   */
  it('debería devolver un error 404 si no se encuentra la categoría', async () => {
    const req = {
      params: { id: '1' },
      body: {
        descripcion: 'Nueva descripción',
        estado: 'activo',
        tipoCategoria: 'principal',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(categoriaRepository.existeIdCategoria as jest.Mock).mockResolvedValue(
      false,
    )

    await categoriaController.actualizarCategoria(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'No se encontró la categoría con la identificación proporcionada',
    })
  })

  /**
   * Prueba: debería devolver un error 400 si ya existe una categoría con la descripción proporcionada.
   */
  it('debería devolver un error 400 si ya existe una categoría con la descripción proporcionada', async () => {
    const req = {
      params: { id: '1' },
      body: {
        descripcion: 'Nueva descripción',
        estado: 'activo',
        tipoCategoria: 'principal',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(categoriaRepository.existeIdCategoria as jest.Mock).mockResolvedValue(
      true,
    )
    ;(
      categoriaRepository.existeDescripcionCategoria as jest.Mock
    ).mockResolvedValue(true)

    await categoriaController.actualizarCategoria(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Ya existe una categoría con la descripción proporcionada',
    })
  })

  /**
   * Prueba: debería devolver un error 500 si ocurre un error al actualizar la categoría.
   */
  it('debería devolver un error 500 si ocurre un error al actualizar la categoría', async () => {
    const req = {
      params: { id: '1' },
      body: {
        descripcion: 'Nueva descripción',
        estado: 'activo',
        tipoCategoria: 'principal',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(categoriaRepository.existeIdCategoria as jest.Mock).mockResolvedValue(
      true,
    )
    ;(
      categoriaRepository.existeDescripcionCategoria as jest.Mock
    ).mockResolvedValue(false)
    ;(categoriaRepository.actualizar as jest.Mock).mockRejectedValue(
      new Error('Error de prueba'),
    )

    await categoriaController.actualizarCategoria(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
