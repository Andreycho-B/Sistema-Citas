# Guía de Despliegue - Sistema de Citas

## Requisitos Previos

### Software Necesario
- **Java**: JDK 17 o superior
- **Maven**: 3.8 o superior
- **Node.js**: 18 o superior
- **npm** o **pnpm**: Última versión estable
- **MySQL**: 8.0 o superior
- **Git**: Para clonar el repositorio

---

## Configuración del Backend

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Andreycho-B/Sistema-Citas.git
cd Sistema-Citas
```

### 2. Configurar Base de Datos

#### Crear la base de datos en MySQL:

```sql
CREATE DATABASE sistema_citas;
CREATE USER 'citas_user'@'localhost' IDENTIFIED BY 'tu_password_segura';
GRANT ALL PRIVILEGES ON sistema_citas.* TO 'citas_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Actualizar `application.properties`:

Editar `src/main/resources/application.properties`:

```properties
# Configuración de Base de Datos
spring.datasource.url=jdbc:mysql://localhost:3306/sistema_citas
spring.datasource.username=citas_user
spring.datasource.password=tu_password_segura
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Configuración de JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Configuración de JWT
jwt.secret=TU_CLAVE_SECRETA_SUPER_SEGURA_MINIMO_256_BITS
jwt.expiration=86400000

# Perfil activo
spring.profiles.active=dev

# Puerto del servidor
server.port=8080
```

**IMPORTANTE:** 
- Cambiar `jwt.secret` por una clave segura de al menos 256 bits
- En producción, usar variables de entorno en lugar de valores hardcodeados

### 3. Compilar y Ejecutar el Backend

```bash
# Compilar el proyecto
mvn clean install

# Ejecutar la aplicación
mvn spring-boot:run
```

El backend estará disponible en `http://localhost:8080`

---

## Configuración del Frontend

### 1. Navegar al directorio del frontend

```bash
cd frontend
```

### 2. Instalar dependencias

```bash
npm install
# o si usas pnpm
pnpm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en `frontend/`:

```env
VITE_API_URL=http://localhost:8080
```

### 4. Ejecutar el frontend

```bash
npm run dev
# o
pnpm dev
```

El frontend estará disponible en `http://localhost:5173`

---

## Creación de Usuario Administrador Inicial

### Opción 1: Mediante SQL directo

```sql
-- Insertar usuario admin (password: admin123 - cambiar inmediatamente)
INSERT INTO usuario (nombre, email, password, role) 
VALUES ('Administrador', 'admin@sistema.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'ADMIN');
```

**Nota:** El password hasheado corresponde a "admin123". Cambiar inmediatamente tras primer login.

### Opción 2: Mediante endpoint de registro + actualización manual

1. Registrar usuario normal en `/auth/register`
2. Actualizar rol en base de datos:

```sql
UPDATE usuario SET role = 'ADMIN' WHERE email = 'tu_email@ejemplo.com';
```

---

## Verificación de Instalación

### 1. Verificar Backend

```bash
curl http://localhost:8080/auth/login
```

Debería retornar un error 400 o 401 (esperado sin credenciales).

### 2. Verificar Frontend

Abrir navegador en `http://localhost:5173`

Debería mostrar la página de login.

### 3. Probar Login

1. Acceder a la interfaz web
2. Iniciar sesión con credenciales de admin
3. Verificar acceso al panel de administración

---

## Estructura de Roles y Permisos

### ROL: USER
**Permisos:**
- Ver servicios y profesionales
- Crear citas propias
- Ver sus propias citas
- Editar fecha de sus citas (solo pendientes/confirmadas)
- Cancelar sus citas (solo pendientes/confirmadas)

**Rutas Frontend:**
- `/dashboard`
- `/servicios`
- `/profesionales`
- `/citas/nueva`
- `/mis-citas`

---

### ROL: PROFESSIONAL
**Permisos:**
- Todos los permisos de USER
- Crear servicios propios
- Editar servicios propios
- Eliminar servicios propios
- Ver agenda de citas asignadas
- Confirmar citas
- Completar citas

**Rutas Frontend Adicionales:**
- `/professional/dashboard`
- `/professional/mis-servicios`

---

### ROL: ADMIN
**Permisos:**
- Acceso total al sistema
- Gestionar usuarios (crear, editar, eliminar)
- Gestionar profesionales (crear, editar, eliminar)
- Gestionar servicios (crear, editar, eliminar - todos)
- Gestionar citas (ver todas, cancelar, eliminar)
- Ver estadísticas del sistema

**Rutas Frontend Exclusivas:**
- `/admin/dashboard`
- `/admin/usuarios`
- `/admin/profesionales`
- `/admin/servicios`
- `/admin/citas`

---

## Migración de Datos Existentes

Si ya tienes datos en el sistema y estás actualizando desde una versión anterior:

### Script de Migración SQL

```sql
-- Agregar columna profesional_id a servicios
ALTER TABLE servicio ADD COLUMN profesional_id BIGINT;

-- Agregar foreign key
ALTER TABLE servicio 
ADD CONSTRAINT fk_servicio_profesional 
FOREIGN KEY (profesional_id) REFERENCES profesional(id) 
ON DELETE SET NULL;

-- Los servicios existentes quedarán como "globales" (profesional_id = NULL)
-- Si deseas asignar servicios a profesionales específicos, ejecuta:
-- UPDATE servicio SET profesional_id = X WHERE id = Y;
```

---

## Solución de Problemas Comunes

### Error: "Access Denied for user"
**Causa:** Credenciales incorrectas en `application.properties`  
**Solución:** Verificar usuario y password de MySQL

### Error: "Table doesn't exist"
**Causa:** Hibernate no creó las tablas  
**Solución:** Verificar `spring.jpa.hibernate.ddl-auto=update` y permisos de usuario en MySQL

### Error: "CORS policy"
**Causa:** Frontend y backend en diferentes puertos  
**Solución:** Verificar configuración CORS en `SecurityConfigDev.java` incluye `http://localhost:5173`

### Error: "JWT signature does not match"
**Causa:** `jwt.secret` cambió o es diferente entre reinicios  
**Solución:** Mantener `jwt.secret` constante, logout y login nuevamente

### Error: "Access Denied" al intentar operaciones
**Causa:** Rol de usuario incorrecto o permisos no configurados  
**Solución:** Verificar rol en base de datos, verificar anotaciones `@PreAuthorize` en controladores

---

## Configuración para Producción

### Backend

1. **Cambiar perfil a producción:**
   ```properties
   spring.profiles.active=prod
   ```

2. **Usar variables de entorno:**
   ```bash
   export DB_URL=jdbc:mysql://tu-servidor:3306/sistema_citas
   export DB_USER=tu_usuario
   export DB_PASSWORD=tu_password
   export JWT_SECRET=tu_clave_secreta_256_bits
   ```

3. **Actualizar `application-prod.properties`:**
   ```properties
   spring.datasource.url=${DB_URL}
   spring.datasource.username=${DB_USER}
   spring.datasource.password=${DB_PASSWORD}
   jwt.secret=${JWT_SECRET}
   spring.jpa.hibernate.ddl-auto=validate
   ```

4. **Compilar JAR:**
   ```bash
   mvn clean package -DskipTests
   ```

5. **Ejecutar:**
   ```bash
   java -jar target/sistema-citas-0.0.1-SNAPSHOT.jar
   ```

### Frontend

1. **Actualizar `.env.production`:**
   ```env
   VITE_API_URL=https://tu-dominio-backend.com
   ```

2. **Compilar para producción:**
   ```bash
   npm run build
   ```

3. **Servir archivos estáticos:**
   - Usar Nginx, Apache o servicio de hosting estático
   - Archivos compilados en `frontend/dist/`

---

## Monitoreo y Logs

### Backend
Los logs se generan en consola por defecto.

Para archivo de logs, agregar a `application.properties`:
```properties
logging.file.name=logs/sistema-citas.log
logging.level.com.andrey.sistema_citas=DEBUG
```

### Frontend
Logs en consola del navegador (F12 > Console)

---

## Seguridad - Checklist

- [ ] Cambiar password de admin por defecto
- [ ] Usar JWT secret seguro (mínimo 256 bits)
- [ ] Configurar HTTPS en producción
- [ ] Configurar CORS solo para dominios permitidos
- [ ] Usar variables de entorno para credenciales
- [ ] Configurar `spring.jpa.hibernate.ddl-auto=validate` en producción
- [ ] Implementar rate limiting (recomendado)
- [ ] Configurar backups automáticos de base de datos
- [ ] Implementar auditoría de acciones críticas

---

## Contacto y Soporte

Para reportar problemas o solicitar ayuda:
- **GitHub Issues:** https://github.com/Andreycho-B/Sistema-Citas/issues
- **Email:** [Tu email de contacto]

---

**Última actualización:** 18 de Noviembre de 2025
