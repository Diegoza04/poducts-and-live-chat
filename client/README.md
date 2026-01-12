# Frontend: Portal de productos con autenticación y chat en tiempo real.


Este directorio contiene el código fuente del **frontend** para el portal de productos con autenticación y chat en tiempo real.

## Instalación de dependencias

### 1. Requisitos previos
- Node.js (recomendado v18+)
- npm (v8+)

### 2. Instalación rápida

 Clonar el repositorio (paso previo obligatorio)
```bash
git clone https://github.com/Diegoza04/poducts-and-live-chat.git
```

Dentro de la carpeta `client`, ejecuta:

```bash
npm install
```

Esto instalará automáticamente todas las dependencias listadas en el archivo package.json.

#### 3. Lista de dependencias utilizadas

**Dependencias principales:**
- `react`: ^19.1.1  
- `react-dom`: ^19.1.1  
- `react-router-dom`: ^7.9.5  
- `socket.io-client`: ^4.8.1  
- `classnames`: ^2.5.1  
- `framer-motion`: ^12.23.24  
- `jwt-decode`: ^4.0.0  

**Dependencias de desarrollo:**
- `vite`: ^7.1.7  
- `@vitejs/plugin-react`: ^5.0.4  
- `eslint`: ^9.36.0  
- `@eslint/js`: ^9.36.0  
- `eslint-plugin-react-hooks`: ^5.2.0  
- `eslint-plugin-react-refresh`: ^0.4.22  
- `@types/react`: ^19.1.16  
- `@types/react-dom`: ^19.1.9  
- `autoprefixer`: ^10.4.21  
- `postcss`: ^8.5.6  
- `tailwindcss`: ^3.4.18  
- `globals`: ^16.4.0

## Lista de dependencias utilizadas y por qué se usan

Dependencias principales:
- react (^19.1.1) y react-dom (^19.1.1)
  - Base de la UI y renderizado.
  - Uso en: toda la app (por ejemplo, `src/App.jsx`, `src/main.jsx`).

- react-router-dom (^7.9.5)
  - Navegación SPA, rutas y Outlet para vistas anidadas.
  - Uso en: `src/App.jsx` (Outlet) y hooks de navegación en `src/pages/chat.jsx`, `src/pages/login.jsx`.

- socket.io-client (^4.8.1)
  - Comunicación en tiempo real para el chat (WebSocket + fallback).
  - Uso en: `src/pages/chat.jsx` (conexión, reconexión, emisión y escucha de eventos).

- classnames (^2.5.1)
  - Composición condicional de clases CSS.
  - Uso en: componentes con estilos condicionales (por ejemplo, burbujas del chat).

- framer-motion (^12.23.24)
  - Animaciones y transiciones fluidas en la UI.
  - Uso en: `src/App.jsx` (`<motion.div>` para transiciones de contenido).

- jwt-decode (^4.0.0)
  - Decodificar información del usuario y roles desde el JWT.
  - Uso en: `src/utils/auth.js` (decodifica y expone utilidades como `getUserFromToken()`).

Dependencias de desarrollo:
- vite (^7.1.7) y @vitejs/plugin-react (^5.0.4)
  - Entorno de desarrollo rápido (HMR), build optimizado y soporte para React Fast Refresh.
  - Configuración: `vite.config.js` (proxy de `/api` y `/socket.io` hacia `http://localhost:3000`).

- eslint (^9.36.0), @eslint/js (^9.36.0), eslint-plugin-react-hooks (^5.2.0), eslint-plugin-react-refresh (^0.4.22), globals (^16.4.0)
  - Linting, reglas recomendadas, mejores prácticas con hooks y contexto de navegador.
  - Configuración: `eslint.config.js`.

- tailwindcss (^3.4.18), postcss (^8.5.6), autoprefixer (^10.4.21)
  - Estilos utilitarios, compatibilidad de prefijos CSS y pipeline de estilos.
  - Configuración: `tailwind.config.js`, `postcss.config.js`; estilos en `src/styles.css`.

- @types/react (^19.1.16), @types/react-dom (^19.1.9)
  - Tipos para mejorar DX en editores, aunque el proyecto esté en JS.

---

## ¿Qué hay de nuevo?

### Cambios recientes destacados:
#### 1. Configuración de WebSocket
- La funcionalidad de chat en tiempo real se habilita mediante **Socket.IO**.
- Configuración Proxy en `vite.config.js`:
  - `'/socket.io'` se conecta con el backend WebSocket en `ws://localhost:3000`.

#### 2. Interacción con GraphQL
- Se agregó el método `graphqlFetch()` en el archivo `services/api.js`:
  - Este método permite interactuar con servicios GraphQL utilizando consultas y mutaciones.
- Proxy agregado para la ruta `'/graphql'` en `vite.config.js`.

#### 3. Rutas protegidas y lógica basada en roles
- Se añadió una validación de roles de usuario (`admin`, `user`) en `client/src/main.jsx`.
- Rutas de administración (`/admin/orders` y `/admin/users`) son accesibles únicamente para usuarios **admin**.

#### 4. Estructura modular de administración
- Se han añadido dos nuevas páginas en `client/src/pages/admin/`:
  - **`ordersAdmin.jsx`:** Para la gestión de órdenes.
  - **`usersAdmin.jsx`:** Para la gestión de usuarios.
- Estas páginas consumen datos del backend utilizando GraphQL y utilizan componentes compartidos (e.g., **Button**, **Card**).

#### 5. Componente reutilizable: `Button`
- El archivo `client/src/components/UI/Button.jsx` contiene un componente `Button` extremadamente estilizado y reutilizable.
  - Soporta variantes como `primary`, `ghost` y `danger`.

#### 6. Contexto del carrito (`CartContext.jsx`):
- Ahora el estado del carrito persiste mediante el almacenamiento en local (`localStorage`).
- Se calcula el total de productos y precio automáticamente.

---

## ¿Cómo ejecutar el frontend?

Puedes iniciar el servidor de desarrollo con:

```bash
npm run dev
```

O bien, para construir la aplicación para producción:

```bash
npm run build
```

La vista previa de producción puede ejecutarse con:

```bash
npm run preview
```

La aplicación se inicia por defecto en [http://localhost:3000](http://localhost:3000).

## ¿Cómo probar el frontend?

- Asegúrate de tener el backend corriendo adecuadamente.
- Regístrate o accede con tus credenciales para probar autenticación.
- Prueba el chat en tiempo real enviando mensajes desde diferentes ventanas o navegadores.
- Navega por los productos y utiliza las distintas funcionalidades disponibles.

## Estructura de la carpeta `client/`

A continuación se muestra la estructura detallada y profunda de archivos y carpetas del frontend, incluyendo los módulos principales, subcarpetas y archivos relevantes para el desarrollo.

```
client/
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── public/
├── src/
│   ├── App.jsx
│   ├── assets/
│   ├── components/
│   │   ├── NavBar.jsx
│   │   ├── productForm.jsx
│   │   └── UI/
│   │       ├── Button.jsx
│   │       └── Card.jsx
│   ├── context/
│   │   └── cartContext.jsx
│   ├── main.jsx
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── ordersAdmin.jsx
│   │   │   └── usersAdmin.jsx
│   │   ├── cart.jsx
│   │   ├── chat.jsx
│   │   ├── login.jsx
│   │   └── products.jsx
│   ├── services/
│   │   └── api.js
│   ├── styles.css
│   ├── utils/
│   │   └── auth.js
├── tailwind.config.js
├── vite.config.js
```

## Desglose de las principales subcarpetas y archivos

### src/components/
- **NavBar.jsx:** Componente para la barra de navegación superior.
- **productForm.jsx:** Componente para el formulario de productos.
- **UI/:** Carpeta que agrupa componentes reutilizables de interfaz de usuario, como Card y Button, entre otros.

### src/pages/
- **`cart.jsx`:** Página del carrito de compras.
- **`admin/`:** Contiene las vistas de administración (`ordersAdmin.jsx`, `usersAdmin.jsx`).
- **`Login.jsx`:** Página para gestionar autenticación (registro e inicio de sesión).
- **`Chat.jsx`:** Página de chat en tiempo real basada en WebSocket.
- **`Products.jsx`:** Pagina de visualizacion de productos

### src/utils/
- **auth.js:** Módulo de autenticación (manejo de JWT, roles, sesión).


## Decisiones tomadas durante el desarrollo

- **Componentización con React:**  
  El frontend está dividido en componentes reutilizables:
  - `src/App.jsx` define la estructura principal con `<NavBar />` y `<Outlet />`.
  - Componentes de interfaz como `src/components/UI/Card.jsx` y `Button.jsx`.

- **GraphQL sobre REST**: Una arquitectura flexible y robusta para manejar peticiones del backend en tiempo real.

- **Persistencia del estado**: Contexto de React para el carrito, integrando `localStorage`.
 
- **Animaciones modernas:**  
  Uso de `framer-motion` para transiciones suaves en la UI, como en el `<motion.div>` de `App.jsx`:

  ```jsx
  // src/App.jsx
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: .35, ease: 'easeOut' }}
  >
    <Outlet />
  </motion.div>
  ```

- **Gestión de rutas y navegación protegida:**  
  Navegación SPA con `react-router-dom`, protección de rutas en chat y autenticación:

  ```javascript
  // src/pages/chat.jsx
  useEffect(() => {
    if (!user || !token) navigate('/login')
  }, [user, token, navigate])
  ```

- **Autenticación y sesión vía JWT:**  
  El helper `src/utils/auth.js` gestiona el almacenamiento y extracción del usuario desde el token:

  ```javascript
  // src/utils/auth.js
  export function getUserFromToken() { ... }
  export function saveToken(token) { ... }
  ```

- **Chat en tiempo real con Socket.io:**  
  Comunicación bidireccional, reconexiones automáticas, mensajes agrupados y scroll automático:

  ```javascript
  // src/pages/chat.jsx
  const s = io('/', {
    path: '/socket.io',
    auth: { token },            
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 20,
    reconnectionDelay: 400,
    reconnectionDelayMax: 2000,
    timeout: 5000,
  })
  ```

  Mensaje enviado y UI actualizada instantáneamente:

  ```javascript
  // src/pages/chat.jsx
  function sendMessage(e) {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !socketRef.current) return;
    const payload = { user: user?.username, message: trimmed, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, { ...payload, createdAt: new Date(payload.createdAt) }]);
    socketRef.current.emit('chat:message', payload);
  }
  ```

- **Gestión de estado y formularios:**  
  Uso extensivo de hooks:

  ```javascript
  // src/pages/login.jsx
  const [tab, setTab] = useState('login');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  ```

  Validación y error en login y registro:

  ```javascript
  // src/pages/login.jsx
  {error && (
    <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm text-center">
      {error}
    </div>
  )}
  ```

- **Diseño adaptativo con TailwindCSS y estilos personalizados:**  
  Variables y utilidades para diseño y responsividad:

  ```css
  /* src/styles.css */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :root {
    --bg: #0b1220;
    --card: #0f172a;
    --muted: #94a3b8;
  }
  ```

  Uso de clases utilitarias y personalizadas en JSX:

  ```jsx
  // src/components/UI/Card.jsx
  export default function Card({ className='', children }) {
    return <div className={`card ${className}`}>{children}</div>
  }
  ```

- **Proxy y configuración para desarrollo con Vite:**  
  Redirección de API y WebSocket con hot reload y build optimizado:

  ```javascript
  // client/vite.config.js
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
      '/socket.io': { target: 'ws://localhost:3000', ws: true }
    }
  }
  ```

- **Gestión condicional de clases CSS:**  
  Uso de la librería `classnames` para controlar los estilos de los mensajes del chat:

  ```javascript
  // src/pages/chat.jsx
  <div key={idx} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[72%] rounded-2xl px-3 py-2 border
        ${mine ? 'bg-blue-600 text-white border-blue-500' : 'bg-white/10 text-white border-white/10'}`}>
      ...
    </div>
  </div>
  ```

- **Linting y calidad automática:**  
  Configuración avanzada en `eslint.config.js` con exclusiones, plugins y reglas personalizadas para mantener el código limpio y consistente.

  ```javascript
  // client/eslint.config.js
  extends: [js.configs.recommended, reactHooks.configs['recommended-latest'], reactRefresh.configs.vite],
  rules: { 'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }] }
  ```

---


## Solución de problemas
- Si tienes problemas con el comando `npm run dev` y el frontend no se levanta, es posible que se deba a un conflicto de versión de Vite. En mi caso, se solucionó ejecutando manualmente el comando especificando la ruta de node y el ejecutable de Vite:

  ```bash
  & "C:\Program Files\nodejs\node.exe" .\node_modules\vite\bin\vite.js
  ```

  Esto permite correr la versión deseada de Vite que tienes instalada en tu proyecto.

---


