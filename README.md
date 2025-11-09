# Portal de productos con autenticacion y chat en tiempo real

Portal de productos con autenticación y chat en tiempo real.  
El proyecto está dividido en dos partes: un frontend (client) construido con React + Vite y un backend (server) con Express, MongoDB y Socket.IO.  
Permite a los usuarios registrarse, iniciar sesión, ver productos, gestionar carrito y comunicarse mediante un chat en tiempo real autenticado.

## Características principales

- Autenticación JWT (registro / login).
- Catálogo de productos (CRUD en el backend; listado y visualización en el frontend).
- Carrito de compras (persistencia lógica del lado cliente y operaciones desde la API).
- Chat en tiempo real con Socket.IO (mensajería instantánea entre usuarios autenticados).
- Interfaz moderna con React 19, TailwindCSS y animaciones con Framer Motion.
- API REST estructurada + WebSockets en un mismo servidor.
- Proxy de desarrollo (el frontend consume la API y el socket sin configuración adicional).

## Estructura del proyecto

```
/
├── client/   # Frontend (React + Vite + Tailwind + Socket.IO client)
├── server/   # Backend (Express + Mongoose + JWT + Socket.IO server)
├── README.md # (este archivo)
```

### client/
Frontend SPA:
- Rutas protegidas (react-router-dom).
- Manejo de token y roles (jwt-decode).
- Chat con reconexión y scroll automático.
- Estilos utilitarios con TailwindCSS.
- Animaciones con Framer Motion.

Más detalles en [client/README.md](client/README.md).

### server/
Backend API + WebSocket:
- Endpoints para autenticación (`/api/auth/*`), productos (`/api/products/*`), chat (`/api/chat/history`).
- Conexión a MongoDB (Mongoose).
- Hash de contraseñas (bcryptjs).
- Emisión y recepción de eventos de chat (Socket.IO).
- Configuración por variables de entorno.

Más detalles en [server/README.md](server/README.md).

## Tecnologías

| Capa     | Tecnologías |
|----------|-------------|
| Frontend | React 19, Vite 7, TailwindCSS, Framer Motion, Socket.IO Client |
| Backend  | Node.js, Express, Mongoose, Socket.IO, JWT, bcryptjs |
| Base de datos | MongoDB |
| Autenticación | JSON Web Tokens (JWT) |


## Flujo general

1. El usuario se registra o inicia sesión (token JWT recibido).
2. El token se guarda en el navegador (localStorage).
3. El frontend consume `/api/products` para listar productos.
4. El chat se conecta vía Socket.IO enviando `auth: { token }`.
5. Los mensajes se persisten y el historial se obtiene desde `/api/chat/history`.
6. Operaciones del carrito y productos via REST (según permisos y rol).



## Seguridad 

- Tokens firmados con `JWT_SECRET`.
- Contraseñas hash con bcryptjs (no se almacenan en texto plano).
- CORS restringido por origen.
- Rutas protegidas en frontend (redirección a login si falta token).
- Middleware de autenticación en backend (ver rutas protegidas).

## Chat en tiempo real 
- Handshake autenticado: el cliente adjunta el token.
- Eventos:
  - Cliente emite: `chat:message`
  - Servidor difunde a todos los conectados autenticados.
- Reconexión automática configurada en el cliente (intentos y delays).
- Historial disponible vía REST para consistencia al recargar.
