package zoll_h1.com.travel_planer.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import zoll_h1.com.travel_planer.dto.request.LoginRequest;
import zoll_h1.com.travel_planer.dto.request.RegisterRequest;
import zoll_h1.com.travel_planer.dto.response.LoginResponse;
import zoll_h1.com.travel_planer.dto.response.UserResponse;
import zoll_h1.com.travel_planer.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User registration, login, and profile endpoints")
public class AuthController {
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Registering new account
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    // Login with email and password , receiving JWT token
    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    // Getting current user
    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return authService.getCurrentUser(email);
    }
}
