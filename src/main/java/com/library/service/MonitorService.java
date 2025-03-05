package com.library.service;

import com.library.dto.monitor.MonitorDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import javax.sql.DataSource;
import java.time.ZonedDateTime;
import java.util.Random;

@Service
public class MonitorService {

    @Resource
    private DataSource dataSource;
    
    @Resource
    private JdbcTemplate jdbcTemplate;
    
    private final Random random = new Random();

    /**
     * 시스템 헬스 체크 정보를 제공합니다.
     * 데이터베이스 연결 상태와 현재 타임스탬프를 포함합니다.
     */
    public MonitorDto.HealthResponse checkHealth() {
        String status = "UP";
        String databaseStatus = "CONNECTED";
        
        try {
            // 데이터베이스 연결 확인
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
        } catch (Exception e) {
            status = "DOWN";
            databaseStatus = "DISCONNECTED";
        }

        return MonitorDto.HealthResponse.builder()
                .status(status)
                .database(databaseStatus)
                .timestamp(ZonedDateTime.now())
                .build();
    }

    /**
     * 시스템 상태 정보를 제공합니다.
     * 데이터베이스, 캐시, 외부 서비스의 상태와 응답 시간을 포함합니다.
     */
    public MonitorDto.StatusResponse getSystemStatus() {
        // 데이터베이스 상태 확인
        MonitorDto.ComponentStatus dbStatus = checkDatabaseStatus();
        
        // 캐시 상태 확인 (예시 - 실제 캐시 시스템이 있다면 해당 시스템 체크)
        MonitorDto.ComponentStatus cacheStatus = simulateCacheStatus();
        
        // 외부 서비스 상태 확인 (예시 - 실제 연동된 외부 서비스가 있다면 해당 서비스 체크)
        MonitorDto.ComponentStatus externalServiceStatus = simulateExternalServiceStatus();

        return MonitorDto.StatusResponse.builder()
                .database(dbStatus)
                .cache(cacheStatus)
                .externalService(externalServiceStatus)
                .build();
    }

    private MonitorDto.ComponentStatus checkDatabaseStatus() {
        long startTime = System.currentTimeMillis();
        String status = "CONNECTED";
        
        try {
            // 데이터베이스 연결 확인
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
        } catch (Exception e) {
            status = "DISCONNECTED";
        }
        
        long responseTime = System.currentTimeMillis() - startTime;
        
        return MonitorDto.ComponentStatus.builder()
                .status(status)
                .responseTimeMs(responseTime)
                .build();
    }

    // 예시용 캐시 상태 체크 (실제 캐시 시스템 연동 시 이 부분 수정)
    private MonitorDto.ComponentStatus simulateCacheStatus() {
        // 실제 캐시 시스템 없이 시뮬레이션
        return MonitorDto.ComponentStatus.builder()
                .status("CONNECTED")
                .responseTimeMs(random.nextInt(10) + 1) // 1-10ms 사이의 응답 시간
                .build();
    }

    // 예시용 외부 서비스 상태 체크 (실제 외부 서비스 연동 시 이 부분 수정)
    private MonitorDto.ComponentStatus simulateExternalServiceStatus() {
        // 실제 외부 서비스 없이 시뮬레이션
        return MonitorDto.ComponentStatus.builder()
                .status("UP")
                .responseTimeMs(random.nextInt(50) + 20) // 20-70ms 사이의 응답 시간
                .build();
    }
} 