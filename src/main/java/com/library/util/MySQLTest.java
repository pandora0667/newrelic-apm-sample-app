package com.library.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * MySQL 데이터베이스에 직접 연결하여 도서 정보를 가져오는 테스트 프로그램
 * 이 프로그램은 Spring 애플리케이션 없이 직접 JDBC로 연결합니다.
 */
public class MySQLTest {

    public static void main(String[] args) {
        // 데이터베이스 연결 정보
        String url = "jdbc:mysql://localhost:3306/library_db?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=UTF-8&useUnicode=true&connectionCollation=utf8mb4_unicode_ci&sessionVariables=character_set_client=utf8mb4,character_set_results=utf8mb4,character_set_connection=utf8mb4,collation_connection=utf8mb4_unicode_ci&initSQL=SET NAMES utf8mb4";
        String user = "libraryuser";
        String password = "librarypassword";
        
        try {
            System.out.println("MySQL 연결 테스트 시작...");
            
            // MySQL 드라이버 로드
            Class.forName("com.mysql.cj.jdbc.Driver");
            
            // 데이터베이스 연결
            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("데이터베이스 연결 성공!");
            
            // 연결 설정 확인
            checkConnectionSettings(conn);
            
            // 도서 ID로 조회
            String bookId = "b1000000000001";
            queryBookById(conn, bookId);
            
            // 모든 도서 정보 조회
            queryAllBooks(conn);
            
            // 연결 종료
            conn.close();
            System.out.println("연결 종료");
            
        } catch (ClassNotFoundException e) {
            System.err.println("MySQL 드라이버를 찾을 수 없습니다: " + e.getMessage());
        } catch (SQLException e) {
            System.err.println("데이터베이스 연결 또는 쿼리 실행 중 오류 발생: " + e.getMessage());
        }
    }
    
    /**
     * 현재 DB 연결의 문자셋 설정 확인
     */
    private static void checkConnectionSettings(Connection conn) throws SQLException {
        System.out.println("\n==== 연결 설정 확인 ====");
        
        try (PreparedStatement pstmt = conn.prepareStatement("SHOW VARIABLES LIKE 'character%'");
             ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                System.out.println(rs.getString(1) + ": " + rs.getString(2));
            }
        }
        
        try (PreparedStatement pstmt = conn.prepareStatement("SHOW VARIABLES LIKE 'collation%'");
             ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                System.out.println(rs.getString(1) + ": " + rs.getString(2));
            }
        }
        
        System.out.println("------------------------");
    }
    
    /**
     * 도서 ID로 도서 정보 조회
     */
    private static void queryBookById(Connection conn, String bookId) throws SQLException {
        String sql = "SELECT * FROM books WHERE book_id = ?";
        
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, bookId);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                System.out.println("\n==== 도서 ID로 조회 ====");
                while (rs.next()) {
                    printBookInfo(rs);
                }
            }
        }
    }
    
    /**
     * 모든 도서 정보 조회
     */
    private static void queryAllBooks(Connection conn) throws SQLException {
        String sql = "SELECT * FROM books LIMIT 5";
        
        try (PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            
            System.out.println("\n==== 모든 도서 조회 (최대 5개) ====");
            while (rs.next()) {
                printBookInfo(rs);
                System.out.println("--------------------");
            }
        }
    }
    
    /**
     * 도서 정보 출력
     */
    private static void printBookInfo(ResultSet rs) throws SQLException {
        System.out.println("ID: " + rs.getLong("id"));
        System.out.println("도서 ID: " + rs.getString("book_id"));
        System.out.println("제목: " + rs.getString("title"));
        System.out.println("저자: " + rs.getString("author"));
        System.out.println("카테고리: " + rs.getString("category"));
        System.out.println("ISBN: " + rs.getString("isbn"));
        System.out.println("수량: " + rs.getInt("copies_available"));
        System.out.println("설명: " + rs.getString("description"));
    }
} 