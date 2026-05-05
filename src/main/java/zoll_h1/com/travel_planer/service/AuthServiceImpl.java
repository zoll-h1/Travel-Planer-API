package zoll_h1.com.travel_planer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import zoll_h1.com.travel_planer.dto.request.LoginRequest;
import zoll_h1.com.travel_planer.dto.request.RegisterRequest;
import zoll_h1.com.travel_planer.dto.response.LoginResponse;
import zoll_h1.com.travel_planer.dto.response.UserResponse;
import zoll_h1.com.travel_planer.model.User;
import zoll_h1.com.travel_planer.repository.UserRepository;
import zoll_h1.com.travel_planer.security.JwtUtil;

@Service
public class AuthServiceImpl implements AuthService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }
    @Override
    public UserResponse register(RegisterRequest request) {
        // Check if email already exists
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        // Check if username already exists
        if(userRepository.existsByUsername(request.getUsername())){
            throw new RuntimeException("Username already taken");
        }
        // Creating new User
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);

        // Converting to DTO and returning
        return mapToUserResponse(saved);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        try {
            // Authentication of User
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            // Catching an error
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid email or password");
        }
        // Loading user from database
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail());

        // Creating Response
        UserResponse userResponse = mapToUserResponse(user);
        return new LoginResponse(token, "Bearer", userResponse);
    }
    @Override
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return mapToUserResponse(user);
    }

    // Map User entity to UserResponse DTO
    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getCreatedAt()
        );
    }
}
