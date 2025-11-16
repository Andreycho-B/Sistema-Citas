package com.andrey.sistema_citas.exception;

public class BusinessRuleException extends RuntimeException {
    
    private static final long serialVersionUID = 1L;

    public BusinessRuleException(String mensaje) {
        super(mensaje);
    }

    public BusinessRuleException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}