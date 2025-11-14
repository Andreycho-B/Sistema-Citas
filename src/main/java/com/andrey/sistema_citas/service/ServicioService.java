package com.andrey.sistema_citas.service;

import com.andrey.sistema_citas.dto.ServicioCreateDTO;
import com.andrey.sistema_citas.dto.ServicioUpdateDTO;
import com.andrey.sistema_citas.dto.ServicioResponseDTO;
import com.andrey.sistema_citas.entity.Profesional;
import com.andrey.sistema_citas.entity.Servicio;
import com.andrey.sistema_citas.exception.ResourceNotFoundException;
import com.andrey.sistema_citas.mapper.ServicioMapper;
import com.andrey.sistema_citas.repository.ProfesionalRepository;
import com.andrey.sistema_citas.repository.ServicioRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ServicioService {

    private final ServicioRepository servicioRepository;
    private final ProfesionalRepository profesionalRepository;

    public ServicioService(ServicioRepository servicioRepository,
                           ProfesionalRepository profesionalRepository) {
        this.servicioRepository = servicioRepository;
        this.profesionalRepository = profesionalRepository;
    }

    // -------------------------------------------------------------------------
    // CREAR SERVICIO
    // -------------------------------------------------------------------------
    public ServicioResponseDTO crearServicio(ServicioCreateDTO dto) {

        // Validar profesional
        Profesional profesional = profesionalRepository.findById(dto.getProfesionalId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No existe un profesional con id: " + dto.getProfesionalId()
                ));

        // Validar nombre único
        servicioRepository.findByNombre(dto.getNombre()).ifPresent(s -> {
            throw new RuntimeException("Ya existe un servicio con el nombre: " + dto.getNombre());
        });

        Servicio servicio = ServicioMapper.toEntity(dto);
        servicio.setProfesional(profesional);

        Servicio guardado = servicioRepository.save(servicio);
        return ServicioMapper.toResponse(guardado);
    }

    // -------------------------------------------------------------------------
    // ACTUALIZAR SERVICIO
    // -------------------------------------------------------------------------
    public ServicioResponseDTO actualizarServicioDTO(Long id, ServicioUpdateDTO dto) {

        Servicio existente = servicioRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Servicio no encontrado con id: " + id)
                );

        ServicioMapper.updateEntityFromDto(dto, existente);

        Servicio actualizado = servicioRepository.save(existente);
        return ServicioMapper.toResponse(actualizado);
    }

    // -------------------------------------------------------------------------
    // OBTENER POR ID (para controller)
    // -------------------------------------------------------------------------
    public Optional<Servicio> obtenerServicioPorId(Long id) {
        return servicioRepository.findById(id);
    }

    // -------------------------------------------------------------------------
    // PÁGINA COMPLETA DE SERVICIOS
    // -------------------------------------------------------------------------
    public Page<ServicioResponseDTO> obtenerServiciosPaginados(Pageable pageable) {
        return servicioRepository.findAll(pageable)
                .map(ServicioMapper::toResponse);
    }

    // -------------------------------------------------------------------------
    // BUSCAR POR NOMBRE
    // -------------------------------------------------------------------------
    public List<Servicio> buscarServiciosPorNombre(String nombre) {
        return servicioRepository.findByNombreContainingIgnoreCase(nombre);
    }

    // -------------------------------------------------------------------------
    // BUSCAR POR RANGO DE PRECIO
    // -------------------------------------------------------------------------
    public List<Servicio> buscarServiciosPorRangoDePrecio(Double min, Double max) {
        return servicioRepository.findByPrecioBetween(min, max);
    }

    // -------------------------------------------------------------------------
    // BUSCAR POR DURACIÓN
    // -------------------------------------------------------------------------
    public List<Servicio> buscarServiciosPorDuracion(String duracion) {
        return servicioRepository.findByDuracion(duracion);
    }

    // -------------------------------------------------------------------------
    // ELIMINAR
    // -------------------------------------------------------------------------
    public void eliminarServicio(Long id) {
        if (!servicioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Servicio no encontrado con id: " + id);
        }
        servicioRepository.deleteById(id);
    }
}


