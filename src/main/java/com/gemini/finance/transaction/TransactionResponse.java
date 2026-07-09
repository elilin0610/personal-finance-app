package com.gemini.finance.transaction;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionResponse(
        Long id,
        Long categoryId,
        String categoryName,
        TransactionType type,
        BigDecimal amount,
        LocalDate occurredOn,
        String merchant,
        String note
) {
    public static TransactionResponse from(WalletTransaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getCategory().getId(),
                transaction.getCategory().getName(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getOccurredOn(),
                transaction.getMerchant(),
                transaction.getNote()
        );
    }
}
