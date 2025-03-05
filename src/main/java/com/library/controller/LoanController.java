package com.library.controller;

import com.library.dto.loan.LoanDto;
import com.library.service.LoanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Loan Management", description = "도서 대출 관리 API")
@RestController
@RequestMapping("/api/v1/loans")
@RequiredArgsConstructor
public class LoanController {
    
    private final LoanService loanService;
    
    @Operation(summary = "도서 대출", description = "새로운 도서 대출을 생성합니다. 사용자당 최대 5권까지 대출 가능합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "도서 대출 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 대출 가능한 도서 없음", content = @Content),
        @ApiResponse(responseCode = "404", description = "사용자 또는 도서를 찾을 수 없음", content = @Content)
    })
    @PostMapping
    public ResponseEntity<LoanDto.Response> createLoan(@Valid @RequestBody LoanDto.CreateRequest request) {
        return new ResponseEntity<>(loanService.createLoan(request), HttpStatus.CREATED);
    }
    
    @Operation(summary = "대출 내역 조회", description = "사용자의 대출 내역을 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "대출 내역 조회 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
        @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음", content = @Content)
    })
    @GetMapping
    public ResponseEntity<List<LoanDto.SimpleResponse>> getLoansByUserId(
        @Parameter(description = "사용자 ID", required = true) @RequestParam String userId
    ) {
        return ResponseEntity.ok(loanService.getLoansByUserId(userId));
    }
    
    @Operation(summary = "도서 반납", description = "대출한 도서를 반납합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "도서 반납 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 이미 반납된 도서", content = @Content),
        @ApiResponse(responseCode = "404", description = "대출 기록을 찾을 수 없음", content = @Content)
    })
    @PostMapping("/{loanId}/return")
    public ResponseEntity<LoanDto.Response> returnBook(
        @Parameter(description = "대출 ID", required = true) @PathVariable String loanId,
        @Valid @RequestBody LoanDto.ReturnRequest request
    ) {
        return ResponseEntity.ok(loanService.returnBook(loanId, request));
    }

    @Operation(summary = "대출 연장 (일수 지정)", description = "대출 기간을 지정한 일수만큼 연장합니다. 최대 3회까지 연장 가능합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "대출 연장 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 연장 불가 상태", content = @Content),
        @ApiResponse(responseCode = "404", description = "대출 기록을 찾을 수 없음", content = @Content)
    })
    @PostMapping("/{loanId}/extend")
    public ResponseEntity<LoanDto.Response> extendLoan(
        @Parameter(description = "대출 ID", required = true) @PathVariable String loanId,
        @Valid @RequestBody LoanDto.ExtendRequest request
    ) {
        return ResponseEntity.ok(loanService.extendLoan(loanId, request));
    }

    @Operation(summary = "대출 연장 (기본 일수)", description = "대출 기간을 기본 일수(14일)만큼 연장합니다. 최대 3회까지 연장 가능합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "대출 연장 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 연장 불가 상태", content = @Content),
        @ApiResponse(responseCode = "404", description = "대출 기록을 찾을 수 없음", content = @Content)
    })
    @PostMapping("/{loanId}/extend/default")
    public ResponseEntity<LoanDto.Response> extendLoanDefaultDays(
        @Parameter(description = "대출 ID", required = true) @PathVariable String loanId
    ) {
        return ResponseEntity.ok(loanService.extendLoan(loanId));
    }
} 