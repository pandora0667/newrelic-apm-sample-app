package com.library.dto.book;

import com.library.domain.book.Book;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

public class BookDto {
    
    @Data
    public static class CreateRequest {
        @NotBlank(message = "도서 제목은 필수입니다")
        private String title;
        
        @NotBlank(message = "저자는 필수입니다")
        private String author;
        
        @NotBlank(message = "ISBN은 필수입니다")
        private String isbn;
        
        @NotNull(message = "출판일은 필수입니다")
        private LocalDate publishedDate;
        
        @NotBlank(message = "카테고리는 필수입니다")
        private String category;
        
        @NotNull(message = "도서 수량은 필수입니다")
        @Min(value = 0, message = "도서 수량은 0보다 작을 수 없습니다")
        private Integer copiesAvailable;
        
        private String description;
    }
    
    @Data
    public static class UpdateRequest {
        private String title;
        private String author;
        private String isbn;
        private LocalDate publishedDate;
        private String category;
        
        @Min(value = 0, message = "도서 수량은 0보다 작을 수 없습니다")
        private Integer copiesAvailable;
        
        private String description;
    }
    
    @Data
    public static class Response {
        private String bookId;
        private String title;
        private String author;
        private String isbn;
        private LocalDate publishedDate;
        private String category;
        private Integer copiesAvailable;
        private String description;
        private String createdAt;
        private String updatedAt;
        
        public static Response from(Book book) {
            Response response = new Response();
            response.setBookId(book.getBookId());
            response.setTitle(book.getTitle());
            response.setAuthor(book.getAuthor());
            response.setIsbn(book.getIsbn());
            response.setPublishedDate(book.getPublishedDate());
            response.setCategory(book.getCategory());
            response.setCopiesAvailable(book.getCopiesAvailable());
            response.setDescription(book.getDescription());
            response.setCreatedAt(book.getCreatedAt().toString());
            if (book.getUpdatedAt() != null) {
                response.setUpdatedAt(book.getUpdatedAt().toString());
            }
            return response;
        }
    }
    
    @Data
    public static class SimpleResponse {
        private String bookId;
        private String title;
        private String author;
        private String category;
        private Integer copiesAvailable;
        private LocalDate publishedDate;
        private String isbn;
        
        public static SimpleResponse from(Book book) {
            SimpleResponse response = new SimpleResponse();
            response.setBookId(book.getBookId());
            response.setTitle(book.getTitle());
            response.setAuthor(book.getAuthor());
            response.setCategory(book.getCategory());
            response.setCopiesAvailable(book.getCopiesAvailable());
            response.setPublishedDate(book.getPublishedDate());
            response.setIsbn(book.getIsbn());
            return response;
        }
    }
} 