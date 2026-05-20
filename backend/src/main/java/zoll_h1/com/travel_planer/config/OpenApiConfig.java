package zoll_h1.com.travel_planer.config;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Travel Planer API",
                version = "1.0",
                description = "REST API for managing travel and trips and activities. " +
                        "Users can register, login with JWT authentication, create trips, " +
                        "add activities, and track budgets. " ,
                contact = @Contact(
                        name = "Nurbek",
                        email = "nurbek@example.com"
                )
        )
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT",
        description = "Enter JWT token obtained from /api/auth/login endpoint. " +
                      "Format: Just paste the token (no 'Bearer' prefix needed)."

)
public class OpenApiConfig {
}
