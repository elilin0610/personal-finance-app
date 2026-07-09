package com.gemini.finance.auth;

import com.gemini.finance.security.JwtService;
import com.gemini.finance.user.AppUser;
import com.gemini.finance.user.UserRepository;
import jakarta.persistence.EntityExistsException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder, JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.email().toLowerCase();
        if (users.existsByEmail(email)) {
            throw new EntityExistsException("Email is already registered.");
        }
        AppUser user = users.save(new AppUser(request.name(), email, passwordEncoder.encode(request.password())));
        return responseFor(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.email().toLowerCase(),
                request.password()
        ));
        AppUser user = users.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        return responseFor(user);
    }

    private AuthResponse responseFor(AppUser user) {
        return new AuthResponse(
                jwtService.createToken(user.getId(), user.getEmail()),
                "Bearer",
                UserProfile.from(user)
        );
    }
}
