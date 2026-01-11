import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importaciones necesarias
import jwt from 'jsonwebtoken';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone'; // Usamos Apollo standalone
import { typeDefs } from './graphql/schema.js'; // Esquema GraphQL
import { resolvers } from './graphql/resolvers.js'; // Resolvers para Apollo Server
import { JWT_SECRET } from './config.js'; // Clave secreta importada de config.js

// Rutas REST y middlewares
import authRoutes from './routes/authroutes.js';
import productRoutes from './routes/productroutes.js';
import chatRoutes from './routes/chatroutes.js';
import { authenticateSocket } from './middleware/authenticateJWT.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
  path: '/socket.io',
});

// Middleware global de Express
app.use(cors());
app.use(express.json());

// Configuración de Apollo Server (GraphQL)
async function startGraphQLServer() {
  const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(graphqlServer, {
    listen: { port: 4000 }, // Apollo Server en puerto separado
    context: async ({ req }) => {
      const token = req.headers.authorization?.split(' ')[1]; // Extrae la token del header
      console.log('---------------');
      console.log('Token recibido para verificación:', token); // Registro del token recibido
      console.log('JWT_SECRET actual:', JWT_SECRET); // Registro de la clave secreta para depuración

      if (!token) {
        console.warn('No token provided. Context will be empty.');
        return {}; // Si no hay token, devuelve un contexto vacío
      }
      try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verifica el token JWT con la clave secreta
        console.log('Usuario decodificado correctamente:', decoded); // Registro del usuario decodificado
        return { user: decoded }; // Si la token es válida, pasa el usuario autenticado al contexto
      } catch (err) {
        console.error('Error validando la token JWT:', err.message); // Registro si la verificación falla
        return {}; // Si falla la verificación de la token, devuelve un contexto vacío
      }
    },
  });

  console.log(`🚀 Servidor GraphQL disponible en ${url}`);
}

// Montar las rutas REST en Express
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);

// Configuración de Socket.IO para operaciones de chat
io.use(authenticateSocket);
io.on('connection', (socket) => {
  socket.emit('message', {
    user: 'System',
    message: `Bienvenido ${socket.user?.username || 'usuario'}`,
    createdAt: new Date().toISOString(),
  });
  socket.on('chat:message', (payload) => {
    const msg = {
      user: socket.user?.username || 'Anon',
      message: String(payload?.message || '').slice(0, 500),
      createdAt: new Date().toISOString(),
    };
    socket.broadcast.emit('chat:message', msg);
  });
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'src')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Configuración del puerto y conexión MongoDB
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/practica1';

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Conectado a MongoDB');
    await startGraphQLServer(); // Inicia el servidor Apollo GraphQL
    server.listen(PORT, () =>
      console.log(`🚀 Servidor principal corriendo en http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error('❌ Error de conexión a MongoDB:', err));