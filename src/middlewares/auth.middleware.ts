import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/config'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      nombreUsuario: string
    }
  }
}

export const estaAutenticado = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token

  const authorizationHeader = req.headers['authorization']
  if (authorizationHeader && authorizationHeader.startsWith('Bearer')) {
    token = authorizationHeader.split(' ')[1]
  }

  if (!token) {
    token = req.cookies.token
  }

  if (!token) {
    return res.status(401).json({ mensaje: 'No autorizado' })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jwt.verify(token, JWT_SECRET, (err: any, decodedToken: any) => {
    if (err) {
      return res.status(401).json({ mensaje: 'No autorizado' })
    } else {
      req.nombreUsuario = decodedToken.nombreUsuario
      next()
    }
  })
}
