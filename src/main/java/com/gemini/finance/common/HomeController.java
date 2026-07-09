package com.gemini.finance.common;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class HomeController {
    @GetMapping("/api/status")
    Map<String, Object> status() {
        return Map.of(
                "name", "Personal Finance API",
                "status", "running",
                "publicEndpoints", List.of(
                        "GET /",
                        "POST /api/auth/register",
                        "POST /api/auth/login",
                        "GET /actuator/health",
                        "GET /h2-console"
                ),
                "protectedEndpoints", List.of(
                        "GET /api/categories",
                        "GET /api/transactions?month=2026-07",
                        "GET /api/budgets?month=2026-07",
                        "GET /api/reports/monthly-summary?month=2026-07"
                )
        );
    }
}
