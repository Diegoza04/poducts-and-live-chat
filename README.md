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

## Esquema de GraphQL

El proyecto utiliza GraphQL para gestionar la comunicación entre el servidor y el cliente. A continuación, se detalla el esquema actual:

### Definición del esquema (typeDefs):

```graphql
export const typeDefs = gql`
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

  type OrderItem {
    product: Product!
    quantity: Int!
    price: Float!
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
`;
```

### Queries y Mutations principales

#### Queries:
- **`products`**: Obtiene la lista de productos disponibles.
- **`orders`**: Recupera la lista de pedidos realizados.
- **`order(id: ID!)`**: Busca un pedido específico por su ID.
- **`users`**: Devuelve la lista de usuarios registrados.

#### Mutations:
- **`addOrder(items: [OrderInput!]!)`**: Añade un nuevo pedido con los ítems especificados.
- **`updateOrderStatus(id: ID!, status: String!)`**: Actualiza el estado de un pedido existente.
- **`deleteUser(id: ID!)`**: Elimina un usuario según su ID.
- **`updateUserRole(id: ID!, role: String!)`**: Modifica el rol de un usuario.

### Decisiones de diseño
- Se implementó GraphQL con Apollo Server para una gestión eficiente de las operaciones del backend.
- Se dividieron las operaciones en queries y mutations para mejorar la estructura y claridad del esquema.
- El esquema está diseñado para admitir roles (usuarios y administradores) mediante autenticación avanzada.


## Gestión de usuarios (solo administradores)

Esta funcionalidad permite a los administradores gestionar los usuarios de la plataforma. Las operaciones principales son:

- **Consultar usuarios**: Visualizar la lista de usuarios registrados en el sistema.
- **Eliminar usuarios**: Permitir que el administrador elimine cuentas innecesarias o no autorizadas.
- **Modificar usuarios**: Actualizar información, como roles o permisos.

> **Nota:** Estas funciones están protegidas mediante autenticación y roles. Solo los administradores pueden acceder a estas rutas o mutations.

## Gestión de pedidos (solo administradores)

Los pedidos realizados por los usuarios pueden ser gestionados por los administradores para garantizar el seguimiento adecuado. Las operaciones incluyen:

- **Visualización de pedidos**: Acceso a la lista de pedidos realizados, incluyendo datos del usuario y estado del pedido.
- **Actualización de estados**: Los administradores pueden cambiar el estado de un pedido (pendiente, en proceso, completado, cancelado, etc.).
- **Cancelación de pedidos**: Posibilidad de realizar la cancelación de pedidos en caso de inconsistencias o solicitudes de los usuarios.

> **Nota:** Estas operaciones están restringidas por un middleware de autenticación, asegurando que solo el rol de administrador pueda acceder a estas funcionalidades.

## Estructura del proyecto

```
/
├── client/   # Frontend (React + Vite + Tailwind + Socket.IO client)
├── server/   # Backend (Express + Mongoose + JWT + Socket.IO server + Apollo/server + Graphql-Tag)
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

#### Tecnologías de GraphQL:
- **@apollo/server**: Configuración del servidor GraphQL.
- **graphql**: Biblioteca base para esquemas y definiciones de resolutores.
- **graphql-tag**: Utilidad para parsear y usar queries GraphQL.

## Tecnologías

| Capa     | Tecnologías |
|----------|-------------|
| Frontend | React 19, Vite 7, TailwindCSS, Framer Motion, Socket.IO Client |
| Backend  | Node.js, Express, Mongoose, Socket.IO, JWT, bcryptjs |
| GraphQL  | Apollo Server, GraphQL.js                            |
| Base de datos | MongoDB                                         |
| Autenticación | JSON Web Tokens (JWT)                          |


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
