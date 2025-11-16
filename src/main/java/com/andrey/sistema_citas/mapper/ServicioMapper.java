package com.andrey.sistema_citas.mapper;

import com.andrey.sistema_citas.dto.ServicioCreateDTO;
import com.andrey.sistema_citas.dto.ServicioUpdateDTO;
import com.andrey.sistema_citas.dto.ServicioResponseDTO;
import com.andrey.sistema_citas.entity.Servicio;

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

        return new ServicioResponseDTO(
                servicio.getId(),
                servicio.getNombre(),
                servicio.getDescripcion(),
                servicio.getDuracion(),
                servicio.getPrecio()
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



