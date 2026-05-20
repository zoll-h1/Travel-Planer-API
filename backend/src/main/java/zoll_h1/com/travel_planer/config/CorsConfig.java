package zoll_h1.com.travel_planer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry
                        .addMapping("/api/**") // Apply CORS to all /api/* endpoints

                        .allowedOrigins("http://localhost:5173", "http://localhost:5174") // React dev server

                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")

                        .allowedHeaders("*") // Allow all headers

                        // Which response headers frontend can read
                        .exposedHeaders("Authorization")

                        // Allow credentials (cookies, Authorization headers)
                        .allowCredentials(true)  // Required for JWT

                        .maxAge(3600);
            }
        };
    }

}
