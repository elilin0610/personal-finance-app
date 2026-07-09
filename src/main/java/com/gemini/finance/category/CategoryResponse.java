package com.gemini.finance.category;

import com.gemini.finance.transaction.TransactionType;

public record CategoryResponse(Long id, String name, TransactionType type, String color) {
    public static CategoryResponse from(Category category) {
        return new CategoryResponse(category.getId(), category.getName(), category.getType(), category.getColor());
    }
}
