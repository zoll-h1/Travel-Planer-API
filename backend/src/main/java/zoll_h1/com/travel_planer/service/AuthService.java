package zoll_h1.com.travel_planer.service;

import zoll_h1.com.travel_planer.dto.request.LoginRequest;
import zoll_h1.com.travel_planer.dto.request.RegisterRequest;
import zoll_h1.com.travel_planer.dto.request.UpdateActivityRequest;
import zoll_h1.com.travel_planer.dto.request.UpdateProfileRequest;
import zoll_h1.com.travel_planer.dto.response.LoginResponse;
import zoll_h1.com.travel_planer.dto.response.UserResponse;

public interface AuthService {

    UserResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    UserResponse getCurrentUser(String email);

    UserResponse updateCurrentUser(String email, UpdateProfileRequest request);
}