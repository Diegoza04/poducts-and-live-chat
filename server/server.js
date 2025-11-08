import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes from './routes/authroutes.js'
import productRoutes from './routes/productroutes.js'
import chatRoutes from './routes/chatroutes.js'
import { authenticateSocket } from './middleware/authenticateJWT.js'
import { setupChat } from './config.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })


app.use(cors())
app.use(express.json())


app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/chat', chatRoutes)


io.use(authenticateSocket)
io.on('connection', (socket) => setupChat(io, socket))


app.use(express.static(path.join(__dirname, 'src')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'))
})


const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/practica1'

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB')
    server.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`))
  })
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err))
