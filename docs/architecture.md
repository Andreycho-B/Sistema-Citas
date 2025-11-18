# Arquitectura del Sistema - Sistema de Citas

## Descripción General

La arquitectura del sistema está basada en un enfoque de **aplicación de una sola página (SPA)** con un **backend de API RESTful desacoplado**. Este diseño promueve la separación de responsabilidades, la escalabilidad y la flexibilidad para el desarrollo y despliegue.

### Componentes Principales

1.  **Frontend (Cliente)**: Una aplicación React construida con Vite que se ejecuta completamente en el navegador del cliente. Es responsable de toda la interfaz de usuario y la experiencia del usuario.
2.  **Backend (Servidor)**: Una API RESTful construida con Spring Boot que maneja toda la lógica de negocio, el acceso a datos y la seguridad.
3.  **Base de Datos**: Una base de datos relacional MySQL que persiste todos los datos de la aplicación.
4.  **Contenedores Docker**: Cada componente (frontend, backend, base de datos) está contenerizado para asegurar consistencia entre entornos y facilitar el despliegue.

## Diagrama de Arquitectura

```mermaid
graph TD
    subgraph "Cliente (Navegador)"
        A[React App] -->|Llamadas API REST| B(API Gateway / Nginx)
    end

    subgraph "Servidor (Docker)"
        B --> C{Backend (Spring Boot)}
        C --> D[Base de Datos (MySQL)]
    end

    subgraph "Autenticación"
        A -->|Credenciales| C
        C -->|Token JWT| A
    end

    style A fill:#61DAFB,stroke:#333,stroke-width:2px
    style C fill:#6DB33F,stroke:#333,stroke-width:2px
    style D fill:#00758F,stroke:#333,stroke-width:2px
```

## Flujo de Datos

1.  **Carga Inicial**: El usuario accede a la URL del sitio. Nginx sirve la aplicación React (archivos estáticos HTML, CSS, JS).
2.  **Renderizado**: React se inicializa en el navegador y renderiza la interfaz de usuario.
3.  **Interacción del Usuario**: El usuario interactúa con la aplicación (ej. hace clic en "Ver Profesionales").
4.  **Llamada a la API**: La aplicación React realiza una petición HTTP (ej. `GET /api/profesionales`) al backend.
5.  **Procesamiento del Backend**: El backend recibe la petición, aplica la lógica de negocio (ej. consulta la base de datos), y devuelve una respuesta en formato JSON.
6.  **Actualización de la UI**: React recibe la respuesta JSON y actualiza dinámicamente la interfaz sin necesidad de recargar la página.

## Detalles de los Componentes

### Frontend (React)

-   **Build Tool**: Vite para un desarrollo rápido y un empaquetado optimizado.
-   **Enrutamiento**: React Router gestiona las rutas del lado del cliente, permitiendo una navegación fluida.
-   **Gestión de Estado**: Se utiliza React Context para la gestión del estado de autenticación global. Para estados locales, se usa el hook `useState`.
-   **Estilos**: Tailwind CSS para un diseño basado en utilidades que facilita la creación de interfaces consistentes y responsivas.
-   **Llamadas a API**: Axios es el cliente HTTP utilizado para comunicarse con el backend, con interceptores para inyectar el token JWT y manejar errores de autenticación.

### Backend (Spring Boot)

-   **API RESTful**: Se exponen endpoints REST para cada recurso (Usuarios, Citas, etc.) siguiendo las convenciones estándar (GET, POST, PUT, DELETE).
-   **Seguridad**: Spring Security protege los endpoints. La autenticación se realiza mediante JWT, lo que permite un sistema *stateless*.
-   **Acceso a Datos**: Spring Data JPA con Hibernate como implementación ORM para interactuar con la base de datos MySQL. Esto abstrae las consultas SQL y facilita el mapeo de objetos a tablas.
-   **Validación**: Se utiliza `jakarta.validation` para validar los datos de entrada en los DTOs, asegurando la integridad de los datos antes de que lleguen a la lógica de negocio.
-   **Manejo de Errores**: Un `ControllerAdvice` global captura excepciones y las traduce a respuestas HTTP consistentes y significativas.

### Base de Datos (MySQL)

-   **Modelo Relacional**: El esquema de la base de datos está diseñado para reflejar las relaciones entre las entidades principales: Usuarios, Profesionales, Servicios y Citas.
-   **Persistencia**: Los datos son almacenados y gestionados por MySQL, una base deatos robusta y ampliamente utilizada.

### Contenerización (Docker)

-   **Dockerfile para Backend**: Compila la aplicación Spring Boot en un JAR y la empaqueta en una imagen ligera con JRE.
-   **Dockerfile para Frontend**: Utiliza un build multi-etapa. La primera etapa instala dependencias y compila la aplicación React. La segunda etapa copia los archivos estáticos resultantes a un servidor Nginx ligero.
-   **Docker Compose**: Orquesta el despliegue de todos los servicios (backend, frontend, db), configurando redes, volúmenes y variables de entorno para que funcionen conjuntamente.

## Escalabilidad y Mantenimiento

-   **Desacoplamiento**: La separación clara entre frontend y backend permite que ambos puedan ser desarrollados, desplegados y escalados de forma independiente.
-   **Contenerización**: Facilita la replicación del entorno en cualquier máquina y simplifica el proceso de CI/CD.
-   **Código Organizado**: La estructura modular tanto en el backend (por funcionalidad) como en el frontend (por componentes/páginas) facilita la localización de código y el mantenimiento añaido de nuevas características.
