package com.gemini.finance.config;

import com.gemini.finance.budget.Budget;
import com.gemini.finance.budget.BudgetRepository;
import com.gemini.finance.category.Category;
import com.gemini.finance.category.CategoryRepository;
import com.gemini.finance.transaction.TransactionRepository;
import com.gemini.finance.transaction.TransactionType;
import com.gemini.finance.transaction.WalletTransaction;
import com.gemini.finance.user.AppUser;
import com.gemini.finance.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;

@Configuration
@Profile("!test")
public class DemoDataSeeder {
    @Bean
    CommandLineRunner seedDemoData(UserRepository users, CategoryRepository categories,
                                   TransactionRepository transactions, BudgetRepository budgets,
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            if (users.existsByEmail("demo@finance.dev")) {
                return;
            }

            AppUser demo = users.save(new AppUser(
                    "Demo User",
                    "demo@finance.dev",
                    passwordEncoder.encode("password123")
            ));
            Category salary = categories.save(new Category(demo, "Salary", TransactionType.INCOME, "#2563EB"));
            Category food = categories.save(new Category(demo, "Food", TransactionType.EXPENSE, "#EF4444"));
            Category transport = categories.save(new Category(demo, "Transport", TransactionType.EXPENSE, "#F59E0B"));
            Category learning = categories.save(new Category(demo, "Learning", TransactionType.EXPENSE, "#10B981"));

            YearMonth month = YearMonth.now();
            budgets.save(new Budget(demo, food, month, new BigDecimal("8000.00")));
            budgets.save(new Budget(demo, transport, month, new BigDecimal("2500.00")));
            budgets.save(new Budget(demo, learning, month, new BigDecimal("3000.00")));

            transactions.save(new WalletTransaction(demo, salary, TransactionType.INCOME, new BigDecimal("62000.00"),
                    month.atDay(5), "Acme Corp", "Monthly salary"));
            transactions.save(new WalletTransaction(demo, food, TransactionType.EXPENSE, new BigDecimal("420.00"),
                    LocalDate.now().minusDays(3), "Lunch", "Team lunch"));
            transactions.save(new WalletTransaction(demo, transport, TransactionType.EXPENSE, new BigDecimal("1280.00"),
                    LocalDate.now().minusDays(2), "Metro", "Monthly pass"));
            transactions.save(new WalletTransaction(demo, learning, TransactionType.EXPENSE, new BigDecimal("1590.00"),
                    LocalDate.now().minusDays(1), "Online Course", "Spring Boot course"));
        };
    }
}
