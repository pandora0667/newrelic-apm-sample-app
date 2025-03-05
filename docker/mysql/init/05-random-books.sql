-- 데이터베이스 선택
USE library_db;

-- 문자 인코딩 설정
SET NAMES utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;

-- 대량의 도서 데이터 생성을 위한 저장 프로시저
DELIMITER //
CREATE PROCEDURE generate_random_books()
BEGIN
    DECLARE j INT DEFAULT 0;
    DECLARE bookId VARCHAR(255);
    DECLARE title VARCHAR(255);
    DECLARE author VARCHAR(100);
    DECLARE isbn VARCHAR(20);
    DECLARE pubDate DATE;
    DECLARE category VARCHAR(50);
    DECLARE copies INT;
    DECLARE description TEXT;
    
    -- 책 제목 접두사 (랜덤 조합용)
    DECLARE title_prefixes VARCHAR(2000) DEFAULT '현대,최신,실용,고급,기초,클래식,입문,완벽,실전,그림으로 배우는,쉽게 배우는,한 권으로 끝내는,처음 시작하는,마스터,프로페셔널,알기 쉬운,비즈니스를 위한,학교에서 가르쳐주지 않는,누구나 할 수 있는,한국인을 위한,세계인이 사랑하는,인생을 바꾸는,미래를 여는,디지털 시대의,4차 산업혁명 시대의,글로벌,트렌드,미래,혁신적인,창의적인,실용적인,전략적인,체계적인,통합적인,효율적인,현명한,지혜로운,스마트한,센스있는,감성적인,논리적인,과학적인,예술적인,철학적인';
    
    -- 책 제목 주제 (카테고리별)
    DECLARE programming_subjects VARCHAR(3000) DEFAULT '자바 프로그래밍,파이썬 기초,C++ 완벽 가이드,자바스크립트와 웹 개발,PHP와 MySQL,루비 온 레일즈,코틀린 안드로이드 개발,스위프트로 iOS 앱 만들기,Go 언어 마스터하기,러스트 시스템 프로그래밍,타입스크립트 실전 프로젝트,데이터베이스 설계와 구현,알고리즘 문제 해결 전략,컴퓨터 구조와 원리,운영체제의 이해,네트워크 프로그래밍,클라우드 컴퓨팅 기초,도커와 쿠버네티스,마이크로서비스 아키텍처,RESTful API 디자인,그래픽 프로그래밍 기초,게임 개발 입문,머신러닝 알고리즘,딥러닝의 기초,강화학습 실전 가이드,웹 보안 프로그래밍,블록체인 개발,함수형 프로그래밍,객체지향 설계 패턴,애자일 개발 방법론,TDD와 클린 코드,DevOps 실전 가이드,CI/CD 파이프라인 구축,서버리스 아키텍처,프론트엔드 프레임워크,백엔드 API 개발,풀스택 웹 개발,모바일 앱 아키텍처,임베디드 시스템 프로그래밍,IoT 프로그래밍 기초';
    
    DECLARE science_subjects VARCHAR(3000) DEFAULT '양자역학의 세계,상대성이론 이해하기,우주의 탄생과 진화,블랙홀의 비밀,입자물리학 기초,별과 은하의 일생,천체물리학 입문,화학반응의 원리,유기화학의 기초,무기화학 이해하기,분자생물학 개론,유전자와 DNA,세포의 구조와 기능,진화론의 이해,생태계와 환경,지구과학 탐구,대기와 기후변화,해양과학의 세계,지질학 기초,화산과 지진의 원리,광물과 암석의 세계,인체 해부학,생리학의 이해,면역학 개론,신경과학 입문,의학의 역사,현대 의학의 발전,약리학 기초,첨단 의료기술,나노과학의 세계,로봇공학 입문,인공지능의 원리,빅데이터 과학,양자컴퓨팅 이해하기,신소재 과학,에너지 공학,친환경 기술,우주 탐사 기술,뇌과학의 최전선,미래 과학 트렌드';
    
    DECLARE novel_subjects VARCHAR(3000) DEFAULT '사랑의 불시착,그해 여름의 비밀,별이 빛나는 밤에,꿈꾸는 시간,잊혀진 약속,바다가 들리는 곳,산책하는 밤,첫사랑의 추억,마지막 인사,겨울의 편지,봄날의 꿈,가을의 속삭임,여름 해변의 추억,그림자의 춤,푸른 하늘 아래,빛나는 순간들,눈물의 미소,별빛 아래 만남,운명의 십자로,시간의 강,영원한 약속,잃어버린 세계,미래로의 여행,과거의 유령,비밀의 정원,마법의 숲,유리성의 비밀,황금 나침반,용의 날개,마지막 전사,왕관의 무게,공주와 기사,호수의 전설,달빛 아래 춤,깊은 바다의 노래,하늘의 성,구름 너머 세상,보랏빛 안개,비단 길의 끝,유리구두의 주인,천년의 사랑,백년의 고독,시간 여행자의 아내,별을 삼킨 아이,숲속의 마녀,바람의 언덕,꽃잎의 속삭임,눈의 여왕,달빛 조각사,빛과 어둠의 경계';
    
    DECLARE literature_subjects VARCHAR(3000) DEFAULT '한국 현대시 모음집,세계 단편소설 걸작선,셰익스피어 전집,고전문학의 이해,동양 철학의 지혜,서양 철학의 기초,중세 문학의 세계,르네상스 문학,낭만주의 시선,모더니즘 문학,포스트모더니즘의 이해,실존주의 문학과 철학,초현실주의 예술과 문학,상징주의 시론,자연주의 문학,표현주의 문학과 예술,미니멀리즘 문학,매직 리얼리즘의 세계,디스토피아 문학,유토피아 소설,신화와 문학,성서와 문학,비평이론의 이해,현대 문예 사조,한국 고전 소설,일본 문학의 이해,중국 고전 문학,러시아 문학 걸작선,프랑스 문학의 정수,독일 문학의 흐름,영미 문학 산책,라틴 아메리카 문학,아프리카 문학의 목소리,중동 문학의 세계,인도 문학의 지혜,북유럽 문학 탐험,동유럽 문학의 숨결,스페인 문학의 매력,그리스 로마 고전,세계 서사시 모음집';
    
    DECLARE economy_subjects VARCHAR(3000) DEFAULT '경제학 원론,미시경제학 기초,거시경제학 이해하기,화폐와 금융의 역사,투자의 기술,주식시장의 심리학,부동산 투자 전략,글로벌 경제의 흐름,경제 위기의 역사,자본주의의 미래,사회주의 경제학,행동경제학 입문,게임이론과 경제전략,금융시장의 구조,기업재무 관리,국제무역의 원리,경제정책의 효과,조세제도의 이해,복지경제학 기초,노동경제학 개론,환경경제학의 원리,디지털 경제의 이해,플랫폼 비즈니스,공유경제의 미래,블록체인과 경제혁명,4차 산업혁명과 경제변화,인공지능 시대의 경제,미래 산업과 일자리,창업과 벤처 경영,경영전략의 기초,마케팅 원리,인사관리의 실제,생산관리 시스템,품질경영의 이해,회계원리 기초,원가관리회계,재무제표 분석,세무회계 기초,경영정보시스템,비즈니스 애널리틱스';
    
    DECLARE history_subjects VARCHAR(3000) DEFAULT '한국사의 이해,세계사 개론,고대 문명의 탄생,그리스 로마 문명,중세 유럽의 역사,르네상스와 종교개혁,대항해 시대,산업혁명의 시대,제국주의의 역사,세계대전과 냉전,현대 국제관계의 형성,한국 고대사,삼국시대의 문화,고려시대의 사회,조선시대의 정치,개항기와 근대화,일제강점기의 역사,해방과 분단,6.25 전쟁의 비극,현대 한국의 발전,중국 문명의 역사,일본 역사의 흐름,인도 문명의 발전,이슬람 세계의 역사,아프리카 문명의 발자취,아메리카 원주민의 문명,동남아시아의 역사,중앙아시아의 문명,러시아 제국의 역사,프랑스 혁명과 나폴레옹,영국 제국의 역사,독일 통일의 과정,미국의 건국과 발전,라틴 아메리카의 독립,전쟁의 역사,혁명의 시대,민주주의의 발전,식민지와 제국주의,냉전 시대의 세계,21세기 국제질서';
    
    DECLARE art_subjects VARCHAR(2000) DEFAULT '서양 미술의 역사,동양 예술의 세계,르네상스 미술,인상주의 화가들,현대 미술의 흐름,추상 예술의 이해,팝 아트와 현대 문화,사진 예술의 역사,영화 이론과 비평,세계 영화사,한국 영화의 발전,음악 이론의 기초,클래식 음악 감상법,재즈의 역사와 발전,대중음악의 변천사,한국 전통 음악,세계 전통 음악의 다양성,연극의 역사와 이론,현대 연극의 실험,무용 예술의 세계,발레의 역사와 감상,한국 무용의 아름다움,건축의 역사,현대 건축의 경향,패션 디자인의 역사,공예 예술의 세계,디지털 아트의 발전,멀티미디어 예술,게임 디자인의 예술성,공공 예술과 도시 환경';
    
    DECLARE self_improvement_subjects VARCHAR(2000) DEFAULT '성공하는 습관,리더십의 비밀,시간 관리의 기술,목표 달성의 심리학,효과적인 의사소통,인간관계의 심리,긍정적 사고의 힘,스트레스 관리법,자기계발의 여정,행복의 과학,감정 지능 높이기,결정력 향상의 기술,창의성 개발하기,자신감 키우기,삶의 균형 찾기,명상과 마음 수련,건강한 생활습관,영양과 다이어트,운동과 피트니스,수면의 과학,기억력 향상법,집중력 키우기,독서의 힘,글쓰기의 기술,말하기와 프레젠테이션,재테크와 자산관리,경력 개발 전략,취업 성공 전략,창업의 기술,비즈니스 협상법';
    
    -- 저자 이름 배열
    DECLARE authors_kr VARCHAR(3000) DEFAULT '김영수,이민준,박지현,최진우,정민서,강수빈,조현우,윤예진,장원영,임지호,한소희,오승현,서준호,신하은,권도윤,황민지,안준서,송지훈,류하늘,전소연,홍승우,고미래,문준영,양하진,손지민,배수현,조예준,백지원,허민준,유하은,남도현,심지우,노은서,하윤성,곽민준,성지은,차예준,주민혁,우승현,구민서,신예은,임도현,나윤서,전지환,민준호,유하린,진민주,지승현,엄하영,채수호';
    DECLARE authors_en VARCHAR(3000) DEFAULT 'John Smith,Emily Johnson,Michael Brown,Sarah Davis,David Wilson,Jennifer Taylor,Robert Anderson,Jessica Martinez,William Thompson,Elizabeth Garcia,James Rodriguez,Patricia Lewis,Joseph Walker,Linda Hall,Thomas Nelson,Margaret White,Charles Harris,Barbara Clark,Daniel Lee,Susan Baker,Paul Hill,Karen Scott,Mark Green,Nancy King,Donald Wright,Lisa Adams,Kenneth Carter,Helen Campbell,Steven Mitchell,Donna Edwards,Edward Turner,Carol Evans,Brian Phillips,Ruth Parker,Ronald Collins,Amanda Murphy,Jeffrey Reed,Kimberly Bailey,Jeffrey Howard,Stephanie Butler,Steven Reed,Michelle Brooks,Andrew Simmons,Rebecca Richardson,Timothy Morgan,Laura Cooper,Kenneth Peterson,Christine Gray';
    
    -- 카테고리 배열
    DECLARE categories VARCHAR(500) DEFAULT '프로그래밍,데이터분석,과학,소설,문학,경제경영,역사,예술,자기계발,건강,여행,요리,철학,정치,사회,심리학,언어,종교,스포츠,취미';
    
    -- 출판사 배열
    DECLARE publishers VARCHAR(1000) DEFAULT '한빛미디어,길벗,위키북스,인사이트,에이콘,이지스퍼블리싱,프리렉,한국경제신문,영진닷컴,정보문화사,제이펍,책만,비제이퍼블릭,인포북,디지털북스,한국학술정보,교보문고,알에이치코리아,사이버출판사,도서출판 다락원,한솔미디어,청림출판,민음사,문학동네,창비,문학과지성사,열림원,밝은세상,황금가지,뿌리와이파리,돌베개,은행나무,비룡소,시공사,웅진지식하우스,다산북스,21세기북스,생각정원,세계사,을유문화사';
    
    -- 도서 데이터 추가 (기본 30권 + 랜덤 670권 = 총 700권)
    -- 기존 02-test-users.sql에 이미 30권이 추가되어 있으므로 여기서는 670권만 추가
    WHILE j < 670 DO
        SET j = j + 1;
        
        -- ID 생성
        SET bookId = CONCAT('rb', LPAD(j + 30, 13, '0'));
        
        -- 카테고리 선택
        SET category = SUBSTRING_INDEX(SUBSTRING_INDEX(categories, ',', FLOOR(RAND() * 20) + 1), ',', -1);
        
        -- 카테고리에 따라 다른 제목 주제 선택
        IF category = '프로그래밍' OR category = '데이터분석' THEN
            SET title = CONCAT(
                SUBSTRING_INDEX(SUBSTRING_INDEX(title_prefixes, ',', FLOOR(RAND() * 40) + 1), ',', -1),
                ' ',
                SUBSTRING_INDEX(SUBSTRING_INDEX(programming_subjects, ',', FLOOR(RAND() * 40) + 1), ',', -1)
            );
            SET author = SUBSTRING_INDEX(SUBSTRING_INDEX(authors_kr, ',', FLOOR(RAND() * 50) + 1), ',', -1);
        ELSEIF category = '과학' THEN
            SET title = CONCAT(
                SUBSTRING_INDEX(SUBSTRING_INDEX(title_prefixes, ',', FLOOR(RAND() * 40) + 1), ',', -1),
                ' ',
                SUBSTRING_INDEX(SUBSTRING_INDEX(science_subjects, ',', FLOOR(RAND() * 40) + 1), ',', -1)
            );
            -- 50% 확률로 외국인 저자 선택
            IF RAND() > 0.5 THEN
                SET author = SUBSTRING_INDEX(SUBSTRING_INDEX(authors_en, ',', FLOOR(RAND() * 50) + 1), ',', -1);
            ELSE
                SET author = SUBSTRING_INDEX(SUBSTRING_INDEX(authors_kr, ',', FLOOR(RAND() * 50) + 1), ',', -1);
            END IF;
        ELSEIF category = '소설' THEN
            SET title = CONCAT(
                SUBSTRING_INDEX(SUBSTRING_INDEX(novel_subjects, ',', FLOOR(RAND() * 50) + 1), ',', -1)
            );
            -- 30% 확률로 외국인 저자 선택
            IF RAND() > 0.7 THEN
                SET author = SUBSTRING_INDEX(SUBSTRING_INDEX(authors_en, ',', FLOOR(RAND() * 50) + 1), ',', -1);
            ELSE
                SET author = SUBSTRING_INDEX(SUBSTRING_INDEX(authors_kr, ',', FLOOR(RAND() * 50) + 1), ',', -1);
            END IF;
        ELSEIF category = '문학' THEN
            SET title = CONCAT(
                SUBSTRING_INDEX(SUBSTRING_INDEX(literature_subjects, ',', FLOOR(RAND() * 40) + 1), ',', -1)
            );
            -- 40% 확률로 외국인 저자 선택
            IF RAND() > 0.6 THEN
                SET author = SUBSTRING_INDEX(SUBSTRING_INDEX(authors_en, ',', FLOOR(RAND() * 50) + 1), ',', -1);
            ELSE
                SET author = SUBSTRING_INDEX(SUBSTRING_INDEX(authors_kr, ',', FLOOR(RAND() * 50) + 1), ',', -1);
            END IF;
        ELSEIF category = '경제경영' THEN
            SET title = CONCAT(
                SUBSTRING_INDEX(SUBSTRING_INDEX(title_prefixes, ',', FLOOR(RAND() * 40) + 1), ',', -1),
                ' ',
                SUBSTRING_INDEX(SUBSTRING_INDEX(economy_subjects, ',', FLOOR(RAND() * 40) + 1), ',', -1)
            );
            -- 40% 확률로 외국인 저자 선택
            IF RAND() > 0.6 THEN
                SET author = SUBSTRING_INDEX(SUBSTRING_INDEX(authors_en, ',', FLOOR(RAND() * 50) + 1), ',', -1);
            ELSE
                SET author = SUBSTRING_INDEX(SUBSTRING_INDEX(authors_kr, ',', FLOOR(RAND() * 50) + 1), ',', -1);
            END IF;
        ELSEIF category = '역사' THEN
            SET title = CONCAT(
                SUBSTRING_INDEX(SUBSTRING_INDEX(history_subjects, ',', FLOOR(RAND() * 40) + 1), ',', -1)
            );
            -- 50% 확률로 외국인 저자 선택
            IF RAND() > 0.5 THEN
                SET author = SUBSTRING_INDEX(SUBSTRING_INDEX(authors_en, ',', FLOOR(RAND() * 50) + 1), ',', -1);
            ELSE
                SET author = SUBSTRING_INDEX(SUBSTRING_INDEX(authors_kr, ',', FLOOR(RAND() * 50) + 1), ',', -1);
            END IF;
        ELSEIF category = '예술' THEN
            SET title = CONCAT(
                SUBSTRING_INDEX(SUBSTRING_INDEX(art_subjects, ',', FLOOR(RAND() * 30) + 1), ',', -1)
            );
            -- 40% 확률로 외국인 저자 선택
            IF RAND() > 0.6 THEN
                SET author = SUBSTRING_INDEX(SUBSTRING_INDEX(authors_en, ',', FLOOR(RAND() * 50) + 1), ',', -1);
            ELSE
                SET author = SUBSTRING_INDEX(SUBSTRING_INDEX(authors_kr, ',', FLOOR(RAND() * 50) + 1), ',', -1);
            END IF;
        ELSEIF category = '자기계발' THEN
            SET title = CONCAT(
                SUBSTRING_INDEX(SUBSTRING_INDEX(self_improvement_subjects, ',', FLOOR(RAND() * 30) + 1), ',', -1)
            );
            -- 50% 확률로 외국인 저자 선택
            IF RAND() > 0.5 THEN
                SET author = SUBSTRING_INDEX(SUBSTRING_INDEX(authors_en, ',', FLOOR(RAND() * 50) + 1), ',', -1);
            ELSE
                SET author = SUBSTRING_INDEX(SUBSTRING_INDEX(authors_kr, ',', FLOOR(RAND() * 50) + 1), ',', -1);
            END IF;
        ELSE
            -- 기타 카테고리
            SET title = CONCAT(
                SUBSTRING_INDEX(SUBSTRING_INDEX(title_prefixes, ',', FLOOR(RAND() * 40) + 1), ',', -1),
                ' ',
                category,
                ' ',
                FLOOR(RAND() * 100) + 1
            );
            -- 30% 확률로 외국인 저자 선택
            IF RAND() > 0.7 THEN
                SET author = SUBSTRING_INDEX(SUBSTRING_INDEX(authors_en, ',', FLOOR(RAND() * 50) + 1), ',', -1);
            ELSE
                SET author = SUBSTRING_INDEX(SUBSTRING_INDEX(authors_kr, ',', FLOOR(RAND() * 50) + 1), ',', -1);
            END IF;
        END IF;
        
        -- ISBN 생성 (978 + 10자리 랜덤 숫자)
        SET isbn = CONCAT('978', LPAD(FLOOR(RAND() * 10000000000), 10, '0'));
        
        -- 출판일 생성 (2000-01-01부터 현재까지)
        SET pubDate = DATE_ADD('2000-01-01', INTERVAL FLOOR(RAND() * DATEDIFF(CURDATE(), '2000-01-01')) DAY);
        
        -- 보유 도서 수 (1-10권)
        SET copies = FLOOR(RAND() * 10) + 1;
        
        -- 책 설명
        SET description = CONCAT('이 책은 ', category, ' 분야의 ', title, '에 대한 내용을 다루고 있습니다. ', author, ' 저자가 ', YEAR(pubDate), '년에 집필한 이 책은 해당 분야에서 중요한 참고 자료로 활용되고 있습니다.');
        
        -- 책 추가
        INSERT INTO books (book_id, title, author, isbn, published_date, category, copies_available, description, created_at, updated_at)
        VALUES (bookId, title, author, isbn, pubDate, category, copies, description, 
                DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND() * 365) DAY), 
                DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND() * 30) DAY));
    END WHILE;
END //
DELIMITER ;

-- 프로시저 실행
CALL generate_random_books();

-- 프로시저 삭제 (사용 후 정리)
DROP PROCEDURE IF EXISTS generate_random_books; 