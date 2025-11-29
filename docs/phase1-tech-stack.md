# Phase 1: 핵심 기반 구축 - 기술 스택 상세

## 개요

Phase 1은 바닐라 웹 기술과 Python Flask를 사용하여 할 일 관리 앱의 핵심 기능을 구현합니다. 프레임워크에 의존하지 않고 기본 기술에 집중하여 학습 효과를 극대화합니다.

---

## 프로젝트 구조

### Monorepo 구조

```
lifeflow/
├── frontend/                 # 프론트엔드 (바닐라 HTML/CSS/JS)
│   ├── index.html
│   ├── css/
│   │   ├── main.css
│   │   ├── components/
│   │   └── utilities/
│   ├── js/
│   │   ├── main.js
│   │   ├── api/
│   │   ├── components/
│   │   ├── state/
│   │   └── utils/
│   └── assets/
│       ├── images/
│       └── icons/
├── backend/                  # 백엔드 (Python Flask)
│   ├── app.py
│   ├── models/
│   │   └── task.py
│   ├── routes/
│   │   └── tasks.py
│   ├── database/
│   │   └── db.py
│   ├── config.py
│   ├── requirements.txt
│   └── db/
│       └── data.db          # SQLite 데이터베이스 파일
├── docker/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 프론트엔드 기술 스택

### 1. HTML5

**버전**: HTML5  
**목적**: 시맨틱 마크업으로 구조화된 웹 페이지 작성

**주요 사용 요소**
- `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`: 시맨틱 구조
- `<form>`, `<input>`, `<textarea>`, `<select>`: 폼 요소
- `<button>`, `<div>`, `<span>`: UI 구성 요소

**선택 이유**
- 웹의 기본 구조를 이해하기 위해 프레임워크 없이 순수 HTML 사용
- 시맨틱 마크업으로 접근성과 SEO 향상
- 모든 브라우저에서 호환성 보장

**학습 포인트**
- 시맨틱 HTML의 중요성
- 폼 요소의 올바른 사용법
- 접근성 고려사항

---

### 2. CSS3

**버전**: CSS3  
**방법론**: BEM (Block Element Modifier)  
**구조**: 모듈화된 CSS 파일

**파일 구조**
```
css/
├── main.css                 # 메인 스타일시트 (imports)
├── base/
│   ├── reset.css           # CSS 리셋
│   ├── typography.css      # 타이포그래피
│   └── variables.css       # CSS 변수 (색상, 폰트 등)
├── components/
│   ├── button.css
│   ├── card.css
│   ├── modal.css
│   ├── form.css
│   └── filter.css
├── layout/
│   ├── header.css
│   ├── main.css
│   └── footer.css
└── utilities/
    ├── spacing.css
    ├── colors.css
    └── display.css
```

**BEM 네이밍 규칙**
```css
/* Block */
.task-card { }

/* Element */
.task-card__title { }
.task-card__description { }
.task-card__actions { }

/* Modifier */
.task-card--completed { }
.task-card--high-priority { }
.task-card--overdue { }
```

**CSS 변수 사용**
```css
:root {
  /* Colors */
  --color-primary: #007bff;
  --color-success: #28a745;
  --color-danger: #dc3545;
  --color-warning: #ffc107;
  
  /* Priority Colors */
  --priority-high: #dc3545;
  --priority-medium: #ffc107;
  --priority-low: #17a2b8;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Typography */
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.5;
}
```

**선택 이유**
- 프레임워크 없이 CSS 구조화 방법 학습
- BEM 방법론으로 명확한 클래스 네이밍
- 모듈화로 유지보수성 향상
- CSS 변수로 일관된 디자인 시스템 구축

**학습 포인트**
- CSS 아키텍처 설계
- BEM 방법론 실전 적용
- CSS 변수를 활용한 디자인 시스템
- 반응형 디자인 (미디어 쿼리)

---

### 3. JavaScript (ES6+)

**버전**: ES6+ (ES2015 이상)  
**모듈 시스템**: ES6 Modules  
**패턴**: 모듈 패턴, Pub/Sub 패턴

**파일 구조**
```
js/
├── main.js                  # 진입점
├── api/
│   └── taskApi.js          # API 통신 모듈
├── components/
│   ├── TaskCard.js
│   ├── TaskModal.js
│   ├── FilterBar.js
│   └── SortBar.js
├── state/
│   ├── state.js            # 상태 저장소
│   └── eventBus.js         # 이벤트 버스 (Pub/Sub)
├── utils/
│   ├── dateUtils.js
│   ├── validation.js
│   └── domUtils.js
└── config/
    └── apiConfig.js         # API 설정
```

**상태 관리 구현**

**state.js** - 상태 저장소
```javascript
// 상태 객체
const state = {
  tasks: [],
  filters: {
    status: 'all',
    category: 'all',
    priority: 'all'
  },
  sort: {
    field: 'due_date',
    order: 'asc'
  },
  selectedTask: null
};

// 상태 변경 함수
function setState(updates) {
  Object.assign(state, updates);
  eventBus.emit('stateChanged', state);
}

// 상태 가져오기
function getState() {
  return { ...state };
}

export { state, setState, getState };
```

**eventBus.js** - 이벤트 버스 (Pub/Sub 패턴)
```javascript
class EventBus {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

export default new EventBus();
```

**API 통신 구현**

**taskApi.js** - Fetch API 사용
```javascript
const API_BASE_URL = '/api/v1';

async function fetchTasks(filters = {}, sort = {}) {
  const params = new URLSearchParams();
  
  if (filters.status) params.append('status', filters.status);
  if (filters.category) params.append('category', filters.category);
  if (filters.priority) params.append('priority', filters.priority);
  if (sort.field) params.append('sort', sort.field);
  if (sort.order) params.append('order', sort.order);

  const response = await fetch(`${API_BASE_URL}/tasks?${params}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

async function createTask(taskData) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(taskData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create task');
  }

  return await response.json();
}

// ... 기타 CRUD 함수들

export { fetchTasks, createTask, updateTask, deleteTask, completeTask };
```

**선택 이유**
- ES6+ 모듈 시스템으로 코드 구조화
- Fetch API로 비동기 통신 (Promise 기반)
- Pub/Sub 패턴으로 상태 관리 원리 학습
- 프레임워크 없이 순수 JavaScript로 구현

**학습 포인트**
- ES6+ 문법 (화살표 함수, 구조 분해, async/await)
- 모듈 시스템과 코드 구조화
- 비동기 프로그래밍 (Promise, async/await)
- 이벤트 기반 아키텍처 (Pub/Sub 패턴)
- DOM 조작과 이벤트 핸들링

---

## 백엔드 기술 스택

### 1. Python

**버전**: Python 3.11+  
**목적**: 백엔드 API 서버 개발

**선택 이유**
- 간결하고 읽기 쉬운 문법으로 학습 용이
- 풍부한 라이브러리 생태계
- Flask 프레임워크와의 호환성
- 크로스 플랫폼 지원

**학습 포인트**
- Python 기본 문법
- 가상환경 (venv) 사용
- 패키지 관리 (pip)

---

### 2. Flask

**버전**: Flask 3.0+  
**목적**: RESTful API 서버 구축

**주요 기능 사용**
- Flask 애플리케이션 생성
- 라우팅 및 HTTP 메서드 처리
- 요청/응답 처리
- 에러 핸들링
- CORS 처리 (Flask-CORS)

**애플리케이션 구조**

**app.py** - 메인 애플리케이션
```python
from flask import Flask
from flask_cors import CORS
from routes.tasks import tasks_bp
from database.db import init_db

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db/data.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    CORS(app)  # 프론트엔드와의 통신을 위한 CORS 설정
    
    # 데이터베이스 초기화
    init_db(app)
    
    # Blueprint 등록
    app.register_blueprint(tasks_bp, url_prefix='/api/v1')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
```

**routes/tasks.py** - 라우트 정의
```python
from flask import Blueprint, request, jsonify
from models.task import Task
from database.db import db

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('/tasks', methods=['GET'])
def get_tasks():
    # 필터 및 정렬 파라미터 처리
    status = request.args.get('status')
    category = request.args.get('category')
    priority = request.args.get('priority')
    sort = request.args.get('sort', 'created_at')
    order = request.args.get('order', 'asc')
    
    # 쿼리 빌드
    query = Task.query
    
    if status:
        query = query.filter(Task.status == status)
    if category:
        query = query.filter(Task.category == category)
    if priority:
        query = query.filter(Task.priority == priority)
    
    # 정렬
    if order == 'desc':
        query = query.order_by(getattr(Task, sort).desc())
    else:
        query = query.order_by(getattr(Task, sort).asc())
    
    tasks = query.all()
    
    return jsonify({
        'tasks': [task.to_dict() for task in tasks],
        'total': len(tasks)
    })

@tasks_bp.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    
    # 유효성 검증
    if not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    
    task = Task(
        title=data['title'],
        description=data.get('description'),
        due_date=data.get('due_date'),
        priority=data.get('priority', 'medium'),
        category=data.get('category'),
        status=data.get('status', 'pending')
    )
    
    db.session.add(task)
    db.session.commit()
    
    return jsonify(task.to_dict()), 201

# ... 기타 CRUD 엔드포인트들
```

**선택 이유**
- 경량 프레임워크로 학습 곡선이 낮음
- RESTful API 구축에 적합
- 유연한 구조로 확장 가능
- Jinja 템플릿 미사용으로 순수 API에 집중

**학습 포인트**
- Flask 애플리케이션 구조
- 라우팅과 HTTP 메서드 처리
- 요청/응답 처리
- 에러 핸들링
- Blueprint를 활용한 모듈화

---

### 3. SQLAlchemy

**버전**: SQLAlchemy 2.0+  
**목적**: ORM으로 데이터베이스 추상화

**주요 기능**
- 모델 정의
- 쿼리 빌더
- 세션 관리
- 마이그레이션 (Alembic은 Phase 2+에서 사용)

**모델 정의**

**models/task.py**
```python
from datetime import datetime
from database.db import db

class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    due_date = db.Column(db.DateTime, nullable=True)
    priority = db.Column(db.String(10), nullable=False, default='medium')
    category = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(20), nullable=False, default='pending')
    completed_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'priority': self.priority,
            'category': self.category,
            'status': self.status,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
```

**데이터베이스 설정**

**database/db.py**
```python
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
    
    with app.app_context():
        db.create_all()  # 테이블 생성
```

**선택 이유**
- ORM으로 SQL 직접 작성 없이 데이터베이스 작업
- 데이터베이스 독립성 (SQLite → PostgreSQL 전환 용이)
- 타입 안정성과 코드 가독성 향상
- 관계형 데이터 모델링 학습

**학습 포인트**
- ORM 개념과 사용법
- 모델 정의와 관계 설정
- 쿼리 빌더 사용법
- 세션 관리와 트랜잭션

---

### 4. SQLite

**버전**: SQLite 3  
**목적**: 파일 기반 데이터베이스

**데이터베이스 파일 위치**
- `backend/db/data.db`

**선택 이유**
- 설정이 간단하고 별도 서버 불필요
- Phase 1에서 ERD 변경이 빈번하므로 마이그레이션이 쉬움
- Docker 볼륨으로 데이터 영속성 보장
- 개발 및 초기 배포에 적합

**제한사항**
- 동시성 제한 (Phase 4+에서 PostgreSQL 전환 고려)
- 네트워크 접근 불가 (단일 서버 환경)

**학습 포인트**
- SQLite의 특징과 사용법
- 파일 기반 데이터베이스의 장단점
- 데이터베이스 마이그레이션 개념

---

## 개발 도구

### 1. Git

**목적**: 버전 관리  
**전략**: Monorepo로 프론트엔드/백엔드 통합 관리

**브랜치 전략**
- `main`: 프로덕션 배포 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발 브랜치

**선택 이유**
- 표준 버전 관리 도구
- 협업 및 코드 히스토리 관리
- Monorepo로 일관성 유지

---

### 2. Docker & Docker Compose

**목적**: 컨테이너화 및 배포

**Dockerfile 구조**

**docker/Dockerfile.frontend**
```dockerfile
FROM nginx:alpine

# 정적 파일 복사
COPY frontend/ /usr/share/nginx/html/

# Nginx 설정 파일 복사
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**docker/Dockerfile.backend**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 의존성 설치
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 복사
COPY backend/ .

# 데이터베이스 디렉토리 생성
RUN mkdir -p db

EXPOSE 5000

CMD ["python", "app.py"]
```

**docker-compose.yml**
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: docker/Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: docker/Dockerfile.backend
    ports:
      - "5000:5000"
    volumes:
      - ./backend/db:/app/db
    environment:
      - FLASK_ENV=production
      - FLASK_DEBUG=0

  # 향후 PostgreSQL 추가 시 사용
  # db:
  #   image: postgres:15-alpine
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data
  #   environment:
  #     - POSTGRES_DB=lifeflow
  #     - POSTGRES_USER=lifeflow
  #     - POSTGRES_PASSWORD=lifeflow
```

**선택 이유**
- 개발 환경과 프로덕션 환경 일치
- 의존성 격리 및 재현 가능한 환경
- 멀티 컨테이너 관리 용이
- Linux 배포 환경과 동일한 환경 구성

**학습 포인트**
- Docker 이미지 빌드
- Docker Compose로 멀티 컨테이너 관리
- 볼륨 마운트로 데이터 영속성
- 네트워크 설정과 서비스 간 통신

---

## 의존성 관리

### 프론트엔드
- 외부 라이브러리 없음 (바닐라 JavaScript)
- 브라우저 네이티브 API만 사용

### 백엔드

**requirements.txt**
```
Flask==3.0.0
Flask-SQLAlchemy==3.1.1
Flask-CORS==4.0.0
```

**의존성 설명**
- **Flask**: 웹 프레임워크
- **Flask-SQLAlchemy**: Flask와 SQLAlchemy 통합
- **Flask-CORS**: CORS 처리 (프론트엔드-백엔드 통신)

**설치 방법**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

## API 설계

### 버전 관리
- **형식**: `/api/v1/`
- **이유**: 향후 API 변경 시 호환성 유지

### 에러 처리

**간단한 에러 응답 형식**
```json
{
  "error": "에러 메시지"
}
```

**HTTP 상태 코드**
- `200 OK`: 성공
- `201 Created`: 생성 성공
- `204 No Content`: 삭제 성공
- `400 Bad Request`: 유효성 검증 실패
- `404 Not Found`: 리소스를 찾을 수 없음
- `500 Internal Server Error`: 서버 오류

**에러 처리 예시**
```python
@tasks_bp.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = Task.query.get_or_404(task_id)
    return jsonify(task.to_dict())

@tasks_bp.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    
    if not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    
    try:
        task = Task(**data)
        db.session.add(task)
        db.session.commit()
        return jsonify(task.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
```

---

## 개발 환경 설정

### Windows 개발 환경

**필수 도구**
- Python 3.11+
- Git
- Docker Desktop for Windows
- 코드 에디터 (VS Code 권장)

**로컬 개발 실행**

**백엔드**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**프론트엔드**
- 브라우저에서 `frontend/index.html` 직접 열기
- 또는 간단한 HTTP 서버 사용:
```bash
cd frontend
python -m http.server 8000
```

**Docker 개발 환경**
```bash
docker-compose up --build
```

---

## 배포 환경

### Linux Docker 배포

**배포 구조**
- 프론트엔드: Nginx 컨테이너 (포트 80)
- 백엔드: Flask 컨테이너 (포트 5000)
- 데이터베이스: SQLite 파일 (볼륨 마운트)

**배포 스크립트 예시**
```bash
#!/bin/bash
# deploy.sh

# Git에서 최신 코드 가져오기
git pull origin main

# Docker 이미지 빌드
docker-compose build

# 기존 컨테이너 중지 및 제거
docker-compose down

# 새 컨테이너 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

---

## 성능 고려사항

### 프론트엔드
- 이미지 최적화
- CSS/JS 파일 압축 (프로덕션 배포 시)
- 브라우저 캐싱 활용

### 백엔드
- SQLAlchemy 쿼리 최적화
- 인덱스 활용 (status, due_date, category, priority)
- 연결 풀링 (향후 PostgreSQL 전환 시)

### 데이터베이스
- 인덱스 설계
- 쿼리 최적화
- SQLite 동시성 제한 인지

---

## 보안 고려사항

### Phase 1 기본 보안
- **CORS**: Flask-CORS로 프론트엔드 도메인만 허용
- **입력 검증**: 서버 측 유효성 검증
- **SQL Injection 방지**: SQLAlchemy ORM 사용
- **에러 메시지**: 민감 정보 노출 방지

### 향후 강화 사항 (Phase 2+)
- 사용자 인증/인가
- HTTPS 적용
- Rate Limiting
- 입력 Sanitization 강화

---

## 테스트 전략

### Phase 1: 수동 테스트
- **프론트엔드**: 브라우저 개발자 도구 활용
- **백엔드**: Postman 또는 Thunder Client로 API 테스트
- **통합 테스트**: 수동으로 전체 플로우 테스트

### 향후 자동화 (Phase 2+)
- 단위 테스트: pytest (백엔드)
- 통합 테스트: API 엔드포인트 테스트
- E2E 테스트: Playwright 또는 Cypress

---

## 학습 목표 달성 체크리스트

Phase 1 완료 시 다음을 학습했는지 확인:

### 프론트엔드
- [ ] HTML5 시맨틱 마크업 작성
- [ ] CSS3 모듈화 및 BEM 방법론 적용
- [ ] JavaScript ES6+ 모듈 시스템 사용
- [ ] Fetch API로 비동기 통신
- [ ] Pub/Sub 패턴으로 상태 관리 구현
- [ ] DOM 조작과 이벤트 핸들링

### 백엔드
- [ ] Python Flask 애플리케이션 구조 이해
- [ ] RESTful API 설계 및 구현
- [ ] SQLAlchemy ORM 사용
- [ ] SQLite 데이터베이스 관리
- [ ] 에러 핸들링 및 유효성 검증

### 인프라
- [ ] Docker 이미지 빌드
- [ ] Docker Compose로 멀티 컨테이너 관리
- [ ] Git 버전 관리 및 브랜치 전략
- [ ] Monorepo 구조 관리

---

## 다음 Phase로의 전환 준비

Phase 1에서 구축한 기술 스택은 Phase 2에서 다음과 같이 발전합니다:

1. **프론트엔드**: 바닐라 JS → React/Vue 프레임워크
2. **백엔드**: Flask 기본 → Flask 확장 또는 FastAPI
3. **상태 관리**: 커스텀 Pub/Sub → Zustand/Redux
4. **스타일링**: 바닐라 CSS → Tailwind CSS
5. **빌드 도구**: 없음 → Vite/Webpack
6. **테스트**: 수동 → 자동화 테스트

Phase 1의 코드 구조와 아키텍처는 이러한 전환을 고려하여 설계되어야 합니다.

