import express, { type Router } from 'express'
import { container } from 'tsyringe'
import { ProductoController } from '../controllers/productos.controller'
import { estaAutenticado } from '../middlewares/auth.middleware'
import {
  manejarArchivo,
  uploadMiddleware,
} from '../middlewares/foto.middleware'

const router: Router = express.Router()

/*
  Obtiene una instancia del controlador de productos (ProductoController) resuelto por el contenedor de dependencias (tsyringe).
  Esta instancia se utiliza para llamar a los métodos del controlador de productos en lasrutas definidas en el router.
*/
const productoController: ProductoController =
  container.resolve(ProductoController)

router.use(estaAutenticado)

router.post(
  '/registrar',
  uploadMiddleware,
  manejarArchivo,
  productoController.registrarProducto,
)
router.get('/', productoController.obtenerListadoProductos)
router.get('/platos', productoController.obtenerListadoProductosPlatos)
router.get('/productos', productoController.obtenerListadoProductosProductos)
router.get('/:id', productoController.obtenerProductoPorIdentificacion)
router.get('/imagen/:id', productoController.obtenerImagenProducto)
router.put('/:id', uploadMiddleware, productoController.actualizarProducto)
router.delete('/:id', productoController.eliminarProducto)
router.get(
  '/categoria/:nombreCategoria',
  productoController.obtenerListadoProductosPorNombreCategoria,
)
router.get(
  '/top/mas-vendidos',
  productoController.obtenerTopProductosMasVendidos,
)

export default router
