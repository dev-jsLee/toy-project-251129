import { createElement, $ } from '../utils/domUtils.js';
import { formatDate, isOverdue, isDueSoon } from '../utils/dateUtils.js';
import { completeTask, deleteTask } from '../api/taskApi.js';
import eventBus from '../state/eventBus.js';

/**
 * 할 일 카드 컴포넌트
 */
export class TaskCard {
    constructor(task) {
        this.task = task;
        this.element = this.create();
    }

    create() {
        const card = createElement('div', {
            className: `task-card ${this.getCardClasses()}`,
            dataset: { taskId: this.task.id }
        });

        // 헤더
        const header = createElement('div', { className: 'task-card__header' });
        const title = createElement('h3', { className: 'task-card__title' }, this.task.title);
        const priority = createElement('span', {
            className: `task-card__priority task-card__priority--${this.task.priority}`
        }, this.getPriorityText(this.task.priority));
        header.appendChild(title);
        header.appendChild(priority);

        // 설명
        if (this.task.description) {
            const description = createElement('p', {
                className: 'task-card__description'
            }, this.task.description);
            card.appendChild(description);
        }

        // 메타 정보
        const meta = createElement('div', { className: 'task-card__meta' });
        
        if (this.task.category) {
            const category = createElement('span', {
                className: 'task-card__category'
            }, this.task.category);
            meta.appendChild(category);
        }

        const status = createElement('span', {
            className: `task-card__status task-card__status--${this.task.status}`
        }, this.getStatusText(this.task.status));
        meta.appendChild(status);

        if (this.task.due_date) {
            const dueDate = createElement('span', {}, formatDate(this.task.due_date));
            meta.appendChild(dueDate);
        }

        // 액션 버튼
        const actions = createElement('div', { className: 'task-card__actions' });
        
        if (this.task.status !== 'completed') {
            const completeBtn = createElement('button', {
                className: 'button button--success button--small'
            }, '완료');
            completeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleComplete();
            });
            actions.appendChild(completeBtn);
        }

        const editBtn = createElement('button', {
            className: 'button button--primary button--small'
        }, '수정');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleEdit();
        });
        actions.appendChild(editBtn);

        const deleteBtn = createElement('button', {
            className: 'button button--danger button--small'
        }, '삭제');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleDelete();
        });
        actions.appendChild(deleteBtn);

        // 조립
        card.appendChild(header);
        card.appendChild(meta);
        card.appendChild(actions);

        // 클릭 이벤트 (상세 보기)
        card.addEventListener('click', () => {
            eventBus.emit('taskSelected', this.task);
        });

        return card;
    }

    getCardClasses() {
        let classes = '';
        if (this.task.status === 'completed') {
            classes += 'task-card--completed ';
        }
        if (this.task.due_date) {
            if (isOverdue(this.task.due_date)) {
                classes += 'task-card--overdue ';
            } else if (isDueSoon(this.task.due_date)) {
                classes += 'task-card--due-soon ';
            }
        }
        return classes.trim();
    }

    getPriorityText(priority) {
        const priorityMap = {
            'high': '높음',
            'medium': '보통',
            'low': '낮음'
        };
        return priorityMap[priority] || priority;
    }

    getStatusText(status) {
        const statusMap = {
            'pending': '대기중',
            'in_progress': '진행중',
            'completed': '완료',
            'cancelled': '취소됨'
        };
        return statusMap[status] || status;
    }

    async handleComplete() {
        try {
            await completeTask(this.task.id);
            eventBus.emit('taskUpdated');
        } catch (error) {
            alert('할 일 완료 처리 중 오류가 발생했습니다: ' + error.message);
        }
    }

    handleEdit() {
        eventBus.emit('taskEdit', this.task);
    }

    async handleDelete() {
        if (!confirm('정말 삭제하시겠습니까?')) {
            return;
        }

        try {
            await deleteTask(this.task.id);
            eventBus.emit('taskUpdated');
        } catch (error) {
            alert('할 일 삭제 중 오류가 발생했습니다: ' + error.message);
        }
    }

    update(task) {
        this.task = task;
        const newElement = this.create();
        this.element.replaceWith(newElement);
        this.element = newElement;
    }

    remove() {
        this.element.remove();
    }
}

