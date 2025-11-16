package com.andrey.sistema_citas.service;

import com.andrey.sistema_citas.entity.Cita;
import com.andrey.sistema_citas.entity.Usuario;
import com.andrey.sistema_citas.entity.Servicio;
import com.andrey.sistema_citas.entity.Profesional;
import com.andrey.sistema_citas.repository.CitaRepository;
import com.andrey.sistema_citas.repository.UsuarioRepository;
import com.andrey.sistema_citas.repository.ServicioRepository;
import com.andrey.sistema_citas.repository.ProfesionalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.andrey.sistema_citas.entity.EstadoCita;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

    
    public Cita agendarCita(Long usuarioId, Long servicioId, Long profesionalId, LocalDateTime fechaHora) {
        
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));
        
        Servicio servicio = servicioRepository.findById(servicioId)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + servicioId));
        
        Profesional profesional = profesionalRepository.findById(profesionalId)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado con ID: " + profesionalId));

       
        if (fechaHora.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("No se pueden agendar citas en fechas pasadas");
        }

        
        boolean profesionalOcupado = citaRepository.existsByProfesionalAndFechaHoraBetween(
                profesional, fechaHora.minusMinutes(30), fechaHora.plusMinutes(30));
        
        if (profesionalOcupado) {
            throw new RuntimeException("El profesional no está disponible en ese horario");
        }

        
        boolean usuarioOcupado = citaRepository.existsByUsuarioAndFechaHoraBetween(
                usuario, fechaHora.minusMinutes(30), fechaHora.plusMinutes(30));
        
        if (usuarioOcupado) {
            throw new RuntimeException("Ya tienes una cita programada en ese horario");
        }

      
        Cita cita = new Cita(fechaHora, EstadoCita.PENDIENTE, usuario, servicio, profesional);
        return citaRepository.save(cita);
    }

    
    public List<Cita> obtenerTodasLasCitas() {
        return citaRepository.findAll();
    }

    
    public Optional<Cita> obtenerCitaPorId(Long id) {
        return citaRepository.findById(id);
    }

    
    public List<Cita> obtenerCitasPorUsuario(Long usuarioId) {
        return citaRepository.findByUsuarioId(usuarioId);
    }

    public List<Cita> obtenerCitasPorProfesional(Long profesionalId) {
        return citaRepository.findByProfesionalId(profesionalId);
    }

   
    public List<Cita> obtenerCitasPorEstado(String estado) {
        return citaRepository.findByEstado(estado);
    }

    
    public List<Cita> obtenerCitasPendientes() {
        return citaRepository.findCitasPendientes();
    }

    
    public List<Cita> obtenerCitasConfirmadas() {
        return citaRepository.findCitasConfirmadas();
    }

    
    public Cita cambiarEstadoCita(Long citaId, EstadoCita nuevoEstado) {
        Cita cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada con ID: " + citaId));
        
        cita.setEstado(nuevoEstado);
        return citaRepository.save(cita);
    }

    
    public Cita confirmarCita(Long citaId) {
        return cambiarEstadoCita(citaId, EstadoCita.CONFIRMADA);
    }

    public Cita cancelarCita(Long citaId) {
        return cambiarEstadoCita(citaId, EstadoCita.CANCELADA);
    }

    public Cita completarCita(Long citaId) {
        return cambiarEstadoCita(citaId, EstadoCita.COMPLETADA);
    }

    
    public List<Cita> obtenerCitasEnRango(LocalDateTime inicio, LocalDateTime fin) {
        return citaRepository.findByFechaHoraBetween(inicio, fin);
    }

    
    public void eliminarCita(Long id) {
        citaRepository.deleteById(id);
    }

   
    public long contarCitas() {
        return citaRepository.count();
    }

    
    public List<Object[]> obtenerEstadisticasCitasPorEstado() {
        return citaRepository.countCitasByEstado();
    }
}