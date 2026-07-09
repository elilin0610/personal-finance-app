package com.gemini.finance.budget;

import java.math.BigDecimal;
import java.time.YearMonth;

public record BudgetResponse(
        Long id,
        Long categoryId,
        String categoryName,
        YearMonth month,
        BigDecimal limitAmount
) {
    public static BudgetResponse from(Budget budget) {
        return new BudgetResponse(
                budget.getId(),
                budget.getCategory().getId(),
                budget.getCategory().getName(),
                budget.getMonth(),
                budget.getLimitAmount()
        );
    }
}
