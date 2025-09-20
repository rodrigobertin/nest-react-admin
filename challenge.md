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

### Frontend
Resumen de cambios en funcionalidad, mejoras y diseño del FrontEnd:

- Funcionalidad:
  - Migración y refactor del sistema de rutas a React Router v6:
    - Uso de <BrowserRouter>, <Routes> y <Route element={...}> (reemplaza <Switch> y la prop "component").
    - Rutas protegidas y públicas mediante envoltorios compatibles con v6:
      - PrivateRoute: verifica sesión y roles antes de renderizar; redirige con Navigate a "/login" o "/" según corresponda.
      - AuthRoute: bloquea el acceso a "/login" si ya hay sesión activa y redirige a "/".
    - Definición centralizada de rutas en src/App.tsx: "/" (Dashboard), "/courses", "/courses/:id", "/users" (solo admin) y "/login".

- Mejoras:
  - Uso eficiente de React Query, se elimina las llamadas constantes cada 1 segundo de los datos tanto en Courses, Users y Contents 
   asi evitando fetchs de datos innecesarios
  - Se aplica un refresh de datos al crear, eliminar o editar una nueva entrada

- Diseño y estilos:
  - Branding y activos visuales:
    - Se aplica el logo de la empresa tanto en el sidebar como en el login.
    - Fondo del menú lateral con transparencia.
  - Rediseño de Sidebar:
    - Actualizaciones SidebarItem.tsx para mejorar estados activos, legibilidad.
    - Integración del logo y mejor jerarquía visual del menú.


### Backend
- Se cambió el puerto a 5001 debido a problemas con el entorno local en Mac os

### Docker Compose
Resumen de mejoras y configuración del orquestado con Docker Compose:

- Base de datos:
  - Imagen postgres:17-alpine con versión específica de Postgres, 
    así evitar la mala práctica de no poner el número de versión específica,
    esto puede generar errores si el container se vuelve a crear.
  - Persistencia de datos con volumen bind: database -> /var/lib/postgresql/data.
  - Carga de variables desde .env compartido.
  - Puerto publicado 5432:5432 para conexiones locales (CLI/cliente SQL).
- Backend:
  - Uso de env_file: .env.template para credenciales/config comunes.
  - Se agregó un restart: on-failure para resiliencia básica.
  - Alineado con Node 22 y uso de bcryptjs (evita toolchain nativo en ARM/AMD).
- Frontend:
  - Se agregó un restart: on-failure.
- Un único .env.template centraliza y reutiliza configuración entre servicios (DB, API, etc.).
- Se agregaron redes para aislar mejor los servicios y mejorar la seguridad y escalabilidad del proyecto