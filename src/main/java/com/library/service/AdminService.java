package com.library.service;

import com.library.domain.book.Book;
import com.library.domain.loan.LoanStatus;
import com.library.domain.reservation.ReservationStatus;
import com.library.dto.admin.AdminReportDto;
import com.library.repository.BookRepository;
import com.library.repository.LoanRepository;
import com.library.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final BookRepository bookRepository;
    private final LoanRepository loanRepository;
    private final ReservationRepository reservationRepository;

    private static final int TOP_BOOKS_LIMIT = 10;

    public AdminReportDto.SummaryResponse getLibrarySummary() {
        // 전체 도서 수
        long totalBooks = bookRepository.count();

        // 전체 대출 수 (현재 대출 중인 도서)
        long totalLoans = loanRepository.countByStatus(LoanStatus.LOANED);

        // 전체 예약 수 (현재 예약 중인 도서)
        long totalReservations = reservationRepository.countByStatus(ReservationStatus.RESERVED);

        // 활성 사용자 수 (최소 1회 이상 대출한 사용자)
        long activeUsers = loanRepository.countDistinctUserIdByStatus(LoanStatus.LOANED);

        // 카테고리별 도서 수
        Map<String, Long> booksByCategory = getBooksByCategory();

        // 가장 많이 대출된 도서 Top 10
        List<AdminReportDto.TopBook> topBooks = getTopBooks();

        return AdminReportDto.SummaryResponse.builder()
                .totalBooks(totalBooks)
                .totalLoans(totalLoans)
                .totalReservations(totalReservations)
                .activeUsers(activeUsers)
                .booksByCategory(booksByCategory)
                .topBooks(topBooks)
                .build();
    }

    private Map<String, Long> getBooksByCategory() {
        Map<String, Long> booksByCategory = new HashMap<>();
        List<Object[]> results = bookRepository.countBooksByCategory();
        
        for (Object[] result : results) {
            String category = (String) result[0];
            Long count = (Long) result[1];
            booksByCategory.put(category, count);
        }
        
        return booksByCategory;
    }

    private List<AdminReportDto.TopBook> getTopBooks() {
        List<Object[]> results = bookRepository.findTopBooksByLoanCount(PageRequest.of(0, TOP_BOOKS_LIMIT));
        
        return results.stream()
                .map(result -> {
                    Book book = (Book) result[0];
                    Long loanCount = (Long) result[1];
                    
                    return AdminReportDto.TopBook.builder()
                            .bookId(book.getBookId())
                            .title(book.getTitle())
                            .author(book.getAuthor())
                            .loanCount(loanCount)
                            .build();
                })
                .collect(Collectors.toList());
    }
} 