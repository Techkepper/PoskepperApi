import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import { type IProducto } from '../interfaces/IProducto'
import { type IProductoRepository } from '../interfaces/IProductoRepository'

/**
 * Controlador para manejar las operaciones relacionadas con los productos.
 */
export class ProductoController {
  private productoRepository: IProductoRepository

  /**
   * Constructor del controlador.
   * Se encarga de inicializar la instancia del repositorio de productos.
   */
  constructor() {
    this.productoRepository =
      container.resolve<IProductoRepository>('ProductoRepository')
  }

  /**
   * Registra un nuevo producto en la base de datos.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  registrarProducto = async (req: Request, res: Response) => {
    try {
      const {
        nombre,
        descripcion,
        idCategoria,
        precio,
        cantidad,
        comentario,
        estado,
      } = req.body

      if (
        !nombre ||
        !descripcion ||
        !idCategoria ||
        idCategoria == 0 ||
        !precio ||
        !cantidad ||
        !estado
      ) {
        res.status(400).json({
          error: 'Todos los campos son requeridos para registrar un producto',
        })
        return
      }

      if (
        isNaN(precio) ||
        precio < 0 ||
        precio.toString().includes('.') ||
        precio.toString().includes(',')
      ) {
        res.status(400).json({
          error: 'El precio debe ser un número positivo sin decimales',
        })
        return
      }

      if (
        isNaN(cantidad) ||
        cantidad < 0 ||
        cantidad.toString().includes('.') ||
        cantidad.toString().includes(',')
      ) {
        res.status(400).json({
          error: 'La cantidad debe ser un número positivo sin decimales',
        })
        return
      }

      const file = req.file
      if (!file) {
        res.status(400).json({
          error: 'El archivo de la foto es requerido',
        })
        return
      }

      const nuevoProducto = await this.productoRepository.registrar({
        nombre,
        descripcion,
        idCategoria,
        precio,
        cantidad,
        comentario,
        estado,
        foto: file.buffer,
        fechaCreacion: new Date(),
      })

      if (!nuevoProducto)
        throw new Error('No se pudo registrar el nuevo producto')

      res.status(200).json({ mensaje: 'Producto registrado exitosamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene un listado de todos los productos registrados en la base de datos.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  obtenerListadoProductos = async (req: Request, res: Response) => {
    try {
      const listaProductos = await this.productoRepository.obtenerTodos()

      if (!listaProductos || listaProductos.length === 0) {
        res.status(404).json({ error: 'No se encontraron productos' })
        return
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`

      const listaProductosConImagen = listaProductos.map(
        (producto: IProducto) => {
          const imagenUrl = `${baseUrl}/api/productos/imagen/${producto.idProducto}`
          return {
            ...producto,
            imagenUrl,
          }
        },
      )

      res.status(200).json(listaProductosConImagen)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene un listado de todos los productos registrados en la base de datos pero que sean platos.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  obtenerListadoProductosPlatos = async (req: Request, res: Response) => {
    try {
      const listaProductos = await this.productoRepository.obtenerTodosPlatos()

      if (!listaProductos || listaProductos.length === 0) {
        res.status(404).json({ error: 'No se encontraron productos' })
        return
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`

      const listaProductosConImagen = listaProductos.map(
        (producto: IProducto) => {
          const imagenUrl = `${baseUrl}/api/productos/imagen/${producto.idProducto}`
          return {
            ...producto,
            imagenUrl,
          }
        },
      )

      res.status(200).json(listaProductosConImagen)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene un listado de todos los productos registrados en la base de datos pero que sean platos.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  obtenerListadoProductosProductos = async (req: Request, res: Response) => {
    try {
      const listaProductos =
        await this.productoRepository.obtenerTodosProductos()

      if (!listaProductos || listaProductos.length === 0) {
        res.status(404).json({ error: 'No se encontraron productos' })
        return
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`

      const listaProductosConImagen = listaProductos.map(
        (producto: IProducto) => {
          const imagenUrl = `${baseUrl}/api/productos/imagen/${producto.idProducto}`
          return {
            ...producto,
            imagenUrl,
          }
        },
      )

      res.status(200).json(listaProductosConImagen)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene la imagen de un producto por su ID.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  obtenerImagenProducto = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params
      const idProducto = parseInt(id, 10)

      if (isNaN(idProducto)) {
        res.status(400).json({ error: 'La identificación debe ser un número' })
        return
      }

      const producto = await this.productoRepository.obtenerPorId(idProducto)

      if (!producto) {
        res
          .status(404)
          .json({ error: 'No se encontró el producto con la identificación' })
        return
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const primerProducto = producto[0]

      if (!primerProducto.foto) {
        res.status(404).json({ error: 'No se encontró la imagen del producto' })
        return
      }

      res.set('Content-Type', 'image/png')

      res.send(primerProducto.foto)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene un producto por su ID.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  obtenerProductoPorIdentificacion = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const idProducto = parseInt(id, 10)

      if (isNaN(idProducto)) {
        res.status(400).json({ error: 'La identificación debe ser un número' })
        return
      }

      const producto = await this.productoRepository.obtenerPorId(idProducto)
      if (!producto) {
        res
          .status(404)
          .json({ error: 'No se encontró el producto ' + idProducto })
        return
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const primerProducto = producto[0]

      const baseUrl = `${req.protocol}://${req.get('host')}`
      const imagenUrl = `${baseUrl}/api/productos/imagen/${idProducto}`

      const productoSinFoto = {
        ...primerProducto,
        foto: undefined,
        imagenUrl,
      }

      res.status(200).json([productoSinFoto])
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Elimina un usuario por su identificación.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  eliminarProducto = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const idProducto = parseInt(id, 10)

      if (isNaN(idProducto)) {
        res
          .status(400)
          .json({ error: 'El ID debe ser un número entero válido' })
        return
      }

      const productoExistente =
        await this.productoRepository.existeIdProducto(idProducto)
      if (!productoExistente) {
        res
          .status(404)
          .json({ error: 'No se encontró el producto con ID proporcionado' })
        return
      }

      const eliminado = await this.productoRepository.eliminar(idProducto)
      if (!eliminado) throw new Error('No se pudo eliminar el producto')

      res.status(200).json({ mensaje: 'Producto eliminado correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Actualiza un producto por su identificación.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  actualizarProducto = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const idProducto = parseInt(id, 10)
      const {
        nombre,
        descripcion,
        idCategoria,
        precio,
        cantidad,
        estado,
        comentario,
      } = req.body

      if (isNaN(idProducto)) {
        res
          .status(400)
          .json({ error: 'El ID de producto debe ser un número entero válido' })
        return
      }

      if (precio) {
        if (
          isNaN(precio) ||
          precio < 0 ||
          precio.toString().includes('.') ||
          precio.toString().includes(',')
        ) {
          res.status(400).json({
            error: 'El precio debe ser un número positivo sin decimales',
          })
          return
        }
      }

      if (cantidad) {
        if (
          isNaN(cantidad) ||
          cantidad < 0 ||
          cantidad.toString().includes('.') ||
          cantidad.toString().includes(',')
        ) {
          res.status(400).json({
            error: 'La cantidad debe ser un número positivo sin decimales',
          })
          return
        }
      }

      const productoExistente =
        await this.productoRepository.existeIdProducto(idProducto)
      if (!productoExistente) {
        res
          .status(404)
          .json({ error: 'No se encontró el producto con el ID proporcionado' })
        return
      }

      const file = req.file
      const productoData: Partial<IProducto> = {
        nombre,
        descripcion,
        idCategoria,
        precio,
        cantidad,
        estado,
        comentario,
      }

      if (file) {
        productoData.foto = file.buffer
      }

      const productoActualizado = await this.productoRepository.actualizar(
        idProducto,
        productoData,
      )

      if (!productoActualizado) {
        res.status(500).json({ error: 'No se pudo actualizar el producto' })
        return
      }

      res.status(200).json({ mensaje: 'Producto actualizado correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene un listado de todos los productos registrados en la base de datos por nombre de categoria.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  obtenerListadoProductosPorNombreCategoria = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { nombreCategoria } = req.params
      const listaProductos =
        await this.productoRepository.obtenerTodosPorNombreCategoria(
          nombreCategoria,
        )

      if (!listaProductos || listaProductos.length === 0) {
        res.status(404).json({ error: 'No se encontraron productos' })
        return
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`

      const listaProductosConImagen = listaProductos.map(
        (producto: IProducto) => {
          const imagenUrl = `${baseUrl}/api/productos/imagen/${producto.idProducto}`
          return {
            ...producto,
            imagenUrl,
          }
        },
      )

      res.status(200).json(listaProductosConImagen)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene un TOP 3 de los productos más vendidos.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  obtenerTopProductosMasVendidos = async (req: Request, res: Response) => {
    try {
      const topProductos =
        await this.productoRepository.obtenerTopProductosMasVendidos()

      if (!topProductos || topProductos.length === 0) {
        res.status(404).json({ error: 'No se encontraron productos' })
        return
      }

      res.status(200).json(topProductos)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
