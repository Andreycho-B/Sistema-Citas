package com.andrey.sistema_citas.mapper;

import com.andrey.sistema_citas.dto.ServicioCreateDTO;
import com.andrey.sistema_citas.dto.ServicioUpdateDTO;
import com.andrey.sistema_citas.dto.ServicioResponseDTO;
import com.andrey.sistema_citas.entity.Servicio;
import com.andrey.sistema_citas.entity.Profesional;

public class ServicioMapper {

    
    public static Servicio toEntity(ServicioCreateDTO dto) {
        if (dto == null) return null;

        Servicio servicio = new Servicio();
        servicio.setNombre(dto.getNombre());
        servicio.setDescripcion(dto.getDescripcion());
        servicio.setDuracion(dto.getDuracion());
        servicio.setPrecio(dto.getPrecio());
        return servicio;
    }

    
    public static ServicioResponseDTO toResponse(Servicio servicio) {
        if (servicio == null) return null;

        Long profesionalId = null;
        String profesionalNombre = null;
        
        if (servicio.getProfesional() != null) {
            profesionalId = servicio.getProfesional().getId();
            if (servicio.getProfesional().getUsuario() != null) {
                profesionalNombre = servicio.getProfesional().getUsuario().getNombre();
            }
        }

        return new ServicioResponseDTO(
                servicio.getId(),
                servicio.getNombre(),
                servicio.getDescripcion(),
                servicio.getDuracion(),
                servicio.getPrecio(),
                profesionalId,
                profesionalNombre
        );
    }

   
    public static void updateEntityFromDto(ServicioUpdateDTO dto, Servicio servicio) {
        if (dto == null || servicio == null) return;

        if (dto.getNombre() != null) {
            servicio.setNombre(dto.getNombre());
        }
        if (dto.getDescripcion() != null) {
            servicio.setDescripcion(dto.getDescripcion());
        }
        if (dto.getDuracion() != null) {
            servicio.setDuracion(dto.getDuracion());
        }
        if (dto.getPrecio() != null) {
            servicio.setPrecio(dto.getPrecio());
        }
    }
}



