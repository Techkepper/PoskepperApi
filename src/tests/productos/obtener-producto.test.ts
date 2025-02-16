import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ProductoController } from '../../controllers/productos.controller'
import { IProductoRepository } from '../../interfaces/IProductoRepository'

describe('ProductoController - obtenerProductoPorIdentificacion', () => {
  let productoController: ProductoController
  let productoRepository: IProductoRepository

  /**
   * Configuración inicial antes de cada prueba.
   * Se encarga de inicializar el repositorio de productos simulado (mock)
   * y resolver la instancia del controlador con dicho repositorio.
   */
  beforeEach(() => {
    productoRepository = {
      obtenerTodos: jest.fn(),
      registrar: jest.fn(),
      obtenerPorId: jest.fn(),
      eliminar: jest.fn(),
      existeIdProducto: jest.fn(),
      actualizar: jest.fn(),
      obtenerTodosPlatos: jest.fn(),
      obtenerTodosPorNombreCategoria: jest.fn(),
      obtenerTodosProductos: jest.fn(),
      obtenerTopProductosMasVendidos: jest.fn(),
    }

    // Resolver el controlador con el repositorio mockeado
    container.clearInstances()
    container.registerInstance<IProductoRepository>(
      'ProductoRepository',
      productoRepository,
    )

    // Resolver el controlador con el repositorio mockeado
    productoController = container.resolve(ProductoController)
  })

  /**
   * Prueba: debería devolver un error 400 si la identificación no es un número.
   */
  it('debería devolver 400 si la identificación no es un número', async () => {
    const req = {
      params: {
        id: 'notanumber',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await productoController.obtenerProductoPorIdentificacion(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'La identificación debe ser un número',
    })
  })

  /**
   * Prueba: debería devolver un error 404 si no se encuentra el producto.
   */
  it('debería devolver 404 si no se encuentra el producto', async () => {
    const req = {
      params: {
        id: '999',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(productoRepository.obtenerPorId as jest.Mock).mockResolvedValue(null)

    await productoController.obtenerProductoPorIdentificacion(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'No se encontró el producto 999',
    })
  })

  /**
   * Prueba: debería devolver un estado 500 si hay un problema con el servidor.
   */
  it('debería devolver 500 si hay un problema con el servidor', async () => {
    const req = {
      params: {
        id: '1',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(productoRepository.obtenerPorId as jest.Mock).mockRejectedValue(
      new Error('Error del servidor'),
    )

    await productoController.obtenerProductoPorIdentificacion(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
