package com.andrey.sistema_citas.validation;

import org.springframework.stereotype.Component;

@Component
public class ValidationLayer {
    public void validarNombre(String nombre) {
        if (nombre == null || nombre.isEmpty()) {
            throw new RuntimeException("El nombre no puede ser vacío");
        }
        if (nombre.length() < 3) {
            throw new RuntimeException("El nombre debe tener al menos 3 caracteres");
        }
    }

    public void validarApellido(String apellido) {
        if (apellido == null || apellido.isEmpty()) {
            throw new RuntimeException("El apellido no puede ser vacío");
        }
        if (apellido.length() < 3) {
            throw new RuntimeException("El apellido debe tener al menos 3 caracteres");
        }
    }

    public void validarCorreo(String correo) {
        if (correo == null || correo.isEmpty()) {
            throw new RuntimeException("El correo no puede ser vacío");
        }
        if (!correo.contains("@")) {
            throw new RuntimeException("El correo debe contener el símbolo @");
        }
    }

    public void validarTelefono(String telefono) {
        if (telefono == null || telefono.isEmpty()) {
            throw new RuntimeException("El teléfono no puede ser vacío");
        }
        if (telefono.length() < 10) {
            throw new RuntimeException("El teléfono debe tener al menos 10 dígitos");
        }
    }
}
