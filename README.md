# Clínica Salud - Frontend 🏥

Este es el repositorio del cliente (Frontend) para la aplicación de gestión de la **Clínica Salud**. Está desarrollado utilizando **React**, **Vite** y configurado para conectarse con una API REST en NestJS.

## 🚀 Tecnologías Utilizadas

*   **React** (v18+) - Biblioteca para la interfaz de usuario.
*   **Vite** - Entorno de desarrollo rápido y empaquetador.
*   **TypeScript** - Tipado estático para un código más robusto.
*   **Pnpm / Npm** - Gestión de dependencias eficiente.
*   **Axios / Fetch** - Para el consumo de la API REST.

---

## 🛠️ Configuración Local

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina local:

### 1. Clonar el repositorio
```bash
git clone https://github.com
cd clinica-salud-frontend
```

### 2. Instalar dependencias
Si utilizas `pnpm` (recomendado):
```bash
pnpm install
```
O si prefieres `npm`:
```bash
npm install
```

### 3. Variables de Entorno (`.env`)
Crea un archivo llamado `.env.development` en la raíz del proyecto y apunta la URL hacia tu servidor local de NestJS:

```env
VITE_API_URL=http://localhost:3000
```

### 4. Iniciar el servidor de desarrollo
```bash
pnpm run dev

```
Abre (http://localhost:5173) en tu navegador para ver la aplicación corriendo.

---

## 📦 Despliegue en Producción (Vercel)

El proyecto está optimizado para ser desplegado de manera continua utilizando **Vercel**.

1. Conecta este repositorio en tu cuenta de Vercel.
2. En la sección **Environment Variables**, configura la variable de producción de forma obligatoria:
    *   **Key:** `VITE_API_URL`
    *   **Value:** `https://clinica-salud-nest.onrender.com`
3. Haz clic en **Deploy**.

---

## 📂 Estructura Principal del Proyecto

```text
├── src/
│   ├── assets/        # Imágenes, logos y archivos estáticos
│   ├── components/    # Componentes reutilizables (Botones, Inputs, Modales)
│   ├── context/       # Estado global (Autenticación, Temas)
│   ├── hooks/         # Custom Hooks personalizados
│   ├── services/      # Configuración de Axios y llamadas a la API REST
│   ├── views/         # Páginas principales (Dashboard, Pacientes, Citas)
│   ├── App.tsx        # Enrutador y punto de entrada de componentes
│   └── main.tsx       # Inicialización de React y estilos globales
├── .env.development   # Variables de entorno locales
├── index.html
└── package.json
```

## Autor

Para mayores detalles sobre el proyecto, puedes visitar el repositorio de mi proyecto o contactarme en:
[Manuel Mitacc](https://github.com/mmitacc)
Telefono: +051 996 080 313  (Tacna-Perú)
Email: manuelmitacc@hotmail.com


## Licencia

MIT License

Copyright (c) 2026 [Manuel Mitacc](https://github.com/mmitacc)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
