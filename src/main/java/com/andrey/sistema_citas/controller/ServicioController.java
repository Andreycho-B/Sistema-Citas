package com.andrey.sistema_citas.controller;

import com.andrey.sistema_citas.dto.ServicioCreateDTO;
import com.andrey.sistema_citas.dto.ServicioResponseDTO;
import com.andrey.sistema_citas.dto.ServicioUpdateDTO;
import com.andrey.sistema_citas.entity.Servicio;
import com.andrey.sistema_citas.mapper.ServicioMapper;
import com.andrey.sistema_citas.service.ServicioService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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

    @PostMapping
    public ServicioResponseDTO crearServicio(@RequestBody ServicioCreateDTO dto) {
        Servicio servicio = ServicioMapper.toEntity(dto);
        Servicio guardado = servicioService.guardarServicio(servicio);
        return ServicioMapper.toResponse(guardado);
    }

    @GetMapping
    public Page<ServicioResponseDTO> obtenerServiciosPaginados(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageRequest pageable = PageRequest.of(page, size);
        List<Servicio> servicios = servicioService.obtenerTodosLosServicios();

        int start = Math.min((int) pageable.getOffset(), servicios.size());
        int end = Math.min(start + pageable.getPageSize(), servicios.size());

        List<ServicioResponseDTO> contenido = servicios.subList(start, end)
                .stream()
                .map(ServicioMapper::toResponse)
                .collect(Collectors.toList());

        return new PageImpl<>(contenido, pageable, servicios.size());
    }

    @GetMapping("/{id}")
    public ServicioResponseDTO obtenerPorId(@PathVariable Long id) {
        Servicio servicio = servicioService.obtenerServicioPorId(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        return ServicioMapper.toResponse(servicio);
    }

    @GetMapping("/buscar")
    public List<ServicioResponseDTO> buscarPorNombre(@RequestParam String nombre) {
        return servicioService.buscarServiciosPorNombre(nombre)
                .stream()
                .map(ServicioMapper::toResponse)
                .collect(Collectors.toList());
    }

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

    @GetMapping("/duracion")
    public List<ServicioResponseDTO> buscarPorDuracion(@RequestParam String duracion) {
        return servicioService.buscarServiciosPorDuracion(duracion)
                .stream()
                .map(ServicioMapper::toResponse)
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public ServicioResponseDTO actualizarServicio(
            @PathVariable Long id,
            @RequestBody ServicioUpdateDTO dto
    ) {
        Servicio servicio = servicioService.obtenerServicioPorId(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        ServicioMapper.updateEntityFromDto(dto, servicio);

        Servicio actualizado = servicioService.guardarServicio(servicio);
        return ServicioMapper.toResponse(actualizado);
    }


    @DeleteMapping("/{id}")
    public void eliminarServicio(@PathVariable Long id) {
        servicioService.eliminarServicio(id);
    }
}
