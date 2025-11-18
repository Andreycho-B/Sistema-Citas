# Modelo de Datos - Sistema de Citas

## Diagrama Entidad-Relación (ERD)

```mermaid
erDiagram
    USUARIO {
        Long id PK
        String nombre
        String email
        String password
        String telefono
        Set<Role> roles
    }

    PROFESIONAL {
        Long id PK
        String especialidad
        String horarioDisponible
        Long usuario_id FK
    }

    SERVICIO {
        Long id PK
        String nombre
        String descripcion
        Double precio
        String duracion
    }

    CITA {
        Long id PK
        LocalDateTime fechaHora
        EstadoCita estado
        String notas
        Long usuario_id FK
        Long profesional_id FK
        Long servicio_id FK
    }

    USUARIO ||--o{ CITA : "tiene"
    PROFESIONAL ||--o{ CITA : "atiende"
    SERVICIO ||--o{ CITA : "es_para"
    USUARIO ||--|{ PROFESIONAL : "es_un"
```

## Descripción de las Entidades

### 1. Usuario

Representa a cualquier persona que interactúa con el sistema. Puede ser un cliente, un profesional o un administrador.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Long` | Identificador único del usuario (PK). |
| `nombre` | `String` | Nombre completo del usuario. |
| `email` | `String` | Correo electrónico (único, usado para login). |
| `password` | `String` | Contraseña cifrada (hashed). |
| `telefono` | `String` | Número de teléfono de contacto. |
| `roles` | `Set<Role>` | Conjunto de roles asignados (USER, PROFESSIONAL, ADMIN). |

### 2. Profesional

Extiende la información de un `Usuario` para incluir detalles específicos de un profesional que ofrece servicios.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Long` | Identificador único del profesional (PK). |
| `especialidad` | `String` | Área de especialización (ej. "Psicología Clínica"). |
| `horarioDisponible` | `String` | Descripción textual del horario de trabajo. *Nota: Se recomienda refactorizar a una estructura más compleja para una gestión de disponibilidad real.* |
| `usuario` | `Usuario` | Relación uno a uno con la entidad `Usuario`. |

### 3. Servicio

Describe un servicio ofrecido por los profesionales en la plataforma.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Long` | Identificador único del servicio (PK). |
| `nombre` | `String` | Nombre del servicio (ej. "Terapia Individual"). |
| `descripcion` | `String` | Descripción detallada del servicio. |
| `precio` | `Double` | Costo del servicio. |
| `duracion` | `String` | Duración de la sesión (ej. "1 hora", "30 minutos"). |

### 4. Cita

Representa una cita agendada entre un usuario y un profesional para un servicio específico.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Long` | Identificador único de la cita (PK). |
| `fechaHora` | `LocalDateTime` | Fecha y hora exactas de la cita. |
| `estado` | `EstadoCita` | Estado actual de la cita (PENDIENTE, CONFIRMADA, COMPLETADA, CANCELADA). |
| `notas` | `String` | Notas adicionales del usuario al agendar. |
| `usuario` | `Usuario` | El usuario que agenda la cita. |
| `profesional` | `Profesional` | El profesional que atenderá la cita. |
| `servicio` | `Servicio` | El servicio para el cual es la cita. |

## Enumeraciones

### Role

Define los niveles de acceso en el sistema.

-   `USER`: Rol por defecto para nuevos usuarios.
-   `PROFESSIONAL`: Permite al usuario ser listado como profesional y gestionar sus citas.
-   `ADMIN`: Acceso total a la gestión del sistema.

### EstadoCita

Define el ciclo de vida de una cita.

-   `PENDIENTE`: La cita ha sido solicitada por el usuario pero no confirmada por el profesional.
-   `CONFIRMADA`: El profesional ha aceptado la cita.
-   `COMPLETADA`: La cita ha finalizado.
-   `CANCELADA`: La cita ha sido cancelada por el usuario o el profesional.
