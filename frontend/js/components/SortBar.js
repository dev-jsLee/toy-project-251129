import { createElement, $ } from '../utils/domUtils.js';
import { getState, updateState } from '../state/state.js';
import eventBus from '../state/eventBus.js';

/**
 * 정렬 바 컴포넌트
 */
export class SortBar {
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

        // 정렬 기준 선택
        const sortFieldSelect = createElement('select', {
            className: 'sort-bar__select',
            id: 'sortField'
        });

        const sortFields = [
            { value: 'created_at', label: '생성일' },
            { value: 'due_date', label: '마감일' },
            { value: 'priority', label: '우선순위' },
            { value: 'title', label: '제목' }
        ];

        sortFields.forEach(field => {
            const option = createElement('option', {
                value: field.value,
                selected: state.sort.field === field.value
            }, field.label);
            sortFieldSelect.appendChild(option);
        });

        sortFieldSelect.addEventListener('change', (e) => {
            const state = getState();
            updateState('sort', {
                ...state.sort,
                field: e.target.value
            });
            eventBus.emit('sortChanged');
        });

        // 정렬 방향 토글
        const sortOrderButton = createElement('button', {
            className: 'button button--secondary button--small'
        }, state.sort.order === 'asc' ? '↑ 오름차순' : '↓ 내림차순');

        sortOrderButton.addEventListener('click', () => {
            const state = getState();
            updateState('sort', {
                ...state.sort,
                order: state.sort.order === 'asc' ? 'desc' : 'asc'
            });
            eventBus.emit('sortChanged');
        });

        this.container.appendChild(sortFieldSelect);
        this.container.appendChild(sortOrderButton);
    }
}

