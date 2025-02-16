import express, { type Router } from 'express'
import { container } from 'tsyringe'
import { MermaController } from '../controllers/merma.controller'
import { estaAutenticado } from '../middlewares/auth.middleware'

const router: Router = express.Router()

/*
  Obtiene una instancia del controlador de usuarios (UsuarioController) resuelto por el contenedor de dependencias (tsyringe).
  Esta instancia se utiliza para llamar a los métodos del controlador de usuarios en las rutas definidas en el router.
*/
const mermaController: MermaController = container.resolve(MermaController)

router.use(estaAutenticado)

router.post('/registrar', mermaController.registrar)
router.get('/', mermaController.obtenerTodos)

export default router
