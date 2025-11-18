package com.andrey.sistema_citas.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.andrey.sistema_citas.dto.LoginRequest;
import com.andrey.sistema_citas.dto.LoginResponse;
import com.andrey.sistema_citas.service.AuthService;
import com.andrey.sistema_citas.service.UsuarioService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import com.andrey.sistema_citas.dto.UsuarioCreateDTO;
import com.andrey.sistema_citas.dto.UsuarioResponseDTO;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final UsuarioService usuarioService;

    public AuthController(AuthService authService, UsuarioService usuarioService) {
        this.authService = authService;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioResponseDTO> register(@Valid @RequestBody UsuarioCreateDTO usuarioDTO) {
        // El registro público siempre asigna rol USER
        // Los roles ADMIN y PROFESSIONAL solo pueden ser asignados por un ADMIN existente
        UsuarioResponseDTO nuevoUsuario = usuarioService.crearUsuario(usuarioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }
}