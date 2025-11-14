package com.andrey.sistema_citas.repository;

import com.andrey.sistema_citas.entity.Servicio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ServicioRepository extends JpaRepository<Servicio, Long> {

    // Buscar servicio por nombre exacto
    Optional<Servicio> findByNombre(String nombre);

    // Buscar servicios que contengan texto en el nombre (insensible a mayúsculas)
    List<Servicio> findByNombreContainingIgnoreCase(String nombre);

    // Overload con paginación (por si lo necesitas)
    Page<Servicio> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);

    // Buscar servicios por rango de precio
    List<Servicio> findByPrecioBetween(Double precioMin, Double precioMax);

    // Buscar servicios con precio menor o igual a un valor
    List<Servicio> findByPrecioLessThanEqual(Double precioMax);

    // Buscar servicios por duración
    List<Servicio> findByDuracion(String duracion);

    // Consulta personalizada: servicios ordenados por precio (ascendente)
    @Query("SELECT s FROM Servicio s ORDER BY s.precio ASC")
    List<Servicio> findAllOrderByPrecioAsc();

    // Consulta personalizada: servicios con descripción que contenga texto
    @Query("SELECT s FROM Servicio s WHERE s.descripcion LIKE %:texto%")
    List<Servicio> findByDescripcionContaining(@Param("texto") String texto);

    // Consulta personalizada: precio promedio de todos los servicios
    @Query("SELECT AVG(s.precio) FROM Servicio s")
    Double findPrecioPromedio();

    // Consulta personalizada: servicios más caros que el promedio
    @Query("SELECT s FROM Servicio s WHERE s.precio > (SELECT AVG(s2.precio) FROM Servicio s2)")
    List<Servicio> findServiciosMasCarosQueElPromedio();
}
