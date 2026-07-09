package com.gemini.finance.transaction;

import com.gemini.finance.user.AppUser;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactions;

    public TransactionController(TransactionService transactions) {
        this.transactions = transactions;
    }

    @GetMapping
    List<TransactionResponse> list(
            @AuthenticationPrincipal AppUser user,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth month
    ) {
        return transactions.list(user, month);
    }

    @PostMapping
    TransactionResponse create(@AuthenticationPrincipal AppUser user, @Valid @RequestBody TransactionRequest request) {
        return transactions.create(user, request);
    }

    @PutMapping("/{id}")
    TransactionResponse update(@AuthenticationPrincipal AppUser user, @PathVariable Long id,
                               @Valid @RequestBody TransactionRequest request) {
        return transactions.update(user, id, request);
    }

    @DeleteMapping("/{id}")
    void delete(@AuthenticationPrincipal AppUser user, @PathVariable Long id) {
        transactions.delete(user, id);
    }
}
