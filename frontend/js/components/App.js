import { getState, setState, updateState } from '../state/state.js';
import eventBus from '../state/eventBus.js';
import { fetchTasks } from '../api/taskApi.js';
import { TaskCard } from './TaskCard.js';
import { TaskModal } from './TaskModal.js';
import { FilterBar } from './FilterBar.js';
import { SortBar } from './SortBar.js';
import { $ } from '../utils/domUtils.js';

/**
 * 메인 애플리케이션 컴포넌트
 */
export function initApp() {
    const taskList = $('#taskList');
    const addTaskBtn = $('#addTaskBtn');
    const filterBar = $('#filterBar');
    const sortBar = $('#sortBar');

    // 컴포넌트 초기화
    const taskModal = new TaskModal();
    const filterBarComponent = new FilterBar(filterBar);
    const sortBarComponent = new SortBar(sortBar);

    // 할 일 추가 버튼 이벤트
    addTaskBtn.addEventListener('click', () => {
        eventBus.emit('taskAdd');
    });

    // 상태 변경 이벤트 리스너
    eventBus.on('taskUpdated', () => {
        loadTasks();
    });

    eventBus.on('filterChanged', () => {
        loadTasks();
    });

    eventBus.on('sortChanged', () => {
        loadTasks();
    });

    // 할 일 로드 및 렌더링
    async function loadTasks() {
        try {
            updateState('isLoading', true);
            const state = getState();
            
            const response = await fetchTasks(state.filters, state.sort);
            const tasks = response.tasks || [];
            
            setState({ tasks });
            renderTasks(tasks);
        } catch (error) {
            console.error('할 일 로드 실패:', error);
            alert('할 일을 불러오는 중 오류가 발생했습니다: ' + error.message);
        } finally {
            updateState('isLoading', false);
        }
    }

    // 할 일 목록 렌더링
    function renderTasks(tasks) {
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = '할 일이 없습니다.';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '2rem';
            emptyMessage.style.color = 'var(--color-text-muted)';
            taskList.appendChild(emptyMessage);
            return;
        }

        tasks.forEach(task => {
            const taskCard = new TaskCard(task);
            taskList.appendChild(taskCard.element);
        });
    }

    // 초기 로드
    loadTasks();
}

