import express, { type Router } from 'express'
import { container } from 'tsyringe'
import { CategoriaController } from '../controllers/categorias.controller'
import { estaAutenticado } from '../middlewares/auth.middleware'

const router: Router = express.Router()

/*
  Obtiene una instancia del controlador de categorias (CategoriaController) resuelto por el contenedor de dependencias (tsyringe).
  Esta instancia se utiliza para llamar a los métodos del controlador de categorias en las rutas definidasen el router.
*/
const categoriaController: CategoriaController =
  container.resolve(CategoriaController)

router.use(estaAutenticado)

router.get('/', categoriaController.obtenerCategorias)
router.post('/registrar', categoriaController.registrarCategoria)
router.delete('/:id', categoriaController.eliminarCategoria)
router.put('/:id', categoriaController.actualizarCategoria)

export default router
