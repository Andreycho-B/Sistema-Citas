package com.andrey.sistema_citas.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class CitaCreateDTO {

    @NotNull(message = "El ID de usuario es obligatorio")
    private Long usuarioId;

    @NotNull(message = "El ID de servicio es obligatorio")
    private Long servicioId;

    @NotNull(message = "El ID de profesional es obligatorio")
    private Long profesionalId;

    @NotNull(message = "La fecha y hora es obligatoria")
    @Future(message = "La fecha debe ser futura")
    private LocalDateTime fechaHora;

    public CitaCreateDTO() {}

    // Getters y Setters
    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Long getServicioId() {
        return servicioId;
    }

    public void setServicioId(Long servicioId) {
        this.servicioId = servicioId;
    }

    public Long getProfesionalId() {
        return profesionalId;
    }

    public void setProfesionalId(Long profesionalId) {
        this.profesionalId = profesionalId;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }
}