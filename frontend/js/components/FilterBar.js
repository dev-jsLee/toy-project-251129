import { createElement, $ } from '../utils/domUtils.js';
import { getState, updateState } from '../state/state.js';
import eventBus from '../state/eventBus.js';

/**
 * 필터 바 컴포넌트
 */
export class FilterBar {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        this.render();
        eventBus.on('stateChanged', () => this.render());
    }

    render() {
        const state = getState();
        this.container.innerHTML = '';

        // 상태 필터
        const statusGroup = createElement('div', { className: 'filter-bar__group' });
        const statusLabel = createElement('span', {}, '상태: ');
        statusGroup.appendChild(statusLabel);

        const statuses = [
            { value: 'all', label: '전체' },
            { value: 'pending', label: '대기중' },
            { value: 'in_progress', label: '진행중' },
            { value: 'completed', label: '완료' },
            { value: 'cancelled', label: '취소됨' }
        ];

        statuses.forEach(status => {
            const button = createElement('button', {
                className: `filter-bar__button ${state.filters.status === status.value ? 'filter-bar__button--active' : ''}`,
                dataset: { filter: 'status', value: status.value }
            }, status.label);
            button.addEventListener('click', () => this.handleFilterChange('status', status.value));
            statusGroup.appendChild(button);
        });

        // 우선순위 필터
        const priorityGroup = createElement('div', { className: 'filter-bar__group' });
        const priorityLabel = createElement('span', {}, '우선순위: ');
        priorityGroup.appendChild(priorityLabel);

        const priorities = [
            { value: 'all', label: '전체' },
            { value: 'high', label: '높음' },
            { value: 'medium', label: '보통' },
            { value: 'low', label: '낮음' }
        ];

        priorities.forEach(priority => {
            const button = createElement('button', {
                className: `filter-bar__button ${state.filters.priority === priority.value ? 'filter-bar__button--active' : ''}`,
                dataset: { filter: 'priority', value: priority.value }
            }, priority.label);
            button.addEventListener('click', () => this.handleFilterChange('priority', priority.value));
            priorityGroup.appendChild(button);
        });

        this.container.appendChild(statusGroup);
        this.container.appendChild(priorityGroup);
    }

    handleFilterChange(filterType, value) {
        const state = getState();
        updateState('filters', {
            ...state.filters,
            [filterType]: value
        });
        eventBus.emit('filterChanged');
    }
}

