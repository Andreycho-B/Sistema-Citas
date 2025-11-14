package com.andrey.sistema_citas.repository;

import com.andrey.sistema_citas.entity.Profesional;
import com.andrey.sistema_citas.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ProfesionalRepository extends JpaRepository<Profesional, Long> {
    
    // Buscar profesional por especialidad
    List<Profesional> findByEspecialidadContainingIgnoreCase(String especialidad);
    
    // Buscar profesional por usuario asociado
    Optional<Profesional> findByUsuario(Usuario usuario);
    
    // Buscar profesional por ID de usuario
    @Query("SELECT p FROM Profesional p WHERE p.usuario.id = :usuarioId")
    Optional<Profesional> findByUsuarioId(@Param("usuarioId") Long usuarioId);
    
    // Buscar profesionales disponibles después de una fecha y hora
    List<Profesional> findByHorarioDisponibleAfter(LocalDateTime fechaHora);
    
    // Buscar profesionales disponibles antes de una fecha y hora
    List<Profesional> findByHorarioDisponibleBefore(LocalDateTime fechaHora);
    
    // Consulta personalizada: profesionales con horario disponible en un rango
    @Query("SELECT p FROM Profesional p WHERE p.horarioDisponible BETWEEN :inicio AND :fin")
    List<Profesional> findProfesionalesDisponiblesEnRango(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);
    
    // Consulta personalizada: contar profesionales por especialidad
    @Query("SELECT p.especialidad, COUNT(p) FROM Profesional p GROUP BY p.especialidad")
    List<Object[]> countProfesionalesByEspecialidad();
    
    // Consulta personalizada: profesionales con sus datos de usuario
    @Query("SELECT p, u FROM Profesional p JOIN p.usuario u WHERE u.nombre LIKE %:nombre%")
    List<Object[]> findProfesionalesConUsuarioPorNombre(@Param("nombre") String nombre);
}