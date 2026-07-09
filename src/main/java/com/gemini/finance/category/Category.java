package com.gemini.finance.category;

import com.gemini.finance.transaction.TransactionType;
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
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "categories", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "name", "type"}))
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private AppUser user;

    @Column(nullable = false, length = 80)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionType type;

    @Column(nullable = false, length = 7)
    private String color;

    protected Category() {
    }

    public Category(AppUser user, String name, TransactionType type, String color) {
        this.user = user;
        this.name = name;
        this.type = type;
        this.color = color;
    }

    public Long getId() {
        return id;
    }

    public AppUser getUser() {
        return user;
    }

    public String getName() {
        return name;
    }

    public TransactionType getType() {
        return type;
    }

    public String getColor() {
        return color;
    }

    public void update(String name, TransactionType type, String color) {
        this.name = name;
        this.type = type;
        this.color = color;
    }
}
