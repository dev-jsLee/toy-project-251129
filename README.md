# LifeFlow - 통합 생산성 관리 플랫폼

할 일 관리를 시작으로 시간 추적, 메모, 습관, 목표, 일정 관리, 종합 분석까지 하나의 플랫폼에서 통합 관리하는 생산성 도구입니다.

## 프로젝트 구조

```
lifeflow/
├── frontend/          # 프론트엔드 (바닐라 HTML/CSS/JS)
├── backend/           # 백엔드 (Python Flask)
├── docker/            # Docker 설정 파일
└── docs/              # 프로젝트 문서
```

## 기술 스택

### Phase 1
- **프론트엔드**: HTML5, CSS3, JavaScript (ES6+)
- **백엔드**: Python 3.11+, Flask, SQLAlchemy
- **데이터베이스**: SQLite
- **컨테이너**: Docker, Docker Compose

## 시작하기

### 사전 요구사항
- Python 3.11+
- Docker & Docker Compose
- Git

### 로컬 개발 환경 설정

#### 백엔드 설정
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

백엔드는 `http://localhost:5000`에서 실행됩니다.

#### 프론트엔드 설정
프론트엔드는 정적 파일이므로 브라우저에서 직접 열거나 간단한 HTTP 서버를 사용할 수 있습니다:

```bash
cd frontend
python -m http.server 8000
```

프론트엔드는 `http://localhost:8000`에서 실행됩니다.

### Docker를 사용한 실행

```bash
docker-compose -f docker/docker-compose.yml up --build
```

- 프론트엔드: `http://localhost`
- 백엔드 API: `http://localhost:5000`

## API 엔드포인트

### 할 일 관리
- `GET /api/v1/tasks` - 할 일 목록 조회
- `GET /api/v1/tasks/{id}` - 할 일 상세 조회
- `POST /api/v1/tasks` - 할 일 생성
- `PATCH /api/v1/tasks/{id}` - 할 일 수정
- `DELETE /api/v1/tasks/{id}` - 할 일 삭제
- `PATCH /api/v1/tasks/{id}/complete` - 할 일 완료 처리

## 개발 계획

- **Phase 1**: 핵심 기반 구축 (할 일 관리)
- **Phase 2**: 메모 및 시간 추적
- **Phase 3**: 습관 추적
- **Phase 4**: 목표 관리
- **Phase 5**: 일정 관리
- **Phase 6**: 종합 분석 대시보드

자세한 내용은 `docs/` 폴더의 문서를 참조하세요.

## 라이선스

이 프로젝트는 학습 목적으로 제작되었습니다.

