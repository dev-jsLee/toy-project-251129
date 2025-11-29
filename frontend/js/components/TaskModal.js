import { $ } from '../utils/domUtils.js';
import { formatDateTimeLocal } from '../utils/dateUtils.js';
import { createTask, updateTask } from '../api/taskApi.js';
import eventBus from '../state/eventBus.js';

/**
 * 할 일 추가/수정 모달 컴포넌트
 */
export class TaskModal {
    constructor() {
        this.modal = $('#taskModal');
        this.form = $('#taskForm');
        this.titleInput = $('#taskTitle');
        this.descriptionInput = $('#taskDescription');
        this.dueDateInput = $('#taskDueDate');
        this.prioritySelect = $('#taskPriority');
        this.categoryInput = $('#taskCategory');
        this.statusSelect = $('#taskStatus');
        this.modalTitle = $('#modalTitle');
        this.currentTask = null;

        this.init();
    }

    init() {
        // 모달 닫기 이벤트
        $('#closeModal').addEventListener('click', () => this.close());
        $('#cancelBtn').addEventListener('click', () => this.close());
        this.modal.querySelector('.modal__overlay').addEventListener('click', () => this.close());

        // 폼 제출 이벤트
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // 이벤트 리스너
        eventBus.on('taskAdd', () => this.open());
        eventBus.on('taskEdit', (task) => this.open(task));
    }

    open(task = null) {
        this.currentTask = task;
        
        if (task) {
            // 수정 모드
            this.modalTitle.textContent = '할 일 수정';
            this.titleInput.value = task.title;
            this.descriptionInput.value = task.description || '';
            this.dueDateInput.value = formatDateTimeLocal(task.due_date);
            this.prioritySelect.value = task.priority;
            this.categoryInput.value = task.category || '';
            this.statusSelect.value = task.status;
        } else {
            // 추가 모드
            this.modalTitle.textContent = '할 일 추가';
            this.form.reset();
            this.dueDateInput.value = '';
            this.prioritySelect.value = 'medium';
            this.statusSelect.value = 'pending';
        }

        this.modal.classList.add('modal--active');
        this.titleInput.focus();
    }

    close() {
        this.modal.classList.remove('modal--active');
        this.currentTask = null;
        this.form.reset();
    }

    async handleSubmit(e) {
        e.preventDefault();

        const taskData = {
            title: this.titleInput.value.trim(),
            description: this.descriptionInput.value.trim(),
            due_date: this.dueDateInput.value || null,
            priority: this.prioritySelect.value,
            category: this.categoryInput.value.trim() || null,
            status: this.statusSelect.value
        };

        // 유효성 검증
        if (!taskData.title) {
            alert('제목을 입력해주세요.');
            this.titleInput.focus();
            return;
        }

        try {
            if (this.currentTask) {
                // 수정
                await updateTask(this.currentTask.id, taskData);
            } else {
                // 생성
                await createTask(taskData);
            }

            this.close();
            eventBus.emit('taskUpdated');
        } catch (error) {
            alert('할 일 저장 중 오류가 발생했습니다: ' + error.message);
        }
    }
}

