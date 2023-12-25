# Esqueleto_Comfyui_API

## Descripción
Este proyecto proporciona un esqueleto para crear flujos de trabajo personalizados utilizando la API de ComfyUI. Está diseñado para ser un punto de partida, permitiéndote adaptarlo y expandirlo según tus necesidades específicas.

## Requisitos Previos
Para utilizar este proyecto, necesitas tener instalado Node.js en tu sistema. Puedes descargar e instalar Node.js desde [Node.js Official Website](https://nodejs.org/).

## Instalación
1. Clona el repositorio en tu máquina local usando:
   ```
   git clone <URL-del-repositorio>
   ```
2. Navega al directorio del proyecto clonado.
3. Instala las dependencias del proyecto ejecutando:
   ```
   npm install
   ```
   Esto instalará todas las dependencias necesarias que están definidas en tu archivo `package.json`.

### Instalación de Dependencias Específicas
Para asegurarte de que todas las dependencias necesarias están instaladas, ejecuta los siguientes comandos:
   ```
   npm install ws uuid
   ```
   Esto instalará los módulos `ws` (WebSocket) y `uuid` que son cruciales para el funcionamiento del proyecto.

## Ejecución
Para ejecutar el script:
1. Asegúrate de estar en el directorio del proyecto.
2. Ejecuta el script con Node.js utilizando el comando:
   ```
   node main.js
   ```
   Reemplaza `main.js` con el nombre del archivo principal de tu proyecto si es diferente.

## Características Principales
- Conexión WebSocket para comunicarse con el servidor de ComfyUI.
- Funciones para leer datos de la API, encolar solicitudes de flujo de trabajo y descargar imágenes resultantes.
- Ejemplo de uso de la API de ComfyUI para manipular y ejecutar flujos de trabajo personalizados.

## Contribuciones
Las contribuciones a este proyecto son bienvenidas. Si deseas contribuir, por favor:
1. Haz un fork del repositorio.
2. Crea una rama para tu característica o corrección.
3. Envía un pull request con tus cambios.

## Licencia
Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo `LICENSE` para obtener más detalles.

## Contacto
Si tienes alguna pregunta o sugerencia, no dudes en contactar al autor del proyecto.

¡Gracias por utilizar este esqueleto de flujo de trabajo con ComfyUI!
