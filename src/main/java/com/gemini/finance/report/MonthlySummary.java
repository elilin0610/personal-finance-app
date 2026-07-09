package com.gemini.finance.report;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;

public record MonthlySummary(
        YearMonth month,
        BigDecimal income,
        BigDecimal expense,
        BigDecimal netCashFlow,
        BigDecimal budgetLimit,
        BigDecimal budgetRemaining,
        List<CategorySpending> topExpenseCategories
) {
}
