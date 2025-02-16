import { PORT } from './config'

export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Poskepper API',
      version: '1.0.0',
      description: 'API de Poskeeper',
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api`,
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
}
