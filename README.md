# 도서관 관리 시스템 (Library Management System)

이 프로젝트는 도서관의 도서 대출, 예약, 관리 기능을 제공하는 웹 애플리케이션입니다. Spring Boot 백엔드와 Next.js 프론트엔드로 구성되어 있으며, NewRelic APM을 테스트를 위한 코드 예제입니다. 

## 주요 기능

### 시스템 개요
- 도서관의 일상적인 운영을 자동화하고 효율화하는 통합 관리 시스템
- 사용자 친화적인 웹 인터페이스를 통한 도서 검색 및 대출/예약 서비스
- 관리자를 위한 도서 관리 및 통계 리포트 기능
- 실시간 시스템 모니터링 및 성능 분석 기능

### 백엔드 (Spring Boot)
- 도서 관리 (등록, 수정, 삭제, 조회)
- 대출 관리 (대출, 반납, 연장)
- 예약 관리 (예약, 취소)
- 사용자 관리
- 관리자 리포트
- 시스템 모니터링

### 프론트엔드 (Next.js)
- 도서 검색 및 목록 조회
- 대출 내역 조회
- 예약 내역 조회
- 관리자 대시보드
- 시스템 상태 모니터링

## API 구조

모든 API는 `/api/v1` 경로를 기본으로 합니다.

### 도서 관리 API (`/api/v1/books`)
- `POST /` - 도서 등록 (201 Created)
- `PUT /{bookId}` - 도서 정보 수정 (200 OK)
- `DELETE /{bookId}` - 도서 삭제 (204 No Content)
- `GET /` - 도서 목록 조회 (200 OK)
- `GET /{bookId}` - 도서 상세 조회 (200 OK)
- `GET /category/{category}` - 카테고리별 도서 조회 (200 OK)
- `GET /available-for-reservation` - 예약 가능한 도서 목록 조회 (200 OK)

### 대출 관리 API (`/api/v1/loans`)
- `POST /` - 도서 대출 (201 Created)
- `GET /` - 사용자별 대출 내역 조회 (200 OK)
- `POST /{loanId}/return` - 도서 반납 (200 OK)
- `POST /{loanId}/extend` - 대출 연장 (일수 지정) (200 OK)
- `POST /{loanId}/extend/default` - 대출 연장 (기본 일수) (200 OK)

### 예약 관리 API (`/api/v1/reservations`)
- `POST /` - 도서 예약 (201 Created)
- `GET /users/{userId}` - 사용자별 예약 목록 조회 (200 OK)
- `DELETE /{reservationId}` - 예약 취소 (204 No Content)
- `POST /{reservationId}/complete` - 예약 완료 처리 (204 No Content)

### 사용자 관리 API (`/api/v1/users`)
- `GET /` - 전체 사용자 목록 조회 (200 OK)
- `POST /register` - 회원가입 (201 Created)
- `GET /{userId}` - 사용자 정보 조회 (200 OK)
- `PUT /{userId}` - 사용자 정보 수정 (200 OK)

### 검색 API (`/api/v1/search`)
- `GET /books` - 도서 검색 (200 OK)
  - `keyword`: 검색 키워드 (제목 또는 저자)
  - `category`: 카테고리
  - `author`: 저자
  - `page`: 페이지 번호 (기본값: 0)
  - `size`: 페이지 크기 (기본값: 10)

### 관리자 API (`/api/v1/admin`)
- `GET /reports/summary` - 도서관 통계 조회 (200 OK)

### 모니터링 API (`/api/v1/monitor`)
- `GET /health` - 시스템 헬스 체크 (200 OK)
- `GET /status` - 시스템 상태 정보 (200 OK)

## NewRelic APM 설정

### 제외 URL
다음 URL들은 NewRelic APM 모니터링에서 제외되어야 합니다:
- `/api/v1/admin/*` - 관리자 API
- `/api/v1/monitor/health` - 시스템 헬스 체크
- `/api/v1/monitor/status` - 시스템 상태 정보

## 프로젝트 실행 방법

### 사전 요구사항
- Java 17
- Node.js 18 이상
- Docker & Docker Compose
- MySQL 8.0

### 프로젝트 구조
```
.
├── src/                    # Spring Boot 백엔드 소스 코드
├── library-frontend/       # Next.js 프론트엔드 소스 코드
├── docker/                # Docker 관련 설정 파일
├── build.gradle          # Gradle 빌드 설정
├── settings.gradle       # Gradle 프로젝트 설정
├── Dockerfile           # 백엔드 Docker 이미지 설정
├── docker-compose.yml    # Docker Compose 설정
└── docker-compose-dev.yml # 개발 환경 Docker Compose 설정
```

### Docker Compose로 실행
1. 프로젝트 루트 디렉토리에서 다음 명령어를 실행합니다:
   ```bash
   docker-compose up -d
   ```
   이 명령어는 다음 서비스들을 시작합니다:
   - MySQL (포트: 3306)
     - 데이터베이스: library_db
     - 사용자: libraryuser
     - 비밀번호: librarypassword
   - Spring Boot 백엔드 (포트: 8080)
   - Next.js 프론트엔드 (포트: 3000)

2. 서비스 상태 확인:
   ```bash
   docker-compose ps
   ```

3. 로그 확인:
   ```bash
   docker-compose logs -f
   ```

4. 서비스 중지:
   ```bash
   docker-compose down
   ```

### 개발 환경에서 실행

#### Docker Compose Dev로 실행
개발 환경에서는 `docker-compose-dev.yml`을 사용하여 백엔드와 데이터베이스만 실행하고, 프론트엔드는 로컬에서 개발할 수 있습니다.

1. 개발 환경 서비스 실행:
   ```bash
   docker-compose -f docker-compose-dev.yml up -d
   ```
   이 명령어는 다음 서비스들을 시작합니다:
   - MySQL (포트: 3306)
     - 데이터베이스: library_db
     - 사용자: libraryuser
     - 비밀번호: librarypassword
   - Spring Boot 백엔드 (포트: 8080)

2. 개발 환경 서비스 상태 확인:
   ```bash
   docker-compose -f docker-compose-dev.yml ps
   ```

3. 개발 환경 로그 확인:
   ```bash
   docker-compose -f docker-compose-dev.yml logs -f
   ```

4. 개발 환경 서비스 중지:
   ```bash
   docker-compose -f docker-compose-dev.yml down
   ```

#### 로컬 환경에서 실행

##### 백엔드 실행
1. 프로젝트 루트 디렉토리에서 다음 명령어를 실행합니다:
   ```bash
   ./gradlew bootRun
   ```

##### 프론트엔드 실행
1. 프론트엔드 디렉토리로 이동:
   ```bash
   cd library-frontend
   ```

2. 의존성 설치:
   ```bash
   pnpm install
   ```

3. 개발 서버 실행:
   ```bash
   pnpm run dev
   ```

### 접속 정보
- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

## 기술 스택

### 백엔드
- Java 17
- Spring Boot 3.4.3
- Spring Data JPA
- MySQL 8.0

### 프론트엔드
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

### 인프라
- Docker
- Docker Compose
- MySQL





