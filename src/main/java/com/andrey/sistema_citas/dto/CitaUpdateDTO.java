package com.andrey.sistema_citas.dto;

import com.andrey.sistema_citas.entity.EstadoCita;
import jakarta.validation.constraints.Future;
import java.time.LocalDateTime;

public class CitaUpdateDTO {

    @Future(message = "La fecha debe ser futura")
    private LocalDateTime fechaHora;

    private EstadoCita estado;

    public CitaUpdateDTO() {}

    // Getters y Setters
    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public EstadoCita getEstado() {
        return estado;
    }

    public void setEstado(EstadoCita estado) {
        this.estado = estado;
    }
}