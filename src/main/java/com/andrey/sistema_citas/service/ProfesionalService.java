package com.andrey.sistema_citas.service;

import com.andrey.sistema_citas.dto.ProfesionalCreateDTO;
import com.andrey.sistema_citas.dto.ProfesionalResponseDTO;
import com.andrey.sistema_citas.dto.ProfesionalUpdateDTO;
import com.andrey.sistema_citas.entity.Profesional;
import com.andrey.sistema_citas.entity.Role;
import com.andrey.sistema_citas.entity.Usuario;
import com.andrey.sistema_citas.exception.ResourceNotFoundException;
import com.andrey.sistema_citas.mapper.ProfesionalMapper;
import com.andrey.sistema_citas.repository.ProfesionalRepository;
import com.andrey.sistema_citas.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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

    public ProfesionalResponseDTO crearProfesional(ProfesionalCreateDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + dto.getUsuarioId()));

        if (profesionalRepository.findByUsuario(usuario).isPresent()) {
            throw new RuntimeException("El usuario ya está registrado como profesional");
        }

        usuario.addRole(Role.PROFESSIONAL);
        usuarioRepository.save(usuario);

        Profesional profesional = ProfesionalMapper.toEntity(dto, usuario);
        Profesional guardado = profesionalRepository.save(profesional);

        return ProfesionalMapper.toResponse(guardado);
    }

    public ProfesionalResponseDTO actualizarProfesional(Long id, ProfesionalUpdateDTO dto) {
        Profesional existente = profesionalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profesional no encontrado con id: " + id));

        ProfesionalMapper.updateEntityFromDto(dto, existente);
        Profesional actualizado = profesionalRepository.save(existente);

        return ProfesionalMapper.toResponse(actualizado);
    }

    public void eliminarProfesional(Long id) {
        Profesional profesional = profesionalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profesional no encontrado con id: " + id));

        Usuario usuario = profesional.getUsuario();
        if (usuario != null) {
            usuario.removeRole(Role.PROFESSIONAL);
            usuarioRepository.save(usuario);
        }

        profesionalRepository.deleteById(id);
    }

    public List<ProfesionalResponseDTO> obtenerTodosLosProfesionales() {
        return profesionalRepository.findAll()
                .stream()
                .map(ProfesionalMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ProfesionalResponseDTO obtenerProfesionalPorId(Long id) {
        Profesional profesional = profesionalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profesional no encontrado con id: " + id));
        return ProfesionalMapper.toResponse(profesional);
    }

    public List<ProfesionalResponseDTO> buscarProfesionalesPorEspecialidad(String especialidad) {
        return profesionalRepository.findByEspecialidadContainingIgnoreCase(especialidad)
                .stream()
                .map(ProfesionalMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ProfesionalResponseDTO obtenerProfesionalPorUsuarioId(Long usuarioId) {
        Profesional profesional = profesionalRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("No existe profesional con usuario ID: " + usuarioId));
        return ProfesionalMapper.toResponse(profesional);
    }

    public List<ProfesionalResponseDTO> buscarProfesionalesDisponiblesDespuesDe(LocalDateTime fechaHora) {
        return profesionalRepository.findByHorarioDisponibleAfter(fechaHora)
                .stream()
                .map(ProfesionalMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProfesionalResponseDTO> buscarProfesionalesDisponiblesEnRango(LocalDateTime inicio, LocalDateTime fin) {
        return profesionalRepository.findProfesionalesDisponiblesEnRango(inicio, fin)
                .stream()
                .map(ProfesionalMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<Object[]> obtenerEstadisticasPorEspecialidad() {
        return profesionalRepository.countProfesionalesByEspecialidad();
    }

    public long contarProfesionales() {
        return profesionalRepository.count();
    }
}