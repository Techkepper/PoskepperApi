import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { MesasController } from '../../controllers/mesas.controller'
import { IMesaRepository } from '../../interfaces/IMesaRepository'

describe('MesasController - eliminarMesa', () => {
  let mesasController: MesasController
  let mesaRepository: IMesaRepository

  beforeEach(() => {
    mesaRepository = {
      registrar: jest.fn(),
      obtenerMesas: jest.fn(),
      existeNombreMesa: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn(),
      existeIdMesa: jest.fn(),
      obtenerMesaOcupada: jest.fn(),
    }

    // Limpiar instancias del contenedor y registrar el mock del repositorio
    container.clearInstances()
    container.registerInstance<IMesaRepository>('MesaRepository', mesaRepository)

    // Resolver el controlador con el repositorio mockeado
    mesasController = container.resolve(MesasController)
  })

  /**
   * Prueba: debería devolver un error 400 si el ID de la mesa no es un número entero válido.
    */
  it('debería devolver un error 400 si el ID de la mesa no es un número entero válido', async () => {
    const req = {
      params: { id: 'abc' },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await mesasController.eliminarMesa(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'El ID de la mesa debe ser un número entero válido',
    })
  })

  /**
   * Prueba: debería devolver un error 404 si no se encuentra la mesa con la identificación proporcionada.
    */
  it('debería devolver un error 404 si no se encuentra la mesa con la identificación proporcionada', async () => {
    const req = {
      params: { id: '1' },
    } as unknown as Request

    ;(mesaRepository.existeIdMesa as jest.Mock).mockResolvedValue(false)

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await mesasController.eliminarMesa(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'No se encontró la mesa con la identificación proporcionada',
    })
  })

  /**
   * Prueba: debería devolver un error 500 en caso de error interno del servidor al eliminar la mesa.
    */
  it('debería devolver un error 500 en caso de error interno del servidor al eliminar la mesa', async () => {
    const req = {
      params: { id: '1' },
    } as unknown as Request

    ;(mesaRepository.existeIdMesa as jest.Mock).mockResolvedValue(true)
    ;(mesaRepository.eliminar as jest.Mock).mockRejectedValue(new Error('Error interno'))

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await mesasController.eliminarMesa(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })

    /**
     * Prueba: debería eliminar la mesa correctamente
    */
  it('debería eliminar la mesa correctamente', async () => {
    const req = {
      params: { id: '1' },
    } as unknown as Request

    ;(mesaRepository.existeIdMesa as jest.Mock).mockResolvedValue(true)
    ;(mesaRepository.eliminar as jest.Mock).mockResolvedValue(true)

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await mesasController.eliminarMesa(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Mesa eliminada correctamente' })
  })
})
