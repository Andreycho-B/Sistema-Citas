package com.andrey.sistema_citas.repository;

import com.andrey.sistema_citas.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Buscar usuario por email (método automático de Spring Data JPA)
    Optional<Usuario> findByEmail(String email);
    
    // Buscar usuarios por nombre (contiene el texto)
    List<Usuario> findByNombreContainingIgnoreCase(String nombre);

    // Buscar usuarios por teléfono
    Optional<Usuario> findByTelefono(String telefono);
    
    // Consulta personalizada: usuarios registrados después de una fecha
    @Query("SELECT u FROM Usuario u WHERE u.fechaRegistro > :fecha")
    List<Usuario> findUsuariosRegistradosDespuesDe(@Param("fecha") java.time.LocalDateTime fecha);
    
    // Consulta personalizada: contar usuarios por dominio de email
    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.email LIKE %:dominio%")
    long countByEmailDominio(@Param("dominio") String dominio);
}