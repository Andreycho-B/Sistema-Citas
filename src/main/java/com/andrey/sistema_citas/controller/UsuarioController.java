package com.andrey.sistema_citas.controller;

import com.andrey.sistema_citas.dto.UsuarioCreateDTO;
import com.andrey.sistema_citas.dto.UsuarioResponseDTO;
import com.andrey.sistema_citas.dto.UsuarioUpdateDTO;
import com.andrey.sistema_citas.entity.Usuario;
import com.andrey.sistema_citas.exception.ResourceNotFoundException;
import com.andrey.sistema_citas.mapper.UsuarioMapper;
import com.andrey.sistema_citas.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioResponseDTO>> obtenerTodosLosUsuarios() {
        List<UsuarioResponseDTO> usuarios = usuarioService.obtenerTodosLosUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @authz.puedeModificarUsuario(#id, authentication)")
    public ResponseEntity<UsuarioResponseDTO> obtenerUsuarioPorId(@PathVariable Long id) {
        UsuarioResponseDTO usuarioDTO = usuarioService.obtenerUsuarioPorId(id);
        return ResponseEntity.ok(usuarioDTO);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioResponseDTO> crearUsuario(@Valid @RequestBody UsuarioCreateDTO usuarioDTO) {
        UsuarioResponseDTO nuevo = usuarioService.crearUsuario(usuarioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @authz.puedeModificarUsuario(#id, authentication)")
    public ResponseEntity<UsuarioResponseDTO> actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioUpdateDTO usuarioDTO) {

        UsuarioResponseDTO actualizado = usuarioService.actualizarUsuario(id, usuarioDTO);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioResponseDTO>> buscarUsuariosPorNombre(@RequestParam String nombre) {
        List<UsuarioResponseDTO> usuarios = usuarioService.buscarUsuariosPorNombre(nombre);
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioResponseDTO> obtenerUsuarioPorEmail(@PathVariable String email) {

        Usuario u = usuarioService.obtenerUsuarioPorEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con email: " + email));

        return ResponseEntity.ok(UsuarioMapper.toResponseDTO(u));
    }
}
