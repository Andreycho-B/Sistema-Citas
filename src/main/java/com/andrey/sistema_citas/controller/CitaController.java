package com.andrey.sistema_citas.controller;

import com.andrey.sistema_citas.entity.Cita;
import com.andrey.sistema_citas.service.CitaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/citas")
public class CitaController {

    private final CitaService citaService;

    public CitaController(CitaService citaService) {
        this.citaService = citaService;
    }

    // Obtener todas las citas
    @GetMapping
    public ResponseEntity<List<Cita>> obtenerTodasLasCitas() {
        List<Cita> citas = citaService.obtenerTodasLasCitas();
        return ResponseEntity.ok(citas);
    }

    // Obtener una cita por ID
    @GetMapping("/{id}")
    public ResponseEntity<Cita> obtenerCitaPorId(@PathVariable Long id) {
        Optional<Cita> cita = citaService.obtenerCitaPorId(id);
        return cita.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    // Agendar una nueva cita
    @PostMapping
    public ResponseEntity<?> agendarCita(@RequestBody CitaRequest request) {
        try {
            Cita cita = citaService.agendarCita(
                request.getUsuarioId(),
                request.getServicioId(), 
                request.getProfesionalId(),
                request.getFechaHora()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(cita);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Actualizar una cita existente
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCita(@PathVariable Long id, @RequestBody Cita cita) {
        // Verificar que la cita exista
        Optional<Cita> citaExistente = citaService.obtenerCitaPorId(id);
        if (citaExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Asegurar que el ID del cuerpo coincida con el ID de la ruta
        cita.setId(id);
        // Nota: Para actualizar una cita, se debería tener un método específico en el servicio
        // que maneje las validaciones. Por simplicidad, usamos guardar, pero en un caso real
        // sería mejor tener un método actualizarCita con validaciones.
        try {
            // Como no tenemos un método actualizar específico, usamos guardar pero con las validaciones?
            // En este caso, podríamos permitir la actualización sin las mismas validaciones de agendamiento
            // o podríamos crear un método de actualización en el servicio. Por ahora, usamos guardar.
            Cita citaActualizada = citaService.cambiarEstadoCita(id, cita.getEstado());
            return ResponseEntity.ok(citaActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Eliminar una cita
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCita(@PathVariable Long id) {
        Optional<Cita> cita = citaService.obtenerCitaPorId(id);
        if (cita.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        citaService.eliminarCita(id);
        return ResponseEntity.noContent().build();
    }

    // Obtener citas por usuario
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Cita>> obtenerCitasPorUsuario(@PathVariable Long usuarioId) {
        List<Cita> citas = citaService.obtenerCitasPorUsuario(usuarioId);
        return ResponseEntity.ok(citas);
    }

    // Obtener citas por profesional
    @GetMapping("/profesional/{profesionalId}")
    public ResponseEntity<List<Cita>> obtenerCitasPorProfesional(@PathVariable Long profesionalId) {
        List<Cita> citas = citaService.obtenerCitasPorProfesional(profesionalId);
        return ResponseEntity.ok(citas);
    }

    // Obtener citas por estado
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Cita>> obtenerCitasPorEstado(@PathVariable String estado) {
        List<Cita> citas = citaService.obtenerCitasPorEstado(estado);
        return ResponseEntity.ok(citas);
    }

    // Confirmar una cita
    @PatchMapping("/{id}/confirmar")
    public ResponseEntity<Cita> confirmarCita(@PathVariable Long id) {
        try {
            Cita cita = citaService.confirmarCita(id);
            return ResponseEntity.ok(cita);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Cancelar una cita
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Cita> cancelarCita(@PathVariable Long id) {
        try {
            Cita cita = citaService.cancelarCita(id);
            return ResponseEntity.ok(cita);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Completar una cita
    @PatchMapping("/{id}/completar")
    public ResponseEntity<Cita> completarCita(@PathVariable Long id) {
        try {
            Cita cita = citaService.completarCita(id);
            return ResponseEntity.ok(cita);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Obtener citas en un rango de fechas
    @GetMapping("/rango")
    public ResponseEntity<List<Cita>> obtenerCitasEnRango(
            @RequestParam LocalDateTime inicio, 
            @RequestParam LocalDateTime fin) {
        List<Cita> citas = citaService.obtenerCitasEnRango(inicio, fin);
        return ResponseEntity.ok(citas);
    }

    // Obtener estadísticas de citas por estado
    @GetMapping("/estadisticas")
    public ResponseEntity<List<Object[]>> obtenerEstadisticasCitasPorEstado() {
        List<Object[]> estadisticas = citaService.obtenerEstadisticasCitasPorEstado();
        return ResponseEntity.ok(estadisticas);
    }

    // Clase interna para representar la solicitud de agendamiento de cita
    public static class CitaRequest {
        private Long usuarioId;
        private Long servicioId;
        private Long profesionalId;
        private LocalDateTime fechaHora;

        // Getters y Setters
        public Long getUsuarioId() {
            return usuarioId;
        }

        public void setUsuarioId(Long usuarioId) {
            this.usuarioId = usuarioId;
        }

        public Long getServicioId() {
            return servicioId;
        }

        public void setServicioId(Long servicioId) {
            this.servicioId = servicioId;
        }

        public Long getProfesionalId() {
            return profesionalId;
        }

        public void setProfesionalId(Long profesionalId) {
            this.profesionalId = profesionalId;
        }

        public LocalDateTime getFechaHora() {
            return fechaHora;
        }

        public void setFechaHora(LocalDateTime fechaHora) {
            this.fechaHora = fechaHora;
        }
    }
}