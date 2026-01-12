# Backend: API y Socket.IO para Productos con chat en tiempo real

Este directorio contiene el código fuente del backend (API REST + WebSockets) para autenticación, catálogo de productos y chat en tiempo real.

## Instalación y puesta en marcha

### 0) Clonar el repositorio (paso previo obligatorio)
```bash
git clone https://github.com/Diegoza04/poducts-and-live-chat.git
```

### 1) Requisitos previos
- Node.js (recomendado v18+)
- npm (v8+)
- MongoDB (local o Atlas)

### 2) Configurar variables de entorno
Crea un archivo `.env` dentro de `server/` con valores como los siguientes (ajusta a tu entorno):

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/myapp
JWT_SECRET=la_llave_secreta
```

Notas:
- `PORT`: Puerto donde se levanta el backend.
- `MONGODB_URI`: Cadena de conexión de MongoDB (local o Atlas).
- `JWT_SECRET`: Clave para firmar y verificar JWT.

### 3) Instalar dependencias
Desde `server/` ejecuta:
```bash
npm install
```

### 4) Ejecutar en desarrollo
```bash
npm run dev
```

### 5) Ejecutar en producción
```bash
npm start
```

El servidor expone HTTP en `http://localhost:3000` y el endpoint de WebSocket en `/socket.io`. El frontend (Vite) usa un proxy hacia `http://localhost:3000` para `/api` y `/socket.io`.

## Lista de dependencias utilizadas y por qué se usan

Dependencias principales (package.json):
- express (^4.18.2)
  - Framework HTTP para definir rutas REST, middlewares y controladores.
- mongoose (^7.0.0)
  - ODM para modelar y acceder a MongoDB (definición de esquemas y validaciones).
- dotenv (^16.0.0)
  - Carga variables desde `.env` a `process.env` de forma segura.
- cors (^2.8.5)
  - Habilita CORS, permitiendo al frontend (5173) acceder a la API.
- jsonwebtoken (^9.0.0)
  - Firma y verificación de tokens JWT para autenticación de usuarios.
- bcryptjs (^2.4.3)
  - Hash y verificación de contraseñas en el proceso de registro/login.
- socket.io (^4.7.0)
  - Canal bidireccional en tiempo real para el chat (eventos, reconexión, salas).

### Nuevas dependencias:
- **@apollo/server** (^5.2.0): Configuración del servidor GraphQL, compatible con Express.
- **graphql** (^16.12.0): Biblioteca oficial para definir esquemas y trabajar con consultas/mutaciones GraphQL.
- **graphql-tag** (^2.12.6): Herramienta para definir consultas/mutaciones directamente en el código.

Dependencias de desarrollo:
- nodemon (^3.1.0)
  - Recarga automática del servidor al detectar cambios durante el desarrollo.

Scripts útiles:
- `npm run dev` → nodemon server.js
- `npm start` → node server.js

## Funcionalidades nuevas o destacadas

1. **API REST**
   - Endpoints para usuarios (`/api/auth`), productos (`/api/products`), historial de chat (`/api/chat`) y pedidos (`/api/admin/orders`).

2. **Integración GraphQL**
   - Queries y Mutations principales añadidas para productos, pedidos, usuarios.
   - Implementación avanzada de resolvers con validaciones contextuales:
     - `addOrder`
     - `updateOrderStatus`
     - `deleteUser`
     - `updateUserRole`.

3. **Administración completa de usuarios y pedidos**
   - Protección con middlewares (autenticación y permisos de administrador).
   - Endpoints: `/admin/users` y `/admin/orders`.

4. **WebSockets con autenticación JWT**
   - Emisión y recepción de mensajes seguros.
   - Broadcast en tiempo real entre usuarios autenticados.

5. **Modelos de datos avanzados**
   - `Order`: Incluye usuarios, productos, precio total y estados.
   - `Product`: Soporte para CRUD completo de productos.
   - `User`: Roles, inclusión de historial de órdenes.

---

## Estructura del backend

```
server/
├── .env                 # Variables de entorno
├── config.js            # Configuración inicial (dotenv, JWT_SECRET, etc.)
├── middleware/          # Middlewares (verificación de JWT, roles)
├── models/              # Esquemas Mongoose (User, Order, Product, etc.)
├── graphql/             # Esquema y resolutores para GraphQL
├── routes/              # Endpoints REST: Auth, Admin, Chat, Products
├── server.js            # Configuración principal: API + WebSockets + GraphQL
└── package.json         # Dependencias del backend
```

---

## GraphQL: Esquema y Queries disponibles

### Definición del esquema

```graphql
type User {
  id: ID!
  username: String!
  role: String!
  orders: [Order]
}

type Product {
  id: ID!
  title: String!
  description: String
  price: Float!
  image: String
}

type Order {
  id: ID!
  user: User!
  items: [OrderItem!]!
  status: String!
  createdAt: String!
  total: Float!
}

type Query {
  products: [Product!]
  orders: [Order!]
  order(id: ID!): Order
  users: [User!]!
}

type Mutation {
  addOrder(items: [OrderInput!]!): Order!
  updateOrderStatus(id: ID!, status: String!): Order
  deleteUser(id: ID!): String
  updateUserRole(id: ID!, role: String!): User
}

input OrderInput {
  product: ID!
  quantity: Int!
}
```

### Queries
- `products`: Lista de productos disponibles.
- `orders`: Lista de pedidos, incluyendo detalles de productos/usuarios.
- `users`: Consulta de usuarios (solo administradores).

### Mutations
- `addOrder(items: [OrderInput!]!)`: Crear un pedido.
- `updateOrderStatus(id: ID!, status: String!)`: Actualizar el estado de una orden.
- `deleteUser(id: ID!)`: Eliminar usuarios.
- `updateUserRole(id: ID!, role: String!)`: Modificar roles.

---

## Rutas REST principales

### Autenticación de usuarios
- `POST /api/auth/register`: Registro de usuarios (opcionalmente rol).
- `POST /api/auth/login`: Inicio de sesión (retorna JWT).

### Productos (CRUD)
- `GET /api/products`: Listado.
- `POST /api/products`: Crear (admin).
- `PUT /api/products/:id`: Actualizar (admin).
- `DELETE /api/products/:id`: Eliminar (admin).

### Pedidos (Admin)
- `GET /api/admin/orders`: Consultar todos los pedidos.
- `GET /api/admin/orders/:status`: Filtrar por estado (`completed`, etc.).
- `PUT /api/admin/orders/:id`: Modificar estado.

### Chat
- `GET /api/chat/history`: Ver historial de chat.

---

## Ejemplo: Pedido en GraphQL

1. **Crear Pedido (`addOrder`)**
   ```graphql
   mutation {
     addOrder(items: [{ product: "ID_PRODUCTO", quantity: 2 }]) {
       id
       total
       status
       items {
         product {
           title
         }
         quantity
         price
       }
     }
   }
   ```

2. **Actualizar Estado de Pedido (`updateOrderStatus`)**
   ```graphql
   mutation {
     updateOrderStatus(id: "ID_ORDER", status: "completed") {
       id
     }
   }
   ```

---

## Solución de problemas

- **Autenticación fallida**
  Asegurate de insertar el token vía `Authorization: Bearer <TOKEN>`.

- **Errores con GraphQL**
  Revisa el esquema definido, y verifica que el contexto (`user`) se reciba correctamente.

---

## ¿Cómo ejecutar y probar el backend?

- Inicia MongoDB y arranca el servidor:
  ```bash
  npm run dev
  ```
- Verifica el estado:
  - API base: `http://localhost:3000/` .
  - WebSocket: el cliente se conecta a `ws://localhost:3000/socket.io`.

Pruebas rápidas (con Postman/curl):

- Registro:
  ```
  POST http://localhost:3000/api/auth/register
  Content-Type: application/json

  {
    "username": "usuario1",
    "password": "contraseña_que_se_quiera_usar"
  }
  ```

-Registro como ADMIN:

  ```
  POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123",
  "role": "admin"
}

  ```
- Login:
  ```
  POST http://localhost:3000/api/auth/login
  Content-Type: application/json

  {
    "username": "usuario1",
    "password": "secreta"
  }
  ```
-Login como ADMIN:
 ```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

  ```
  Respuesta esperada: `{ "token": "..." }`

- Historial de chat (lo consume el frontend):
  ```
  GET http://localhost:3000/api/chat/history
  Authorization: Bearer <TOKEN_JWT>
  ```

- Productos (el catálogo del frontend consume endpoints bajo `/api/products`). Consulta los archivos de `routes/` para ver los endpoints disponibles (GET/POST/PUT/DELETE, según implementación).

Conexión WebSocket (desde el frontend):
- El cliente envía el token en el handshake:
  ```js
  io('/', { path: '/socket.io', auth: { token } })
  ```
- Eventos usados por el frontend:
  - Emisión: `chat:message`
  - Escucha: `chat:message`, `message` (mensajes genéricos), `connect`, `disconnect`, `connect_error`

## Decisiones tomadas durante el desarrollo

- Arquitectura Express + Mongoose
  - Permite rapidez de desarrollo y un modelo claro de datos en MongoDB.
  - Separación por carpetas (`routes/`, `models/`, `middleware/`) para mantener el código modular.

- Autenticación basada en JWT
  - Tokens firmados con `jsonwebtoken` y validados en middleware.
  - El frontend persiste el token y lo envía en `Authorization: Bearer <token>`.

- Seguridad y hashing de contraseñas
  - `bcryptjs` para almacenar contraseñas hash y comparar en login.
  - `JWT_SECRET` definido en `.env` para evitar exposición en el código.

- CORS controlado
  - `cors` limitado a `CORS_ORIGIN` (por defecto Vite en `http://localhost:5173`) para permitir sólo el frontend esperado.

- Chat en tiempo real con Socket.IO
  - Handshake autenticado (el cliente envía `auth: { token }`).
  - Eventos nominales (`chat:message`) y reconexión automática.

- DX y productividad
  - `nodemon` para hot-reload del servidor.
  - Variables externas en `.env` para despliegues y entornos distintos (dev/prod).

## Solución de problemas

- No conecta a MongoDB
  - Verifica `MONGODB_URI` en `.env` y que el servicio de MongoDB esté activo.
  - Revisa credenciales/whitelist si usas Atlas.

- 401/403 en endpoints o Socket.IO
  - Asegúrate de enviar `Authorization: Bearer <token>` en REST y `auth: { token }` en Socket.IO.

- Puerto en uso
  - Cambia `PORT` en `.env` o libera el puerto 3000.

- Versión de Node
  - Usa Node v18+ para mayor compatibilidad con las dependencias actuales (Express, Mongoose 7, Socket.IO 4.x).

---
