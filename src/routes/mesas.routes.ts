import express, { type Router } from 'express'
import { container } from 'tsyringe'
import { MesasController } from '../controllers/mesas.controller'
import { estaAutenticado } from '../middlewares/auth.middleware'

const router: Router = express.Router()

/*
  Obtiene una instancia del controlador de mesas (MesasController) resuelto por el contenedor de dependencias (tsyringe).
  Esta instancia se utiliza para llamar a los métodos del controlador de mesas en las rutas definidas en el router.
*/
const mesasController: MesasController = container.resolve(MesasController)

router.use(estaAutenticado)

router.post('/registrar', mesasController.registrarMesa)
router.get('/', mesasController.obtenerMesas)
router.delete('/:id', mesasController.eliminarMesa)
router.put('/:id', mesasController.actualizarMesa)

export default router
