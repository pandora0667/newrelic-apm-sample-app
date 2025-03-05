package com.library.service;

import com.library.domain.book.Book;
import com.library.dto.book.BookDto;
import com.library.dto.book.BookReservationDto;
import com.library.repository.BookRepository;
import com.library.repository.LoanRepository;
import com.library.repository.ReservationRepository;
import com.library.domain.loan.LoanStatus;
import com.library.domain.reservation.ReservationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookService {
    
    private final BookRepository bookRepository;
    private final LoanRepository loanRepository;
    private final ReservationRepository reservationRepository;
    
    @Transactional
    public BookDto.Response createBook(BookDto.CreateRequest request) {
        // ISBN 중복 검사
        if (bookRepository.existsByIsbn(request.getIsbn())) {
            throw new IllegalArgumentException("이미 등록된 ISBN입니다.");
        }
        
        // 도서 생성
        Book book = Book.createBook(
            request.getTitle(),
            request.getAuthor(),
            request.getIsbn(),
            request.getPublishedDate(),
            request.getCategory(),
            request.getCopiesAvailable(),
            request.getDescription()
        );
        
        // 저장
        Book savedBook = bookRepository.save(book);
        
        return BookDto.Response.from(savedBook);
    }
    
    @Transactional
    public BookDto.Response updateBook(String bookId, BookDto.UpdateRequest request) {
        Book book = bookRepository.findByBookId(bookId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 도서입니다."));
        
        boolean isUpdated = false;
        
        if (request.getTitle() != null) {
            book.setTitle(request.getTitle());
            isUpdated = true;
        }
        
        if (request.getAuthor() != null) {
            book.setAuthor(request.getAuthor());
            isUpdated = true;
        }
        
        if (request.getIsbn() != null) {
            // ISBN 중복 검사
            if (!book.getIsbn().equals(request.getIsbn()) && bookRepository.existsByIsbn(request.getIsbn())) {
                throw new IllegalArgumentException("이미 등록된 ISBN입니다.");
            }
            book.setIsbn(request.getIsbn());
            isUpdated = true;
        }
        
        if (request.getPublishedDate() != null) {
            book.setPublishedDate(request.getPublishedDate());
            isUpdated = true;
        }
        
        if (request.getCategory() != null) {
            book.setCategory(request.getCategory());
            isUpdated = true;
        }
        
        if (request.getCopiesAvailable() != null) {
            book.setCopiesAvailable(request.getCopiesAvailable());
            isUpdated = true;
        }
        
        if (request.getDescription() != null) {
            book.setDescription(request.getDescription());
            isUpdated = true;
        }
        
        // 업데이트 시간 명시적 설정 (필요한 경우)
        if (isUpdated && book.getUpdatedAt() == null) {
            book.setUpdatedAt(LocalDateTime.now());
        }
        
        return BookDto.Response.from(book);
    }
    
    @Transactional
    public void deleteBook(String bookId) {
        Book book = bookRepository.findByBookId(bookId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 도서입니다."));
        
        // 현재 대출 중인 도서인지 확인
        boolean hasActiveLoans = loanRepository.existsByBookBookIdAndStatus(bookId, LoanStatus.LOANED) || 
                               loanRepository.existsByBookBookIdAndStatus(bookId, LoanStatus.OVERDUE);
        if (hasActiveLoans) {
            throw new IllegalStateException("현재 대출 중인 도서는 삭제할 수 없습니다.");
        }
        
        // 예약된 도서인지 확인
        boolean hasReservations = reservationRepository.existsByBookBookIdAndStatus(bookId, ReservationStatus.RESERVED);
        if (hasReservations) {
            throw new IllegalStateException("현재 예약된 도서는 삭제할 수 없습니다.");
        }
        
        bookRepository.delete(book);
    }
    
    public List<BookDto.SimpleResponse> getAllBooks() {
        return bookRepository.findAll().stream()
            .map(BookDto.SimpleResponse::from)
            .collect(Collectors.toList());
    }
    
    public BookDto.Response getBookDetail(String bookId) {
        Book book = bookRepository.findByBookId(bookId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 도서입니다."));
        
        return BookDto.Response.from(book);
    }
    
    public List<BookDto.SimpleResponse> getBooksByCategory(String category) {
        return bookRepository.findByCategory(category).stream()
            .map(BookDto.SimpleResponse::from)
            .collect(Collectors.toList());
    }

    public List<BookReservationDto> getBooksAvailableForReservation(String userId) {
        // 대출 가능한 책이 없는 도서 목록 조회
        List<Book> books = bookRepository.findBooksAvailableForReservation();
        
        return books.stream()
            .<BookReservationDto>map(book -> {
                // 현재 예약 수 조회
                long currentReservations = bookRepository.countReservationsByBookAndStatus(book, ReservationStatus.RESERVED);
                
                // 사용자의 예약 순서 조회 (예약하지 않은 경우 null)
                Integer userReservationOrder = null;
                if (userId != null) {
                    long userReservations = bookRepository.countUserReservationsByBookAndStatus(book, userId, ReservationStatus.RESERVED);
                    if (userReservations > 0) {
                        userReservationOrder = (int) userReservations;
                    }
                }
                
                return BookReservationDto.builder()
                    .bookId(book.getBookId())
                    .title(book.getTitle())
                    .author(book.getAuthor())
                    .category(book.getCategory())
                    .copiesAvailable(book.getCopiesAvailable())
                    .currentReservations((int) currentReservations)
                    .userReservationOrder(userReservationOrder)
                    .publishedDate(book.getPublishedDate())
                    .isbn(book.getIsbn())
                    .build();
            })
            .collect(Collectors.toList());
    }
} 