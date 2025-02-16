import 'reflect-metadata'

import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ProductoController } from '../../controllers/productos.controller'
import { IProductoRepository } from '../../interfaces/IProductoRepository'

describe('ProductoController - registrarProducto', () => {
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

    // Limpiar instancias del contenedor y registrar el mock del repositorio
    container.clearInstances()
    container.registerInstance<IProductoRepository>(
      'ProductoRepository',
      productoRepository,
    )

    // Resolver el controlador con el repositorio mockeado
    productoController = container.resolve(ProductoController)
  })

  /**
   * Prueba: debería devolver un error 400 si falta el archivo de la foto del producto.
   */
  it('debería devolver 400 si falta el archivo de la foto del producto', async () => {
    const req = {
      body: {
        nombre: 'Producto de prueba',
        descripcion: 'Descripción del producto',
        idCategoria: 1,
        precio: 100,
        cantidad: 10,
        estado: 'activo',
      },
      file: undefined,
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await productoController.registrarProducto(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'El archivo de la foto es requerido',
    })
  })

  /**
   * Prueba: debería devolver un error 400 si falta algún campo requerido para registrar un producto.
   */
  it('debería devolver 400 si falta algún campo requerido', async () => {
    const req = {
      body: {
        nombre: 'Producto de prueba',
        idCategoria: 1,
        precio: 100,
        cantidad: 10,
        estado: 'activo',
      },
      file: { buffer: Buffer.from('imagen de prueba') },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await productoController.registrarProducto(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Todos los campos son requeridos para registrar un producto',
    })
  })

  /**
   * Prueba: debería devolver un estado 200 y un mensaje de éxito al registrar un nuevo producto.
   */
  it('debería devolver 200 y un mensaje de éxito al registrar un producto', async () => {
    const req = {
      body: {
        nombre: 'Producto de prueba',
        descripcion: 'Descripción del producto',
        idCategoria: 1,
        precio: 100,
        cantidad: 10,
        estado: 'activo',
      },
      file: { buffer: Buffer.from('imagen de prueba') },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(productoRepository.registrar as jest.Mock).mockResolvedValue(true)

    await productoController.registrarProducto(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Producto registrado exitosamente',
    })
  })

  /**
   * Prueba: debería devolver un estado 500 si hay un problema con el servidor al registrar el producto.
   */
  it('debería devolver 500 en caso de error del servidor al registrar el producto', async () => {
    const req = {
      body: {
        nombre: 'Producto de prueba',
        descripcion: 'Descripción del producto',
        idCategoria: 1,
        precio: 100,
        cantidad: 10,
        estado: 'activo',
      },
      file: { buffer: Buffer.from('imagen de prueba') },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    ;(productoRepository.registrar as jest.Mock).mockRejectedValue(
      new Error('Error del servidor al registrar el producto'),
    )

    await productoController.registrarProducto(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
