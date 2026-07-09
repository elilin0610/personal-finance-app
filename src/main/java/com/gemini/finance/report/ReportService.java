package com.gemini.finance.report;

import com.gemini.finance.budget.BudgetRepository;
import com.gemini.finance.transaction.TransactionRepository;
import com.gemini.finance.transaction.TransactionType;
import com.gemini.finance.transaction.WalletTransaction;
import com.gemini.finance.user.AppUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class ReportService {
    private final TransactionRepository transactions;
    private final BudgetRepository budgets;

    public ReportService(TransactionRepository transactions, BudgetRepository budgets) {
        this.transactions = transactions;
        this.budgets = budgets;
    }

    public MonthlySummary monthlySummary(AppUser user, YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();
        List<WalletTransaction> items = transactions.findDetailedByPeriod(user, start, end);

        BigDecimal income = sumByType(items, TransactionType.INCOME);
        BigDecimal expense = sumByType(items, TransactionType.EXPENSE);
        BigDecimal budgetLimit = budgets.findDetailedByMonth(user, month.toString()).stream()
                .map(budget -> budget.getLimitAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new MonthlySummary(
                month,
                income,
                expense,
                income.subtract(expense),
                budgetLimit,
                budgetLimit.subtract(expense),
                topExpenseCategories(items)
        );
    }

    private static BigDecimal sumByType(List<WalletTransaction> transactions, TransactionType type) {
        return transactions.stream()
                .filter(transaction -> transaction.getType() == type)
                .map(WalletTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private static List<CategorySpending> topExpenseCategories(List<WalletTransaction> transactions) {
        Map<Long, CategorySpending> totals = new LinkedHashMap<>();
        transactions.stream()
                .filter(transaction -> transaction.getType() == TransactionType.EXPENSE)
                .forEach(transaction -> totals.merge(
                        transaction.getCategory().getId(),
                        new CategorySpending(
                                transaction.getCategory().getId(),
                                transaction.getCategory().getName(),
                                transaction.getAmount()
                        ),
                        (left, right) -> new CategorySpending(
                                left.categoryId(),
                                left.categoryName(),
                                left.spent().add(right.spent())
                        )
                ));
        return totals.values().stream()
                .sorted(Comparator.comparing(CategorySpending::spent).reversed())
                .limit(5)
                .toList();
    }
}
