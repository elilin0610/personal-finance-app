package com.gemini.finance.budget;

import com.gemini.finance.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    Optional<Budget> findByIdAndUser(Long id, AppUser user);

    @Query("""
            select b from Budget b
            join fetch b.category
            where b.user = :user and b.month = :month
            order by b.category.name
            """)
    List<Budget> findDetailedByMonth(AppUser user, String month);
}
