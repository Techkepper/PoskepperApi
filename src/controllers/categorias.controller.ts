import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { type ICategoriaRepository } from '../interfaces/ICategoriaRepository'

/**
 * Controlador para manejar las operaciones relacionadas con los clientes.
 */
export class CategoriaController {
  private categoriaRepository: ICategoriaRepository

  /**
   * Constructor del controlador.
   * Se encarga de inicializar la instancia del repositorio de clientes.
   */
  constructor() {
    this.categoriaRepository = container.resolve<ICategoriaRepository>(
      'CategoriaRepository',
    )
  }

  /**
   * Obtiene un listado de categorías de productos.
   * @param res - Objeto de respuesta Express.
   */
  obtenerCategorias = async (req: Request, res: Response) => {
    try {
      const categorias = await this.categoriaRepository.obtenerCategorias()

      if (!categorias || categorias.length === 0) {
        res
          .status(404)
          .json({ error: 'No se encontraron categorías de productos' })
        return
      }

      res.status(200).json(categorias)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Registra una nueva categoría de productos.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  registrarCategoria = async (req: Request, res: Response) => {
    try {
      const { descripcion, estado, tipoCategoria } = req.body

      if (!descripcion || !estado || !tipoCategoria) {
        res.status(400).json({
          error: 'Todos los campos son requeridos para registrar una categoría',
        })
        return
      }

      const existeCategoria =
        await this.categoriaRepository.existeDescripcionCategoria(descripcion)
      if (existeCategoria) {
        res.status(400).json({
          error: 'Ya existe una categoría con la descripción proporcionada',
        })
        return
      }

      const categoria = await this.categoriaRepository.registrar({
        descripcion,
        estado,
        tipoCategoria,
      })

      if (!categoria) throw new Error('No se pudo registrar la nueva categoría')

      res.status(201).json({ mensaje: 'Categoría registrada correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Elimina una categoría de productos.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  eliminarCategoria = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const idCategoria = parseInt(id, 10)

      if (isNaN(idCategoria)) {
        res.status(400).json({
          error: 'La identificación no debe ser un número entero válido',
        })
        return
      }

      const existeCategoria =
        await this.categoriaRepository.existeIdCategoria(idCategoria)
      if (!existeCategoria) {
        res.status(404).json({
          error:
            'No se encontró la categoría con la identificación proporcionada',
        })
        return
      }

      const existeCategoriaEnProductos =
        await this.categoriaRepository.existeCategoriaEnProductos(idCategoria)
      if (existeCategoriaEnProductos) {
        res.status(400).json({
          error:
            'No se puede eliminar una categoría que está asociada a productos. Elimine los productos asociados primero',
        })
        return
      }

      const eliminado = await this.categoriaRepository.eliminar(idCategoria)

      if (!eliminado) {
        res.status(400).json({
          error: 'No se pudo eliminar la categoría seleccionada',
        })
        return
      }

      res.status(200).json({ mensaje: 'Categoría eliminada correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Actualiza una categoría de productos.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  actualizarCategoria = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const idCategoria = parseInt(id, 10)
      const categoriaData = req.body

      if (isNaN(idCategoria)) {
        res.status(400).json({
          error: 'La identificación debe ser un número entero válido',
        })
        return
      }

      const existeIdCategoria =
        await this.categoriaRepository.existeIdCategoria(idCategoria)
      if (!existeIdCategoria) {
        res.status(404).json({
          error:
            'No se encontró la categoría con la identificación proporcionada',
        })
        return
      }

      const existeDescripcionCategoria =
        await this.categoriaRepository.existeDescripcionCategoria(
          categoriaData.descripcion,
        )
      if (existeDescripcionCategoria) {
        res.status(400).json({
          error: 'Ya existe una categoría con la descripción proporcionada',
        })
        return
      }

      const categoria = await this.categoriaRepository.actualizar(
        idCategoria,
        categoriaData,
      )

      if (!categoria) {
        res.status(400).json({
          error: 'No se pudo actualizar la categoría seleccionada',
        })
        return
      }

      res.status(200).json({ mensaje: 'Categoría actualizada correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
