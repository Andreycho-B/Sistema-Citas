package com.andrey.sistema_citas.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.andrey.sistema_citas.dto.LoginRequest;
import com.andrey.sistema_citas.dto.LoginResponse;
import com.andrey.sistema_citas.entity.Usuario;
import com.andrey.sistema_citas.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Usuario usuario = authService.login(request.getEmail(), request.getPassword());

        if (usuario == null) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }

        LoginResponse response = new LoginResponse(
            usuario.getId(),
            usuario.getNombre(),
            usuario.getEmail()
        );

        return ResponseEntity.ok(response);
    }
}
