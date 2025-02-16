import express, { type Router } from 'express'
import { OrdenController } from '../controllers/orden.controller'
import { estaAutenticado } from '../middlewares/auth.middleware'
import { Server } from 'socket.io'

const router: Router = express.Router()

/*
  Obtiene una instancia del controlador de ordenes (OrdenController) resuelto por el contenedor de dependencias (tsyringe).
  Esta instancia se utiliza para llamar a los metodos del controlador de ordenes en las rutas definidas en el router.
  Adicionalmente, se recibe el servidor de Socket.IO (io) como parametro en el constructor del controlador de ordenes.
*/

export default (io: Server): Router => {
  const ordenController = new OrdenController(io)

  router.use(estaAutenticado)

  router.post('/registrar', ordenController.registrarOrden)
  router.get('/', ordenController.obtenerOrdenes)
  router.put('/:idOrden/estado', ordenController.cambiarEstadoOrden)

  return router
}
