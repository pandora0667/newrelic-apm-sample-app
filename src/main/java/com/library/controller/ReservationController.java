package com.library.controller;

import com.library.dto.reservation.ReservationDto;
import com.library.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Reservation Management", description = "도서 예약 관리 API")
@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @Operation(summary = "도서 예약", description = "도서를 예약합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "예약 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청"),
        @ApiResponse(responseCode = "404", description = "도서 또는 사용자를 찾을 수 없음"),
        @ApiResponse(responseCode = "409", description = "이미 예약된 도서")
    })
    @PostMapping
    public ResponseEntity<ReservationDto.Response> createReservation(
            @Valid @RequestBody ReservationDto.CreateRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(reservationService.createReservation(request));
    }

    @Operation(summary = "사용자별 예약 목록 조회", description = "사용자의 예약 목록을 조회합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "조회 성공")
    })
    @GetMapping("/users/{userId}")
    public ResponseEntity<List<ReservationDto.Response>> getReservationsByUserId(
            @PathVariable String userId) {
        return ResponseEntity.ok(reservationService.getReservationsByUserId(userId));
    }

    @Operation(summary = "예약 취소", description = "도서 예약을 취소합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "취소 성공"),
        @ApiResponse(responseCode = "404", description = "예약을 찾을 수 없음"),
        @ApiResponse(responseCode = "400", description = "잘못된 예약 상태")
    })
    @DeleteMapping("/{reservationId}")
    public ResponseEntity<Void> cancelReservation(@PathVariable String reservationId) {
        reservationService.cancelReservation(reservationId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "예약 완료 처리", description = "도서 예약을 완료 처리합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "완료 처리 성공"),
        @ApiResponse(responseCode = "404", description = "예약을 찾을 수 없음"),
        @ApiResponse(responseCode = "400", description = "잘못된 예약 상태 또는 만료된 예약")
    })
    @PostMapping("/{reservationId}/complete")
    public ResponseEntity<Void> completeReservation(@PathVariable String reservationId) {
        reservationService.completeReservation(reservationId);
        return ResponseEntity.noContent().build();
    }
} 