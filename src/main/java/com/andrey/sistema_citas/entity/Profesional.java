package com.andrey.sistema_citas.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @OneToMany(mappedBy = "profesional")
    private List<Cita> citas = new ArrayList<>();

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

    public List<Cita> getCitas() {
        return citas;
    }

    public void setCitas(List<Cita> citas) {
        this.citas = citas;
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