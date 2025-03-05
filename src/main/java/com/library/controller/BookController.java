package com.library.controller;

import com.library.dto.book.BookDto;
import com.library.dto.book.BookReservationDto;
import com.library.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Book Management", description = "도서 관리 API")
@RestController
@RequestMapping(value = "/api/v1/books", produces = MediaType.APPLICATION_JSON_VALUE + ";charset=UTF-8")
@RequiredArgsConstructor
public class BookController {
    
    private final BookService bookService;
    
    @Operation(summary = "도서 등록", description = "새로운 도서를 등록합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "도서 등록 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content)
    })
    @PostMapping
    public ResponseEntity<BookDto.Response> createBook(@Valid @RequestBody BookDto.CreateRequest request) {
        return new ResponseEntity<>(bookService.createBook(request), HttpStatus.CREATED);
    }
    
    @Operation(summary = "도서 정보 수정", description = "도서 정보(수량, 설명)를 수정합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "도서 정보 수정 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
        @ApiResponse(responseCode = "404", description = "도서를 찾을 수 없음", content = @Content)
    })
    @PutMapping("/{bookId}")
    public ResponseEntity<BookDto.Response> updateBook(
        @Parameter(description = "도서 ID", required = true) @PathVariable String bookId,
        @Valid @RequestBody BookDto.UpdateRequest request
    ) {
        return ResponseEntity.ok(bookService.updateBook(bookId, request));
    }
    
    @Operation(summary = "도서 삭제", description = "도서를 삭제합니다. 대출 중이거나 예약된 도서는 삭제할 수 없습니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "도서 삭제 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
        @ApiResponse(responseCode = "404", description = "도서를 찾을 수 없음", content = @Content),
        @ApiResponse(responseCode = "409", description = "대출 중이거나 예약된 도서", content = @Content)
    })
    @DeleteMapping("/{bookId}")
    public ResponseEntity<Void> deleteBook(
        @Parameter(description = "도서 ID", required = true) @PathVariable String bookId
    ) {
        bookService.deleteBook(bookId);
        return ResponseEntity.noContent().build();
    }
    
    @Operation(summary = "도서 목록 조회", description = "전체 도서 목록을 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "도서 목록 조회 성공")
    })
    @GetMapping
    public ResponseEntity<List<BookDto.SimpleResponse>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }
    
    @Operation(summary = "도서 상세 조회", description = "도서 상세 정보를 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "도서 상세 조회 성공"),
        @ApiResponse(responseCode = "404", description = "도서를 찾을 수 없음", content = @Content)
    })
    @GetMapping("/{bookId}")
    public ResponseEntity<BookDto.Response> getBookDetail(
        @Parameter(description = "도서 ID", required = true) @PathVariable String bookId
    ) {
        return ResponseEntity.ok(bookService.getBookDetail(bookId));
    }
    
    @Operation(summary = "카테고리별 도서 조회", description = "특정 카테고리의 도서 목록을 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "카테고리별 도서 조회 성공")
    })
    @GetMapping("/category/{category}")
    public ResponseEntity<List<BookDto.SimpleResponse>> getBooksByCategory(
        @Parameter(description = "도서 카테고리", required = true) @PathVariable String category
    ) {
        return ResponseEntity.ok(bookService.getBooksByCategory(category));
    }
    
    @Operation(summary = "예약 가능한 도서 목록 조회", description = "현재 대출 가능한 책이 없는 도서 목록을 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "도서 목록 조회 성공"),
        @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음", content = @Content)
    })
    @GetMapping("/available-for-reservation")
    public ResponseEntity<List<BookReservationDto>> getBooksAvailableForReservation(
        @Parameter(description = "사용자 ID", required = false) @RequestParam(required = false) String userId
    ) {
        return ResponseEntity.ok(bookService.getBooksAvailableForReservation(userId));
    }
} 