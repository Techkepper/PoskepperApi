import express, { type Router } from 'express'
import { container } from 'tsyringe'
import { UsuarioController } from '../controllers/usuarios.controller'
import { estaAutenticado } from '../middlewares/auth.middleware'

const router: Router = express.Router()

/*
  Obtiene una instancia del controlador de usuarios (UsuarioController) resuelto por el contenedor de dependencias (tsyringe).
  Esta instancia se utiliza para llamar a los métodos del controlador de usuarios en las rutas definidas en el router.
*/
const usuarioController: UsuarioController =
  container.resolve(UsuarioController)

router.use(estaAutenticado)

router.post('/registrar', usuarioController.registrarUsuario)
router.get('/', usuarioController.obtenerTodosLosUsuarios)
router.get('/roles', usuarioController.obtenerRoles)
router.get('/:id', usuarioController.obtenerUsuarioPorIdentificacion)
router.put('/:id', usuarioController.actualizarUsuario)
router.delete('/:id', usuarioController.eliminarUsuario)
router.post('/comisiones', usuarioController.obtenerComisionesMeseros)
router.post(
  '/reporte/comision',
  usuarioController.obtenerReporteComisionesMesero,
)
router.get('/meseros/ordenes', usuarioController.obtenerMeserosConOrdenes)

export default router
