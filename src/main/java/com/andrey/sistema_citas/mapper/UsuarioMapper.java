package com.andrey.sistema_citas.mapper;

import com.andrey.sistema_citas.dto.UsuarioCreateDTO;
import com.andrey.sistema_citas.dto.UsuarioResponseDTO;
import com.andrey.sistema_citas.dto.UsuarioUpdateDTO;
import com.andrey.sistema_citas.entity.Usuario;

public class UsuarioMapper {

    public static Usuario toEntity(UsuarioCreateDTO dto) {
        Usuario u = new Usuario();
        u.setNombre(dto.getNombre());
        u.setEmail(dto.getEmail());
        u.setPassword(dto.getPassword());
        u.setTelefono(dto.getTelefono());
        return u;
    }

    // Renombrado para coincidir con el Controller
    public static UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getTelefono(),
                usuario.getFechaRegistro()
        );
    }

    public static void updateEntityFromDto(UsuarioUpdateDTO dto, Usuario usuario) {
        if (dto.getNombre() != null) {
            usuario.setNombre(dto.getNombre());
        }
        if (dto.getTelefono() != null) {
            usuario.setTelefono(dto.getTelefono());
        }
    }
}



