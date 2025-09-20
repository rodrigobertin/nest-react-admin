## Challenge 

### Pasos iniciales
Al intentar iniciar el proyecto con Docker se encontraron errores relacionados con las dependencias de bcrypt.
Debido a que se realizó el challenge en una arquitectura ARM (mac mini M4) node-alpine requiere Python para compilar
se puede usar la imagen node, pero aumenta significativamente el tamaño de la imagen. También se puede agregar python y make, 
pero aumenta los tiempos de build.

Se solucionó importando bcryptjs en lugar de bcrypt y agregando la dependencia @types/bcryptjs en el archivo package.json.
Esto permite realizar un proceso de compilación compatible con arquitecturas ARM y AMD asi si permite realizar despliegues en
servidores con diferentes arquitecturas.

También se actualizó la version de node a 22

## Frontend

Resumen de actualizaciones en el frontend (rutas de React y dependencias):

- Migración y refactor del sistema de rutas a React Router v6:
  - Uso de <BrowserRouter>, <Routes> y <Route> con la prop "element" (reemplaza el patrón anterior con <Switch> y la prop "component").
  - Implementación de rutas protegidas y públicas mediante envoltorios compatibles con v6:
    - PrivateRoute: verifica usuario autenticado y roles antes de renderizar el componente; redirige con Navigate a "/login" o "/" según corresponda.
    - AuthRoute: bloquea el acceso a "/login" si ya hay sesión activa y redirige a "/".
  - Definición centralizada de rutas en src/App.tsx con las siguientes rutas: "/" (Dashboard), "/courses", "/courses/:id", "/users" (solo rol admin) y "/login".
  - Uso de Navigate (alias de Redirect) según la API de v6 para las redirecciones.

- Actualizaciones de dependencias relevantes en frontend/package.json:
  - react-router-dom: 6 (adopción de API v6 y tipados acordes).
  - axios: 1.12.0.
  - Tooling y estilos: tailwindcss 3.4.x, postcss 8.5.x, autoprefixer 10.4.x.
  - Tipos y utilidades de testing actualizados en línea con React 17 y react-scripts 5.

- Alineación de versión de Node: se recomienda Node 22 para desarrollo/CI, coherente con el backend y el entorno del proyecto.


## Backend
- Se cambió el puerto a 5001 debido a problemas con el entorno local en mac os


## Docker Compose

Resumen de mejoras y configuración del orquestado con Docker Compose:

- Base de datos:
  - Imagen postgres:17-alpine con versión específica de Postgres, 
    así evitar la mala práctica de no poner el número de versión específica,
    esto puede generar errores si el container se vuelve a crear.
  - Persistencia de datos con volumen bind: database -> /var/lib/postgresql/data.
  - Carga de variables desde .env compartido.
  - Puerto publicado 5432:5432 para conexiones locales (CLI/cliente SQL).
- Backend:
  - Uso de env_file: .env para credenciales/config comunes.
  - Se agregó un restart: on-failure para resiliencia básica.
  - Alineado con Node 22 y uso de bcryptjs (evita toolchain nativo en ARM/AMD).
- Frontend:
  - Se agregó un restart: on-failure.
- Un único .env centraliza y reutiliza configuración entre servicios (DB, API, etc.).
- Se agregaron redes para aislar mejor los servicios y mejorar la seguridad y escalabilidad del proyecto