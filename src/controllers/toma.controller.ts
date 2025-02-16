import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import xlsx from 'xlsx'
import { type ITomaRepository } from '../interfaces/ITomaRepository'
import { join } from 'path'
import { generateReport } from '../../utils/generarReporteDiferencias'
import { generateReportHastaHoy } from '../../utils/genenarReporteSnapshot'

/**
 * Controlador para manejar las operaciones relacionadas con las tomas físicas.
 */
export class TomaController {
  private tomaRepository: ITomaRepository

  /**
   * Constructor del controlador.
   * Se encarga de inicializar la instancia del repositorio de tomas.
   */
  constructor() {
    this.tomaRepository = container.resolve<ITomaRepository>('TomaRepository')
  }

  /**
   * Registra una nueva toma física.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  registrarToma = async (req: Request, res: Response) => {
    try {
      const { fechaToma, motivo, idUsuario } = req.body

      if (!fechaToma || !motivo || !idUsuario) {
        res.status(400).json({
          error: 'Todos los campos son requeridos para registrar una toma',
        })
        return
      }

      const toma = await this.tomaRepository.registrar({
        fechaToma,
        motivo,
        idUsuario,
      })
      if (!toma) {
        res.status(500).json({ error: 'No se pudo registrar la toma' })
        return
      }

      res.status(201).json({ mensaje: 'Datos sobre la toma registrados' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Ingresa una nueva toma física (producto y cantidad) a una toma existente.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  agregarProductoAToma = async (req: Request, res: Response) => {
    try {
      const { nombre, cantidad } = req.body

      if (!nombre || !cantidad) {
        res.status(400).json({
          error:
            'Todos los campos son requeridos para agregar un producto a la toma',
        })
        return
      }

      if (cantidad <= 0) {
        res.status(400).json({ error: 'La cantidad debe ser mayor a 0' })
        return
      }

      if (typeof cantidad !== 'number') {
        res.status(400).json({ error: 'La cantidad debe ser un número' })
        return
      }

      const productoExistente =
        await this.tomaRepository.existeNombreProducto(nombre)
      if (!productoExistente) {
        res.status(404).json({ error: 'El producto no existe' })
        return
      }

      const tomaProducto = await this.tomaRepository.agregarProductoAToma(
        nombre,
        cantidad,
      )
      if (!tomaProducto) {
        res
          .status(500)
          .json({ error: 'No se pudo agregar el producto a la toma' })
        return
      }

      res
        .status(201)
        .json({ mensaje: 'Producto agregado a la toma correctamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Sube un archivo Excel con productos y cantidades para agregar a la toma.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  subirExcel = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo' })
      }

      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' })

      if (
        !workbook ||
        !workbook.SheetNames ||
        workbook.SheetNames.length === 0
      ) {
        return res.status(400).json({
          error: 'El archivo Excel está vacío o no se pudo leer correctamente',
        })
      }

      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]

      // Convertir la hoja Excel a un array de objetos
      const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 }) as (
        | string
        | number
      )[][]

      // Filtrar filas vacías o no válidas
      const [headers, ...rows] = data.filter((row) =>
        row.some((cell) => !!cell),
      )

      if (
        !headers ||
        headers.length < 2 ||
        headers[0] !== 'nombre' ||
        headers[1] !== 'cantidad'
      ) {
        return res.status(400).json({
          error:
            'El formato del archivo Excel es incorrecto o no tiene las cabeceras esperadas',
        })
      }

      if (rows.length === 0) {
        return res
          .status(400)
          .json({ error: 'El archivo Excel no contiene datos' })
      }

      const errores: string[] = []
      const productosAgregados: string[] = []

      // Verificar si hay datos fuera de las columnas A y B
      for (const [index, row] of rows.entries()) {
        if (row.length > 2) {
          errores.push(
            `Fila ${index + 2}: He encontrado productos fuera de los rangos permitidos (columnas A y B). Por favor, asegúrate de que los datos estén solo en las columnas A y B.`,
          )
        }
      }

      for (const [index, row] of rows.entries()) {
        const [nombre, cantidad] = row

        if (!nombre || cantidad === undefined) {
          errores.push(`Fila ${index + 2}: Todos los campos son requeridos`)
          continue
        }

        const cantidadNumerica = Number(cantidad)

        if (isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
          errores.push(
            `Fila ${index + 2}: La cantidad debe ser un número mayor a 0`,
          )
          continue
        }

        const productoExistente =
          await this.tomaRepository.existeNombreProducto(nombre as string)
        if (!productoExistente) {
          errores.push(`Fila ${index + 2}: El producto ${nombre} no existe`)
          continue
        }

        const tomaProducto = await this.tomaRepository.agregarProductoAToma(
          nombre as string,
          cantidadNumerica,
        )
        if (!tomaProducto) {
          errores.push(
            `Fila ${index + 2}: No se pudo agregar el producto ${nombre} a la toma`,
          )
        } else {
          productosAgregados.push(
            `Fila ${index + 2}: Producto ${nombre} agregado con cantidad ${cantidadNumerica}`,
          )
        }
      }

      if (errores.length > 0 || productosAgregados.length > 0) {
        const mensaje = errores.concat(productosAgregados).join('; ')
        return res.status(400).json({ error: mensaje })
      }

      return res.status(201).json({
        mensaje: 'Productos agregados correctamente desde el archivo Excel',
      })
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Descarga un archivo Excel de ejemplo para subir productos a la toma.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  descargarExcelEjemplo = async (req: Request, res: Response) => {
    try {
      // Ruta al archivo de ejemplo en la carpeta resources
      const filePath = join(
        __dirname,
        '../../resources/productos-toma-plantilla.xlsx',
      )

      res.download(filePath, 'productos-toma-plantilla.xlsx', (err) => {
        if (err) {
          res.status(500).json({ error: 'Error al descargar el archivo' })
        }
      })
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene un reporte de todos los productos en la toma.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  obtenerReporteDatos = async (req: Request, res: Response) => {
    try {
      const productos =
        await this.tomaRepository.obtenerTodosProductosReporteDatos()

      if (!productos) {
        res.status(404).json({ error: 'No se encontraron productos' })
        return
      }

      res.setHeader(
        'Content-disposition',
        'attachment; filename=reporte-inventario.pdf',
      )
      res.setHeader('Content-type', 'application/pdf')

      generateReport(productos, res)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  /**
   * Obtiene un reporte de todos los productos en la toma hasta la fecha de hoy.
   * @param req - Objeto de solicitud Express.
   * @param res - Objeto de respuesta Express.
   */
  obtenerReporteDatosHastaHoy = async (req: Request, res: Response) => {
    try {
      const productos =
        await this.tomaRepository.obtenerTodosProductosReporteDatos()

      if (!productos) {
        res.status(404).json({ error: 'No se encontraron productos' })
        return
      }

      res.setHeader(
        'Content-disposition',
        'attachment; filename=reporte-inventario.pdf',
      )
      res.setHeader('Content-type', 'application/pdf')

      generateReportHastaHoy(productos, res)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
