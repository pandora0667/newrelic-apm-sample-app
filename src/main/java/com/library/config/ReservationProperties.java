package com.library.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

/**
 * 도서 예약 관련 설정 속성
 */
@Configuration
@ConfigurationProperties(prefix = "library.reservation")
@Getter
@Setter
public class ReservationProperties {
    /**
     * 최대 예약 권수
     */
    private int maxBooks = 3;
    
    /**
     * 예약 유효 기간(일)
     */
    private int expiryDays = 3;
} 