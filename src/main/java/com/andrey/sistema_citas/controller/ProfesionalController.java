package com.andrey.sistema_citas.controller;

import com.andrey.sistema_citas.entity.Profesional;
import com.andrey.sistema_citas.exception.ResourceNotFoundException;
import com.andrey.sistema_citas.service.ProfesionalService;
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

    // Crear profesional
    @PostMapping
    public ResponseEntity<Profesional> crearProfesional(@RequestBody Profesional profesional) {
        Profesional nuevo = profesionalService.crearProfesional(profesional);
        return ResponseEntity.ok(nuevo);
    }

    // Actualizar profesional
    @PutMapping("/{id}")
    public ResponseEntity<Profesional> actualizarProfesional(
            @PathVariable Long id,
            @RequestBody Profesional profesionalActualizado
    ) {
        Profesional actualizado = profesionalService.actualizarProfesional(id, profesionalActualizado);
        return ResponseEntity.ok(actualizado);
    }

    // Obtener todos los profesionales
    @GetMapping
    public ResponseEntity<List<Profesional>> obtenerTodos() {
        return ResponseEntity.ok(profesionalService.obtenerTodosLosProfesionales());
    }

    // Obtener profesional por ID
    @GetMapping("/{id}")
    public ResponseEntity<Profesional> obtenerPorId(@PathVariable Long id) {
        Profesional profesional = profesionalService.obtenerProfesionalPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profesional no encontrado con ID: " + id));
        return ResponseEntity.ok(profesional);
    }

    // Buscar por especialidad
    @GetMapping("/buscar")
    public ResponseEntity<List<Profesional>> buscarPorEspecialidad(@RequestParam String especialidad) {
        return ResponseEntity.ok(profesionalService.buscarProfesionalesPorEspecialidad(especialidad));
    }

    // Obtener profesional por ID del usuario
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Profesional> obtenerPorUsuarioId(@PathVariable Long usuarioId) {
        Profesional profesional = profesionalService.obtenerProfesionalPorUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("No existe profesional con usuario ID: " + usuarioId));
        return ResponseEntity.ok(profesional);
    }

    // Eliminar profesional por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        profesionalService.eliminarProfesional(id);
        return ResponseEntity.noContent().build();
    }
}


