import express, { type Router } from 'express'
import { container } from 'tsyringe'
import { FacturaController } from '../controllers/factura.controller'
// import { estaAutenticado } from '../middlewares/auth.middleware'

const router: Router = express.Router()

/*
  Obtiene una instancia del controlador de productos (ProductoController) resuelto por el contenedor de dependencias (tsyringe).
  Esta instancia se utiliza para llamar a los métodos del controlador de productos en las rutas definidasen el router.
*/
const facturaController: FacturaController =
  container.resolve(FacturaController)

// router.use(estaAutenticado)

router.post('/registrar', facturaController.registrarFactura)
router.get('/', facturaController.obtenerFacturas)
router.get('/:id', facturaController.obtenerFacturaPorId)
router.post('/registrar/sender', facturaController.registrarSender)
router.post('/registrar/details', facturaController.registrarDetails)
router.post('/registrar/receiver', facturaController.registrarReceiver)
router.put('/:id', facturaController.actualizarFacturaPendiente)

export default router
