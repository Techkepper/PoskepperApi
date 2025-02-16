import 'reflect-metadata'
import './containers/di-container'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { type Application } from 'express'
import path from 'path'
import { Server } from 'socket.io'
import swaggerJsDoc from 'swagger-jsdoc'
import SwaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'
import { ORIGIN, PORT } from './config/config'
import { options as swaggerOptions } from './config/swaggerOptions'
import morganMiddleware from './middlewares/morgan.middleware'
import {
  auth,
  cajas,
  categorias,
  clientes,
  facturas,
  mesas,
  movimientos,
  ordenes,
  productos,
  toma,
  usuarios,
  utils,
  mermas,
} from './routes'

const app: Application = express()

// Configuración del servidor
app.set('port', PORT)

// Middlewares
app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  }),
)
app.use(morganMiddleware)
app.use(cookieParser())
app.use(express.json())

// Rutas de la aplicación
app.use('/api/usuarios', usuarios)
app.use('/api/auth', auth)
app.use('/api/productos', productos)
app.use('/api/clientes', clientes)
app.use('/api/categorias', categorias)
app.use('/api/mesas', mesas)
app.use('/api/cajas', cajas)
app.use('/api/toma', toma)
app.use('/api/utils', utils)
app.use('/api/facturas', facturas)
app.use('/api/movimientos', movimientos)
app.use('/api/mermas', mermas)

// Exporta app sin instanciar ordenes
export { app }

// Configuración de rutas con Socket.IO
export const configureRoutesWithSocket = (io: Server): void => {
  app.use('/api/ordenes', ordenes(io))
}

// Swagger
const usuariosDocument = YAML.load(
  path.resolve(__dirname, '../docs/usuarios.yml'),
)
const authDocument = YAML.load(path.resolve(__dirname, '../docs/auth.yml'))
const productosDocument = YAML.load(
  path.resolve(__dirname, '../docs/productos.yml'),
)
const mesasDocument = YAML.load(path.resolve(__dirname, '../docs/mesas.yml'))
const categoriasDocument = YAML.load(
  path.resolve(__dirname, '../docs/categorias.yml'),
)
const cajasDocument = YAML.load(path.resolve(__dirname, '../docs/cajas.yml'))
const clientesDocument = YAML.load(
  path.resolve(__dirname, '../docs/clientes.yml'),
)

const swaggerDocument = {
  ...swaggerJsDoc(swaggerOptions),
  paths: {
    ...usuariosDocument.paths,
    ...authDocument.paths,
    ...productosDocument.paths,
    ...mesasDocument.paths,
    ...categoriasDocument.paths,
    ...cajasDocument.paths,
    ...clientesDocument.paths,
  },
  components: {
    ...usuariosDocument.components,
    ...authDocument.components,
    ...productosDocument.components,
    ...mesasDocument.components,
    ...categoriasDocument.components,
    ...cajasDocument.components,
    ...clientesDocument.components,
  },
  tags: [
    ...usuariosDocument.tags,
    ...authDocument.tags,
    ...productosDocument.tags,
    ...mesasDocument.tags,
    ...categoriasDocument.tags,
    ...cajasDocument.tags,
    ...clientesDocument.tags,
  ],
}

app.use('/api/docs', SwaggerUI.serve, SwaggerUI.setup(swaggerDocument))
