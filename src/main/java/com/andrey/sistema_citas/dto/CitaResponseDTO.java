package com.andrey.sistema_citas.dto;

import com.andrey.sistema_citas.entity.EstadoCita;
import java.time.LocalDateTime;

public class CitaResponseDTO {

    private Long id;
    private LocalDateTime fechaHora;
    private EstadoCita estado;
    
    private Long usuarioId;
    private String usuarioNombre;
    
    private Long servicioId;
    private String servicioNombre;
    private String servicioDuracion;
    private Double servicioPrecio;
    
    private Long profesionalId;
    private String profesionalNombre;
    private String profesionalEspecialidad;

    public CitaResponseDTO() {}

    // Constructor completo para facilitar mapeo
    public CitaResponseDTO(Long id, LocalDateTime fechaHora, EstadoCita estado,
                          Long usuarioId, String usuarioNombre,
                          Long servicioId, String servicioNombre, String servicioDuracion, Double servicioPrecio,
                          Long profesionalId, String profesionalNombre, String profesionalEspecialidad) {
        this.id = id;
        this.fechaHora = fechaHora;
        this.estado = estado;
        this.usuarioId = usuarioId;
        this.usuarioNombre = usuarioNombre;
        this.servicioId = servicioId;
        this.servicioNombre = servicioNombre;
        this.servicioDuracion = servicioDuracion;
        this.servicioPrecio = servicioPrecio;
        this.profesionalId = profesionalId;
        this.profesionalNombre = profesionalNombre;
        this.profesionalEspecialidad = profesionalEspecialidad;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getUsuarioNombre() {
        return usuarioNombre;
    }

    public void setUsuarioNombre(String usuarioNombre) {
        this.usuarioNombre = usuarioNombre;
    }

    public Long getServicioId() {
        return servicioId;
    }

    public void setServicioId(Long servicioId) {
        this.servicioId = servicioId;
    }

    public String getServicioNombre() {
        return servicioNombre;
    }

    public void setServicioNombre(String servicioNombre) {
        this.servicioNombre = servicioNombre;
    }

    public String getServicioDuracion() {
        return servicioDuracion;
    }

    public void setServicioDuracion(String servicioDuracion) {
        this.servicioDuracion = servicioDuracion;
    }

    public Double getServicioPrecio() {
        return servicioPrecio;
    }

    public void setServicioPrecio(Double servicioPrecio) {
        this.servicioPrecio = servicioPrecio;
    }

    public Long getProfesionalId() {
        return profesionalId;
    }

    public void setProfesionalId(Long profesionalId) {
        this.profesionalId = profesionalId;
    }

    public String getProfesionalNombre() {
        return profesionalNombre;
    }

    public void setProfesionalNombre(String profesionalNombre) {
        this.profesionalNombre = profesionalNombre;
    }

    public String getProfesionalEspecialidad() {
        return profesionalEspecialidad;
    }

    public void setProfesionalEspecialidad(String profesionalEspecialidad) {
        this.profesionalEspecialidad = profesionalEspecialidad;
    }
}