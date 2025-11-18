# Guía de Despliegue - Sistema de Citas

Esta guía proporciona instrucciones detalladas para desplegar el Sistema de Citas en diferentes entornos.

## Tabla de Contenidos

- [Despliegue Local (Desarrollo)](#despliegue-local-desarrollo)
- [Despliegue con Docker](#despliegue-con-docker)
- [Despliegue en Producción](#despliegue-en-producción)
- [Configuración de Base de Datos](#configuración-de-base-de-datos)
- [Variables de Entorno Críticas](#variables-de-entorno-críticas)
- [Monitoreo y Logs](#monitoreo-y-logs)

---

## Despliegue Local (Desarrollo)

### Requisitos Previos

- Java 21 (JDK)
- Maven 3.9+
- Node.js 22+
- MySQL 8.0

### Pasos

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Andreycho-B/Sistema-Citas.git
    cd Sistema-Citas
    ```

2.  **Configurar Base de Datos:**
    - Inicia MySQL y crea la base de datos:
      ```sql
      CREATE DATABASE sistema_citas_emocionales CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
      ```
    - Configura las credenciales en `src/main/resources/application-dev.properties` o mediante variables de entorno.

3.  **Iniciar el Backend:**
    ```bash
    mvn spring-boot:run
    ```
    El backend estará disponible en `http://localhost:8088`.

4.  **Iniciar el Frontend:**
    En una nueva terminal:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    El frontend estará disponible en `http://localhost:5173`.

---

## Despliegue con Docker

### Requisitos Previos

- Docker 20+
- Docker Compose 2+

### Pasos

1.  **Configurar Variables de Entorno:**
    - Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:
      ```bash
      cp .env.example .env
      ```
    - Edita `.env` y configura las variables, especialmente:
      - `DB_PASSWORD`: Contraseña segura para MySQL.
      - `JWT_SECRET`: Clave secreta para JWT (mínimo 256 bits).
      - `CORS_ORIGINS`: Dominios permitidos para CORS.

2.  **Construir y Levantar los Contenedores:**
    ```bash
    docker-compose up --build -d
    ```
    - `-d`: Ejecuta los contenedores en segundo plano.

3.  **Verificar el Estado:**
    ```bash
    docker-compose ps
    ```
    Todos los servicios deben estar en estado `Up`.

4.  **Acceder a la Aplicación:**
    - Frontend: `http://localhost:80`
    - Backend API: `http://localhost:8088`
    - Base de Datos: `localhost:3306`

5.  **Ver Logs:**
    ```bash
    docker-compose logs -f
    ```

6.  **Detener los Contenedores:**
    ```bash
    docker-compose down
    ```

---

## Despliegue en Producción

### Consideraciones de Seguridad

-   **Nunca expongas credenciales en el código fuente.** Utiliza variables de entorno o servicios de gestión de secretos.
-   **Cambia el `JWT_SECRET` a un valor único y seguro** de al menos 256 bits.
-   **Utiliza contraseñas fuertes** para la base de datos.
-   **Configura HTTPS** para todas las comunicaciones. Utiliza un proxy inverso como Nginx con certificados SSL (Let's Encrypt).
-   **Restringe el acceso a la base de datos** solo a los servicios necesarios.

### Pasos Recomendados

1.  **Preparar el Servidor:**
    - Servidor con Ubuntu 22.04 o superior.
    - Instalar Docker y Docker Compose.
    - Configurar firewall (ufw) para permitir solo puertos necesarios (80, 443, 22).

2.  **Configurar Variables de Entorno:**
    - Crea un archivo `.env` en el servidor con valores de producción seguros.
    - Ejemplo:
      ```
      SPRING_PROFILES_ACTIVE=prod
      DB_PASSWORD=super_secure_password_here
      JWT_SECRET=very_long_random_string_with_256_bits
      CORS_ORIGINS=https://yourdomain.com
      ```

3.  **Configurar Nginx como Proxy Inverso (Opcional pero Recomendado):**
    - Instala Nginx en el host.
    - Configura Nginx para hacer proxy a los contenedores Docker y manejar SSL.
    - Ejemplo de configuración:
      ```nginx
      server {
          listen 80;
          server_name yourdomain.com;
          return 301 https://$server_name$request_uri;
      }

      server {
          listen 443 ssl http2;
          server_name yourdomain.com;

          ssl_certificate /path/to/cert.pem;
          ssl_certificate_key /path/to/key.pem;

          location / {
              proxy_pass http://localhost:80;
              proxy_set_header Host $host;
              proxy_set_header X-Real-IP $remote_addr;
          }

          location /api/ {
              proxy_pass http://localhost:8088/api/;
              proxy_set_header Host $host;
              proxy_set_header X-Real-IP $remote_addr;
          }
      }
      ```

4.  **Desplegar con Docker Compose:**
    ```bash
    docker-compose -f docker-compose.yml up -d
    ```

5.  **Configurar Reinicio Automático:**
    - Asegúrate de que Docker Compose esté configurado para reiniciar contenedores automáticamente (`restart: unless-stopped` en el archivo `docker-compose.yml`).

6.  **Configurar Backups de Base de Datos:**
    - Implementa un script cron para realizar backups regulares de MySQL.
    - Ejemplo:
      ```bash
      0 2 * * * docker exec sistema-citas-db mysqldump -u root -p$DB_PASSWORD sistema_citas_emocionales > /backups/db_backup_$(date +\%Y\%m\%d).sql
      ```

---

## Configuración de Base de Datos

### Inicialización

La base de datos se crea automáticamente al iniciar el contenedor de MySQL. El esquema de tablas se genera automáticamente mediante Hibernate con `spring.jpa.hibernate.ddl-auto=update` en desarrollo y `validate` en producción.

### Migración de Datos

Para entornos de producción, se recomienda usar herramientas de migración como **Flyway** o **Liquibase** para gestionar cambios en el esquema de forma controlada y versionada.

---

## Variables de Entorno Críticas

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `DB_URL` | URL de conexión a MySQL | `jdbc:mysql://db:3306/sistema_citas_emocionales` |
| `DB_USERNAME` | Usuario de la base de datos | `appuser` |
| `DB_PASSWORD` | Contraseña de la base de datos | `secure_password` |
| `JWT_SECRET` | Clave secreta para firmar JWT | `random_256_bit_string` |
| `JWT_EXPIRATION` | Tiempo de expiración del token (ms) | `86400000` (24 horas) |
| `CORS_ORIGINS` | Dominios permitidos para CORS | `https://yourdomain.com` |
| `SPRING_PROFILES_ACTIVE` | Perfil de Spring activo | `prod` |

---

## Monitoreo y Logs

### Logs de Docker

Para ver los logs de todos los servicios:
```bash
docker-compose logs -f
```

Para ver logs de un servicio específico:
```bash
docker-compose logs -f backend
```

### Logs de la Aplicación

Los logs de Spring Boot se configuran en `application-prod.properties` y se guardan en `/logs/sistema-citas.log` dentro del contenedor. Puedes montar un volumen para acceder a estos logs desde el host.

### Monitoreo de Salud

El backend de Spring Boot puede exponer endpoints de salud si se configura Spring Boot Actuator. Agrega la dependencia en `pom.xml` y configura los endpoints en `application.properties`.

---

*Esta guía cubre los escenarios más comunes. Para configuraciones avanzadas o problemas específicos, consulta la documentación oficial de Spring Boot, Docker y MySQL.*
