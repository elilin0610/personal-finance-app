package com.gemini.finance.budget;

import com.gemini.finance.category.Category;
import com.gemini.finance.category.CategoryRepository;
import com.gemini.finance.transaction.TransactionType;
import com.gemini.finance.user.AppUser;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.YearMonth;
import java.util.List;

@Service
@Transactional
public class BudgetService {
    private final BudgetRepository budgets;
    private final CategoryRepository categories;

    public BudgetService(BudgetRepository budgets, CategoryRepository categories) {
        this.budgets = budgets;
        this.categories = categories;
    }

    @Transactional(readOnly = true)
    public List<BudgetResponse> list(AppUser user, YearMonth month) {
        return budgets.findDetailedByMonth(user, month.toString()).stream()
                .map(BudgetResponse::from)
                .toList();
    }

    public BudgetResponse create(AppUser user, BudgetRequest request) {
        Category category = expenseCategory(user, request.categoryId());
        return BudgetResponse.from(budgets.save(new Budget(
                user,
                category,
                request.month(),
                request.limitAmount()
        )));
    }

    public BudgetResponse update(AppUser user, Long id, BudgetRequest request) {
        Budget budget = findOwned(user, id);
        budget.update(expenseCategory(user, request.categoryId()), request.month(), request.limitAmount());
        return BudgetResponse.from(budget);
    }

    public void delete(AppUser user, Long id) {
        budgets.delete(findOwned(user, id));
    }

    private Budget findOwned(AppUser user, Long id) {
        return budgets.findByIdAndUser(id, user)
                .orElseThrow(() -> new EntityNotFoundException("Budget not found."));
    }

    private Category expenseCategory(AppUser user, Long categoryId) {
        Category category = categories.findByIdAndUser(categoryId, user)
                .orElseThrow(() -> new EntityNotFoundException("Category not found."));
        if (category.getType() != TransactionType.EXPENSE) {
            throw new IllegalArgumentException("Budgets can only be assigned to expense categories.");
        }
        return category;
    }
}
