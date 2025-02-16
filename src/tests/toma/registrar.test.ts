import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { TomaController } from '../../controllers/toma.controller'
import { ITomaRepository } from '../../interfaces/ITomaRepository'

describe('TomaController - registrarToma', () => {
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

  /*
    *Prueba: debería devolver un error 400 si falta alguno de los campos requer
 */
  it('debería devolver un error 400 si falta alguno de los campos requeridos', async () => {
    const req = {
      body: {
        fechaToma: '2024-07-10',
        motivo: 'Inventario mensual',
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await tomaController.registrarToma(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Todos los campos son requeridos para registrar una toma',
    })
  })

    /*
       *Prueba: debería devolver un error 500 en caso de error interno del servidor al registrar la toma
    */
  it('debería devolver un error 500 en caso de error interno del servidor al registrar la toma', async () => {
    const req = {
      body: {
        fechaToma: '2024-07-10',
        motivo: 'Inventario mensual',
        idUsuario: '1',
      },
    } as unknown as Request

    ;(tomaRepository.registrar as jest.Mock).mockRejectedValue(new Error('Error interno'))

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await tomaController.registrarToma(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' })
  })

    /*
      *Prueba: debería registrar la toma correctamente
    */
  it('debería registrar la toma correctamente', async () => {
    const req = {
      body: {
        fechaToma: '2024-07-10',
        motivo: 'Inventario mensual',
        idUsuario: '1',
      },
    } as unknown as Request

    ;(tomaRepository.registrar as jest.Mock).mockResolvedValue(true)

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await tomaController.registrarToma(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Datos sobre la toma registrados' })
  })
})
