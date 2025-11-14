package com.andrey.sistema_citas.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "profesional")
public class Profesional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "especialidad", length = 255)
    private String especialidad;

    @Column(name = "horario_disponible")
    private LocalDateTime horarioDisponible;

    @OneToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    private Usuario usuario;

    public Profesional() {
        // Constructor requerido por JPA
    }

    public Profesional(String especialidad, LocalDateTime horarioDisponible, Usuario usuario) {
        this.especialidad = especialidad;
        this.horarioDisponible = horarioDisponible;
        this.usuario = usuario;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    @Override
    public String toString() {
        return "Profesional{" +
                "id=" + id +
                ", especialidad='" + especialidad + '\'' +
                ", horarioDisponible=" + horarioDisponible +
                ", usuario=" + (usuario != null ? usuario.getNombre() : "null") +
                '}';
    }
}