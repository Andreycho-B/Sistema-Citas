package com.andrey.sistema_citas.service;

import com.andrey.sistema_citas.entity.Profesional;
import com.andrey.sistema_citas.entity.Usuario;
import com.andrey.sistema_citas.exception.ResourceNotFoundException;
import com.andrey.sistema_citas.repository.ProfesionalRepository;
import com.andrey.sistema_citas.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProfesionalService {

    private final ProfesionalRepository profesionalRepository;
    private final UsuarioRepository usuarioRepository;

    public ProfesionalService(ProfesionalRepository profesionalRepository,
                              UsuarioRepository usuarioRepository) {
        this.profesionalRepository = profesionalRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Profesional crearProfesional(Profesional profesional) {
        Usuario usuario = obtenerUsuarioValido(profesional.getUsuario().getId());
        profesional.setUsuario(usuario);
        return profesionalRepository.save(profesional);
    }

  
    public Profesional actualizarProfesional(Long id, Profesional datosActualizados) {
        Profesional existente = profesionalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profesional no encontrado con id: " + id));

       
        existente.setEspecialidad(datosActualizados.getEspecialidad());
        existente.setHorarioDisponible(datosActualizados.getHorarioDisponible());

       
        if (datosActualizados.getUsuario() != null &&
            datosActualizados.getUsuario().getId() != null) {
            Usuario usuario = obtenerUsuarioValido(datosActualizados.getUsuario().getId());
            existente.setUsuario(usuario);
        }

        return profesionalRepository.save(existente);
    }

   
    public void eliminarProfesional(Long id) {
        if (!profesionalRepository.existsById(id)) {
            throw new ResourceNotFoundException("Profesional no encontrado con id: " + id);
        }
        profesionalRepository.deleteById(id);
    }

   
    public List<Profesional> obtenerTodosLosProfesionales() {
        return profesionalRepository.findAll();
    }

    public Optional<Profesional> obtenerProfesionalPorId(Long id) {
        return profesionalRepository.findById(id);
    }

    public List<Profesional> buscarProfesionalesPorEspecialidad(String especialidad) {
        return profesionalRepository.findByEspecialidadContainingIgnoreCase(especialidad);
    }

    public Optional<Profesional> obtenerProfesionalPorUsuarioId(Long usuarioId) {
        return profesionalRepository.findByUsuarioId(usuarioId);
    }

    public List<Profesional> buscarProfesionalesDisponiblesDespuesDe(LocalDateTime fechaHora) {
        return profesionalRepository.findByHorarioDisponibleAfter(fechaHora);
    }

    public List<Profesional> buscarProfesionalesDisponiblesEnRango(LocalDateTime inicio, LocalDateTime fin) {
        return profesionalRepository.findProfesionalesDisponiblesEnRango(inicio, fin);
    }

    public List<Object[]> obtenerEstadisticasPorEspecialidad() {
        return profesionalRepository.countProfesionalesByEspecialidad();
    }

    public List<Object[]> buscarProfesionalesConUsuarioPorNombre(String nombre) {
        return profesionalRepository.findProfesionalesConUsuarioPorNombre(nombre);
    }

    public long contarProfesionales() {
        return profesionalRepository.count();
    }

    private Usuario obtenerUsuarioValido(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("No se encontró el usuario con ID: " + usuarioId));
    }
}
