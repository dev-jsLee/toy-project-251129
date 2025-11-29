import os
from pathlib import Path

# 프로젝트 루트 디렉토리 경로
BASE_DIR = Path(__file__).resolve().parent
DB_DIR = BASE_DIR / 'db'
DB_DIR.mkdir(exist_ok=True)  # db 디렉토리가 없으면 생성
DB_PATH = DB_DIR / 'data.db'

class Config:
    """애플리케이션 설정"""
    # 절대 경로를 사용하여 데이터베이스 경로 설정 (Windows 경로를 슬래시로 변환)
    db_uri = os.environ.get('DATABASE_URL')
    if not db_uri:
        # Windows 경로의 백슬래시를 슬래시로 변환
        db_path = str(DB_PATH).replace('\\', '/')
        db_uri = f'sqlite:///{db_path}'
    
    SQLALCHEMY_DATABASE_URI = db_uri
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

