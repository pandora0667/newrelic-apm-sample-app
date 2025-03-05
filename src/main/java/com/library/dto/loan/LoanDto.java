package com.library.dto.loan;

import com.library.domain.loan.Loan;
import com.library.domain.loan.LoanStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

public class LoanDto {
    
    @Data
    public static class CreateRequest {
        @NotBlank(message = "사용자 ID는 필수입니다")
        private String userId;
        
        @NotBlank(message = "도서 ID는 필수입니다")
        private String bookId;
        
        @NotNull(message = "대출일은 필수입니다")
        private LocalDate loanDate;
        
        @NotNull(message = "반납 예정일은 필수입니다")
        private LocalDate dueDate;
    }
    
    @Data
    public static class ReturnRequest {
        @NotNull(message = "반납일은 필수입니다")
        private LocalDate returnDate;
    }
    
    @Data
    public static class ExtendRequest {
        @NotNull(message = "연장일은 필수입니다")
        private Integer days;
    }
    
    @Data
    public static class Response {
        private String loanId;
        private String userId;
        private String bookId;
        private String bookTitle;
        private String bookAuthor;
        private LocalDate loanDate;
        private LocalDate dueDate;
        private LoanStatus status;
        private Integer extensionCount;
        private String returnedAt;
        private String createdAt;
        
        public static Response from(Loan loan) {
            Response response = new Response();
            response.setLoanId(loan.getLoanId());
            response.setUserId(loan.getUser().getUserId());
            response.setBookId(loan.getBook().getBookId());
            response.setBookTitle(loan.getBook().getTitle());
            response.setBookAuthor(loan.getBook().getAuthor());
            response.setLoanDate(loan.getLoanDate());
            response.setDueDate(loan.getDueDate());
            response.setStatus(loan.getStatus());
            response.setExtensionCount(loan.getExtensionCount());
            if (loan.getReturnedAt() != null) {
                response.setReturnedAt(loan.getReturnedAt().toString());
            }
            response.setCreatedAt(loan.getCreatedAt().toString());
            return response;
        }
    }
    
    @Data
    public static class SimpleResponse {
        private String loanId;
        private String bookId;
        private String bookTitle;
        private String bookAuthor;
        private LocalDate loanDate;
        private LocalDate dueDate;
        private LoanStatus status;
        private Integer extensionCount;
        
        public static SimpleResponse from(Loan loan) {
            SimpleResponse response = new SimpleResponse();
            response.setLoanId(loan.getLoanId());
            response.setBookId(loan.getBook().getBookId());
            response.setBookTitle(loan.getBook().getTitle());
            response.setBookAuthor(loan.getBook().getAuthor());
            response.setLoanDate(loan.getLoanDate());
            response.setDueDate(loan.getDueDate());
            response.setStatus(loan.getStatus());
            response.setExtensionCount(loan.getExtensionCount());
            return response;
        }
    }
} 