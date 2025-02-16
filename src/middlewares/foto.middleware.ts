import type { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import {
  convertirArchivoABytes,
  esExtensionDeArchivoValida,
  esValidoElTamanoDeArchivo,
} from '../../utils/archivoUtils'

const upload = multer()

export const manejarArchivo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({
        error: 'El archivo de la foto es requerido',
      })
    }

    const maxSize = 2 * 1024 * 1024
    if (!esValidoElTamanoDeArchivo(file.size, maxSize)) {
      return res.status(400).json({
        error: `El tamaño del archivo no debe exceder ${maxSize / 1024 / 1024} MB`,
      })
    }

    const extensionesPermitidas = ['jpg', 'jpeg', 'png']
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase()
    if (
      !fileExtension ||
      !esExtensionDeArchivoValida(fileExtension, extensionesPermitidas)
    ) {
      return res.status(400).json({
        error: `La extensión del archivo debe ser una de las siguientes: ${extensionesPermitidas.join(', ')}`,
      })
    }

    file.buffer = await convertirArchivoABytes(file)

    next()
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const uploadMiddleware = upload.single('foto')
