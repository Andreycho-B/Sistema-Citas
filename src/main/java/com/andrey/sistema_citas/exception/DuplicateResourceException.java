package com.andrey.sistema_citas.exception;

public class DuplicateResourceException extends RuntimeException {
    
    private static final long serialVersionUID = 1L;

    public DuplicateResourceException(String mensaje) {
        super(mensaje);
    }

    public DuplicateResourceException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}