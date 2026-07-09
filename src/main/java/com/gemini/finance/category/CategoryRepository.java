package com.gemini.finance.category;

import com.gemini.finance.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserOrderByTypeAscNameAsc(AppUser user);

    Optional<Category> findByIdAndUser(Long id, AppUser user);
}
