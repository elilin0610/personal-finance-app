package com.gemini.finance.report;

import java.math.BigDecimal;

public record CategorySpending(Long categoryId, String categoryName, BigDecimal spent) {
}
