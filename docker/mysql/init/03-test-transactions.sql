-- 데이터베이스 선택
USE library_db;

-- 문자 인코딩 설정
SET NAMES utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;

-- 기존 대출 및 예약 데이터 삭제 (테스트 환경 초기화)
DELETE FROM loans;
DELETE FROM reservations;

-- 고정된 대출 ID를 사용하여 테스트 데이터 생성
-- 여기서는 각 사용자가 다양한 대출 상태를 가지도록 설정

-- 1. user1: 활성 대출 2건 (하나는 연장 1회)
INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, status, extension_count, created_at)
SELECT 
    'l1000000000001',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000001'),
    DATE_SUB(CURDATE(), INTERVAL 7 DAY),
    DATE_ADD(CURDATE(), INTERVAL 7 DAY),
    'LOANED',
    0,
    DATE_SUB(CURDATE(), INTERVAL 7 DAY)
FROM users u WHERE u.user_id = 'u1000000000001';

INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, status, extension_count, created_at)
SELECT 
    'l1000000000002',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000002'),
    DATE_SUB(CURDATE(), INTERVAL 15 DAY),
    DATE_ADD(CURDATE(), INTERVAL 13 DAY),
    'LOANED',
    1,
    DATE_SUB(CURDATE(), INTERVAL 15 DAY)
FROM users u WHERE u.user_id = 'u1000000000001';

-- user1 추가: 연체되었다가 반납된 대출
INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, returned_at, status, extension_count, created_at)
SELECT 
    'l1000000000003',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000011'),
    DATE_SUB(CURDATE(), INTERVAL 40 DAY),
    DATE_SUB(CURDATE(), INTERVAL 26 DAY),
    DATE_SUB(CURDATE(), INTERVAL 20 DAY),
    'RETURNED',
    0,
    DATE_SUB(CURDATE(), INTERVAL 40 DAY)
FROM users u WHERE u.user_id = 'u1000000000001';

-- 2. user2: 반납 완료된 대출 3건
INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, returned_at, status, extension_count, created_at)
SELECT 
    'l1000000000004',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000003'),
    DATE_SUB(CURDATE(), INTERVAL 30 DAY),
    DATE_SUB(CURDATE(), INTERVAL 16 DAY),
    DATE_SUB(CURDATE(), INTERVAL 20 DAY),
    'RETURNED',
    0,
    DATE_SUB(CURDATE(), INTERVAL 30 DAY)
FROM users u WHERE u.user_id = 'u1000000000002';

INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, returned_at, status, extension_count, created_at)
SELECT 
    'l1000000000005',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000004'),
    DATE_SUB(CURDATE(), INTERVAL 40 DAY),
    DATE_SUB(CURDATE(), INTERVAL 26 DAY),
    DATE_SUB(CURDATE(), INTERVAL 28 DAY),
    'RETURNED',
    0,
    DATE_SUB(CURDATE(), INTERVAL 40 DAY)
FROM users u WHERE u.user_id = 'u1000000000002';

INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, returned_at, status, extension_count, created_at)
SELECT 
    'l1000000000006',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000005'),
    DATE_SUB(CURDATE(), INTERVAL 50 DAY),
    DATE_SUB(CURDATE(), INTERVAL 36 DAY),
    DATE_SUB(CURDATE(), INTERVAL 35 DAY),
    'RETURNED',
    0,
    DATE_SUB(CURDATE(), INTERVAL 50 DAY)
FROM users u WHERE u.user_id = 'u1000000000002';

-- user2 추가: 활성 대출 1건
INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, status, extension_count, created_at)
SELECT 
    'l1000000000007',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000012'),
    DATE_SUB(CURDATE(), INTERVAL 5 DAY),
    DATE_ADD(CURDATE(), INTERVAL 9 DAY),
    'LOANED',
    0,
    DATE_SUB(CURDATE(), INTERVAL 5 DAY)
FROM users u WHERE u.user_id = 'u1000000000002';

-- 3. user3: 연체 중인 대출 2건
INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, status, extension_count, created_at)
SELECT 
    'l1000000000008',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000006'),
    DATE_SUB(CURDATE(), INTERVAL 20 DAY),
    DATE_SUB(CURDATE(), INTERVAL 6 DAY),
    'OVERDUE',
    0,
    DATE_SUB(CURDATE(), INTERVAL 20 DAY)
FROM users u WHERE u.user_id = 'u1000000000003';

INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, status, extension_count, created_at)
SELECT 
    'l1000000000009',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000007'),
    DATE_SUB(CURDATE(), INTERVAL 30 DAY),
    DATE_SUB(CURDATE(), INTERVAL 16 DAY),
    'OVERDUE',
    0,
    DATE_SUB(CURDATE(), INTERVAL 30 DAY)
FROM users u WHERE u.user_id = 'u1000000000003';

-- user3 추가: 반납 완료된 대출 1건
INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, returned_at, status, extension_count, created_at)
SELECT 
    'l1000000000010',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000013'),
    DATE_SUB(CURDATE(), INTERVAL 60 DAY),
    DATE_SUB(CURDATE(), INTERVAL 46 DAY),
    DATE_SUB(CURDATE(), INTERVAL 48 DAY),
    'RETURNED',
    0,
    DATE_SUB(CURDATE(), INTERVAL 60 DAY)
FROM users u WHERE u.user_id = 'u1000000000003';

-- 4. user4: 연체되었다가 반납된 대출 2건
INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, returned_at, status, extension_count, created_at)
SELECT 
    'l1000000000011',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000008'),
    DATE_SUB(CURDATE(), INTERVAL 40 DAY),
    DATE_SUB(CURDATE(), INTERVAL 26 DAY),
    DATE_SUB(CURDATE(), INTERVAL 20 DAY),
    'RETURNED',
    0,
    DATE_SUB(CURDATE(), INTERVAL 40 DAY)
FROM users u WHERE u.user_id = 'u1000000000004';

INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, returned_at, status, extension_count, created_at)
SELECT 
    'l1000000000012',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000009'),
    DATE_SUB(CURDATE(), INTERVAL 50 DAY),
    DATE_SUB(CURDATE(), INTERVAL 36 DAY),
    DATE_SUB(CURDATE(), INTERVAL 30 DAY),
    'RETURNED',
    0,
    DATE_SUB(CURDATE(), INTERVAL 50 DAY)
FROM users u WHERE u.user_id = 'u1000000000004';

-- user4 추가: 활성 대출 1건 (1회 연장)
INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, status, extension_count, created_at)
SELECT 
    'l1000000000013',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000014'),
    DATE_SUB(CURDATE(), INTERVAL 12 DAY),
    DATE_ADD(CURDATE(), INTERVAL 16 DAY),
    'LOANED',
    1,
    DATE_SUB(CURDATE(), INTERVAL 12 DAY)
FROM users u WHERE u.user_id = 'u1000000000004';

-- 5. user5: 다양한 상태의 대출 (활성 1건, 반납 1건, 연체 1건)
INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, status, extension_count, created_at)
SELECT 
    'l1000000000014',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000010'),
    DATE_SUB(CURDATE(), INTERVAL 10 DAY),
    DATE_ADD(CURDATE(), INTERVAL 4 DAY),
    'LOANED',
    0,
    DATE_SUB(CURDATE(), INTERVAL 10 DAY)
FROM users u WHERE u.user_id = 'u1000000000005';

INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, returned_at, status, extension_count, created_at)
SELECT 
    'l1000000000015',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000011'),
    DATE_SUB(CURDATE(), INTERVAL 30 DAY),
    DATE_SUB(CURDATE(), INTERVAL 16 DAY),
    DATE_SUB(CURDATE(), INTERVAL 18 DAY),
    'RETURNED',
    0,
    DATE_SUB(CURDATE(), INTERVAL 30 DAY)
FROM users u WHERE u.user_id = 'u1000000000005';

INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, status, extension_count, created_at)
SELECT 
    'l1000000000016',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000012'),
    DATE_SUB(CURDATE(), INTERVAL 20 DAY),
    DATE_SUB(CURDATE(), INTERVAL 6 DAY),
    'OVERDUE',
    0,
    DATE_SUB(CURDATE(), INTERVAL 20 DAY)
FROM users u WHERE u.user_id = 'u1000000000005';

-- user5 추가: 딱 만기일에 반납한 대출
INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, returned_at, status, extension_count, created_at)
SELECT 
    'l1000000000017',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000015'),
    DATE_SUB(CURDATE(), INTERVAL 28 DAY),
    DATE_SUB(CURDATE(), INTERVAL 14 DAY),
    DATE_SUB(CURDATE(), INTERVAL 14 DAY),
    'RETURNED',
    0,
    DATE_SUB(CURDATE(), INTERVAL 28 DAY)
FROM users u WHERE u.user_id = 'u1000000000005';

-- 6. user6: 활성 대출 2건 (하나는 2회 연장, 하나는 1회 연장)
INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, status, extension_count, created_at)
SELECT 
    'l1000000000018',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000013'),
    DATE_SUB(CURDATE(), INTERVAL 35 DAY),
    DATE_ADD(CURDATE(), INTERVAL 7 DAY),
    'LOANED',
    2,
    DATE_SUB(CURDATE(), INTERVAL 35 DAY)
FROM users u WHERE u.user_id = 'u1000000000006';

INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, status, extension_count, created_at)
SELECT 
    'l1000000000019',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000014'),
    DATE_SUB(CURDATE(), INTERVAL 20 DAY),
    DATE_ADD(CURDATE(), INTERVAL 8 DAY),
    'LOANED',
    1,
    DATE_SUB(CURDATE(), INTERVAL 20 DAY)
FROM users u WHERE u.user_id = 'u1000000000006';

-- user6 추가: 오늘 생성된 대출
INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, status, extension_count, created_at)
SELECT 
    'l1000000000020',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000016'),
    CURDATE(),
    DATE_ADD(CURDATE(), INTERVAL 14 DAY),
    'LOANED',
    0,
    CURDATE()
FROM users u WHERE u.user_id = 'u1000000000006';

-- 7. user7: 활성 대출 1건, 곧 만료되는 대출 1건 (3일 이내)
INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, status, extension_count, created_at)
SELECT 
    'l1000000000021',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000015'),
    DATE_SUB(CURDATE(), INTERVAL 5 DAY),
    DATE_ADD(CURDATE(), INTERVAL 9 DAY),
    'LOANED',
    0,
    DATE_SUB(CURDATE(), INTERVAL 5 DAY)
FROM users u WHERE u.user_id = 'u1000000000007';

INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, status, extension_count, created_at)
SELECT 
    'l1000000000022',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000016'),
    DATE_SUB(CURDATE(), INTERVAL 12 DAY),
    DATE_ADD(CURDATE(), INTERVAL 2 DAY),
    'LOANED',
    0,
    DATE_SUB(CURDATE(), INTERVAL 12 DAY)
FROM users u WHERE u.user_id = 'u1000000000007';

-- user7 추가: 매우 오래 연체된 대출
INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, status, extension_count, created_at)
SELECT 
    'l1000000000023',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000017'),
    DATE_SUB(CURDATE(), INTERVAL 90 DAY),
    DATE_SUB(CURDATE(), INTERVAL 76 DAY),
    'OVERDUE',
    0,
    DATE_SUB(CURDATE(), INTERVAL 90 DAY)
FROM users u WHERE u.user_id = 'u1000000000007';

-- 8. user8: 대출 기록만 있고 현재 대출 없음 (반납 3건, 다양한 기간)
INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, returned_at, status, extension_count, created_at)
SELECT 
    'l1000000000024',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000017'),
    DATE_SUB(CURDATE(), INTERVAL 60 DAY),
    DATE_SUB(CURDATE(), INTERVAL 46 DAY),
    DATE_SUB(CURDATE(), INTERVAL 50 DAY),
    'RETURNED',
    0,
    DATE_SUB(CURDATE(), INTERVAL 60 DAY)
FROM users u WHERE u.user_id = 'u1000000000008';

INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, returned_at, status, extension_count, created_at)
SELECT 
    'l1000000000025',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000018'),
    DATE_SUB(CURDATE(), INTERVAL 45 DAY),
    DATE_SUB(CURDATE(), INTERVAL 31 DAY),
    DATE_SUB(CURDATE(), INTERVAL 35 DAY),
    'RETURNED',
    0,
    DATE_SUB(CURDATE(), INTERVAL 45 DAY)
FROM users u WHERE u.user_id = 'u1000000000008';

INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, returned_at, status, extension_count, created_at)
SELECT 
    'l1000000000026',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000019'),
    DATE_SUB(CURDATE(), INTERVAL 30 DAY),
    DATE_SUB(CURDATE(), INTERVAL 16 DAY),
    DATE_SUB(CURDATE(), INTERVAL 20 DAY),
    'RETURNED',
    0,
    DATE_SUB(CURDATE(), INTERVAL 30 DAY)
FROM users u WHERE u.user_id = 'u1000000000008';

-- user8 추가: 여러 번 연장한 대출
INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, status, extension_count, created_at)
SELECT 
    'l1000000000027',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000018'),
    DATE_SUB(CURDATE(), INTERVAL 35 DAY),
    DATE_ADD(CURDATE(), INTERVAL 7 DAY),
    'LOANED',
    2,
    DATE_SUB(CURDATE(), INTERVAL 35 DAY)
FROM users u WHERE u.user_id = 'u1000000000008';

-- 9. user9: 대출 기록 없음 (신규 사용자)
-- user9 추가: 첫번째 대출
INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, status, extension_count, created_at)
SELECT 
    'l1000000000028',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000020'),
    DATE_SUB(CURDATE(), INTERVAL 2 DAY),
    DATE_ADD(CURDATE(), INTERVAL 12 DAY),
    'LOANED',
    0,
    DATE_SUB(CURDATE(), INTERVAL 2 DAY)
FROM users u WHERE u.user_id = 'u1000000000009';

-- 10. user10: 최대 연장 횟수(3회)에 도달한 대출 1건
INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, status, extension_count, created_at)
SELECT 
    'l1000000000029',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000020'),
    DATE_SUB(CURDATE(), INTERVAL 56 DAY),
    DATE_ADD(CURDATE(), INTERVAL 0 DAY),
    'LOANED',
    3,
    DATE_SUB(CURDATE(), INTERVAL 56 DAY)
FROM users u WHERE u.user_id = 'u1000000000010';

-- user10 추가: 당일 대출 당일 반납
INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, returned_at, status, extension_count, created_at)
SELECT 
    'l1000000000030',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000021'),
    DATE_SUB(CURDATE(), INTERVAL 5 DAY),
    DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY), INTERVAL 14 DAY),
    DATE_SUB(CURDATE(), INTERVAL 5 DAY),
    'RETURNED',
    0,
    DATE_SUB(CURDATE(), INTERVAL 5 DAY)
FROM users u WHERE u.user_id = 'u1000000000010';

-- 예약 데이터 추가

-- 1. user1: 활성 예약 1건
INSERT INTO reservations (reservation_id, user_id, book_id, reservation_date, expiration_date, status, created_at)
SELECT 
    'r1000000000001',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000021'),
    TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
    TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 2 DAY)),
    'RESERVED',
    TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY))
FROM users u WHERE u.user_id = 'u1000000000001';

-- 2. user2: 취소된 예약 1건
INSERT INTO reservations (reservation_id, user_id, book_id, reservation_date, expiration_date, status, created_at)
SELECT 
    'r1000000000002',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000022'),
    TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 10 DAY)),
    TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 7 DAY)),
    'CANCELLED',
    TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 10 DAY))
FROM users u WHERE u.user_id = 'u1000000000002';

-- 3. user3: 만료된 예약 1건
INSERT INTO reservations (reservation_id, user_id, book_id, reservation_date, expiration_date, status, created_at)
SELECT 
    'r1000000000003',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000023'),
    TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 7 DAY)),
    TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
    'EXPIRED',
    TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 7 DAY))
FROM users u WHERE u.user_id = 'u1000000000003';

-- 4. user4: 완료된 예약 1건 (예약 -> 대출로 전환)
INSERT INTO reservations (reservation_id, user_id, book_id, reservation_date, expiration_date, status, created_at)
SELECT 
    'r1000000000004',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000014'),
    TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 15 DAY)),
    TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 12 DAY)),
    'COMPLETED',
    TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 15 DAY))
FROM users u WHERE u.user_id = 'u1000000000004';

-- 5. user5: 대기 중인 예약 1건 (waitlist)
INSERT INTO reservations (reservation_id, user_id, book_id, reservation_date, expiration_date, status, created_at)
SELECT 
    'r1000000000005',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000024'),
    TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
    TIMESTAMP(DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 3 DAY), INTERVAL 7 DAY)),
    'WAITING',
    TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 3 DAY))
FROM users u WHERE u.username = 'user5';

-- 추가 예약 데이터: 같은 도서에 대한 여러 사용자의 예약 (대기열 테스트)
-- 도서 'b1000000000024'에 대해 user6, user7, user8이 순서대로 대기 중
INSERT INTO reservations (reservation_id, user_id, book_id, reservation_date, expiration_date, status, created_at)
SELECT 
    'r1000000000006',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000024'),
    TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
    TIMESTAMP(DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL 7 DAY)),
    'WAITING',
    TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 2 DAY))
FROM users u WHERE u.user_id = 'u1000000000006';

INSERT INTO reservations (reservation_id, user_id, book_id, reservation_date, expiration_date, status, created_at)
SELECT 
    'r1000000000007',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000024'),
    TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
    TIMESTAMP(DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL 7 DAY)),
    'WAITING',
    TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY))
FROM users u WHERE u.user_id = 'u1000000000007';

-- 추가 예약 데이터: 오늘 생성된 예약
INSERT INTO reservations (reservation_id, user_id, book_id, reservation_date, expiration_date, status, created_at)
SELECT 
    'r1000000000008',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000025'),
    TIMESTAMP(CURDATE()),
    TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 3 DAY)),
    'RESERVED',
    TIMESTAMP(CURDATE())
FROM users u WHERE u.user_id = 'u1000000000008';

-- 전체 과정 테스트: 예약 -> 대출 -> 반납 (user10)
-- 1. 예약 완료
INSERT INTO reservations (reservation_id, user_id, book_id, reservation_date, expiration_date, status, created_at)
SELECT 
    'r1000000000009',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000026'),
    TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 30 DAY)),
    TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 27 DAY)),
    'COMPLETED',
    TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 30 DAY))
FROM users u WHERE u.user_id = 'u1000000000010';

-- 2. 대출 후 반납
INSERT INTO loans (loan_id, user_id, book_id, loan_date, due_date, returned_at, status, extension_count, created_at)
SELECT 
    'l1000000000031',
    u.id,
    (SELECT id FROM books WHERE book_id = 'b1000000000026'),
    DATE_SUB(CURDATE(), INTERVAL 27 DAY),
    DATE_SUB(CURDATE(), INTERVAL 13 DAY),
    DATE_SUB(CURDATE(), INTERVAL 15 DAY),
    'RETURNED',
    0,
    DATE_SUB(CURDATE(), INTERVAL 27 DAY)
FROM users u WHERE u.user_id = 'u1000000000010'; 