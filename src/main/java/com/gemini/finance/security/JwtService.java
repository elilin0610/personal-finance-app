package com.gemini.finance.security;

import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;

@Service
public class JwtService {
    private final SecurityProperties properties;

    public JwtService(SecurityProperties properties) {
        this.properties = properties;
    }

    public String createToken(Long userId, String email) {
        Instant expiresAt = Instant.now().plusSeconds(properties.jwtExpirationMinutes() * 60);
        String header = base64Url("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
        String payload = base64Url("""
                {"sub":"%s","email":"%s","exp":%d}
                """.formatted(userId, email, expiresAt.getEpochSecond()).trim());
        String unsignedToken = header + "." + payload;
        return unsignedToken + "." + sign(unsignedToken);
    }

    public Optional<Long> parseUserId(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3 || !sign(parts[0] + "." + parts[1]).equals(parts[2])) {
                return Optional.empty();
            }
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            long expiresAt = Long.parseLong(extractJsonValue(payload, "exp"));
            if (Instant.now().getEpochSecond() >= expiresAt) {
                return Optional.empty();
            }
            return Optional.of(Long.parseLong(extractJsonValue(payload, "sub")));
        } catch (RuntimeException ex) {
            return Optional.empty();
        }
    }

    private String sign(String value) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(properties.jwtSecret().getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to sign JWT", ex);
        }
    }

    private static String base64Url(String value) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private static String extractJsonValue(String json, String key) {
        String pattern = "\"" + key + "\":";
        int start = json.indexOf(pattern);
        if (start < 0) {
            throw new IllegalArgumentException("Missing JWT claim: " + key);
        }
        int valueStart = start + pattern.length();
        if (json.charAt(valueStart) == '"') {
            int valueEnd = json.indexOf('"', valueStart + 1);
            return json.substring(valueStart + 1, valueEnd);
        }
        int valueEnd = json.indexOf(',', valueStart);
        if (valueEnd < 0) {
            valueEnd = json.indexOf('}', valueStart);
        }
        return json.substring(valueStart, valueEnd).trim();
    }
}
