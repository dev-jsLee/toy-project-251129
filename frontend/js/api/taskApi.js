/**
 * 할 일 API 통신 모듈
 */
const API_BASE_URL = '/api/v1';

/**
 * API 요청 헬퍼 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} options - fetch 옵션
 * @returns {Promise} 응답 데이터
 */
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(error.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

/**
 * 할 일 목록 조회
 * @param {Object} filters - 필터 옵션
 * @param {Object} sort - 정렬 옵션
 * @returns {Promise} 할 일 목록
 */
export async function fetchTasks(filters = {}, sort = {}) {
    const params = new URLSearchParams();
    
    if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
    }
    if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
    }
    if (filters.priority && filters.priority !== 'all') {
        params.append('priority', filters.priority);
    }
    if (sort.field) {
        params.append('sort', sort.field);
    }
    if (sort.order) {
        params.append('order', sort.order);
    }

    const queryString = params.toString();
    const endpoint = `/tasks${queryString ? `?${queryString}` : ''}`;
    
    return await apiRequest(endpoint);
}

/**
 * 할 일 상세 조회
 * @param {number} id - 할 일 ID
 * @returns {Promise} 할 일 상세 정보
 */
export async function fetchTask(id) {
    return await apiRequest(`/tasks/${id}`);
}

/**
 * 할 일 생성
 * @param {Object} taskData - 할 일 데이터
 * @returns {Promise} 생성된 할 일 정보
 */
export async function createTask(taskData) {
    return await apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData)
    });
}

/**
 * 할 일 수정
 * @param {number} id - 할 일 ID
 * @param {Object} taskData - 수정할 할 일 데이터
 * @returns {Promise} 수정된 할 일 정보
 */
export async function updateTask(id, taskData) {
    return await apiRequest(`/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(taskData)
    });
}

/**
 * 할 일 삭제
 * @param {number} id - 할 일 ID
 * @returns {Promise} 삭제 결과
 */
export async function deleteTask(id) {
    return await apiRequest(`/tasks/${id}`, {
        method: 'DELETE'
    });
}

/**
 * 할 일 완료 처리
 * @param {number} id - 할 일 ID
 * @returns {Promise} 완료 처리된 할 일 정보
 */
export async function completeTask(id) {
    return await apiRequest(`/tasks/${id}/complete`, {
        method: 'PATCH'
    });
}

/**
 * 할 일 완료 취소
 * @param {number} id - 할 일 ID
 * @returns {Promise} 완료 취소된 할 일 정보
 */
export async function uncompleteTask(id) {
    return await apiRequest(`/tasks/${id}/uncomplete`, {
        method: 'PATCH'
    });
}

