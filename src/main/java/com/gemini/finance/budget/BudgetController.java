package com.gemini.finance.budget;

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
@RequestMapping("/api/budgets")
public class BudgetController {
    private final BudgetService budgets;

    public BudgetController(BudgetService budgets) {
        this.budgets = budgets;
    }

    @GetMapping
    List<BudgetResponse> list(@AuthenticationPrincipal AppUser user,
                              @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth month) {
        return budgets.list(user, month);
    }

    @PostMapping
    BudgetResponse create(@AuthenticationPrincipal AppUser user, @Valid @RequestBody BudgetRequest request) {
        return budgets.create(user, request);
    }

    @PutMapping("/{id}")
    BudgetResponse update(@AuthenticationPrincipal AppUser user, @PathVariable Long id,
                          @Valid @RequestBody BudgetRequest request) {
        return budgets.update(user, id, request);
    }

    @DeleteMapping("/{id}")
    void delete(@AuthenticationPrincipal AppUser user, @PathVariable Long id) {
        budgets.delete(user, id);
    }
}
