package com.andrey.sistema_citas.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.andrey.sistema_citas.entity.Usuario;
import com.andrey.sistema_citas.repository.UsuarioRepository;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository,
                       PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario login(String email, String password) {

        // Obtiene el usuario o retorna null si no existe
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);

        if (usuario == null) {
            return null;
        }

        boolean matches = passwordEncoder.matches(password, usuario.getPassword());

        return matches ? usuario : null;
    }
}
