from flask import Flask
from flask_cors import CORS
from config import Config
from database.db import init_db
from routes.tasks import tasks_bp
import os

def create_app():
    """Flask 애플리케이션 팩토리 함수"""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # CORS 설정 (프론트엔드와의 통신을 위해)
    CORS(app)
    
    # 데이터베이스 초기화
    init_db(app)
    
    # Blueprint 등록
    app.register_blueprint(tasks_bp, url_prefix='/api/v1')
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

