package com.andrey.sistema_citas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.andrey.sistema_citas") // Asegura que escanee tus entidades
@EnableJpaRepositories("com.andrey.sistema_citas.repository") // Asegura que encuentre tus repositorios
public class SistemaCitasApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(SistemaCitasApplication.class);
       
        app.setAdditionalProfiles("dev");
        app.run(args);
    }
}