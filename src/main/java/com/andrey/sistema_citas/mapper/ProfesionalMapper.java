package com.andrey.sistema_citas.mapper;

import com.andrey.sistema_citas.dto.ProfesionalCreateDTO;
import com.andrey.sistema_citas.dto.ProfesionalResponseDTO;
import com.andrey.sistema_citas.dto.ProfesionalUpdateDTO;
import com.andrey.sistema_citas.entity.Profesional;
import com.andrey.sistema_citas.entity.Usuario;

public class ProfesionalMapper {

    public static Profesional toEntity(ProfesionalCreateDTO dto, Usuario usuario) {
        if (dto == null) return null;

        Profesional profesional = new Profesional();
        profesional.setEspecialidad(dto.getEspecialidad());
        profesional.setHorarioDisponible(dto.getHorarioDisponible());
        profesional.setUsuario(usuario);
        
        return profesional;
    }

    public static ProfesionalResponseDTO toResponse(Profesional profesional) {
        if (profesional == null) return null;

        ProfesionalResponseDTO dto = new ProfesionalResponseDTO();
        dto.setId(profesional.getId());
        dto.setEspecialidad(profesional.getEspecialidad());
        dto.setHorarioDisponible(profesional.getHorarioDisponible());

        if (profesional.getUsuario() != null) {
            dto.setUsuarioId(profesional.getUsuario().getId());
            dto.setUsuarioNombre(profesional.getUsuario().getNombre());
        }

        return dto;
    }

    public static void updateEntityFromDto(ProfesionalUpdateDTO dto, Profesional profesional) {
        if (dto == null || profesional == null) return;

        if (dto.getEspecialidad() != null) {
            profesional.setEspecialidad(dto.getEspecialidad());
        }

        if (dto.getHorarioDisponible() != null) {
            profesional.setHorarioDisponible(dto.getHorarioDisponible());
        }
    }
}