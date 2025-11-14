package com.andrey.sistema_citas.dto;

import java.time.LocalDateTime;

public class ProfesionalCreateDTO {

    private String especialidad;
    private LocalDateTime horarioDisponible;
    private Long usuarioId; // referencia al usuario ya existente

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
