package com.andrey.sistema_citas.service;

import com.andrey.sistema_citas.dto.CitaCreateDTO;
import com.andrey.sistema_citas.dto.CitaResponseDTO;
import com.andrey.sistema_citas.dto.CitaUpdateDTO;
import com.andrey.sistema_citas.entity.Cita;
import com.andrey.sistema_citas.entity.EstadoCita;
import com.andrey.sistema_citas.entity.Usuario;
import com.andrey.sistema_citas.entity.Servicio;
import com.andrey.sistema_citas.entity.Profesional;
import com.andrey.sistema_citas.exception.ResourceNotFoundException;
import com.andrey.sistema_citas.mapper.CitaMapper;
import com.andrey.sistema_citas.repository.CitaRepository;
import com.andrey.sistema_citas.repository.UsuarioRepository;
import com.andrey.sistema_citas.repository.ServicioRepository;
import com.andrey.sistema_citas.repository.ProfesionalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CitaService {

    private final CitaRepository citaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ServicioRepository servicioRepository;
    private final ProfesionalRepository profesionalRepository;

    public CitaService(CitaRepository citaRepository, UsuarioRepository usuarioRepository,
                      ServicioRepository servicioRepository, ProfesionalRepository profesionalRepository) {
        this.citaRepository = citaRepository;
        this.usuarioRepository = usuarioRepository;
        this.servicioRepository = servicioRepository;
        this.profesionalRepository = profesionalRepository;
    }

    public CitaResponseDTO agendarCita(CitaCreateDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + dto.getUsuarioId()));
        
        Servicio servicio = servicioRepository.findById(dto.getServicioId())
                .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado con ID: " + dto.getServicioId()));
        
        Profesional profesional = profesionalRepository.findById(dto.getProfesionalId())
                .orElseThrow(() -> new ResourceNotFoundException("Profesional no encontrado con ID: " + dto.getProfesionalId()));

        if (dto.getFechaHora().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("No se pueden agendar citas en fechas pasadas");
        }

        int duracionMinutos = parsearDuracion(servicio.getDuracion());
        
        boolean profesionalOcupado = citaRepository.existsByProfesionalAndFechaHoraBetween(
                profesional, dto.getFechaHora(), dto.getFechaHora().plusMinutes(duracionMinutos));
        
        if (profesionalOcupado) {
            throw new RuntimeException("El profesional no está disponible en ese horario");
        }

        boolean usuarioOcupado = citaRepository.existsByUsuarioAndFechaHoraBetween(
                usuario, dto.getFechaHora(), dto.getFechaHora().plusMinutes(duracionMinutos));
        
        if (usuarioOcupado) {
            throw new RuntimeException("Ya tienes una cita programada en ese horario");
        }

        Cita cita = new Cita(dto.getFechaHora(), EstadoCita.PENDIENTE, usuario, servicio, profesional);
        Cita guardada = citaRepository.save(cita);
        
        return CitaMapper.toResponse(guardada);
    }

    public List<CitaResponseDTO> obtenerTodasLasCitas() {
        return citaRepository.findAll()
                .stream()
                .map(CitaMapper::toResponse)
                .collect(Collectors.toList());
    }

    public CitaResponseDTO obtenerCitaPorId(Long id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con ID: " + id));
        return CitaMapper.toResponse(cita);
    }

    public List<CitaResponseDTO> obtenerCitasPorUsuario(Long usuarioId) {
        return citaRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(CitaMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<CitaResponseDTO> obtenerCitasPorProfesional(Long profesionalId) {
        return citaRepository.findByProfesionalId(profesionalId)
                .stream()
                .map(CitaMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<CitaResponseDTO> obtenerCitasPorEstado(EstadoCita estado) {
        return citaRepository.findByEstado(estado.name())
                .stream()
                .map(CitaMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<CitaResponseDTO> obtenerCitasPendientes() {
        return citaRepository.findCitasPendientes()
                .stream()
                .map(CitaMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<CitaResponseDTO> obtenerCitasConfirmadas() {
        return citaRepository.findCitasConfirmadas()
                .stream()
                .map(CitaMapper::toResponse)
                .collect(Collectors.toList());
    }

    public CitaResponseDTO actualizarCita(Long id, CitaUpdateDTO dto) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con ID: " + id));
        
        CitaMapper.updateEntityFromDto(dto, cita);
        Cita actualizada = citaRepository.save(cita);
        
        return CitaMapper.toResponse(actualizada);
    }

    public CitaResponseDTO cambiarEstadoCita(Long citaId, EstadoCita nuevoEstado) {
        Cita cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con ID: " + citaId));
        
        cita.setEstado(nuevoEstado);
        Cita actualizada = citaRepository.save(cita);
        
        return CitaMapper.toResponse(actualizada);
    }

    public CitaResponseDTO confirmarCita(Long citaId) {
        return cambiarEstadoCita(citaId, EstadoCita.CONFIRMADA);
    }

    public CitaResponseDTO cancelarCita(Long citaId) {
        return cambiarEstadoCita(citaId, EstadoCita.CANCELADA);
    }

    public CitaResponseDTO completarCita(Long citaId) {
        return cambiarEstadoCita(citaId, EstadoCita.COMPLETADA);
    }

    public List<CitaResponseDTO> obtenerCitasEnRango(LocalDateTime inicio, LocalDateTime fin) {
        return citaRepository.findByFechaHoraBetween(inicio, fin)
                .stream()
                .map(CitaMapper::toResponse)
                .collect(Collectors.toList());
    }

    public void eliminarCita(Long id) {
        if (!citaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cita no encontrada con id: " + id);
        }
        citaRepository.deleteById(id);
    }

    public long contarCitas() {
        return citaRepository.count();
    }

    public List<Object[]> obtenerEstadisticasCitasPorEstado() {
        return citaRepository.countCitasByEstado();
    }

    private int parsearDuracion(String duracion) {
        if (duracion == null || duracion.isEmpty()) {
            return 60; // Por defecto 60 minutos
        }
        
        duracion = duracion.toLowerCase().trim();
        
        try {
            if (duracion.contains("hora")) {
                String numero = duracion.replaceAll("[^0-9]", "");
                return Integer.parseInt(numero) * 60;
            } else if (duracion.contains("min")) {
                String numero = duracion.replaceAll("[^0-9]", "");
                return Integer.parseInt(numero);
            } else {
                return Integer.parseInt(duracion);
            }
        } catch (NumberFormatException e) {
            return 60; // Por defecto si no se puede parsear
        }
    }
}