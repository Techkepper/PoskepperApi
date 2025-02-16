import express, { type Router } from 'express'
import { UtilController } from '../../utils/obtenerHoraBD'
import { container } from 'tsyringe'

const router: Router = express.Router()

/*
Obtiene una instancia del controlador de utilidades (UtilController) resuelto por el contenedor de dependencias (tsyringe).
Esta instancia se utiliza para llamar a los metodos del controlador de utilidades en las rutas definidas en el router.
*/

const utilConroller: UtilController = container.resolve(UtilController)

router.get('/hora', utilConroller.obtenerHoraBD)

export default router
