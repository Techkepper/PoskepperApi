import { createServer } from 'http'
import { Server } from 'socket.io'
import { app, configureRoutesWithSocket } from './app'
import { ORIGIN, PORT } from './config/config'
import Logger from './libs/logger'

// Inicialización del servidor
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: ORIGIN,
    credentials: true,
  },
})

// Configuración de rutas con Socket.IO
configureRoutesWithSocket(io)

// Configuración de Socket.IO
io.on('connection', (socket) => {
  Logger.info('Client connected to cocina')

  socket.on('disconnect', () => {
    Logger.info('Client disconnected from cocina')
  })
})

//Inicia el servidor
server.listen({ port: PORT }, () => {
  //Logger.info(`Server running on port ${PORT}`)
  const addressInfo = server.address()
  const host = typeof addressInfo === 'string' ? addressInfo : addressInfo?.address
  const actualHost = host === '::' ? 'localhost' : host // Handle IPv6 case
  Logger.info(`Socket.IO server running at: http://${actualHost}:${PORT}`)
})