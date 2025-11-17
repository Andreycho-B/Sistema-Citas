package com.andrey.sistema_citas.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.andrey.sistema_citas.config.JwtUtil;
import com.andrey.sistema_citas.dto.LoginRequest;
import com.andrey.sistema_citas.dto.LoginResponse;
import com.andrey.sistema_citas.entity.Usuario;
import com.andrey.sistema_citas.exception.UnauthorizedException;
import com.andrey.sistema_citas.repository.UsuarioRepository;

import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UsuarioRepository usuarioRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Credenciales inválidas"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new UnauthorizedException("Credenciales inválidas");
        }

        String token = jwtUtil.generateToken(
            usuario.getEmail(),
            usuario.getRoles().stream()
                .map(Enum::name)
                .collect(Collectors.toSet())
        );

        return new LoginResponse(
            usuario.getId(),
            usuario.getNombre(),
            usuario.getEmail(),
            usuario.getRoles(),
            token
        );
    }
}