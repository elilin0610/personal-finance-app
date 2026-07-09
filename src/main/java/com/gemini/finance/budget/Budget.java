package com.gemini.finance.budget;

import com.gemini.finance.category.Category;
import com.gemini.finance.user.AppUser;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.math.BigDecimal;
import java.time.YearMonth;

@Entity
@Table(name = "budgets", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "category_id", "budget_month"}))
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Category category;

    @Column(name = "budget_month", nullable = false, length = 7)
    private String month;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal limitAmount;

    protected Budget() {
    }

    public Budget(AppUser user, Category category, YearMonth month, BigDecimal limitAmount) {
        this.user = user;
        this.category = category;
        this.month = month.toString();
        this.limitAmount = limitAmount;
    }

    public Long getId() {
        return id;
    }

    public Category getCategory() {
        return category;
    }

    public YearMonth getMonth() {
        return YearMonth.parse(month);
    }

    public BigDecimal getLimitAmount() {
        return limitAmount;
    }

    public void update(Category category, YearMonth month, BigDecimal limitAmount) {
        this.category = category;
        this.month = month.toString();
        this.limitAmount = limitAmount;
    }
}
