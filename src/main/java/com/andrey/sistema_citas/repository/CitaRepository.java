package com.andrey.sistema_citas.repository;

import com.andrey.sistema_citas.entity.Cita;
import com.andrey.sistema_citas.entity.EstadoCita; // Import añadido
import com.andrey.sistema_citas.entity.Profesional;
import com.andrey.sistema_citas.entity.Servicio;
import com.andrey.sistema_citas.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface CitaRepository extends JpaRepository<Cita, Long> {

    // Buscar citas por usuario
    List<Cita> findByUsuario(Usuario usuario);

    // Buscar citas por profesional
    List<Cita> findByProfesional(Profesional profesional);

    // Buscar citas por servicio
    List<Cita> findByServicio(Servicio servicio);

    // Buscar citas por estado (ahora usa el enum para seguridad de tipos)
    List<Cita> findByEstado(EstadoCita estado);

    // Buscar citas por fecha y hora exacta
    List<Cita> findByFechaHora(LocalDateTime fechaHora);

 // Buscar citas en un rango de fechas y horas
    List<Cita> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);
    
    // Buscar citas después de una fecha y hora
    List<Cita> findByFechaHoraAfter(LocalDateTime fechaHora);

    // Buscar citas antes de una fecha y hora
    List<Cita> findByFechaHoraBefore(LocalDateTime fechaHora);

    // Consulta personalizada: citas por usuario y estado (usa el enum)
    @Query("SELECT c FROM Cita c WHERE c.usuario.id = :usuarioId AND c.estado = :estado")
    List<Cita> findCitasByUsuarioAndEstado(@Param("usuarioId") Long usuarioId, @Param("estado") EstadoCita estado);

    // Consulta personalizada: citas por profesional y estado (usa el enum)
    @Query("SELECT c FROM Cita c WHERE c.profesional.id = :profesionalId AND c.estado = :estado")
    List<Cita> findCitasByProfesionalAndEstado(@Param("profesionalId") Long profesionalId, @Param("estado") EstadoCita estado);

    // Consulta personalizada: citas con información completa (join con usuario, servicio y profesional)
    @Query("SELECT c, u, s, p FROM Cita c JOIN c.usuario u JOIN c.servicio s JOIN c.profesional p WHERE c.fechaHora BETWEEN :inicio AND :fin")
    List<Object[]> findCitasCompletasEnRango(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    // Consulta personalizada: contar citas por estado
    @Query("SELECT c.estado, COUNT(c) FROM Cita c GROUP BY c.estado")
    List<Object[]> countCitasByEstado();

    // Consulta personalizada: próximo horario disponible para un profesional
    @Query("SELECT MIN(c.fechaHora) FROM Cita c WHERE c.profesional.id = :profesionalId AND c.fechaHora > :fechaHora")
    LocalDateTime findProximaCitaByProfesional(@Param("profesionalId") Long profesionalId, @Param("fechaHora") LocalDateTime fechaHora);
    
    // Buscar citas por usuario (ID)
    List<Cita> findByUsuarioId(Long usuarioId);
    
    // Buscar citas por profesional (ID)
    List<Cita> findByProfesionalId(Long profesionalId);
    
    // Verificar si existe una cita para un profesional en un rango de fechas
    boolean existsByProfesionalAndFechaHoraBetween(Profesional profesional, LocalDateTime inicio, LocalDateTime fin);
    
    // Verificar si existe una cita para un usuario en un rango de fechas
    boolean existsByUsuarioAndFechaHoraBetween(Usuario usuario, LocalDateTime inicio, LocalDateTime fin);
    
    // --- Métodos reemplazados por versiones más seguras con enums ---
    // Las siguientes consultas @Query son menos seguras que usar métodos derivados con enums.
    // Se recomienda usar findByEstado(EstadoCita.PENDIENTE) y findByEstado(EstadoCita.CONFIRMADA)
    /*
    @Query("SELECT c FROM Cita c WHERE c.estado = 'PENDIENTE'")
    List<Cita> findCitasPendientes();
    
    @Query("SELECT c FROM Cita c WHERE c.estado = 'CONFIRMADA'")
    List<Cita> findCitasConfirmadas();
    */
    
    // Consulta personalizada: citas próximas (en las próximas 24 horas)
    @Query("SELECT c FROM Cita c WHERE c.fechaHora BETWEEN :ahora AND :mañana")
    List<Cita> findCitasProximas(@Param("ahora") LocalDateTime ahora, @Param("mañana") LocalDateTime mañana);

    // Método findByFechaHoraBetween duplicado eliminado. Ya existe uno arriba.
}