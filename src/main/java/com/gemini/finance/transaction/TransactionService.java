package com.gemini.finance.transaction;

import com.gemini.finance.category.Category;
import com.gemini.finance.category.CategoryRepository;
import com.gemini.finance.user.AppUser;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@Transactional
public class TransactionService {
    private final TransactionRepository transactions;
    private final CategoryRepository categories;

    public TransactionService(TransactionRepository transactions, CategoryRepository categories) {
        this.transactions = transactions;
        this.categories = categories;
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> list(AppUser user, YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();
        return transactions.findDetailedByPeriod(user, start, end).stream()
                .map(TransactionResponse::from)
                .toList();
    }

    public TransactionResponse create(AppUser user, TransactionRequest request) {
        Category category = categoryFor(user, request.categoryId());
        ensureCategoryTypeMatches(category, request.type());
        WalletTransaction transaction = new WalletTransaction(
                user,
                category,
                request.type(),
                request.amount(),
                request.occurredOn(),
                request.merchant(),
                request.note()
        );
        return TransactionResponse.from(transactions.save(transaction));
    }

    public TransactionResponse update(AppUser user, Long id, TransactionRequest request) {
        WalletTransaction transaction = findOwned(user, id);
        Category category = categoryFor(user, request.categoryId());
        ensureCategoryTypeMatches(category, request.type());
        transaction.update(category, request.type(), request.amount(), request.occurredOn(), request.merchant(), request.note());
        return TransactionResponse.from(transaction);
    }

    public void delete(AppUser user, Long id) {
        transactions.delete(findOwned(user, id));
    }

    private WalletTransaction findOwned(AppUser user, Long id) {
        return transactions.findByIdAndUser(id, user)
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found."));
    }

    private Category categoryFor(AppUser user, Long id) {
        return categories.findByIdAndUser(id, user)
                .orElseThrow(() -> new EntityNotFoundException("Category not found."));
    }

    private static void ensureCategoryTypeMatches(Category category, TransactionType type) {
        if (category.getType() != type) {
            throw new IllegalArgumentException("Category type must match transaction type.");
        }
    }
}
