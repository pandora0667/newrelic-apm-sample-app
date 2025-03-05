package com.library.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

/**
 * 도서 대출 관련 설정 속성
 */
@Configuration
@ConfigurationProperties(prefix = "library.loan")
@Getter
@Setter
public class LoanProperties {
    /**
     * 기본 대출 기간(일)
     */
    private int defaultPeriod = 14;
    
    /**
     * 최대 대출 권수
     */
    private int maxBooks = 5;
    
    /**
     * 최대 연장 횟수
     */
    private int maxExtensions = 3;
    
    /**
     * 기본 연장 기간(일)
     */
    private int defaultExtensionPeriod = 14;
} 