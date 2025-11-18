package com.andrey.sistema_citas.controller;

import com.andrey.sistema_citas.dto.CitaCreateDTO;
import com.andrey.sistema_citas.dto.CitaResponseDTO;
import com.andrey.sistema_citas.dto.CitaUpdateDTO;
import com.andrey.sistema_citas.entity.EstadoCita;
import com.andrey.sistema_citas.service.CitaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/citas")
public class CitaController {

    private final CitaService citaService;

    public CitaController(CitaService citaService) {
        this.citaService = citaService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CitaResponseDTO>> obtenerTodasLasCitas() {
        List<CitaResponseDTO> citas = citaService.obtenerTodasLasCitas();
        return ResponseEntity.ok(citas);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @authz.esPropietarioCita(#id, authentication)")
    public ResponseEntity<CitaResponseDTO> obtenerCitaPorId(@PathVariable Long id) {
        CitaResponseDTO cita = citaService.obtenerCitaPorId(id);
        return ResponseEntity.ok(cita);
    }

    @PostMapping
    public ResponseEntity<CitaResponseDTO> agendarCita(@Valid @RequestBody CitaCreateDTO request) {
        CitaResponseDTO cita = citaService.agendarCita(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(cita);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @authz.puedeModificarCita(#id, authentication)")
    public ResponseEntity<CitaResponseDTO> actualizarCita(
            @PathVariable Long id,
            @Valid @RequestBody CitaUpdateDTO dto) {
        CitaResponseDTO actualizada = citaService.actualizarCita(id, dto);
        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarCita(@PathVariable Long id) {
        citaService.eliminarCita(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<CitaResponseDTO>> obtenerCitasPorUsuario(@PathVariable Long usuarioId) {
        List<CitaResponseDTO> citas = citaService.obtenerCitasPorUsuario(usuarioId);
        return ResponseEntity.ok(citas);
    }

    @GetMapping("/profesional/{profesionalId}")
    public ResponseEntity<List<CitaResponseDTO>> obtenerCitasPorProfesional(@PathVariable Long profesionalId) {
        List<CitaResponseDTO> citas = citaService.obtenerCitasPorProfesional(profesionalId);
        return ResponseEntity.ok(citas);
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<CitaResponseDTO>> obtenerCitasPorEstado(@PathVariable EstadoCita estado) {
        List<CitaResponseDTO> citas = citaService.obtenerCitasPorEstado(estado);
        return ResponseEntity.ok(citas);
    }

    @PatchMapping("/{id}/confirmar")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSIONAL')")
    public ResponseEntity<CitaResponseDTO> confirmarCita(@PathVariable Long id) {
        CitaResponseDTO cita = citaService.confirmarCita(id);
        return ResponseEntity.ok(cita);
    }

    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasRole('ADMIN') or @authz.puedeModificarCita(#id, authentication)")
    public ResponseEntity<CitaResponseDTO> cancelarCita(@PathVariable Long id) {
        CitaResponseDTO cita = citaService.cancelarCita(id);
        return ResponseEntity.ok(cita);
    }

    @PatchMapping("/{id}/completar")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSIONAL')")
    public ResponseEntity<CitaResponseDTO> completarCita(@PathVariable Long id) {
        CitaResponseDTO cita = citaService.completarCita(id);
        return ResponseEntity.ok(cita);
    }

    @GetMapping("/rango")
    public ResponseEntity<List<CitaResponseDTO>> obtenerCitasEnRango(
            @RequestParam LocalDateTime inicio, 
            @RequestParam LocalDateTime fin) {
        List<CitaResponseDTO> citas = citaService.obtenerCitasEnRango(inicio, fin);
        return ResponseEntity.ok(citas);
    }

    @GetMapping("/estadisticas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Object[]>> obtenerEstadisticasCitasPorEstado() {
        List<Object[]> estadisticas = citaService.obtenerEstadisticasCitasPorEstado();
        return ResponseEntity.ok(estadisticas);
    }
}