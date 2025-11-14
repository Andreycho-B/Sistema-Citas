package com.andrey.sistema_citas.dto;

public class ServicioCreateDTO {

    private String nombre;
    private String descripcion;
    private String duracion;
    private Double precio;
    private Long profesionalId;

    public ServicioCreateDTO() {}

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getDuracion() { return duracion; }
    public void setDuracion(String duracion) { this.duracion = duracion; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public Long getProfesionalId() { return profesionalId; }
    public void setProfesionalId(Long profesionalId) { this.profesionalId = profesionalId; }
}

