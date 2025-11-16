package com.andrey.sistema_citas.controller;

import com.andrey.sistema_citas.dto.ServicioCreateDTO;
import com.andrey.sistema_citas.dto.ServicioResponseDTO;
import com.andrey.sistema_citas.dto.ServicioUpdateDTO;
import com.andrey.sistema_citas.service.ServicioService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = "http://localhost:5173") // React/Vite
public class ServicioController {

    private final ServicioService servicioService;

    public ServicioController(ServicioService servicioService) {
        this.servicioService = servicioService;
    }

    @PostMapping
    public ResponseEntity<ServicioResponseDTO> crearServicio(@Valid @RequestBody ServicioCreateDTO dto) {
        ServicioResponseDTO nuevo = servicioService.crearServicio(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @GetMapping
    public ResponseEntity<Page<ServicioResponseDTO>> obtenerServiciosPaginados(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ServicioResponseDTO> servicios = servicioService.obtenerServiciosPaginados(PageRequest.of(page, size));
        return ResponseEntity.ok(servicios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServicioResponseDTO> obtenerPorId(@PathVariable Long id) {
        ServicioResponseDTO servicio = servicioService.obtenerServicioPorId(id);
        return ResponseEntity.ok(servicio);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ServicioResponseDTO>> buscarPorNombre(@RequestParam String nombre) {
        List<ServicioResponseDTO> servicios = servicioService.buscarServiciosPorNombre(nombre);
        return ResponseEntity.ok(servicios);
    }

    @GetMapping("/rango-precio")
    public ResponseEntity<List<ServicioResponseDTO>> buscarPorRangoPrecio(
            @RequestParam Double min,
            @RequestParam Double max
    ) {
        List<ServicioResponseDTO> servicios = servicioService.buscarServiciosPorRangoDePrecio(min, max);
        return ResponseEntity.ok(servicios);
    }

    @GetMapping("/duracion")
    public ResponseEntity<List<ServicioResponseDTO>> buscarPorDuracion(@RequestParam String duracion) {
        List<ServicioResponseDTO> servicios = servicioService.buscarServiciosPorDuracion(duracion);
        return ResponseEntity.ok(servicios);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServicioResponseDTO> actualizarServicio(
            @PathVariable Long id,
            @Valid @RequestBody ServicioUpdateDTO dto
    ) {
        ServicioResponseDTO actualizado = servicioService.actualizarServicio(id, dto);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarServicio(@PathVariable Long id) {
        servicioService.eliminarServicio(id);
        return ResponseEntity.noContent().build();
    }
}