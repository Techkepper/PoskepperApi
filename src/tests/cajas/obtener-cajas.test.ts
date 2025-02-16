import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CajasController } from '../../controllers/cajas.controller'
import { ICajaRepository } from '../../interfaces/ICajaRepository'

describe('CajasController - obtenerCajas', () => {
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
   * Prueba: debería devolver un listado de cajas cuando hay cajas disponibles.
   */
  it('debería devolver un listado de cajas cuando hay cajas disponibles', async () => {
    const cajasMock = [
      {
        id: 1,
        nombre: 'Caja 1',
        montoApertura: 100,
        montoCierre: 200,
        estaAsignada: true,
      },
      {
        id: 2,
        nombre: 'Caja 2',
        montoApertura: 150,
        montoCierre: 250,
        estaAsignada: false,
      },
    ]

    ;(cajaRepository.obtenerCajas as jest.Mock).mockResolvedValue(cajasMock)

    const req = {} as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await cajasController.obtenerCajas(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(cajasMock)
  })

  /**
   * Prueba: debería devolver 404 si no se encuentran cajas disponibles.
   */
  it('debería devolver 404 si no se encuentran cajas disponibles', async () => {
    (cajaRepository.obtenerCajas as jest.Mock).mockResolvedValue([])

    const req = {} as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await cajasController.obtenerCajas(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'No se encontraron cajas' })
  })

  /**
   * Prueba: debería devolver 500 en caso de error interno del servidor al obtener cajas.
   */
  it('debería devolver 500 en caso de error interno del servidor al obtener cajas', async () => {
    (cajaRepository.obtenerCajas as jest.Mock).mockRejectedValue(
      new Error('Error interno'),
    )

    const req = {} as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await cajasController.obtenerCajas(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
