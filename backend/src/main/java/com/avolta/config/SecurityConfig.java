package com.avolta.config;

import com.avolta.security.JwtAuthorizationFilter;
import com.avolta.security.JwtTokenProvider;
import com.avolta.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final CorsConfig corsConfig;
    private UserService userService;

    public SecurityConfig(JwtTokenProvider jwtTokenProvider, CorsConfig corsConfig) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.corsConfig = corsConfig;
    }
    
    @Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .cors().and()
        .csrf().disable()
        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
        .authorizeHttpRequests(auth -> auth
            // Allow preflight requests
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            
            // Public endpoints
            .requestMatchers("/api/auth/login").permitAll()
            .requestMatchers("/api/publications/public/**").permitAll()
            .requestMatchers("/api/newsletter/subscribe").permitAll()
            .requestMatchers("/api/newsletter/unsubscribe").permitAll() // Ajouté pour cohérence
            
            // Swagger UI
            .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
            
            // SUPERADMIN only endpoints
            .requestMatchers("/api/auth/register").hasAuthority("SUPERADMIN")
            .requestMatchers("/api/users/**").hasAuthority("SUPERADMIN")
            .requestMatchers("/api/publications/pending").hasAuthority("SUPERADMIN")
            .requestMatchers("/api/publications/*/approve").hasAuthority("SUPERADMIN")
            .requestMatchers("/api/publications/*/reject").hasAuthority("SUPERADMIN")
            
            // Authenticated endpoints
            .requestMatchers("/api/publications").authenticated()
            .requestMatchers("/api/publications/**").authenticated()
            .requestMatchers("/api/newsletter/subscribers").authenticated()
            .requestMatchers("/api/newsletter/test").authenticated()
            .requestMatchers("/api/newsletter/subscribers/**").authenticated()
            
            // Default rule
            .anyRequest().authenticated()
        )
        .addFilterBefore(corsConfig.corsFilter(), UsernamePasswordAuthenticationFilter.class)
        .addFilterBefore(new JwtAuthorizationFilter(jwtTokenProvider, userService),
                        UsernamePasswordAuthenticationFilter.class);

    return http.build();
}

    @Autowired
    public void setUserService(@Lazy UserService userService) {
        this.userService = userService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}