# GymGenius - Tu Entrenador Personal con IA

Esta es una aplicación web construida con Next.js y Genkit que genera rutinas de entrenamiento personalizadas utilizando la IA de Google.

## Cómo Empezar (Desarrollo Local)

Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local.

### Prerrequisitos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/) (generalmente se instala con Node.js)
- Una [Clave de API de Google AI Studio (Gemini)](https://makersuite.google.com/app/apikey)

### 1. Clona el Repositorio

Primero, clona este repositorio en tu máquina local usando Git.

### 2. Instala las Dependencias

Una vez dentro de la carpeta del proyecto, instala todas las dependencias necesarias con npm:

```bash
npm install
```

### 3. Configura tu API Key de Gemini

La aplicación necesita una clave de API de Gemini para funcionar.

1.  Crea un nuevo archivo en la raíz del proyecto llamado `.env.local`.
2.  Abre el archivo `.env.local` y añade la siguiente línea, reemplazando `"TU_API_KEY_AQUI"` con tu clave de API real de Gemini:

```
GEMINI_API_KEY="TU_API_KEY_AQUI"
```

*Este archivo está incluido en el `.gitignore`, por lo que tu clave de API permanecerá privada y no se subirá a GitHub.*

### 4. Ejecuta la Aplicación

¡Ya está todo listo! Inicia el servidor de desarrollo con el siguiente comando:

```bash
npm run dev
```

Abre [http://localhost:9002](http://localhost:9002) en tu navegador para ver la aplicación en funcionamiento.

---

## Despliegue en Vercel

Puedes desplegar esta aplicación en Vercel para que esté disponible públicamente. Los usuarios podrán usarla sin necesidad de su propia clave de API, y la tuya se mantendrá segura.

### 1. Sube tu proyecto a GitHub

Asegúrate de que tu código esté en un repositorio de GitHub. El archivo `.gitignore` se asegurará de que tu `.env.local` no se suba.

### 2. Importa tu Proyecto en Vercel

1.  Regístrate o inicia sesión en [Vercel](https://vercel.com) con tu cuenta de GitHub.
2.  Desde tu panel, haz clic en **"Add New..."** -> **"Project"**.
3.  Importa el repositorio de tu proyecto desde GitHub.

### 3. Configura las Variables de Entorno

Este es el paso más importante para mantener tu API key segura.

1.  En la configuración del proyecto en Vercel, busca la sección **"Environment Variables"**.
2.  Añade una nueva variable de entorno:
    - **Name:** `GEMINI_API_KEY`
    - **Value:** Pega tu clave de API de Gemini aquí.
3.  Guarda la variable.

### 4. Despliega

Haz clic en el botón **"Deploy"**. Vercel construirá y publicará tu sitio. Tu aplicación estará en línea y utilizará tu API key de forma segura en el servidor.
