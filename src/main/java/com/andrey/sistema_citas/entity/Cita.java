package com.andrey.sistema_citas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Table(name = "cita")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", length = 50, nullable = false)
    private EstadoCita estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servicio_id", nullable = false)
    private Servicio servicio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profesional_id", nullable = false)
    private Profesional profesional;

    public Cita(LocalDateTime fechaHora, EstadoCita estado, Usuario usuario, Servicio servicio, Profesional profesional) {
        this.fechaHora = fechaHora;
        this.estado = estado;
        this.usuario = usuario;
        this.servicio = servicio;
        this.profesional = profesional;
    }

    @PrePersist
    protected void onCreate() {
        if (this.estado == null) {
            this.estado = EstadoCita.PENDIENTE;
        }
    }
}