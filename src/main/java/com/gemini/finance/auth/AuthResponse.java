package com.gemini.finance.auth;

public record AuthResponse(String accessToken, String tokenType, UserProfile user) {
}
