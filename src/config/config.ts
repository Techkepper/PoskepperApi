import dotenv from 'dotenv'

dotenv.config()

export const JWT_SECRET = process.env.JWT_SECRET || 'secret'
export const PORT = process.env.PORT || 3000
export const ORIGIN = process.env.ORIGIN || 'http://localhost:5000'

export const EMAIL_CONFIG = {
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_SERVICE: process.env.EMAIL_SERVICE,
  EMAIL_FROM: process.env.EMAIL_FROM,
}
