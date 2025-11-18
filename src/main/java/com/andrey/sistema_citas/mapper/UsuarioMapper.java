package com.andrey.sistema_citas.mapper;

import com.andrey.sistema_citas.dto.UsuarioCreateDTO;
import com.andrey.sistema_citas.dto.UsuarioResponseDTO;
import com.andrey.sistema_citas.dto.UsuarioUpdateDTO;
import com.andrey.sistema_citas.entity.Usuario;
import com.andrey.sistema_citas.entity.Role;

public class UsuarioMapper {

    public static Usuario toEntity(UsuarioCreateDTO dto) {
        Usuario u = new Usuario();
        u.setNombre(dto.getNombre());
        u.setEmail(dto.getEmail());
        u.setPassword(dto.getPassword());
        u.setTelefono(dto.getTelefono());
        
        // Asignar role si se proporciona, sino USER por defecto
        if (dto.getRole() != null && !dto.getRole().isEmpty()) {
            try {
                u.addRole(Role.valueOf(dto.getRole().toUpperCase()));
            } catch (IllegalArgumentException e) {
                u.addRole(Role.USER); // Default si el role no es válido
            }
        } else {
            u.addRole(Role.USER);
        }
        
        return u;
    }

    public static UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getTelefono(),
                usuario.getRoles() != null && !usuario.getRoles().isEmpty() 
                    ? usuario.getRoles().iterator().next().name() 
                    : "USER",
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



