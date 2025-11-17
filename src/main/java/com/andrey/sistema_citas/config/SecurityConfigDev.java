package com.andrey.sistema_citas.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@Profile("dev")
public class SecurityConfigDev {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfigDev(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                // Endpoints públicos
                .requestMatchers("/auth/login", "/auth/register").permitAll()
                
                // Endpoints de Usuario - requieren autenticación
                .requestMatchers("/api/usuarios/**").authenticated()
                
                // Endpoints de Profesional - solo ADMIN y PROFESSIONAL
                .requestMatchers("/api/profesionales/**").hasAnyRole("ADMIN", "PROFESSIONAL")
                
                // Endpoints de Servicio - cualquier usuario autenticado
                .requestMatchers("/api/servicios/**").authenticated()
                
                // Endpoints de Cita - cualquier usuario autenticado
                .requestMatchers("/api/citas/**").authenticated()
                
                // Cualquier otra petición requiere autenticación
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}