package com.andrey.sistema_citas.service;

import com.andrey.sistema_citas.dto.ServicioCreateDTO;
import com.andrey.sistema_citas.dto.ServicioUpdateDTO;
import com.andrey.sistema_citas.dto.ServicioResponseDTO;
import com.andrey.sistema_citas.entity.Servicio;
import com.andrey.sistema_citas.exception.ResourceNotFoundException;
import com.andrey.sistema_citas.mapper.ServicioMapper;
import com.andrey.sistema_citas.repository.ServicioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ServicioService {

    private final ServicioRepository servicioRepository;

    public ServicioService(ServicioRepository servicioRepository) {
        this.servicioRepository = servicioRepository;
    }

    public ServicioResponseDTO crearServicio(ServicioCreateDTO dto) {
        servicioRepository.findByNombre(dto.getNombre()).ifPresent(s -> {
            throw new RuntimeException("Ya existe un servicio con el nombre: " + dto.getNombre());
        });

        Servicio servicio = ServicioMapper.toEntity(dto);
        Servicio guardado = servicioRepository.save(servicio);
        return ServicioMapper.toResponse(guardado);
    }

    public ServicioResponseDTO actualizarServicio(Long id, ServicioUpdateDTO dto) {
        Servicio existente = servicioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado con id: " + id));

        ServicioMapper.updateEntityFromDto(dto, existente);
        Servicio actualizado = servicioRepository.save(existente);
        return ServicioMapper.toResponse(actualizado);
    }

    public ServicioResponseDTO obtenerServicioPorId(Long id) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado con id: " + id));
        return ServicioMapper.toResponse(servicio);
    }

    public Page<ServicioResponseDTO> obtenerServiciosPaginados(Pageable pageable) {
        return servicioRepository.findAll(pageable)
                .map(ServicioMapper::toResponse);
    }

    public List<ServicioResponseDTO> obtenerTodosLosServicios() {
        return servicioRepository.findAll()
                .stream()
                .map(ServicioMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ServicioResponseDTO> buscarServiciosPorNombre(String nombre) {
        return servicioRepository.findByNombreContainingIgnoreCase(nombre)
                .stream()
                .map(ServicioMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ServicioResponseDTO> buscarServiciosPorRangoDePrecio(Double min, Double max) {
        return servicioRepository.findByPrecioBetween(min, max)
                .stream()
                .map(ServicioMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ServicioResponseDTO> buscarServiciosPorDuracion(String duracion) {
        return servicioRepository.findByDuracion(duracion)
                .stream()
                .map(ServicioMapper::toResponse)
                .collect(Collectors.toList());
    }

    public void eliminarServicio(Long id) {
        if (!servicioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Servicio no encontrado con id: " + id);
        }
        servicioRepository.deleteById(id);
    }
}