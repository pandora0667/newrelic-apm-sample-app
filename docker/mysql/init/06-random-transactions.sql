-- 데이터베이스 선택
USE library_db;

-- 문자 인코딩 설정
SET NAMES utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;

-- 랜덤 사용자들의 대출 및 예약 데이터 생성
DELIMITER //
CREATE PROCEDURE generate_random_transactions()
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE j INT DEFAULT 0;
    DECLARE loan_count INT DEFAULT 300; -- 생성할 대출 데이터 수
    DECLARE reservation_count INT DEFAULT 100; -- 생성할 예약 데이터 수
    
    -- 대출 관련 변수
    DECLARE loanId VARCHAR(255);
    DECLARE userId VARCHAR(255);
    DECLARE bookId VARCHAR(255);
    DECLARE loanDate DATE;
    DECLARE dueDate DATE;
    DECLARE returnedDate DATE;
    DECLARE status VARCHAR(20);
    DECLARE extensionCount INT;
    DECLARE bookCount INT;
    DECLARE userCount INT;
    
    -- 예약 관련 변수
    DECLARE reservationId VARCHAR(255);
    DECLARE reservationDate DATE;
    DECLARE expirationDate DATE;
    
    -- 책과 사용자 수 가져오기
    SELECT COUNT(*) INTO bookCount FROM books;
    SELECT COUNT(*) INTO userCount FROM users WHERE role = 'USER';
    
    -- 랜덤 대출 데이터 생성
    WHILE i < loan_count DO
        SET i = i + 1;
        
        -- 랜덤 ID 생성 (기존 테스트 데이터와 충돌하지 않도록 r로 시작)
        SET loanId = CONCAT('r', LPAD(CONV(FLOOR(RAND() * 9999999999), 10, 36), 13, '0'));
        
        -- 랜덤 사용자 선택 (테스트 사용자 제외)
        SELECT user_id INTO userId FROM users WHERE role = 'USER' ORDER BY RAND() LIMIT 1;
        
        -- 랜덤 책 선택
        SELECT book_id INTO bookId FROM books ORDER BY RAND() LIMIT 1;
        
        -- 대출 날짜 (최근 1년 내)
        SET loanDate = DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND() * 365) DAY);
        
        -- 연장 횟수 (0-3회)
        SET extensionCount = FLOOR(RAND() * 4);
        
        -- 기본 대출 기간 14일 + 연장 횟수 * 14일
        SET dueDate = DATE_ADD(loanDate, INTERVAL (14 + extensionCount * 14) DAY);
        
        -- 상태 및 반납일 결정
        IF DATEDIFF(CURDATE(), dueDate) > 0 AND RAND() < 0.7 THEN
            -- 연체 상태 (30%)
            SET status = 'OVERDUE';
            SET returnedDate = NULL;
        ELSEIF RAND() < 0.6 THEN
            -- 반납 완료 (42%)
            SET status = 'RETURNED';
            -- 반납일은 대출일과 만기일 사이 또는 만기일 이후(연체 후 반납)
            IF RAND() < 0.8 THEN
                -- 정상 반납 (80%)
                SET returnedDate = DATE_ADD(loanDate, INTERVAL FLOOR(RAND() * DATEDIFF(dueDate, loanDate)) DAY);
            ELSE
                -- 연체 후 반납 (20%)
                SET returnedDate = DATE_ADD(dueDate, INTERVAL FLOOR(RAND() * 30) DAY);
            END IF;
        ELSE
            -- 대출 중 (28%)
            SET status = 'LOANED';
            SET returnedDate = NULL;
            -- 현재 대출 중인 경우 대출일을 최근으로 조정
            SET loanDate = DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND() * 14) DAY);
            SET dueDate = DATE_ADD(loanDate, INTERVAL (14 + extensionCount * 14) DAY);
        END IF;
        
        -- 대출 데이터 추가
        IF status = 'RETURNED' THEN
            INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, returned_at, status, extension_count, created_at)
            VALUES (
                loanId,
                userId,
                bookId,
                loanDate,
                dueDate,
                returnedDate,
                status,
                extensionCount,
                loanDate
            );
        ELSE
            INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, status, extension_count, created_at)
            VALUES (
                loanId,
                userId,
                bookId,
                loanDate,
                dueDate,
                status,
                extensionCount,
                loanDate
            );
        END IF;
    END WHILE;
    
    -- 랜덤 예약 데이터 생성
    WHILE j < reservation_count DO
        SET j = j + 1;
        
        -- 예약 ID 생성
        SET reservationId = CONCAT('rr', LPAD(CONV(FLOOR(RAND() * 9999999999), 10, 36), 13, '0'));
        
        -- 랜덤 사용자 선택 (테스트 사용자 제외)
        SELECT user_id INTO userId FROM users WHERE role = 'USER' ORDER BY RAND() LIMIT 1;
        
        -- 랜덤 책 선택
        SELECT book_id INTO bookId FROM books ORDER BY RAND() LIMIT 1;
        
        -- 예약 날짜 (최근 30일 내)
        SET reservationDate = DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND() * 30) DAY);
        
        -- 예약 상태 결정
        CASE FLOOR(RAND() * 4)
            WHEN 0 THEN 
                -- 활성 예약 (25%)
                SET status = 'RESERVED';
                SET expirationDate = DATE_ADD(reservationDate, INTERVAL 3 DAY);
            WHEN 1 THEN 
                -- 대기 중 (25%)
                SET status = 'WAITING';
                SET expirationDate = NULL;
            WHEN 2 THEN 
                -- 완료됨 (25%)
                SET status = 'COMPLETED';
                SET expirationDate = DATE_ADD(reservationDate, INTERVAL 3 DAY);
            ELSE 
                -- 취소됨/만료됨 (25%)
                IF RAND() < 0.5 THEN
                    SET status = 'CANCELLED';
                ELSE
                    SET status = 'EXPIRED';
                END IF;
                SET expirationDate = DATE_ADD(reservationDate, INTERVAL 3 DAY);
        END CASE;
        
        -- 예약 데이터 추가
        INSERT INTO reservations (reservation_id, user_id, book_id, reservation_date, expiration_date, status, created_at)
        VALUES (
            reservationId,
            userId,
            bookId,
            TIMESTAMP(reservationDate),
            TIMESTAMP(expirationDate),
            status,
            TIMESTAMP(reservationDate)
        );
    END WHILE;
END //
DELIMITER ;

-- 프로시저 실행
CALL generate_random_transactions();

-- 프로시저 삭제 (사용 후 정리)
DROP PROCEDURE IF EXISTS generate_random_transactions; 