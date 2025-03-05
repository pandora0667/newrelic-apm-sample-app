-- 데이터베이스 선택
USE library_db;

-- 문자 인코딩 설정
SET NAMES utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;

-- 실행 완료 메시지 출력
SELECT '도서관 데이터베이스 초기화가 완료되었습니다.' AS 'MESSAGE';
SELECT '스키마, 10명의 테스트 유저, 90명의 랜덤 유저, 700권의 도서, 테스트 대출 기록 및 랜덤 대출/예약 데이터가 생성되었습니다.' AS 'STATUS';

-- 테이블 레코드 수 확인
SELECT 'users' AS TABLE_NAME, COUNT(*) AS RECORD_COUNT FROM users
UNION
SELECT 'books' AS TABLE_NAME, COUNT(*) AS RECORD_COUNT FROM books
UNION
SELECT 'loans' AS TABLE_NAME, COUNT(*) AS RECORD_COUNT FROM loans
UNION
SELECT 'reservations' AS TABLE_NAME, COUNT(*) AS RECORD_COUNT FROM reservations;

-- 테스트 사용자 정보 확인
SELECT '테스트 사용자 정보:' AS 'TEST USERS';
SELECT user_id, username, SUBSTRING(full_name, 1, 10) AS name, email FROM users WHERE username IN ('admin', 'user1', 'user2', 'user3', 'user4', 'user5') ORDER BY user_id;

-- 도서 카테고리별 수량 확인
SELECT '도서 카테고리별 수량:' AS 'BOOKS BY CATEGORY';
SELECT category, COUNT(*) AS count FROM books GROUP BY category ORDER BY count DESC;

-- 대출 상태별 수량 확인
SELECT '대출 상태별 수량:' AS 'LOANS BY STATUS';
SELECT status, COUNT(*) AS count FROM loans GROUP BY status ORDER BY count DESC;

-- 예약 상태별 수량 확인
SELECT '예약 상태별 수량:' AS 'RESERVATIONS BY STATUS';
SELECT status, COUNT(*) AS count FROM reservations GROUP BY status ORDER BY count DESC; 