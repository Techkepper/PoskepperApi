import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { TomaController } from '../../controllers/toma.controller'
import { ITomaRepository } from '../../interfaces/ITomaRepository'

describe('TomaController - agregarProductoAToma', () => {
  let tomaController: TomaController
  let tomaRepository: ITomaRepository

  beforeEach(() => {
    tomaRepository = {
      registrar: jest.fn(),
      agregarProductoAToma: jest.fn(),
      existeNombreProducto: jest.fn(),
      obtenerTodosProductosReporteDatos: jest.fn(),
    }

    // Limpiar instancias del contenedor y registrar el mock del repositorio
    container.clearInstances()
    container.registerInstance<ITomaRepository>('TomaRepository', tomaRepository)

    // Resolver el controlador con el repositorio mockeado
    tomaController = container.resolve(TomaController)
  })

  /**
   * Prueba: debería devolver un error 400 si falta alguno de los campos requeridos.
  */
  it('debería devolver un error 400 si falta alguno de los campos requeridos', async () => {
    const req = {
      body: {
        // Faltan algunos campos requeridos
        nombre: 'Producto A',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await tomaController.agregarProductoAToma(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error:
        'Todos los campos son requeridos para agregar un producto a la toma',
    })
  })

  /**
   * Prueba: debería devolver un error 400 si la cantidad no es un número.
   */
  it('debería devolver un error 400 si la cantidad no es un número', async () => {
    const req = {
      body: {
        nombre: 'Producto A',
        cantidad: 'cantidad',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await tomaController.agregarProductoAToma(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'La cantidad debe ser un número' })
  })

    /**
     * Prueba: debería devolver un error 400 si la cantidad es menor o igual a 0.
     */
  it('debería devolver un error 404 si el producto no existe', async () => {
    const req = {
      body: {
        nombre: 'Producto Inexistente',
        cantidad: 5,
      },
    } as unknown as Request

    ;(tomaRepository.existeNombreProducto as jest.Mock).mockResolvedValue(false)

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await tomaController.agregarProductoAToma(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'El producto no existe' })
  })

    /**
      * Prueba: debería devolver un error 400 si la cantidad es menor o igual a 0.
    */
  it('debería agregar el producto a la toma correctamente', async () => {
    const req = {
      body: {
        nombre: 'Producto A',
        cantidad: 5,
      },
    } as unknown as Request

    ;(tomaRepository.existeNombreProducto as jest.Mock).mockResolvedValue(true)
    ;(tomaRepository.agregarProductoAToma as jest.Mock).mockResolvedValue(true)

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await tomaController.agregarProductoAToma(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Producto agregado a la toma correctamente',
    })
  })

  /**
   * Prueba: debería devolver un error 500 en caso de error interno del servidor al agregar el producto a la toma.
   */
  it('debería devolver un error 500 en caso de error interno del servidor al agregar el producto a la toma', async () => {
    const req = {
      body: {
        nombre: 'Producto A',
        cantidad: 5,
      },
    } as unknown as Request

    ;(tomaRepository.existeNombreProducto as jest.Mock).mockResolvedValue(true)
    ;(tomaRepository.agregarProductoAToma as jest.Mock).mockRejectedValue(
      new Error('Error interno')
    )

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await tomaController.agregarProductoAToma(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' })
  })
})
