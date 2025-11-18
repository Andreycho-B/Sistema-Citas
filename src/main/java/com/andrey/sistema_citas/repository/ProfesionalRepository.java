package com.andrey.sistema_citas.repository;

import com.andrey.sistema_citas.entity.Profesional;
import com.andrey.sistema_citas.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    
    // --- Métodos de disponibilidad comentados ---
    // Estos métodos intentan comparar un String (horarioDisponible) con LocalDateTime.
    // Esto no funcionará de manera fiable. La lógica de disponibilidad se manejará mejor en la capa de Servicio.
    /*
    List<Profesional> findByHorarioDisponibleAfter(LocalDateTime fechaHora);
    
    List<Profesional> findByHorarioDisponibleBefore(LocalDateTime fechaHora);
    
    @Query("SELECT p FROM Profesional p WHERE p.horarioDisponible BETWEEN :inicio AND :fin")
    List<Profesional> findProfesionalesDisponiblesEnRango(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);
    */
    
    // Consulta personalizada: contar profesionales por especialidad
    @Query("SELECT p.especialidad, COUNT(p) FROM Profesional p GROUP BY p.especialidad")
    List<Object[]> countProfesionalesByEspecialidad();
    
    // Consulta personalizada: profesionales con sus datos de usuario
    @Query("SELECT p, u FROM Profesional p JOIN p.usuario u WHERE u.nombre LIKE %:nombre%")
    List<Object[]> findProfesionalesConUsuarioPorNombre(@Param("nombre") String nombre);
}