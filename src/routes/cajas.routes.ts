import express, { type Router } from 'express'
import { container } from 'tsyringe'
import { CajasController } from '../controllers/cajas.controller'
import { estaAutenticado } from '../middlewares/auth.middleware'

const router: Router = express.Router()

/*
  Obtiene una instancia del controlador de cajas (CajasController) resuelto por el contenedor de dependencias (tsyringe).
  Esta instancia se utiliza para llamar a los métodos del controlador de cajas en las rutas definidas en el router.
*/
const cajasController: CajasController = container.resolve(CajasController)

router.use(estaAutenticado)

router.post('/registrar', cajasController.registrarCaja)
router.get('/', cajasController.obtenerCajas)
router.delete('/:id', cajasController.eliminarCaja)
router.put('/:id', cajasController.actualizarCaja)
router.get('/:idUsuario/tieneCaja', cajasController.verificarCajaAsignada)
router.get('/disponibles', cajasController.obtenerCajasDisponibles)
router.post('/asignar', cajasController.asignarCaja)
router.put('/:idCaja/estado', cajasController.cambiarEstado)
router.get('/:idUsuario', cajasController.obtenerCajaPorUsuario)

export default router
