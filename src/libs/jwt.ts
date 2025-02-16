import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/config'

interface Payload {
  nombreUsuario: string
}

export const crearTokenAcceso = (nombreUsuario: string): Promise<string> => {
  const payload: Payload = { nombreUsuario }

  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) reject(err)
      else resolve(token as string)
    })
  })
}
