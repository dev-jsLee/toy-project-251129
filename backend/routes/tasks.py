from flask import Blueprint, request, jsonify
from datetime import datetime
from models.task import Task
from database.db import db

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('/tasks', methods=['GET'])
def get_tasks():
    """할 일 목록 조회"""
    try:
        # 쿼리 파라미터 가져오기
        status = request.args.get('status')
        category = request.args.get('category')
        priority = request.args.get('priority')
        sort = request.args.get('sort', 'created_at')
        order = request.args.get('order', 'asc')
        
        # 쿼리 빌드
        query = Task.query
        
        # 필터 적용
        if status:
            query = query.filter(Task.status == status)
        if category:
            query = query.filter(Task.category == category)
        if priority:
            query = query.filter(Task.priority == priority)
        
        # 정렬 적용
        if hasattr(Task, sort):
            if order == 'desc':
                query = query.order_by(getattr(Task, sort).desc())
            else:
                query = query.order_by(getattr(Task, sort).asc())
        else:
            query = query.order_by(Task.created_at.desc())
        
        tasks = query.all()
        
        return jsonify({
            'tasks': [task.to_dict() for task in tasks],
            'total': len(tasks)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    """할 일 상세 조회"""
    try:
        task = Task.query.get_or_404(task_id)
        return jsonify(task.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@tasks_bp.route('/tasks', methods=['POST'])
def create_task():
    """할 일 생성"""
    try:
        data = request.get_json()
        
        # 유효성 검증
        if not data.get('title'):
            return jsonify({'error': 'Title is required'}), 400
        
        # 마감일 파싱
        due_date = None
        if data.get('due_date'):
            try:
                due_date = datetime.fromisoformat(data.get('due_date').replace('Z', '+00:00'))
            except:
                return jsonify({'error': 'Invalid date format'}), 400
        
        task = Task(
            title=data['title'],
            description=data.get('description'),
            due_date=due_date,
            priority=data.get('priority', 'medium'),
            category=data.get('category'),
            status=data.get('status', 'pending')
        )
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify(task.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/tasks/<int:task_id>', methods=['PATCH'])
def update_task(task_id):
    """할 일 수정"""
    try:
        task = Task.query.get_or_404(task_id)
        data = request.get_json()
        
        # 필드 업데이트
        if 'title' in data:
            task.title = data['title']
        if 'description' in data:
            task.description = data['description']
        if 'due_date' in data:
            if data['due_date']:
                try:
                    task.due_date = datetime.fromisoformat(data['due_date'].replace('Z', '+00:00'))
                except:
                    return jsonify({'error': 'Invalid date format'}), 400
            else:
                task.due_date = None
        if 'priority' in data:
            task.priority = data['priority']
        if 'category' in data:
            task.category = data['category']
        if 'status' in data:
            task.status = data['status']
        
        task.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(task.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """할 일 삭제"""
    try:
        task = Task.query.get_or_404(task_id)
        db.session.delete(task)
        db.session.commit()
        
        return jsonify({'message': 'Task deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/tasks/<int:task_id>/complete', methods=['PATCH'])
def complete_task(task_id):
    """할 일 완료 처리"""
    try:
        task = Task.query.get_or_404(task_id)
        task.status = 'completed'
        task.completed_at = datetime.utcnow()
        task.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(task.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/tasks/<int:task_id>/uncomplete', methods=['PATCH'])
def uncomplete_task(task_id):
    """할 일 완료 취소"""
    try:
        task = Task.query.get_or_404(task_id)
        task.status = 'pending'
        task.completed_at = None
        task.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(task.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

