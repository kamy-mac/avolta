package com.avolta.controllers;

import com.avolta.dto.UserDto;
import com.avolta.dto.requests.CreateUserRequest;
import com.avolta.dto.responses.ApiResponse;
import com.avolta.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication API")
public class AuthController {

    private final UserService userService;

    @Operation(summary = "Register a new admin user", description = "Only super admins can create new admin users")
    @PostMapping("/register")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> registerUser(@Valid @RequestBody CreateUserRequest request) {
        UserDto createdUser = userService.createUser(request);
        return new ResponseEntity<>(ApiResponse.success("User registered successfully", createdUser), HttpStatus.CREATED);
    }

    // Note: Login is handled by JwtAuthenticationFilter
}