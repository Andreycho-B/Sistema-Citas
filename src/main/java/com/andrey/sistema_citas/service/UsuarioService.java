package com.andrey.sistema_citas.service;

import com.andrey.sistema_citas.dto.UsuarioCreateDTO;
import com.andrey.sistema_citas.dto.UsuarioUpdateDTO;
import com.andrey.sistema_citas.dto.UsuarioResponseDTO;
import com.andrey.sistema_citas.entity.Usuario;
import com.andrey.sistema_citas.exception.ResourceNotFoundException;
import com.andrey.sistema_citas.mapper.UsuarioMapper;
import com.andrey.sistema_citas.repository.UsuarioRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UsuarioResponseDTO> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(UsuarioMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<Usuario> obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public UsuarioResponseDTO crearUsuario(UsuarioCreateDTO dto) {
        Usuario usuario = UsuarioMapper.toEntity(dto);

        String hashed = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(hashed);

        Usuario guardado = usuarioRepository.save(usuario);
        return UsuarioMapper.toResponseDTO(guardado);
    }

    public UsuarioResponseDTO actualizarUsuario(Long id, UsuarioUpdateDTO dto) {

        Usuario existente = usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        UsuarioMapper.updateEntityFromDto(dto, existente);

        Usuario actualizado = usuarioRepository.save(existente);
        return UsuarioMapper.toResponseDTO(actualizado);
    }

    public void eliminarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario no encontrado con id: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    public List<UsuarioResponseDTO> buscarUsuariosPorNombre(String nombre) {
        return usuarioRepository.findByNombreContainingIgnoreCase(nombre)
                .stream()
                .map(UsuarioMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<Usuario> obtenerUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public Optional<Usuario> login(String email, String rawPassword) {
        Optional<Usuario> opt = usuarioRepository.findByEmail(email);

        if (opt.isPresent() && passwordEncoder.matches(rawPassword, opt.get().getPassword())) {
            return opt;
        }

        return Optional.empty();
    }
}


