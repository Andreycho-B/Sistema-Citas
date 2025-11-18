package com.andrey.sistema_citas.service;

import com.andrey.sistema_citas.entity.Cita;
import com.andrey.sistema_citas.entity.Profesional;
import com.andrey.sistema_citas.entity.Role;
import com.andrey.sistema_citas.entity.Servicio;
import com.andrey.sistema_citas.entity.Usuario;
import com.andrey.sistema_citas.repository.CitaRepository;
import com.andrey.sistema_citas.repository.ProfesionalRepository;
import com.andrey.sistema_citas.repository.ServicioRepository;
import com.andrey.sistema_citas.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Servicio centralizado para validación de autorización y permisos.
 * Nombrado como "authz" para uso en anotaciones @PreAuthorize.
 */
@Service("authz")
public class AuthorizationService {

    private final CitaRepository citaRepository;
    private final ServicioRepository servicioRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProfesionalRepository profesionalRepository;

    public AuthorizationService(CitaRepository citaRepository,
                                ServicioRepository servicioRepository,
                                UsuarioRepository usuarioRepository,
                                ProfesionalRepository profesionalRepository) {
        this.citaRepository = citaRepository;
        this.servicioRepository = servicioRepository;
        this.usuarioRepository = usuarioRepository;
        this.profesionalRepository = profesionalRepository;
    }

    /**
     * Verifica si el usuario autenticado puede modificar una cita específica.
     * Un usuario puede modificar una cita si:
     * - Es el propietario de la cita (usuario que la creó)
     * - Tiene rol ADMIN
     * 
     * @param citaId ID de la cita
     * @param authentication Información de autenticación del usuario
     * @return true si puede modificar, false en caso contrario
     */
    public boolean puedeModificarCita(Long citaId, Authentication authentication) {
        if (authentication == null) {
            return false;
        }

        // Los ADMIN pueden modificar cualquier cita
        if (tieneRol(authentication, Role.ADMIN)) {
            return true;
        }

        String email = authentication.getName();
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        
        if (usuarioOpt.isEmpty()) {
            return false;
        }

        Optional<Cita> citaOpt = citaRepository.findById(citaId);
        
        if (citaOpt.isEmpty()) {
            return false;
        }

        // Verificar si el usuario es el propietario de la cita
        return citaOpt.get().getUsuario().getId().equals(usuarioOpt.get().getId());
    }

    /**
     * Verifica si el usuario autenticado puede modificar un servicio específico.
     * Un usuario puede modificar un servicio si:
     * - Es el profesional que creó el servicio
     * - Tiene rol ADMIN
     * 
     * @param servicioId ID del servicio
     * @param authentication Información de autenticación del usuario
     * @return true si puede modificar, false en caso contrario
     */
    public boolean puedeModificarServicio(Long servicioId, Authentication authentication) {
        if (authentication == null) {
            return false;
        }

        // Los ADMIN pueden modificar cualquier servicio
        if (tieneRol(authentication, Role.ADMIN)) {
            return true;
        }

        String email = authentication.getName();
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        
        if (usuarioOpt.isEmpty()) {
            return false;
        }

        Optional<Servicio> servicioOpt = servicioRepository.findById(servicioId);
        
        if (servicioOpt.isEmpty()) {
            return false;
        }

        Servicio servicio = servicioOpt.get();
        
        // Si el servicio no tiene profesional asignado, solo ADMIN puede modificarlo
        if (servicio.getProfesional() == null) {
            return false;
        }

        // Verificar si el usuario es el profesional propietario del servicio
        return servicio.getProfesional().getUsuario().getId().equals(usuarioOpt.get().getId());
    }

    /**
     * Verifica si el usuario autenticado puede modificar un usuario específico.
     * Un usuario puede modificar otro usuario si:
     * - Es el mismo usuario (modificando su propio perfil)
     * - Tiene rol ADMIN
     * 
     * @param usuarioId ID del usuario a modificar
     * @param authentication Información de autenticación del usuario
     * @return true si puede modificar, false en caso contrario
     */
    public boolean puedeModificarUsuario(Long usuarioId, Authentication authentication) {
        if (authentication == null) {
            return false;
        }

        // Los ADMIN pueden modificar cualquier usuario
        if (tieneRol(authentication, Role.ADMIN)) {
            return true;
        }

        String email = authentication.getName();
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        
        if (usuarioOpt.isEmpty()) {
            return false;
        }

        // Verificar si el usuario está modificando su propio perfil
        return usuarioOpt.get().getId().equals(usuarioId);
    }

    /**
     * Verifica si el usuario autenticado puede modificar un profesional específico.
     * Solo los ADMIN pueden modificar perfiles de profesionales.
     * 
     * @param profesionalId ID del profesional
     * @param authentication Información de autenticación del usuario
     * @return true si puede modificar, false en caso contrario
     */
    public boolean puedeModificarProfesional(Long profesionalId, Authentication authentication) {
        if (authentication == null) {
            return false;
        }

        // Solo ADMIN puede modificar profesionales
        return tieneRol(authentication, Role.ADMIN);
    }

    /**
     * Verifica si el usuario autenticado es propietario de una cita.
     * 
     * @param citaId ID de la cita
     * @param authentication Información de autenticación del usuario
     * @return true si es propietario, false en caso contrario
     */
    public boolean esPropietarioCita(Long citaId, Authentication authentication) {
        if (authentication == null) {
            return false;
        }

        String email = authentication.getName();
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        
        if (usuarioOpt.isEmpty()) {
            return false;
        }

        Optional<Cita> citaOpt = citaRepository.findById(citaId);
        
        if (citaOpt.isEmpty()) {
            return false;
        }

        return citaOpt.get().getUsuario().getId().equals(usuarioOpt.get().getId());
    }

    /**
     * Verifica si el usuario autenticado es propietario de un servicio.
     * 
     * @param servicioId ID del servicio
     * @param authentication Información de autenticación del usuario
     * @return true si es propietario, false en caso contrario
     */
    public boolean esPropietarioServicio(Long servicioId, Authentication authentication) {
        if (authentication == null) {
            return false;
        }

        String email = authentication.getName();
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        
        if (usuarioOpt.isEmpty()) {
            return false;
        }

        Optional<Servicio> servicioOpt = servicioRepository.findById(servicioId);
        
        if (servicioOpt.isEmpty()) {
            return false;
        }

        Servicio servicio = servicioOpt.get();
        
        if (servicio.getProfesional() == null) {
            return false;
        }

        return servicio.getProfesional().getUsuario().getId().equals(usuarioOpt.get().getId());
    }

    /**
     * Obtiene el ID del usuario autenticado.
     * 
     * @param authentication Información de autenticación del usuario
     * @return ID del usuario o null si no se encuentra
     */
    public Long obtenerUsuarioIdActual(Authentication authentication) {
        if (authentication == null) {
            return null;
        }

        String email = authentication.getName();
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        
        return usuarioOpt.map(Usuario::getId).orElse(null);
    }

    /**
     * Obtiene el ID del profesional asociado al usuario autenticado.
     * 
     * @param authentication Información de autenticación del usuario
     * @return ID del profesional o null si no existe
     */
    public Long obtenerProfesionalIdActual(Authentication authentication) {
        if (authentication == null) {
            return null;
        }

        String email = authentication.getName();
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        
        if (usuarioOpt.isEmpty()) {
            return null;
        }

        Optional<Profesional> profesionalOpt = profesionalRepository.findByUsuarioId(usuarioOpt.get().getId());
        
        return profesionalOpt.map(Profesional::getId).orElse(null);
    }

    /**
     * Verifica si el usuario autenticado tiene un rol específico.
     * 
     * @param authentication Información de autenticación del usuario
     * @param role Rol a verificar
     * @return true si tiene el rol, false en caso contrario
     */
    private boolean tieneRol(Authentication authentication, Role role) {
        if (authentication == null || authentication.getAuthorities() == null) {
            return false;
        }

        String roleName = "ROLE_" + role.name();
        return authentication.getAuthorities().contains(new SimpleGrantedAuthority(roleName));
    }
}
