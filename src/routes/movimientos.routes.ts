import express, { type Router } from 'express'
import { MovimientoInventarioController } from '../controllers/movimientos.controller'
import { container } from 'tsyringe'
import { estaAutenticado } from '../middlewares/auth.middleware'

const router: Router = express.Router()

/*
  Obtiene una instancia del controlador de movimientos de inventario (MovimientoInventarioController) resuelto por el contenedor de dependencias (tsyringe).
  Esta instancia se utiliza para llamar a los metodos del controlador de movimientos de inventario en las rutas definidas en el router.
  Adicionalmente, se recibe el servidor de Socket.IO (io) como parametro en el constructor del controlador de movimientos de inventario.
*/

const movimientoController: MovimientoInventarioController = container.resolve(
  MovimientoInventarioController,
)

router.use(estaAutenticado)

router.post('/registrar', movimientoController.registrarMovimiento)
router.get('/', movimientoController.obtenerMovimientos)
router.get('/:id', movimientoController.obtenerMovimientos)
router.get(
  '/reporteMovimiento/:id',
  movimientoController.obtenerReporteMovimientoPorId,
)

export default router
