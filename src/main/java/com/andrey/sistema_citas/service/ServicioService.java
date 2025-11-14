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

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    // Crear servicio
    public ServicioResponseDTO crearServicio(ServicioCreateDTO dto) {

        Profesional profesional = profesionalRepository.findById(dto.getProfesionalId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No existe un profesional con id: " + dto.getProfesionalId()
                ));

        // Validación de nombre único
        servicioRepository.findByNombre(dto.getNombre()).ifPresent(s -> {
            throw new RuntimeException("Ya existe un servicio con el nombre: " + dto.getNombre());
        });

        Servicio servicio = ServicioMapper.toEntity(dto);
        servicio.setProfesional(profesional);

        Servicio guardado = servicioRepository.save(servicio);
        return ServicioMapper.toResponse(guardado);
    }

    // Actualizar servicio
    public ServicioResponseDTO actualizarServicio(Long id, ServicioUpdateDTO dto) {

        Servicio existente = servicioRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Servicio no encontrado con id: " + id)
                );

        ServicioMapper.updateEntityFromDto(dto, existente);

        Servicio actualizado = servicioRepository.save(existente);
        return ServicioMapper.toResponse(actualizado);
    }

    // Obtener por ID
    public ServicioResponseDTO obtenerServicioPorId(Long id) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Servicio no encontrado con id: " + id)
                );

        return ServicioMapper.toResponse(servicio);
    }

    // Paginación
    public Page<ServicioResponseDTO> obtenerServiciosPaginados(Pageable pageable) {
        return servicioRepository.findAll(pageable)
                .map(ServicioMapper::toResponse);
    }

    // Buscar por nombre con paginación
    public Page<ServicioResponseDTO> buscarPorNombre(String nombre, Pageable pageable) {
        return servicioRepository.findByNombreContainingIgnoreCase(nombre, pageable)
                .map(ServicioMapper::toResponse);
    }

    // Eliminar
    public void eliminarServicio(Long id) {
        if (!servicioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Servicio no encontrado con id: " + id);
        }
        servicioRepository.deleteById(id);
    }

	public List<Servicio> obtenerTodosLosServicios() {
		// TODO Auto-generated method stub
		return null;
	}
}
