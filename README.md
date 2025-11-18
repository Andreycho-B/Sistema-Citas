# Sistema de Citas para Bienestar Emocional

Sistema de gestión de citas diseñado para conectar a usuarios con profesionales del bienestar emocional. La plataforma permite a los usuarios registrarse, buscar profesionales, agendar, y gestionar sus citas de manera sencilla y eficiente.

## Tabla de Contenidos

- [Stack Tecnológico](#stack-tecnológico)
- [Características Principales](#características-principales)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Configuración del Entorno](#configuración-del-entorno)
  - [Prerrequisitos](#prerrequisitos)
  - [Instalación Local](#instalación-local)
  - [Instalación con Docker](#instalación-con-docker)
- [Variables de Entorno](#variables-de-entorno)
- [Documentación de la API](#documentación-de-la-api)
- [Guía de Contribución](#guía-de-contribución)

---

## Stack Tecnológico

| Categoría | Tecnología | Versión |
| :--- | :--- | :--- |
| **Backend** | Java | 21 |
| | Spring Boot | 3.5.7 |
| | Spring Security | 6.x |
| | Spring Data JPA | 3.x |
| | Maven | 3.9 |
| **Frontend** | React | 18.3.1 |
| | Vite | 7.2.2 |
| | Tailwind CSS | 3.4.1 |
| | React Router | 6.28.0 |
| **Base de Datos** | MySQL | 8.0 |
| **Contenerización**| Docker | - |
| | Docker Compose | - |

---

## Características Principales

- **Autenticación y Autorización**: Sistema seguro basado en JWT con roles (Usuario, Profesional, Admin).
- **Gestión de Usuarios**: Registro, login, y actualización de perfil de usuario.
- **Gestión de Profesionales**: Perfiles de profesionales con especialidades y horarios.
- **Gestión de Servicios**: Creación, edición y visualización de los servicios ofrecidos.
- **Sistema de Citas Completo**: Agendamiento, cancelación, confirmación y visualización de citas con filtros.
- **Dashboards por Rol**: Paneles personalizados para usuarios, profesionales y administradores.
- **Búsqueda y Filtrado**: Búsqueda avanzada de profesionales, servicios y citas.
- **Diseño Responsivo**: Interfaz adaptable a diferentes dispositivos.
- **Entorno contenerizado**: Configuración completa con Docker y Docker Compose para fácil despliegue.

---

## Estructura del Proyecto

El proyecto está organizado en dos módulos principales: `backend` (API REST con Spring Boot) y `frontend` (Aplicación de una sola página con React).

```
/Sistema-Citas
├── backend/ (Proyecto Spring Boot)
│   ├── src/main/java/com/andrey/sistema_citas/
│   │   ├── config/         # Configuración de Seguridad y JWT
│   │   ├── controller/     # Controladores REST
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # Entidades JPA
│   │   ├── exception/      # Manejo de excepciones
│   │   ├── repository/     # Repositorios Spring Data JPA
│   │   └── service/        # Lógica de negocio
│   ├── src/main/resources/ # Archivos de configuración
│   │   ├── application.properties
│   │   ├── application-dev.properties
│   │   └── application-prod.properties
│   ├── pom.xml             # Dependencias de Maven
│   └── Dockerfile          # Dockerfile para el backend
├── frontend/ (Proyecto React)
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── context/        # Contexto de autenticación
│   │   ├── hooks/          # Hooks personalizados
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── services/       # Servicios para consumir la API
│   │   └── utils/          # Utilidades (constantes, formato, validación)
│   ├── public/             # Archivos estáticos
│   ├── .env.example        # Ejemplo de variables de entorno
│   ├── package.json        # Dependencias de Node.js
│   ├── vite.config.js      # Configuración de Vite
│   └── Dockerfile          # Dockerfile para el frontend
├── .dockerignore
├── .gitignore
├── docker-compose.yml      # Orquestación para producción
├── docker-compose.dev.yml  # Orquestación para desarrollo
└── README.md
```

---

## Configuración del Entorno

### Prerrequisitos

- Java 21 (JDK)
- Maven 3.9+
- Node.js 22+
- npm 10+
- MySQL 8.0
- Docker y Docker Compose (opcional, para despliegue)

### Instalación Local

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Andreycho-B/Sistema-Citas.git
    cd Sistema-Citas
    ```

2.  **Configurar la Base de Datos:**
    - Asegúrate de tener una instancia de MySQL corriendo.
    - Crea una base de datos llamada `sistema_citas_emocionales`.
    - Configura las credenciales en `backend/src/main/resources/application-dev.properties` o mediante variables de entorno.

3.  **Ejecutar el Backend:**
    ```bash
    cd backend
    mvn spring-boot:run
    ```
    La API estará disponible en `http://localhost:8088`.

4.  **Ejecutar el Frontend:**
    - Abre una nueva terminal.
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

### Instalación con Docker

Esta es la forma recomendada para un entorno de producción o para simplificar la configuración.

1.  **Configurar Variables de Entorno:**
    - Crea un archivo `.env` en la raíz del proyecto a partir de `.env.example` y configura las variables, especialmente las contraseñas y el secreto JWT.

2.  **Levantar los contenedores:**
    ```bash
    docker-compose up --build
    ```
    - El frontend estará disponible en `http://localhost:80`.
    - El backend estará disponible en `http://localhost:8088`.
    - La base de datos estará en el puerto `3306`.

3.  **Para un entorno de solo base de datos (desarrollo):**
    ```bash
    docker-compose -f docker-compose.dev.yml up
    ```
    - Esto levantará una base de datos MySQL y phpMyAdmin en `http://localhost:8080`.

---

## Variables de Entorno

El proyecto utiliza variables de entorno para configuraciones sensibles. Crea un archivo `.env` en la raíz para `docker-compose` y en la carpeta `frontend` para el desarrollo de React.

### Backend (`.env` en la raíz)

```
# Base de datos
DB_PASSWORD=your_strong_password
DB_USERNAME=appuser

# JWT
JWT_SECRET=your_super_secret_key_with_at_least_256_bits
JWT_EXPIRATION=86400000 # 24 horas en ms

# CORS
CORS_ORIGINS=http://localhost:5173,http://your_production_domain.com

# Perfil de Spring
SPRING_PROFILES_ACTIVE=prod
```

### Frontend (`frontend/.env`)

```
VITE_API_BASE_URL=http://localhost:8088/api
```

---

## Documentación de la API

Los principales endpoints de la API son:

- `POST /auth/register`: Registro de nuevos usuarios.
- `POST /auth/login`: Autenticación y obtención de token JWT.
- `GET /api/servicios`: Obtener lista de servicios.
- `POST /api/servicios`: Crear un nuevo servicio (Admin).
- `GET /api/profesionales`: Obtener lista de profesionales.
- `POST /api/citas`: Agendar una nueva cita.
- `GET /api/citas/usuario/{id}`: Obtener citas de un usuario.
- `PATCH /api/citas/{id}/cancelar`: Cancelar una cita.

*Se recomienda implementar Swagger/OpenAPI para una documentación interactiva completa.*

---

## Guía de Contribución

¡Las contribuciones son bienvenidas! Por favor, sigue estos pasos:

1.  **Haz un Fork** del repositorio.
2.  **Crea una nueva rama** para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3.  **Realiza tus cambios** y haz commits descriptivos.
4.  **Asegúrate de que el código sigue las guías de estilo** y que las pruebas (si existen) pasan.
5.  **Haz un Push** a tu rama (`git push origin feature/nueva-funcionalidad`).
6.  **Abre un Pull Request** hacia la rama `main` del repositorio original.

---

*Este proyecto fue desarrollado y mejorado con la asistencia de Manus AI.*
