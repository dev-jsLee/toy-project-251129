from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    """데이터베이스 초기화"""
    db.init_app(app)
    
    with app.app_context():
        # 모든 테이블 생성
        db.create_all()
        print("Database initialized successfully")

