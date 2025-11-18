package com.andrey.sistema_citas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ProfesionalCreateDTO {

    @NotBlank(message = "La especialidad es obligatoria")
    @Size(min = 3, max = 255, message = "La especialidad debe tener entre 3 y 255 caracteres")
    private String especialidad;

    @NotBlank(message = "El horario disponible es obligatorio")
    @Size(max = 500, message = "La descripción del horario no puede exceder los 500 caracteres")
    private String horarioDisponible; // Cambiado a String

    @NotNull(message = "El ID de usuario es obligatorio")
    private Long usuarioId;

    // Getters y Setters (sin cambios en la lógica)
    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public String getHorarioDisponible() {
        return horarioDisponible;
    }

    public void setHorarioDisponible(String horarioDisponible) {
        this.horarioDisponible = horarioDisponible;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
}