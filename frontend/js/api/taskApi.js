/**
 * 할 일 API 통신 모듈
 */
// 개발 환경: 절대 URL 사용 (백엔드가 별도 포트에서 실행)
// 프로덕션 환경: 상대 URL 사용 (Nginx가 프록시)
const API_BASE_URL = window.location.hostname === 'localhost' && window.location.port !== '80'
    ? 'http://localhost:5000/api/v1'  // 개발 환경
    : '/api/v1';  // 프로덕션 환경 (Docker)

/**
 * API 요청 헬퍼 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} options - fetch 옵션
 * @returns {Promise} 응답 데이터
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                // JSON 파싱 실패 시 기본 메시지 사용
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        // 네트워크 오류인 경우 더 자세한 정보 제공
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.error(`API request failed: Cannot connect to ${url}`);
            throw new Error(`백엔드 서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인하세요. (${url})`);
        }
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

