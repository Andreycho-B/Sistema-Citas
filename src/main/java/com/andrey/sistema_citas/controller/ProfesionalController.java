package com.andrey.sistema_citas.controller;

import com.andrey.sistema_citas.dto.ProfesionalCreateDTO;
import com.andrey.sistema_citas.dto.ProfesionalResponseDTO;
import com.andrey.sistema_citas.dto.ProfesionalUpdateDTO;
import com.andrey.sistema_citas.service.ProfesionalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profesionales")
public class ProfesionalController {

    private final ProfesionalService profesionalService;

    public ProfesionalController(ProfesionalService profesionalService) {
        this.profesionalService = profesionalService;
    }

    @PostMapping
    public ResponseEntity<ProfesionalResponseDTO> crearProfesional(@Valid @RequestBody ProfesionalCreateDTO dto) {
        ProfesionalResponseDTO nuevo = profesionalService.crearProfesional(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfesionalResponseDTO> actualizarProfesional(
            @PathVariable Long id,
            @Valid @RequestBody ProfesionalUpdateDTO dto) {
        ProfesionalResponseDTO actualizado = profesionalService.actualizarProfesional(id, dto);
        return ResponseEntity.ok(actualizado);
    }

    @GetMapping
    public ResponseEntity<List<ProfesionalResponseDTO>> obtenerTodos() {
        List<ProfesionalResponseDTO> profesionales = profesionalService.obtenerTodosLosProfesionales();
        return ResponseEntity.ok(profesionales);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfesionalResponseDTO> obtenerPorId(@PathVariable Long id) {
        ProfesionalResponseDTO profesional = profesionalService.obtenerProfesionalPorId(id);
        return ResponseEntity.ok(profesional);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ProfesionalResponseDTO>> buscarPorEspecialidad(@RequestParam String especialidad) {
        List<ProfesionalResponseDTO> profesionales = profesionalService.buscarProfesionalesPorEspecialidad(especialidad);
        return ResponseEntity.ok(profesionales);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<ProfesionalResponseDTO> obtenerPorUsuarioId(@PathVariable Long usuarioId) {
        ProfesionalResponseDTO profesional = profesionalService.obtenerProfesionalPorUsuarioId(usuarioId);
        return ResponseEntity.ok(profesional);
    }

    // --- Endpoints de disponibilidad comentados ---
    // Estos endpoints han sido deshabilitados porque los métodos de servicio correspondientes
    // dependían de consultas a la base de datos poco fiables (comparación de String con LocalDateTime).
    // La lógica de disponibilidad debe ser reimplementada en el futuro.
    /*
    @GetMapping("/disponibles")
    public ResponseEntity<List<ProfesionalResponseDTO>> buscarDisponiblesDespuesDe(@RequestParam LocalDateTime fecha) {
        List<ProfesionalResponseDTO> profesionales = profesionalService.buscarProfesionalesDisponiblesDespuesDe(fecha);
        return ResponseEntity.ok(profesionales);
    }

    @GetMapping("/disponibles/rango")
    public ResponseEntity<List<ProfesionalResponseDTO>> buscarDisponiblesEnRango(
            @RequestParam LocalDateTime inicio,
            @RequestParam LocalDateTime fin) {
        List<ProfesionalResponseDTO> profesionales = profesionalService.buscarProfesionalesDisponiblesEnRango(inicio, fin);
        return ResponseEntity.ok(profesionales);
    }
    */

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        profesionalService.eliminarProfesional(id);
        return ResponseEntity.noContent().build();
    }
}
