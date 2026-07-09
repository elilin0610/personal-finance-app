package com.gemini.finance.transaction;

import com.gemini.finance.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<WalletTransaction, Long> {
    Optional<WalletTransaction> findByIdAndUser(Long id, AppUser user);

    List<WalletTransaction> findByUserAndOccurredOnBetweenOrderByOccurredOnDescIdDesc(
            AppUser user,
            LocalDate startDate,
            LocalDate endDate
    );

    @Query("""
            select t from WalletTransaction t
            join fetch t.category
            where t.user = :user and t.occurredOn between :startDate and :endDate
            order by t.occurredOn desc, t.id desc
            """)
    List<WalletTransaction> findDetailedByPeriod(AppUser user, LocalDate startDate, LocalDate endDate);
}
