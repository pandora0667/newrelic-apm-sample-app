package com.library.domain.book;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Book {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String bookId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String author;
    
    @Column(nullable = false, unique = true)
    private String isbn;
    
    @Column(nullable = false)
    private LocalDate publishedDate;
    
    @Column(nullable = false)
    private String category;
    
    @Column(nullable = false)
    private Integer copiesAvailable;
    
    @Column(length = 1000)
    private String description;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // 도서 생성을 위한 정적 팩토리 메서드
    public static Book createBook(String title, String author, String isbn, 
                                LocalDate publishedDate, String category, 
                                Integer copiesAvailable, String description) {
        Book book = new Book();
        book.setBookId("b" + System.currentTimeMillis());
        book.setTitle(title);
        book.setAuthor(author);
        book.setIsbn(isbn);
        book.setPublishedDate(publishedDate);
        book.setCategory(category);
        book.setCopiesAvailable(copiesAvailable);
        book.setDescription(description);
        return book;
    }
} 