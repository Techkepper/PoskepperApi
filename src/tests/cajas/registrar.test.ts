import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CajasController } from '../../controllers/cajas.controller'
import { ICajaRepository } from '../../interfaces/ICajaRepository'

describe('CajasController - registrarCaja', () => {
  let cajasController: CajasController
  let cajaRepository: ICajaRepository

  beforeEach(() => {
    cajaRepository = {
      registrar: jest.fn(),
      obtenerCajas: jest.fn(),
      existeNombreCaja: jest.fn(),
      existeIdCaja: jest.fn(),
      eliminar: jest.fn(),
      actualizar: jest.fn(),
      asignarCaja: jest.fn(),
      estaAsignada: jest.fn(),
      obtenerCajasDisponibles: jest.fn(),
      cambiarEstado: jest.fn(),
      obtenerCajaPorUsuario: jest.fn(),
    }

    // Limpiar instancias del contenedor y registrar el mock del repositorio
    container.clearInstances()
    container.registerInstance<ICajaRepository>(
      'CajaRepository',
      cajaRepository,
    )

    // Resolver el controlador con el repositorio mockeado
    cajasController = container.resolve(CajasController)
  })

  /**
   * Prueba: debería devolver 400 si faltan campos requeridos para registrar una caja.
   */
  it('debería devolver 400 si faltan campos requeridos para registrar una caja', async () => {
    const req = {
      body: {},
    } as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await cajasController.registrarCaja(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Todos los campos son requeridos para registrar una caja',
    })
  })

  /**
   * Prueba: debería devolver 400 si el monto de apertura no es un número positivo sin decimales.
   */
  it('debería devolver 400 si el monto de apertura no es un número positivo sin decimales', async () => {
    const req = {
      body: {
        nombre: 'Caja de prueba',
        montoApertura: 'invalido',
        montoCierre: 100,
        estaAsignada: true,
      },
    } as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await cajasController.registrarCaja(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'El monto de apertura debe ser un número positivo sin decimales',
    })
  })

  /**
   * Prueba: debería devolver 400 si el monto de cierre no es un número positivo sin decimales.
   */
  it('debería devolver 201 y un mensaje de éxito al registrar una nueva caja', async () => {
    const req = {
      body: {
        nombre: 'Nueva Caja',
        montoApertura: 150,
        montoCierre: 300,
        estaAsignada: true,
      },
    } as Request

    ;(cajaRepository.existeNombreCaja as jest.Mock).mockResolvedValue(false)
    ;(cajaRepository.registrar as jest.Mock).mockResolvedValue(true)

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await cajasController.registrarCaja(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Caja registrada correctamente',
    })
  })

  /**
   * Prueba: debería devolver 400 si el monto de cierre no es un número positivo sin decimales.
   */
  it('debería devolver 500 en caso de error interno del servidor al registrar una caja', async () => {
    const req = {
      body: {
        nombre: 'Caja',
        montoApertura: 200,
        montoCierre: 400,
        estaAsignada: true,
      },
    } as Request

    ;(cajaRepository.registrar as jest.Mock).mockRejectedValue(
      new Error('Error interno al registrar la caja'),
    )

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await cajasController.registrarCaja(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
