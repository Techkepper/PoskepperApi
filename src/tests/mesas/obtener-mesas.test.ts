import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { MesasController } from '../../controllers/mesas.controller'
import { IMesaRepository } from '../../interfaces/IMesaRepository'

describe('MesasController - obtenerMesas', () => {
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
    container.registerInstance<IMesaRepository>(
      'MesaRepository',
      mesaRepository,
    )

    // Resolver el controlador con el repositorio mockeado
    mesasController = container.resolve(MesasController)
  })

  /**
   * Prueba: debería devolver un error 404 si no se encuentran mesas.
   */
  it('debería devolver un error 404 si no se encuentran mesas', async () => {
    (mesaRepository.obtenerMesas as jest.Mock).mockResolvedValue([])

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await mesasController.obtenerMesas({} as Request, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'No se encontraron mesas',
    })
  })

  /**
   * Prueba: debería devolver un error 500 en caso de error interno del servidor al obtener mesas.
   */
  it('debería devolver un error 500 en caso de error interno del servidor al obtener mesas', async () => {
    (mesaRepository.obtenerMesas as jest.Mock).mockRejectedValue(
      new Error('Error interno'),
    )

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await mesasController.obtenerMesas({} as Request, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })

  /**
   * Prueba: debería devolver las mesas obtenidas correctamente.
   */
  it('debería devolver las mesas obtenidas correctamente', async () => {
    const mockMesas = [
      { id: 1, nombre: 'Mesa 1', estado: 'Disponible' },
      { id: 2, nombre: 'Mesa 2', estado: 'Ocupada' },
    ]
    ;(mesaRepository.obtenerMesas as jest.Mock).mockResolvedValue(mockMesas)

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await mesasController.obtenerMesas({} as Request, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(mockMesas)
  })
})
