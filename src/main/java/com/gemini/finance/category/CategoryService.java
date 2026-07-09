package com.gemini.finance.category;

import com.gemini.finance.user.AppUser;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoryService {
    private final CategoryRepository categories;

    public CategoryService(CategoryRepository categories) {
        this.categories = categories;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> list(AppUser user) {
        return categories.findByUserOrderByTypeAscNameAsc(user).stream()
                .map(CategoryResponse::from)
                .toList();
    }

    public CategoryResponse create(AppUser user, CategoryRequest request) {
        return CategoryResponse.from(categories.save(new Category(
                user,
                request.name(),
                request.type(),
                request.color()
        )));
    }

    public CategoryResponse update(AppUser user, Long id, CategoryRequest request) {
        Category category = findOwned(user, id);
        category.update(request.name(), request.type(), request.color());
        return CategoryResponse.from(category);
    }

    public void delete(AppUser user, Long id) {
        categories.delete(findOwned(user, id));
    }

    private Category findOwned(AppUser user, Long id) {
        return categories.findByIdAndUser(id, user)
                .orElseThrow(() -> new EntityNotFoundException("Category not found."));
    }
}
