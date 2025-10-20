# GymGenius - Tu Entrenador Personal con IA

Esta es una aplicación web construida con Next.js y Genkit que genera rutinas de entrenamiento personalizadas utilizando la IA de Google.

## Cómo Empezar

Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local.

### Prerrequisitos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/) (generalmente se instala con Node.js)
- Una [Clave de API de Google AI Studio (Gemini)](https://makersuite.google.com/app/apikey)

### 1. Clona el Repositorio

Primero, clona este repositorio en tu máquina local usando Git:

```bash
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
cd TU_REPOSITORIO
```
*Reemplaza `TU_USUARIO` y `TU_REPOSITORIO` con tu nombre de usuario y el nombre de tu repositorio en GitHub.*

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