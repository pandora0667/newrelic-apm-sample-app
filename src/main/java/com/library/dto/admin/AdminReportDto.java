package com.library.dto.admin;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

public class AdminReportDto {

    @Getter
    @NoArgsConstructor
    public static class SummaryResponse {
        private long totalBooks;
        private long totalLoans;
        private long totalReservations;
        private long activeUsers;
        private Map<String, Long> booksByCategory;
        private List<TopBook> topBooks;

        @Builder
        public SummaryResponse(long totalBooks, long totalLoans, long totalReservations,
                             long activeUsers, Map<String, Long> booksByCategory,
                             List<TopBook> topBooks) {
            this.totalBooks = totalBooks;
            this.totalLoans = totalLoans;
            this.totalReservations = totalReservations;
            this.activeUsers = activeUsers;
            this.booksByCategory = booksByCategory;
            this.topBooks = topBooks;
        }
    }

    @Getter
    @NoArgsConstructor
    public static class TopBook {
        private String bookId;
        private String title;
        private String author;
        private long loanCount;

        @Builder
        public TopBook(String bookId, String title, String author, long loanCount) {
            this.bookId = bookId;
            this.title = title;
            this.author = author;
            this.loanCount = loanCount;
        }
    }
} 