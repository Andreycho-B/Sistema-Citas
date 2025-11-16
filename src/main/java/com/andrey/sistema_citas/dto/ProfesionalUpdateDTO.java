package com.andrey.sistema_citas.dto;

import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class ProfesionalUpdateDTO {

    @Size(min = 3, max = 255, message = "La especialidad debe tener entre 3 y 255 caracteres")
    private String especialidad;

    private LocalDateTime horarioDisponible;

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
}