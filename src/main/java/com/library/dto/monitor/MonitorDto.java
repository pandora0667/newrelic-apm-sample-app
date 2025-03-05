package com.library.dto.monitor;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

public class MonitorDto {

    @Getter
    @NoArgsConstructor
    public static class HealthResponse {
        private String status;
        private String database;
        private String timestamp;

        @Builder
        public HealthResponse(String status, String database, ZonedDateTime timestamp) {
            this.status = status;
            this.database = database;
            this.timestamp = timestamp.toString();
        }
    }

    @Getter
    @NoArgsConstructor
    public static class StatusResponse {
        private ComponentStatus database;
        private ComponentStatus cache;
        private ComponentStatus externalService;

        @Builder
        public StatusResponse(ComponentStatus database, ComponentStatus cache, ComponentStatus externalService) {
            this.database = database;
            this.cache = cache;
            this.externalService = externalService;
        }
    }

    @Getter
    @NoArgsConstructor
    public static class ComponentStatus {
        private String status;
        private String responseTime;

        @Builder
        public ComponentStatus(String status, long responseTimeMs) {
            this.status = status;
            this.responseTime = responseTimeMs + "ms";
        }
    }
} 