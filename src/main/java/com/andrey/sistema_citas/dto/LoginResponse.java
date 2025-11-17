package com.andrey.sistema_citas.dto;

import com.andrey.sistema_citas.entity.Role;
import java.util.Set;

public class LoginResponse {

    private Long id;
    private String nombre;
    private String email;
    private Set<Role> roles;
    private String token;
    private String tokenType = "Bearer";

    public LoginResponse() {}

    public LoginResponse(Long id, String nombre, String email, Set<Role> roles, String token) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.roles = roles;
        this.token = token;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
}