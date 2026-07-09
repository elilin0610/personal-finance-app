package com.gemini.finance.report;

import com.gemini.finance.user.AppUser;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.YearMonth;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final ReportService reports;

    public ReportController(ReportService reports) {
        this.reports = reports;
    }

    @GetMapping("/monthly-summary")
    MonthlySummary monthlySummary(@AuthenticationPrincipal AppUser user,
                                  @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth month) {
        return reports.monthlySummary(user, month);
    }
}
