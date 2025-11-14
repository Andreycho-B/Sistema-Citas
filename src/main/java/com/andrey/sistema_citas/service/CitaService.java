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

    // Agendar una nueva cita con validaciones completas
    public Cita agendarCita(Long usuarioId, Long servicioId, Long profesionalId, LocalDateTime fechaHora) {
        // Validar que existan las entidades relacionadas
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));
        
        Servicio servicio = servicioRepository.findById(servicioId)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + servicioId));
        
        Profesional profesional = profesionalRepository.findById(profesionalId)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado con ID: " + profesionalId));

        // Validar que la fecha sea futura
        if (fechaHora.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("No se pueden agendar citas en fechas pasadas");
        }

        // Validar que el profesional esté disponible en ese horario
        boolean profesionalOcupado = citaRepository.existsByProfesionalAndFechaHoraBetween(
                profesional, fechaHora.minusMinutes(30), fechaHora.plusMinutes(30));
        
        if (profesionalOcupado) {
            throw new RuntimeException("El profesional no está disponible en ese horario");
        }

        // Validar que el usuario no tenga otra cita en el mismo horario
        boolean usuarioOcupado = citaRepository.existsByUsuarioAndFechaHoraBetween(
                usuario, fechaHora.minusMinutes(30), fechaHora.plusMinutes(30));
        
        if (usuarioOcupado) {
            throw new RuntimeException("Ya tienes una cita programada en ese horario");
        }

        // Crear y guardar la cita
        Cita cita = new Cita(fechaHora, "PENDIENTE", usuario, servicio, profesional);
        return citaRepository.save(cita);
    }

    // Obtener todas las citas
    public List<Cita> obtenerTodasLasCitas() {
        return citaRepository.findAll();
    }

    // Obtener cita por ID
    public Optional<Cita> obtenerCitaPorId(Long id) {
        return citaRepository.findById(id);
    }

    // Obtener citas por usuario
    public List<Cita> obtenerCitasPorUsuario(Long usuarioId) {
        return citaRepository.findByUsuarioId(usuarioId);
    }

    // Obtener citas por profesional
    public List<Cita> obtenerCitasPorProfesional(Long profesionalId) {
        return citaRepository.findByProfesionalId(profesionalId);
    }

    // Obtener citas por estado
    public List<Cita> obtenerCitasPorEstado(String estado) {
        return citaRepository.findByEstado(estado);
    }

    // Obtener citas pendientes
    public List<Cita> obtenerCitasPendientes() {
        return citaRepository.findCitasPendientes();
    }

    // Obtener citas confirmadas
    public List<Cita> obtenerCitasConfirmadas() {
        return citaRepository.findCitasConfirmadas();
    }

    // Cambiar estado de una cita
    public Cita cambiarEstadoCita(Long citaId, String nuevoEstado) {
        Cita cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada con ID: " + citaId));
        
        cita.setEstado(nuevoEstado);
        return citaRepository.save(cita);
    }

    // Confirmar una cita
    public Cita confirmarCita(Long citaId) {
        return cambiarEstadoCita(citaId, "CONFIRMADA");
    }

    // Cancelar una cita
    public Cita cancelarCita(Long citaId) {
        return cambiarEstadoCita(citaId, "CANCELADA");
    }

    // Completar una cita
    public Cita completarCita(Long citaId) {
        return cambiarEstadoCita(citaId, "COMPLETADA");
    }

    // Obtener citas en un rango de fechas
    public List<Cita> obtenerCitasEnRango(LocalDateTime inicio, LocalDateTime fin) {
        return citaRepository.findByFechaHoraBetween(inicio, fin);
    }

    // Eliminar cita por ID
    public void eliminarCita(Long id) {
        citaRepository.deleteById(id);
    }

    // Contar total de citas
    public long contarCitas() {
        return citaRepository.count();
    }

    // Obtener estadísticas de citas por estado
    public List<Object[]> obtenerEstadisticasCitasPorEstado() {
        return citaRepository.countCitasByEstado();
    }
}