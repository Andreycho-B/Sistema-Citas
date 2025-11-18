package com.andrey.sistema_citas.dto;

import jakarta.validation.constraints.Size;

public class ProfesionalUpdateDTO {

    @Size(min = 3, max = 255, message = "La especialidad debe tener entre 3 y 255 caracteres")
    private String especialidad;

    private String horarioDisponible; // Cambiado a String

    // Getters y Setters
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
}