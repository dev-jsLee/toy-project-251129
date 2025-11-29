/**
 * 날짜 유틸리티 함수
 */

/**
 * 날짜를 로컬 datetime-local 형식으로 변환
 * @param {Date|string} date - 날짜 객체 또는 ISO 문자열
 * @returns {string} datetime-local 형식 문자열
 */
export function formatDateTimeLocal(date) {
    if (!date) return '';
    
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * 날짜를 사용자 친화적인 형식으로 포맷
 * @param {Date|string} date - 날짜 객체 또는 ISO 문자열
 * @returns {string} 포맷된 날짜 문자열
 */
export function formatDate(date) {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * 날짜가 지났는지 확인
 * @param {Date|string} date - 날짜 객체 또는 ISO 문자열
 * @returns {boolean} 지났는지 여부
 */
export function isOverdue(date) {
    if (!date) return false;
    return new Date(date) < new Date();
}

/**
 * 날짜가 임박했는지 확인 (24시간 이내)
 * @param {Date|string} date - 날짜 객체 또는 ISO 문자열
 * @returns {boolean} 임박했는지 여부
 */
export function isDueSoon(date) {
    if (!date) return false;
    const now = new Date();
    const dueDate = new Date(date);
    const diff = dueDate - now;
    const hours = diff / (1000 * 60 * 60);
    return hours > 0 && hours <= 24;
}

