package com.andrey.sistema_citas.controller;

import com.andrey.sistema_citas.entity.Cita;
import com.andrey.sistema_citas.service.CitaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.andrey.sistema_citas.entity.EstadoCita;

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

    
    @GetMapping
    public ResponseEntity<List<Cita>> obtenerTodasLasCitas() {
        List<Cita> citas = citaService.obtenerTodasLasCitas();
        return ResponseEntity.ok(citas);
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<Cita> obtenerCitaPorId(@PathVariable Long id) {
        Optional<Cita> cita = citaService.obtenerCitaPorId(id);
        return cita.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    
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

   
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCita(@PathVariable Long id, @RequestBody Cita cita) {
       
        Optional<Cita> citaExistente = citaService.obtenerCitaPorId(id);
        if (citaExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        
        cita.setId(id);
        
        try {
           
        	Cita citaActualizada = citaService.cambiarEstadoCita(id, cita.getEstado());
            return ResponseEntity.ok(citaActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

   
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCita(@PathVariable Long id) {
        Optional<Cita> cita = citaService.obtenerCitaPorId(id);
        if (cita.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        citaService.eliminarCita(id);
        return ResponseEntity.noContent().build();
    }

  
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Cita>> obtenerCitasPorUsuario(@PathVariable Long usuarioId) {
        List<Cita> citas = citaService.obtenerCitasPorUsuario(usuarioId);
        return ResponseEntity.ok(citas);
    }

   
    @GetMapping("/profesional/{profesionalId}")
    public ResponseEntity<List<Cita>> obtenerCitasPorProfesional(@PathVariable Long profesionalId) {
        List<Cita> citas = citaService.obtenerCitasPorProfesional(profesionalId);
        return ResponseEntity.ok(citas);
    }

    
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Cita>> obtenerCitasPorEstado(@PathVariable String estado) {
        List<Cita> citas = citaService.obtenerCitasPorEstado(estado);
        return ResponseEntity.ok(citas);
    }

    
    @PatchMapping("/{id}/confirmar")
    public ResponseEntity<Cita> confirmarCita(@PathVariable Long id) {
        try {
            Cita cita = citaService.confirmarCita(id);
            return ResponseEntity.ok(cita);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Cita> cancelarCita(@PathVariable Long id) {
        try {
            Cita cita = citaService.cancelarCita(id);
            return ResponseEntity.ok(cita);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

   
    @PatchMapping("/{id}/completar")
    public ResponseEntity<Cita> completarCita(@PathVariable Long id) {
        try {
            Cita cita = citaService.completarCita(id);
            return ResponseEntity.ok(cita);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

   
    @GetMapping("/rango")
    public ResponseEntity<List<Cita>> obtenerCitasEnRango(
            @RequestParam LocalDateTime inicio, 
            @RequestParam LocalDateTime fin) {
        List<Cita> citas = citaService.obtenerCitasEnRango(inicio, fin);
        return ResponseEntity.ok(citas);
    }

    
    @GetMapping("/estadisticas")
    public ResponseEntity<List<Object[]>> obtenerEstadisticasCitasPorEstado() {
        List<Object[]> estadisticas = citaService.obtenerEstadisticasCitasPorEstado();
        return ResponseEntity.ok(estadisticas);
    }

   
    public static class CitaRequest {
        private Long usuarioId;
        private Long servicioId;
        private Long profesionalId;
        private LocalDateTime fechaHora;

       
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