package com.andrey.sistema_citas.service;

import com.andrey.sistema_citas.dto.ServicioCreateDTO;
import com.andrey.sistema_citas.dto.ServicioUpdateDTO;
import com.andrey.sistema_citas.dto.ServicioResponseDTO;
import com.andrey.sistema_citas.entity.Servicio;
import com.andrey.sistema_citas.entity.Profesional;
import com.andrey.sistema_citas.entity.Usuario;
import com.andrey.sistema_citas.exception.ResourceNotFoundException;
import com.andrey.sistema_citas.mapper.ServicioMapper;
import com.andrey.sistema_citas.repository.ServicioRepository;
import com.andrey.sistema_citas.repository.ProfesionalRepository;
import com.andrey.sistema_citas.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import com.andrey.sistema_citas.exception.DuplicateResourceException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ServicioService {

    private final ServicioRepository servicioRepository;
    private final ProfesionalRepository profesionalRepository;
    private final UsuarioRepository usuarioRepository;

    public ServicioService(ServicioRepository servicioRepository,
                          ProfesionalRepository profesionalRepository,
                          UsuarioRepository usuarioRepository) {
        this.servicioRepository = servicioRepository;
        this.profesionalRepository = profesionalRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public ServicioResponseDTO crearServicio(ServicioCreateDTO dto) {
        servicioRepository.findByNombre(dto.getNombre()).ifPresent(s -> {
        	throw new DuplicateResourceException("Ya existe un servicio con el nombre: " + dto.getNombre());
        });

        Servicio servicio = ServicioMapper.toEntity(dto);
        
        // Si se proporciona un profesionalId, asignar el profesional al servicio
        if (dto.getProfesionalId() != null) {
            com.andrey.sistema_citas.entity.Profesional profesional = 
                profesionalRepository.findById(dto.getProfesionalId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                        "Profesional no encontrado con ID: " + dto.getProfesionalId()));
            servicio.setProfesional(profesional);
        }
        // Si no se proporciona profesionalId, el servicio es global (creado por ADMIN)
        
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

    public List<ServicioResponseDTO> obtenerServiciosPorProfesional(Long profesionalId) {
        return servicioRepository.findByProfesionalId(profesionalId)
                .stream()
                .map(ServicioMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ServicioResponseDTO> obtenerServiciosGlobales() {
        return servicioRepository.findByProfesionalIsNull()
                .stream()
                .map(ServicioMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Long obtenerProfesionalIdPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .flatMap(usuario -> profesionalRepository.findByUsuarioId(usuario.getId()))
                .map(Profesional::getId)
                .orElse(null);
    }
}