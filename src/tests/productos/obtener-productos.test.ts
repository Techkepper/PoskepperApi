import 'reflect-metadata'

import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ProductoController } from '../../controllers/productos.controller'
import { IProductoRepository } from '../../interfaces/IProductoRepository'
import { IProducto } from '../../interfaces/IProducto'

describe('ProductoController - obtenerListadoProductos', () => {
  let productoController: ProductoController
  let productoRepository: jest.Mocked<IProductoRepository>

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
      obtenerCategorias: jest.fn(),
      actualizar: jest.fn(),
      obtenerTodosPlatos: jest.fn(),
      obtenerTodosPorNombreCategoria: jest.fn(),
      obtenerTodosProductosPorCategoria: jest.fn(),
      obtenerTodosProductos: jest.fn(),
      obtenerTopProductosMasVendidos: jest.fn(),
    } as jest.Mocked<IProductoRepository>

    // Resolver el controlador con el repositorio mockeado
    container.clearInstances()
    container.registerInstance<IProductoRepository>(
      'ProductoRepository',
      productoRepository,
    )
    productoController = container.resolve(ProductoController)
  })

  /*
   * Prueba: debería devolver un estado 200 y la lista de productos si se encontraron productos.
   */
  it('debería devolver un error 404 si no se encontraron productos', async () => {
    const productosMock: IProducto[] = []

    const req = {} as unknown as Request
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    productoRepository.obtenerTodos.mockResolvedValue(productosMock)

    await productoController.obtenerListadoProductos(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'No se encontraron productos',
    })
  })

  /*
   * Prueba: debería devolver un estado 500 y un mensaje de error si ocurre un error interno del servidor.
   */
  it('debería manejar un error interno del servidor correctamente', async () => {
    const error = new Error('Error interno del servidor')

    const req = {} as unknown as Request
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    productoRepository.obtenerTodos.mockRejectedValue(error)

    await productoController.obtenerListadoProductos(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
