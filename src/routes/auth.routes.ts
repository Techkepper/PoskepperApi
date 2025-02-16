import express, { type Router } from 'express'
import { container } from 'tsyringe'
import { AuthController } from '../controllers/auth.controller'
import { estaAutenticado } from '../middlewares/auth.middleware'

const authRouter: Router = express.Router()

/*
  Obtiene una instancia del controlador de autenticación (AuthController) resuelto por el contenedor de dependencias (tsyringe).
  Esta instancia se utiliza para llamar a los métodos del controlador de autenticación en las rutas definidas en el router.
*/
const authController: AuthController = container.resolve(AuthController)

authRouter.post('/iniciar-sesion', authController.iniciarSesion)

authRouter.get('/mi-perfil', estaAutenticado, authController.miPerfil)

authRouter.post('/cerrar-sesion', authController.cerrarSesion)

authRouter.post(
  '/solicitar-token-recuperacion',
  authController.solicitarTokenRecuperacion,
)

authRouter.post('/verificar-token', authController.verificarToken)

authRouter.post('/cambiar-contrasenna', authController.cambiarContrasenna)

authRouter.post(
  '/eliminar-mi-cuenta',
  estaAutenticado,
  authController.eliminarMiCuenta,
)

authRouter.post(
  '/restablecer-mi-contrasenna',
  estaAutenticado,
  authController.actualizarContrasennaMiCuenta,
)

export default authRouter
