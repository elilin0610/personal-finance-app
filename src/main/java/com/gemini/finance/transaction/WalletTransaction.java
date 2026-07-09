package com.gemini.finance.transaction;

import com.gemini.finance.category.Category;
import com.gemini.finance.user.AppUser;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "wallet_transactions")
public class WalletTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionType type;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDate occurredOn;

    @Column(nullable = false, length = 120)
    private String merchant;

    @Column(length = 500)
    private String note;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected WalletTransaction() {
    }

    public WalletTransaction(AppUser user, Category category, TransactionType type, BigDecimal amount,
                             LocalDate occurredOn, String merchant, String note) {
        this.user = user;
        this.category = category;
        this.type = type;
        this.amount = amount;
        this.occurredOn = occurredOn;
        this.merchant = merchant;
        this.note = note;
    }

    public Long getId() {
        return id;
    }

    public Category getCategory() {
        return category;
    }

    public TransactionType getType() {
        return type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public LocalDate getOccurredOn() {
        return occurredOn;
    }

    public String getMerchant() {
        return merchant;
    }

    public String getNote() {
        return note;
    }

    public void update(Category category, TransactionType type, BigDecimal amount,
                       LocalDate occurredOn, String merchant, String note) {
        this.category = category;
        this.type = type;
        this.amount = amount;
        this.occurredOn = occurredOn;
        this.merchant = merchant;
        this.note = note;
    }
}
