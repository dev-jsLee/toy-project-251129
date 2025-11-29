# Phase 1: 핵심 기반 구축 - 기능 명세서

## 개요

Phase 1은 LifeFlow 프로젝트의 핵심 기반을 구축하는 단계입니다. 할 일 관리의 기본 기능을 완성하여 사용자가 실제로 사용할 수 있는 MVP(Minimum Viable Product)를 제공합니다.

**기간**: 1-2주  
**목표**: 동작하는 할 일 관리 앱 완성

---

## 핵심 목표

1. 할 일의 생성, 조회, 수정, 삭제 기능 구현
2. 할 일 완료 처리 및 상태 관리
3. 우선순위, 카테고리, 마감일 설정 기능
4. 할 일 목록 필터링 및 정렬 기능
5. 데이터 영속성 확보 (SQLite 데이터베이스)
6. 프론트엔드와 백엔드 분리 아키텍처 구축
7. Docker 기반 개발 및 배포 환경 구축

---

## 기능 상세 명세

### 1. 할 일 CRUD 기능

#### 1.1 할 일 생성 (Create)

**기능 설명**
- 사용자가 새로운 할 일을 추가할 수 있는 기능

**요구사항**
- 제목 입력 (필수)
- 설명 입력 (선택)
- 마감일 설정 (선택)
- 우선순위 설정 (선택, 기본값: 보통)
- 카테고리 선택 (선택)
- 상태 설정 (기본값: 대기중)

**API 엔드포인트**
```
POST /api/v1/tasks
```

**요청 형식**
```json
{
  "title": "프로젝트 기획서 작성",
  "description": "LifeFlow 프로젝트 기획서 작성",
  "due_date": "2024-01-15T10:00:00",
  "priority": "high",
  "category": "업무",
  "status": "pending"
}
```

**응답 형식**
```json
{
  "id": 1,
  "title": "프로젝트 기획서 작성",
  "description": "LifeFlow 프로젝트 기획서 작성",
  "due_date": "2024-01-15T10:00:00",
  "priority": "high",
  "category": "업무",
  "status": "pending",
  "created_at": "2024-01-10T09:00:00",
  "updated_at": "2024-01-10T09:00:00"
}
```

**유효성 검증**
- 제목: 필수, 최대 200자
- 설명: 선택, 최대 1000자
- 마감일: 선택, 미래 날짜만 허용
- 우선순위: high, medium, low 중 하나
- 카테고리: 문자열, 최대 50자
- 상태: pending, in_progress, completed, cancelled 중 하나

**에러 처리**
- 400 Bad Request: 유효성 검증 실패
- 500 Internal Server Error: 서버 오류

---

#### 1.2 할 일 조회 (Read)

**기능 설명**
- 저장된 할 일 목록을 조회하는 기능
- 단일 할 일 상세 정보 조회 기능

**요구사항**
- 전체 할 일 목록 조회
- 단일 할 일 상세 조회
- 필터링 옵션 (상태, 카테고리, 우선순위)
- 정렬 옵션 (생성일, 마감일, 우선순위)

**API 엔드포인트**

**전체 목록 조회**
```
GET /api/v1/tasks
```

**쿼리 파라미터**
- `status`: 상태 필터 (pending, in_progress, completed, cancelled)
- `category`: 카테고리 필터
- `priority`: 우선순위 필터 (high, medium, low)
- `sort`: 정렬 기준 (created_at, due_date, priority)
- `order`: 정렬 방향 (asc, desc)

**예시 요청**
```
GET /api/v1/tasks?status=pending&sort=due_date&order=asc
```

**응답 형식**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "프로젝트 기획서 작성",
      "description": "LifeFlow 프로젝트 기획서 작성",
      "due_date": "2024-01-15T10:00:00",
      "priority": "high",
      "category": "업무",
      "status": "pending",
      "created_at": "2024-01-10T09:00:00",
      "updated_at": "2024-01-10T09:00:00"
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 20
}
```

**단일 할 일 조회**
```
GET /api/v1/tasks/{id}
```

**응답 형식**
```json
{
  "id": 1,
  "title": "프로젝트 기획서 작성",
  "description": "LifeFlow 프로젝트 기획서 작성",
  "due_date": "2024-01-15T10:00:00",
  "priority": "high",
  "category": "업무",
  "status": "pending",
  "created_at": "2024-01-10T09:00:00",
  "updated_at": "2024-01-10T09:00:00"
}
```

**에러 처리**
- 404 Not Found: 할 일을 찾을 수 없음
- 500 Internal Server Error: 서버 오류

---

#### 1.3 할 일 수정 (Update)

**기능 설명**
- 기존 할 일의 정보를 수정하는 기능

**요구사항**
- 모든 필드 수정 가능
- 부분 업데이트 지원 (일부 필드만 수정 가능)

**API 엔드포인트**
```
PUT /api/v1/tasks/{id}
PATCH /api/v1/tasks/{id}
```

**요청 형식**
```json
{
  "title": "프로젝트 기획서 작성 (수정)",
  "status": "in_progress"
}
```

**응답 형식**
```json
{
  "id": 1,
  "title": "프로젝트 기획서 작성 (수정)",
  "description": "LifeFlow 프로젝트 기획서 작성",
  "due_date": "2024-01-15T10:00:00",
  "priority": "high",
  "category": "업무",
  "status": "in_progress",
  "created_at": "2024-01-10T09:00:00",
  "updated_at": "2024-01-10T10:30:00"
}
```

**에러 처리**
- 400 Bad Request: 유효성 검증 실패
- 404 Not Found: 할 일을 찾을 수 없음
- 500 Internal Server Error: 서버 오류

---

#### 1.4 할 일 삭제 (Delete)

**기능 설명**
- 할 일을 삭제하는 기능

**요구사항**
- 단일 할 일 삭제
- 삭제 확인 (선택사항, 프론트엔드에서 처리)

**API 엔드포인트**
```
DELETE /api/v1/tasks/{id}
```

**응답 형식**
```json
{
  "message": "Task deleted successfully"
}
```

**에러 처리**
- 404 Not Found: 할 일을 찾을 수 없음
- 500 Internal Server Error: 서버 오류

---

### 2. 할 일 완료 처리

**기능 설명**
- 할 일을 완료 상태로 변경하는 기능
- 완료일 자동 기록

**요구사항**
- 상태를 "completed"로 변경
- 완료일(completed_at) 자동 설정
- 완료 취소 기능 (다시 진행중/대기중으로 변경 가능)

**API 엔드포인트**
```
PATCH /api/v1/tasks/{id}/complete
PATCH /api/v1/tasks/{id}/uncomplete
```

**완료 요청**
```
PATCH /api/v1/tasks/1/complete
```

**응답 형식**
```json
{
  "id": 1,
  "status": "completed",
  "completed_at": "2024-01-12T15:30:00",
  "updated_at": "2024-01-12T15:30:00"
}
```

**완료 취소 요청**
```
PATCH /api/v1/tasks/1/uncomplete
```

**응답 형식**
```json
{
  "id": 1,
  "status": "pending",
  "completed_at": null,
  "updated_at": "2024-01-12T16:00:00"
}
```

---

### 3. 우선순위 관리

**기능 설명**
- 할 일의 우선순위를 설정하고 관리하는 기능

**요구사항**
- 우선순위 레벨: high, medium, low
- 우선순위별 색상 표시 (프론트엔드)
- 우선순위별 필터링

**우선순위 값**
- `high`: 높음 (빨간색)
- `medium`: 보통 (노란색)
- `low`: 낮음 (파란색)

**기본값**: medium

---

### 4. 카테고리 관리

**기능 설명**
- 할 일을 카테고리로 분류하는 기능

**요구사항**
- 카테고리 문자열 입력 (자유 입력)
- 카테고리별 필터링
- 카테고리별 색상 표시 (프론트엔드)

**기본 카테고리 예시**
- 업무
- 개인
- 학습
- 건강
- 기타

**사용자 정의 카테고리**: 자유롭게 생성 가능

---

### 5. 마감일 관리

**기능 설명**
- 할 일의 마감일을 설정하고 관리하는 기능

**요구사항**
- 날짜 및 시간 설정
- 마감일 임박 알림 (프론트엔드에서 처리)
- 마감일 지난 할 일 표시
- 마감일 기준 정렬

**마감일 표시 규칙**
- 마감일 임박 (24시간 이내): 주황색
- 마감일 지남: 빨간색
- 정상: 기본 색상

---

### 6. 상태 관리

**기능 설명**
- 할 일의 진행 상태를 관리하는 기능

**상태 값**
- `pending`: 대기중 (기본값)
- `in_progress`: 진행중
- `completed`: 완료
- `cancelled`: 취소됨

**상태 전이 규칙**
- pending → in_progress → completed
- pending → cancelled
- completed → in_progress (완료 취소)
- cancelled → pending (취소 해제)

---

### 7. 필터링 및 정렬

#### 7.1 필터링

**필터 옵션**
- 상태별 필터: 전체, 대기중, 진행중, 완료, 취소
- 카테고리별 필터: 전체, 특정 카테고리
- 우선순위별 필터: 전체, 높음, 보통, 낮음
- 마감일 필터: 전체, 오늘, 이번 주, 지난 할 일

**프론트엔드 구현**
- 필터 UI 컴포넌트
- 다중 필터 조합 지원
- 필터 상태 유지

#### 7.2 정렬

**정렬 옵션**
- 생성일: 최신순, 오래된순
- 마감일: 임박순, 늦은순
- 우선순위: 높은순, 낮은순
- 제목: 가나다순, 역순

**기본 정렬**: 마감일 임박순 (마감일 없는 항목은 맨 아래)

---

## 사용자 인터페이스 요구사항

### 1. 메인 화면 (할 일 목록)

**구성 요소**
- 할 일 추가 버튼
- 필터 및 정렬 컨트롤
- 할 일 카드 목록
- 각 카드에 표시할 정보:
  - 제목
  - 설명 (요약)
  - 마감일
  - 우선순위 (색상 표시)
  - 카테고리 (태그 형태)
  - 상태 (배지 형태)
  - 완료 버튼
  - 수정 버튼
  - 삭제 버튼

**인터랙션**
- 할 일 카드 클릭: 상세 보기
- 완료 버튼 클릭: 즉시 완료 처리
- 수정 버튼 클릭: 수정 모달 열기
- 삭제 버튼 클릭: 삭제 확인 후 삭제

---

### 2. 할 일 추가/수정 모달

**구성 요소**
- 제목 입력 필드 (필수)
- 설명 입력 필드 (텍스트 영역)
- 마감일 선택기 (날짜/시간)
- 우선순위 선택 (라디오 버튼 또는 드롭다운)
- 카테고리 입력 (자유 입력 또는 드롭다운)
- 상태 선택 (드롭다운)
- 저장 버튼
- 취소 버튼

**유효성 검증**
- 제목 필수 입력 확인
- 마감일 미래 날짜 확인
- 실시간 유효성 검증 피드백

---

### 3. 할 일 상세 보기

**구성 요소**
- 제목
- 설명 (전체)
- 마감일
- 우선순위
- 카테고리
- 상태
- 생성일
- 수정일
- 완료일 (완료된 경우)
- 수정 버튼
- 삭제 버튼
- 뒤로 가기 버튼

---

### 4. 필터 및 정렬 UI

**필터 섹션**
- 상태 필터 버튼 그룹
- 카테고리 필터 드롭다운
- 우선순위 필터 버튼 그룹
- 필터 초기화 버튼

**정렬 섹션**
- 정렬 기준 선택 드롭다운
- 정렬 방향 토글 버튼 (오름차순/내림차순)

---

## 데이터 모델

### Task (할 일) 테이블

**필드 정의**

| 필드명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | 할 일 고유 ID |
| title | VARCHAR(200) | NOT NULL | 제목 |
| description | TEXT | NULL | 설명 |
| due_date | DATETIME | NULL | 마감일 |
| priority | VARCHAR(10) | NOT NULL, DEFAULT 'medium' | 우선순위 (high/medium/low) |
| category | VARCHAR(50) | NULL | 카테고리 |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | 상태 (pending/in_progress/completed/cancelled) |
| completed_at | DATETIME | NULL | 완료일 |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일 |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 수정일 |

**인덱스**
- `idx_status`: status 필드 인덱스
- `idx_due_date`: due_date 필드 인덱스
- `idx_category`: category 필드 인덱스
- `idx_priority`: priority 필드 인덱스

---

## API 명세 요약

### 엔드포인트 목록

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/v1/tasks` | 할 일 목록 조회 |
| GET | `/api/v1/tasks/{id}` | 할 일 상세 조회 |
| POST | `/api/v1/tasks` | 할 일 생성 |
| PUT | `/api/v1/tasks/{id}` | 할 일 전체 수정 |
| PATCH | `/api/v1/tasks/{id}` | 할 일 부분 수정 |
| DELETE | `/api/v1/tasks/{id}` | 할 일 삭제 |
| PATCH | `/api/v1/tasks/{id}/complete` | 할 일 완료 처리 |
| PATCH | `/api/v1/tasks/{id}/uncomplete` | 할 일 완료 취소 |

### 공통 응답 형식

**성공 응답**
- 200 OK: 조회, 수정 성공
- 201 Created: 생성 성공
- 204 No Content: 삭제 성공

**에러 응답**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지"
  }
}
```

**에러 코드**
- 400: Bad Request (유효성 검증 실패)
- 404: Not Found (리소스를 찾을 수 없음)
- 500: Internal Server Error (서버 오류)

---

## 사용자 시나리오

### 시나리오 1: 새로운 할 일 추가

1. 사용자가 메인 화면에서 "할 일 추가" 버튼 클릭
2. 할 일 추가 모달이 열림
3. 제목 입력: "프로젝트 기획서 작성"
4. 설명 입력: "LifeFlow 프로젝트 기획서 작성"
5. 마감일 선택: 2024년 1월 15일 오전 10시
6. 우선순위 선택: 높음
7. 카테고리 입력: "업무"
8. "저장" 버튼 클릭
9. API 요청 전송 (POST /api/v1/tasks)
10. 성공 응답 수신
11. 모달 닫기 및 할 일 목록 새로고침
12. 새로 추가된 할 일이 목록에 표시됨

---

### 시나리오 2: 할 일 완료 처리

1. 사용자가 할 일 카드에서 "완료" 버튼 클릭
2. API 요청 전송 (PATCH /api/v1/tasks/{id}/complete)
3. 성공 응답 수신
4. 할 일 카드의 상태가 "완료"로 변경됨
5. 완료일이 표시됨
6. 완료된 할 일은 필터로 숨길 수 있음

---

### 시나리오 3: 할 일 필터링 및 정렬

1. 사용자가 상태 필터에서 "진행중" 선택
2. 카테고리 필터에서 "업무" 선택
3. 정렬 기준을 "마감일"로 선택
4. 정렬 방향을 "오름차순"으로 선택
5. 필터링 및 정렬된 할 일 목록이 표시됨
6. API 요청: GET /api/v1/tasks?status=in_progress&category=업무&sort=due_date&order=asc

---

### 시나리오 4: 할 일 수정

1. 사용자가 할 일 카드에서 "수정" 버튼 클릭
2. 할 일 수정 모달이 열리고 기존 정보가 표시됨
3. 제목 수정: "프로젝트 기획서 작성 (수정)"
4. 상태 변경: "진행중"으로 변경
5. "저장" 버튼 클릭
6. API 요청 전송 (PATCH /api/v1/tasks/{id})
7. 성공 응답 수신
8. 모달 닫기 및 할 일 목록 새로고침
9. 수정된 내용이 반영됨

---

## 성공 기준

Phase 1이 완료되었다고 판단할 수 있는 기준:

1. ✅ 할 일 CRUD 기능이 모두 정상 작동
2. ✅ 할 일 완료 처리 기능 정상 작동
3. ✅ 우선순위, 카테고리, 마감일 설정 및 표시 정상 작동
4. ✅ 필터링 및 정렬 기능 정상 작동
5. ✅ 데이터가 SQLite 데이터베이스에 영속적으로 저장됨
6. ✅ 프론트엔드와 백엔드가 API를 통해 통신함
7. ✅ Docker 환경에서 정상 실행됨
8. ✅ 기본적인 에러 처리가 구현됨
9. ✅ 사용자가 실제로 할 일을 관리할 수 있는 수준의 UI/UX

---

## 다음 Phase로의 연결점

Phase 1에서 구축한 기반은 이후 Phase에서 다음과 같이 확장됩니다:

- **Phase 2**: 메모 기능이 할 일과 연결됨
- **Phase 2**: 시간 추적 기능이 할 일과 연결됨
- **Phase 3**: 습관 기능이 할 일을 활용함
- **Phase 4**: 목표 기능이 할 일을 그룹화함
- **Phase 5**: 일정 관리가 할 일을 캘린더로 변환함
- **Phase 6**: 종합 분석이 할 일 데이터를 분석함

따라서 Phase 1의 데이터 모델과 API 구조는 확장 가능하도록 설계되어야 합니다.

