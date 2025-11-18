package com.andrey.sistema_citas.dto;

import java.time.LocalDateTime;

public class UsuarioResponseDTO {

    private Long id;
    private String nombre;
    private String email;
    private String telefono;
    private String role;
    private LocalDateTime fechaRegistro;

    // Constructor vacío (requerido para el mapper, frameworks, Jackson)
    public UsuarioResponseDTO() {
    }

    // Constructor completo (opcional)
    public UsuarioResponseDTO(Long id, String nombre, String email, String telefono, String role, LocalDateTime fechaRegistro) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.role = role;
        this.fechaRegistro = fechaRegistro;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getEmail() {
        return email;
    }

    public String getTelefono() {
        return telefono;
    }

    public String getRole() {
        return role;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
}

