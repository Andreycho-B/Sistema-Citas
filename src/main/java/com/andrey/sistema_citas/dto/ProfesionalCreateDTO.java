package com.andrey.sistema_citas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class ProfesionalCreateDTO {

    @NotBlank(message = "La especialidad es obligatoria")
    @Size(min = 3, max = 255, message = "La especialidad debe tener entre 3 y 255 caracteres")
    private String especialidad;

    @NotNull(message = "El horario disponible es obligatorio")
    private LocalDateTime horarioDisponible;

    @NotNull(message = "El ID de usuario es obligatorio")
    private Long usuarioId;

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public LocalDateTime getHorarioDisponible() {
        return horarioDisponible;
    }

    public void setHorarioDisponible(LocalDateTime horarioDisponible) {
        this.horarioDisponible = horarioDisponible;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
}
