package com.andrey.sistema_citas.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "profesional")
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = {"usuario", "citas"})
public class Profesional {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 255)
    private String especialidad;
    
    @Column(name = "horario_disponible", length = 500)
    private String horarioDisponible;
    
    @OneToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false, unique = true)
    private Usuario usuario;
    
    @OneToMany(mappedBy = "profesional")
    @JsonIgnore
    private List<Cita> citas = new ArrayList<>();
    
    public Profesional(String especialidad, String horarioDisponible, Usuario usuario) {
        this.especialidad = especialidad;
        this.horarioDisponible = horarioDisponible;
        this.usuario = usuario;
    }
}