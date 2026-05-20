package zoll_h1.com.travel_planer.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import zoll_h1.com.travel_planer.security.JwtRequestFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;

    @Autowired
    public SecurityConfig(JwtRequestFilter jwtRequestFilter){
        this.jwtRequestFilter = jwtRequestFilter;
    }

    /**
     * Configuration of Security Filter Chain
     * The main security configuration
     */
   @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
       http
               .cors(Customizer.withDefaults()) // Must add , or gonna be <blocking all OPTIONS preflight requests with 403 before CORS headers could be applied>
               // Disabling CSRF (Cross-Site Request Forgery) protection
               // Not needed for jwt-based stateless API'S
               .csrf(csrf -> csrf.disable())
           // Configuration of authorization rules
               .authorizeHttpRequests(auth -> auth
                       .requestMatchers("/api/auth/**").permitAll()
                       .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                       .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                       .anyRequest().authenticated()
               )
               .sessionManagement(session -> session
                       .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
               )
               .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
       return http.build();
    }
    // Password Encoder Bean
    // Uses BCrypt hashing algorithm - industry standart for password storage
    @Bean
    public PasswordEncoder passwordEncoder() {
       return new BCryptPasswordEncoder();
    }

    // Authentication Manager Bean
    // Required for login functionality
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
       return configuration.getAuthenticationManager();
    }
}
