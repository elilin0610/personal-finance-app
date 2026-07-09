package com.gemini.finance.category;

import com.gemini.finance.user.AppUser;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categories;

    public CategoryController(CategoryService categories) {
        this.categories = categories;
    }

    @GetMapping
    List<CategoryResponse> list(@AuthenticationPrincipal AppUser user) {
        return categories.list(user);
    }

    @PostMapping
    CategoryResponse create(@AuthenticationPrincipal AppUser user, @Valid @RequestBody CategoryRequest request) {
        return categories.create(user, request);
    }

    @PutMapping("/{id}")
    CategoryResponse update(@AuthenticationPrincipal AppUser user, @PathVariable Long id,
                            @Valid @RequestBody CategoryRequest request) {
        return categories.update(user, id, request);
    }

    @DeleteMapping("/{id}")
    void delete(@AuthenticationPrincipal AppUser user, @PathVariable Long id) {
        categories.delete(user, id);
    }
}
