import express, { type Router } from 'express'
import { container } from 'tsyringe'
import multer from 'multer'
import { TomaController } from '../controllers/toma.controller'
import { estaAutenticado } from '../middlewares/auth.middleware'

const router: Router = express.Router()

// Configuración de multer para guardar el archivo en la memoria
const upload = multer({ storage: multer.memoryStorage() })

/*
    Obtiene una instancia del controlador de tomas (TomaController) resuelto por el contenedor de dependencias (tsyringe).
    Esta instancia se utiliza para llamar a los métodos del controlador de tomas en las rutas definidas en el router.
*/

const tomaController: TomaController = container.resolve(TomaController)

router.use(estaAutenticado)

router.post('/registrar', tomaController.registrarToma)
router.post('/agregar-producto', tomaController.agregarProductoAToma)
router.post('/subir-excel', upload.single('file'), tomaController.subirExcel)
router.get('/descargar-excel', tomaController.descargarExcelEjemplo)
router.get('/reporte-datos', tomaController.obtenerReporteDatos)
router.get('/reporte-estado', tomaController.obtenerReporteDatosHastaHoy)

export default router
