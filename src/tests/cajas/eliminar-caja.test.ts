import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CajasController } from '../../controllers/cajas.controller'
import { ICajaRepository } from '../../interfaces/ICajaRepository'

describe('CajasController - eliminarCaja', () => {
  let cajasController: CajasController
  let cajaRepository: ICajaRepository

  beforeEach(() => {
    cajaRepository = {
      registrar: jest.fn(),
      existeNombreCaja: jest.fn(),
      obtenerCajas: jest.fn(),
      existeIdCaja: jest.fn(),
      eliminar: jest.fn(),
      actualizar: jest.fn(),
      estaAsignada: jest.fn(),
      obtenerCajasDisponibles: jest.fn(),
      asignarCaja: jest.fn(),
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
   * Prueba: debería devolver 400 si el ID de la caja no es un número entero válido.
   */
  it('debería devolver 400 si el ID de la caja no es un número entero válido', async () => {
    const req = {
      params: { id: 'abc' },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await cajasController.eliminarCaja(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'El ID de la caja debe ser un número entero válido',
    })
  })

  /**
   * Prueba: debería devolver 404 si no se encuentra la caja con el ID proporcionado.
   */
  it('debería devolver 404 si no se encuentra la caja con el ID proporcionado', async () => {
    const req = {
      params: { id: '123' },
    } as unknown as Request

    ;(cajaRepository.existeIdCaja as jest.Mock).mockResolvedValue(false)

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await cajasController.eliminarCaja(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'No se encontró la caja con la identificación proporcionada',
    })
  })

  /**
   * Prueba: debería devolver 404 si no se pudo eliminar la caja seleccionada.
   */
  it('debería devolver 404 si no se pudo eliminar la caja seleccionada', async () => {
    const req = {
      params: { id: '123' },
    } as unknown as Request

    ;(cajaRepository.existeIdCaja as jest.Mock).mockResolvedValue(true)
    ;(cajaRepository.eliminar as jest.Mock).mockResolvedValue(false)

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await cajasController.eliminarCaja(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'No se pudo eliminar la caja seleccionada',
    })
  })

  /**
   * Prueba: debería devolver 200 y un mensaje de éxito al eliminar una caja correctamente.
   */
  it('debería devolver 200 y un mensaje de éxito al eliminar una caja correctamente', async () => {
    const req = {
      params: { id: '123' },
    } as unknown as Request

    ;(cajaRepository.existeIdCaja as jest.Mock).mockResolvedValue(true)
    ;(cajaRepository.eliminar as jest.Mock).mockResolvedValue(true)

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await cajasController.eliminarCaja(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Caja eliminada correctamente',
    })
  })

  /**
   * Prueba: debería devolver 500 en caso de error interno del servidor al eliminar una caja.
   */
  it('debería devolver 500 en caso de error interno del servidor al eliminar una caja', async () => {
    const req = {
      params: { id: '123' },
    } as unknown as Request

    ;(cajaRepository.existeIdCaja as jest.Mock).mockRejectedValue(
      new Error('Error interno al eliminar la caja'),
    )

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await cajasController.eliminarCaja(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })
})
