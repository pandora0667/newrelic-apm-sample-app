package com.library.controller;

import com.library.dto.monitor.MonitorDto;
import com.library.service.MonitorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Monitoring", description = "시스템 모니터링 API")
@RestController
@RequestMapping("/api/v1/monitor")
@RequiredArgsConstructor
public class MonitorController {

    private final MonitorService monitorService;

    @Operation(summary = "시스템 헬스 체크", description = "시스템의 전반적인 상태와 데이터베이스 연결 상태를 확인합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "헬스 체크 성공")
    })
    @GetMapping("/health")
    public ResponseEntity<MonitorDto.HealthResponse> healthCheck() {
        return ResponseEntity.ok(monitorService.checkHealth());
    }

    @Operation(summary = "시스템 상태 정보", description = "시스템의 각 구성 요소(데이터베이스, 캐시, 외부 서비스)의 상태 및 응답 시간을 제공합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "상태 정보 조회 성공")
    })
    @GetMapping("/status")
    public ResponseEntity<MonitorDto.StatusResponse> systemStatus() {
        return ResponseEntity.ok(monitorService.getSystemStatus());
    }
} 