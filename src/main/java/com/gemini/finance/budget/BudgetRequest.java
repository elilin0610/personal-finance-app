package com.gemini.finance.budget;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.YearMonth;

public record BudgetRequest(
        @NotNull Long categoryId,
        @NotNull YearMonth month,
        @NotNull @DecimalMin(value = "0.01") BigDecimal limitAmount
) {
}
