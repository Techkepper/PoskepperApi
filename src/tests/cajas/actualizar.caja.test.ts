import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CajasController } from '../../controllers/cajas.controller'
import { ICajaRepository } from '../../interfaces/ICajaRepository'

describe('CajasController - actualizarCaja', () => {
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
   * Prueba: debería devolver un error 400 si la identificación de la caja no es un número entero válido.
   */
  it('debería devolver un error 400 si la identificación de la caja no es un número entero válido', async () => {
    const req = {
      params: { id: 'abc' },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await cajasController.actualizarCaja(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'La identificación debe ser un número entero válido',
    })
  })

  /**
   * Prueba: debería devolver un error 400 si el monto de apertura no es un número positivo sin decimales.
   */
  it('debería devolver un error 400 si el monto de apertura no es un número positivo sin decimales', async () => {
    const req = {
      params: { id: '1' },
      body: { montoApertura: 'abc' },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await cajasController.actualizarCaja(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'El monto de apertura debe ser un número positivo sin decimales',
    })
  })

  /**
   * Prueba: debería devolver un error 400 si el monto de cierre no es un número positivo sin decimales.
   */
  it('debería devolver un error 404 si no se encuentra la caja con la identificación proporcionada', async () => {
    (cajaRepository.existeIdCaja as jest.Mock).mockResolvedValue(false)

    const req = {
      params: { id: '1' },
      body: { nombre: 'Caja 1' },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await cajasController.actualizarCaja(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'No se encontró la caja con la identificación proporcionada',
    })
  })

  /**
   * Prueba: debería devolver un error 400 si ya existe una caja con el nombre proporcionado al intentar actualizar.
   */
  it('debería devolver un error 400 si ya existe una caja con el nombre proporcionado al intentar actualizar', async () => {
    (cajaRepository.existeIdCaja as jest.Mock).mockResolvedValue(true)
    ;(cajaRepository.existeNombreCaja as jest.Mock).mockResolvedValue(true)

    const req = {
      params: { id: '1' },
      body: { nombre: 'Caja 1' },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await cajasController.actualizarCaja(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Ya existe una caja con el nombre proporcionado',
    })
  })

  /**
   * Prueba: debería devolver un error 500 en caso de error interno del servidor al actualizar la caja.
   */
  it('debería devolver un error 500 en caso de error interno del servidor al actualizar la caja', async () => {
    (cajaRepository.existeIdCaja as jest.Mock).mockRejectedValue(
      new Error('Error interno'),
    )

    const req = {
      params: { id: '1' },
      body: { nombre: 'Caja 1' },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await cajasController.actualizarCaja(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })

  /**
   * Prueba: debería devolver un mensaje de éxito al actualizar correctamente la caja.
   */
  it('debería devolver un mensaje de éxito al actualizar correctamente la caja', async () => {
    (cajaRepository.existeIdCaja as jest.Mock).mockResolvedValue(true)
    ;(cajaRepository.existeNombreCaja as jest.Mock).mockResolvedValue(false)
    ;(cajaRepository.actualizar as jest.Mock).mockResolvedValue(true)

    const req = {
      params: { id: '1' },
      body: {
        nombre: 'Caja actualizada',
        montoApertura: 200,
        montoCierre: 300,
      },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await cajasController.actualizarCaja(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Caja actualizada correctamente',
    })
  })
})
