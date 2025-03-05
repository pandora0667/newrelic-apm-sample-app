-- 데이터베이스 선택
USE library_db;

-- 문자 인코딩 설정
SET NAMES utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;

-- 랜덤 사용자 90명 생성 (user11 ~ user100)
-- 비밀번호: user123 (모든 사용자 동일)
DELIMITER //
CREATE PROCEDURE generate_random_users()
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE userId VARCHAR(255);
    DECLARE username VARCHAR(50);
    DECLARE fullName VARCHAR(100);
    DECLARE email VARCHAR(100);
    
    -- 사용자 성, 이름 배열 (랜덤 조합용)
    DECLARE surnames VARCHAR(500) DEFAULT '김,이,박,최,정,강,조,윤,장,임,한,오,서,신,권,황,안,송,류,전,홍,고,문,양,손,배,조,백,허,유,남,심,노,하,곽,성,차,주,우,구,신,임,나,전,민,유,진,지,엄,채,원,천,방,공,강,현,함,변,염,양,변,여,추,노,도,소,신,석,선,설,마,길,표,명,기,반,왕,금,옥,육,인,맹';
    DECLARE names VARCHAR(1000) DEFAULT '준,민,현,재,서,도,연,우,원,민,건,준,영,일,정,진,혁,주,훈,진,기,성,수,환,석,상,준,성,영,환,은,호,용,희,보,승,유,지,연,우,예,은,서,현,지,수,예,원,하,윤,정,민,채,다,빈,소,하,지,윤,민,서,승,재,도,연,건,우,은,지,하,준,지,훈,민,준,도,현,지,현,수,빈,예,진,서,연,윤,정,도,윤,승,민,은,서,재,윤,수,민,예,은,유,민,태,현,재,민,승,현,재,영,서,진,성,민,지,은,민,지,주,현,승,우,준,서,유,준,연,호,유,빈,지,호,태,양,민,석,수,호,진,석,유,정,주,원';
    
    -- 랜덤 비밀번호 해시 (모든 사용자에게 동일한 비밀번호 'user123' 적용)
    DECLARE pwd_hash VARCHAR(255) DEFAULT '$2a$10$dDkJKbXYfW8Mx/nO7aDwA.g2FbCT7VfVoQJ4YbMpVxx9Ckf/XKx4O';
    
    -- 사용자 추가 생성 (90명)
    WHILE i < 90 DO
        SET i = i + 1;
        
        -- ID 생성 (고정된 테스트 사용자와 충돌하지 않도록 r로 시작)
        SET userId = CONCAT('r', LPAD(CONV(FLOOR(RAND() * 9999999999), 10, 36), 13, '0'));
        
        -- 이름 생성
        SET fullName = CONCAT(
            SUBSTRING_INDEX(SUBSTRING_INDEX(surnames, ',', FLOOR(RAND() * 60) + 1), ',', -1),
            SUBSTRING_INDEX(SUBSTRING_INDEX(names, ',', FLOOR(RAND() * 100) + 1), ',', -1)
        );
        
        -- 이메일, 사용자명 생성
        SET username = CONCAT('user', i + 10);
        SET email = CONCAT(username, '@example.com');
        
        -- 사용자 추가
        INSERT INTO users (user_id, username, password, full_name, email, role)
        VALUES (userId, username, pwd_hash, fullName, email, 'USER');
    END WHILE;
END //
DELIMITER ;

-- 프로시저 실행
CALL generate_random_users();

-- 프로시저 삭제 (사용 후 정리)
DROP PROCEDURE IF EXISTS generate_random_users; 