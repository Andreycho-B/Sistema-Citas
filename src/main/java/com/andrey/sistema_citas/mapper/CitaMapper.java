package com.andrey.sistema_citas.mapper;

import com.andrey.sistema_citas.dto.CitaResponseDTO;
import com.andrey.sistema_citas.dto.CitaUpdateDTO;
import com.andrey.sistema_citas.entity.Cita;

public class CitaMapper {

    public static CitaResponseDTO toResponse(Cita cita) {
        if (cita == null) return null;

        return new CitaResponseDTO(
                cita.getId(),
                cita.getFechaHora(),
                cita.getEstado(),
                cita.getUsuario() != null ? cita.getUsuario().getId() : null,
                cita.getUsuario() != null ? cita.getUsuario().getNombre() : null,
                cita.getServicio() != null ? cita.getServicio().getId() : null,
                cita.getServicio() != null ? cita.getServicio().getNombre() : null,
                cita.getServicio() != null ? cita.getServicio().getDuracion() : null,
                cita.getServicio() != null ? cita.getServicio().getPrecio() : null,
                cita.getProfesional() != null ? cita.getProfesional().getId() : null,
                cita.getProfesional() != null && cita.getProfesional().getUsuario() != null 
                    ? cita.getProfesional().getUsuario().getNombre() : null,
                cita.getProfesional() != null ? cita.getProfesional().getEspecialidad() : null
        );
    }

    public static void updateEntityFromDto(CitaUpdateDTO dto, Cita cita) {
        if (dto == null || cita == null) return;

        if (dto.getFechaHora() != null) {
            cita.setFechaHora(dto.getFechaHora());
        }

        if (dto.getEstado() != null) {
            cita.setEstado(dto.getEstado());
        }
    }
}