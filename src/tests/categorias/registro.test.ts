import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CategoriaController } from '../../controllers/categorias.controller'
import { ICategoriaRepository } from '../../interfaces/ICategoriaRepository'

describe('CategoriaController - registrarCategoria', () => {
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
   * Prueba: debería registrar una nueva categoría correctamente.
   */
  it('debería registrar una nueva categoría correctamente', async () => {
    const req = {
      body: {
        descripcion: 'Nueva categoría',
        estado: 'activo',
        tipoCategoria: 'alimentos',
      },
    } as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(
      categoriaRepository.existeDescripcionCategoria as jest.Mock
    ).mockResolvedValue(false)
    ;(categoriaRepository.registrar as jest.Mock).mockResolvedValue({
      id: 1,
      descripcion: 'Nueva categoría',
      estado: 'activo',
      tipoCategoria: 'alimentos',
    })

    await categoriaController.registrarCategoria(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Categoría registrada correctamente',
    })
  })

  /**
   * Prueba: debería devolver un error 400 si faltan campos requeridos para registrar una categoría.
   */
  it('debería devolver un error 400 si faltan campos requeridos', async () => {
    const req = {
      body: {
        descripcion: 'Nueva categoría',
        estado: 'activo',
      },
    } as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await categoriaController.registrarCategoria(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Todos los campos son requeridos para registrar una categoría',
    })
  })

  /**
   * Prueba: debería devolver un error 400 si ya existe una categoría con la misma descripción.
   */
  it('debería devolver un error 400 si ya existe una categoría con la misma descripción', async () => {
    const req = {
      body: {
        descripcion: 'Nueva categoría',
        estado: 'activo',
        tipoCategoria: 'alimentos',
      },
    } as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(
      categoriaRepository.existeDescripcionCategoria as jest.Mock
    ).mockResolvedValue(true)

    await categoriaController.registrarCategoria(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Ya existe una categoría con la descripción proporcionada',
    })
  })

  /**
   * Prueba: debería devolver un error 500 si ocurre un error al registrar la categoría.
   */
  it('debería devolver un error 500 si ocurre un error al registrar la categoría', async () => {
    const req = {
      body: {
        descripcion: 'Nueva categoría',
        estado: 'activo',
        tipoCategoria: 'alimentos',
      },
    } as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(
      categoriaRepository.existeDescripcionCategoria as jest.Mock
    ).mockRejectedValue(new Error('Error de prueba'))

    await categoriaController.registrarCategoria(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
