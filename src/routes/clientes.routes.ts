import express, { type Router } from 'express'
import { container } from 'tsyringe'
import { ClienteController } from '../controllers/clientes.controller'
import { estaAutenticado } from '../middlewares/auth.middleware'

const router: Router = express.Router()

/*
  Obtiene una instancia del controlador de productos (ProductoController) resuelto por el contenedor de dependencias (tsyringe).
  Esta instancia se utiliza para llamar a los métodos del controlador de productos en las rutas definidasen el router.
*/
const clienteController: ClienteController =
  container.resolve(ClienteController)

router.use(estaAutenticado)

router.post('/registrar', clienteController.registrarCliente)
router.get('/', clienteController.obtenerListadoClientes)
router.get('/:id', clienteController.obtenerClientePorIdentificacion)
router.put('/:id', clienteController.actualizarCliente)
router.delete('/:id', clienteController.eliminarCliente)

export default router
