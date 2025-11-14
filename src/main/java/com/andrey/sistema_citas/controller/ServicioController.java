package com.andrey.sistema_citas.controller;

import com.andrey.sistema_citas.dto.ServicioCreateDTO;
import com.andrey.sistema_citas.dto.ServicioResponseDTO;
import com.andrey.sistema_citas.dto.ServicioUpdateDTO;
import com.andrey.sistema_citas.entity.Servicio;
import com.andrey.sistema_citas.mapper.ServicioMapper;
import com.andrey.sistema_citas.service.ServicioService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = "*")
public class ServicioController {

    private final ServicioService servicioService;

    public ServicioController(ServicioService servicioService) {
        this.servicioService = servicioService;
    }

    // -------------------------------------------------------------------------
    // CREAR SERVICIO (usa DTO completo = profesionalId + datos)
    // -------------------------------------------------------------------------
    @PostMapping
    public ServicioResponseDTO crearServicio(@RequestBody ServicioCreateDTO dto) {
        return servicioService.crearServicio(dto);
    }

    // -------------------------------------------------------------------------
    // LISTAR SERVICIOS CON PAGINACIÓN
    // -------------------------------------------------------------------------
    @GetMapping
    public Page<ServicioResponseDTO> obtenerServiciosPaginados(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return servicioService.obtenerServiciosPaginados(PageRequest.of(page, size));
    }

    // -------------------------------------------------------------------------
    // OBTENER SERVICIO POR ID
    // -------------------------------------------------------------------------
    @GetMapping("/{id}")
    public ServicioResponseDTO obtenerPorId(@PathVariable Long id) {
        Servicio servicio = servicioService.obtenerServicioPorId(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        return ServicioMapper.toResponse(servicio);
    }

    // -------------------------------------------------------------------------
    // BUSCAR POR NOMBRE (SIN PAGINAR)
    // -------------------------------------------------------------------------
    @GetMapping("/buscar")
    public List<ServicioResponseDTO> buscarPorNombre(@RequestParam String nombre) {
        return servicioService.buscarServiciosPorNombre(nombre)
                .stream()
                .map(ServicioMapper::toResponse)
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------------------------
    // BUSCAR POR RANGO DE PRECIO
    // -------------------------------------------------------------------------
    @GetMapping("/rango-precio")
    public List<ServicioResponseDTO> buscarPorRangoPrecio(
            @RequestParam Double min,
            @RequestParam Double max
    ) {
        return servicioService.buscarServiciosPorRangoDePrecio(min, max)
                .stream()
                .map(ServicioMapper::toResponse)
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------------------------
    // BUSCAR POR DURACIÓN
    // -------------------------------------------------------------------------
    @GetMapping("/duracion")
    public List<ServicioResponseDTO> buscarPorDuracion(@RequestParam String duracion) {
        return servicioService.buscarServiciosPorDuracion(duracion)
                .stream()
                .map(ServicioMapper::toResponse)
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------------------------
    // ACTUALIZAR SERVICIO
    // -------------------------------------------------------------------------
    @PutMapping("/{id}")
    public ServicioResponseDTO actualizarServicio(
            @PathVariable Long id,
            @RequestBody ServicioUpdateDTO dto
    ) {
        return servicioService.actualizarServicioDTO(id, dto);
    }

    // -------------------------------------------------------------------------
    // ELIMINAR SERVICIO
    // -------------------------------------------------------------------------
    @DeleteMapping("/{id}")
    public void eliminarServicio(@PathVariable Long id) {
        servicioService.eliminarServicio(id);
    }
}
