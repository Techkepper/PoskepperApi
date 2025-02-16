import 'reflect-metadata'

import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { MesasController } from '../../controllers/mesas.controller'
import { IMesaRepository } from '../../interfaces/IMesaRepository'

describe('MesasController - registrarMesa', () => {
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
   * Prueba: debería devolver un error 400 si faltan campos requeridos.
   */
  it('debería devolver un error 400 si faltan campos requeridos', async () => {
    const req = {
      body: {},
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await mesasController.registrarMesa(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Todos los campos son requeridos para registrar una mesa',
    })
  })

  /**
   * Prueba: debería devolver un error 400 si ya existe una mesa con el nombre proporcionado.
   */
  it('debería devolver un error 400 si ya existe una mesa con el nombre proporcionado', async () => {
    (mesaRepository.existeNombreMesa as jest.Mock).mockResolvedValue(true)

    const req = {
      body: { nombre: 'Mesa 1', estado: 'Disponible' },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await mesasController.registrarMesa(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Ya existe una mesa con ese nombre',
    })
  })

  /**
   * Prueba: debería devolver un error 500 en caso de error interno del servidor al registrar la mesa.
   */
  it('debería devolver un error 500 en caso de error interno del servidor al registrar la mesa', async () => {
    (mesaRepository.existeNombreMesa as jest.Mock).mockRejectedValue(
      new Error('Error interno'),
    )

    const req = {
      body: { nombre: 'Mesa 1', estado: 'Disponible' },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await mesasController.registrarMesa(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
    })
  })

  /**
   * Prueba: debería devolver un mensaje de éxito al registrar correctamente la mesa.
   */
  it('debería devolver un mensaje de éxito al registrar correctamente la mesa', async () => {
    (mesaRepository.existeNombreMesa as jest.Mock).mockResolvedValue(false)
    ;(mesaRepository.registrar as jest.Mock).mockResolvedValue({
      nombre: 'Mesa 1',
      estado: 'Disponible',
    })

    const req = {
      body: { nombre: 'Mesa 1', estado: 'Disponible' },
    } as unknown as Request

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await mesasController.registrarMesa(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Mesa registrada correctamente',
    })
  })
})
