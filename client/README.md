# Frontend: Products Portal with Authentication and Real-Time Chat

Este directorio contiene el código fuente del **frontend** para el portal de productos con autenticación y chat en tiempo real.

## Instalación de dependencias

### 1. Requisitos previos
- Node.js (recomendado v18+)
- npm (v8+)

### 2. Instalación rápida

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

## Decisiones tomadas durante el desarrollo

- **Componentización:** El frontend está construido con componentes reutilizables gracias a React.
- **Gestión de rutas:** Se utiliza `react-router-dom` para la navegación de páginas.
- **Animaciones:** Para animaciones y transiciones en los componentes, se utiliza `framer-motion`.
- **Autenticación JWT:** Implementación y decodificación de tokens con `jwt-decode`.
- **Chat en tiempo real:** Integración con `socket.io-client` para comunicación de chat en tiempo real.
- **Estilos:** Uso de `tailwindcss`, `autoprefixer`, y `postcss` para un diseño responsivo y moderno.
- **Linting y calidad:** Se utiliza ESLint con varios plugins para mantener la calidad del código y buenas prácticas.
- **Gestión de clases CSS:** Uso de la librería `classnames` para concatenación de clases de manera condicional.
- **Construcción y optimización:** Vite se utiliza como herramienta principal para construcción y entorno de desarrollo rápido.

## Solución de problemas

- Puede requerir un archivo personalizado `.env` para configurar variables específicas (por ejemplo, URLs del backend).
- Si tienes problemas con el comando `npm run dev` y el frontend no se levanta, es posible que se deba a un conflicto de versión de Vite. En mi caso, se solucionó ejecutando manualmente el comando especificando la ruta de node y el ejecutable de Vite:

  ```bash
  & "C:\Program Files\nodejs\node.exe" .\node_modules\vite\bin\vite.js
  ```

  Esto permite correr la versión deseada de Vite que tienes instalada en tu proyecto.

---

**¡Gracias por revisar este frontend! Si tienes sugerencias o encuentras algún bug, por favor utiliza el sistema de issues del repositorio.**
