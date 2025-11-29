import eventBus from './eventBus.js';

/**
 * 애플리케이션 상태 저장소
 */
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
    selectedTask: null,
    isLoading: false
};

/**
 * 상태 변경 함수
 * @param {Object} updates - 업데이트할 상태 객체
 */
function setState(updates) {
    Object.assign(state, updates);
    eventBus.emit('stateChanged', state);
}

/**
 * 상태 가져오기 (불변성 보장)
 * @returns {Object} 상태 객체의 복사본
 */
function getState() {
    return { ...state };
}

/**
 * 특정 필드만 업데이트
 * @param {string} key - 업데이트할 상태 키
 * @param {*} value - 새로운 값
 */
function updateState(key, value) {
    state[key] = value;
    eventBus.emit('stateChanged', state);
}

export { state, setState, getState, updateState };

