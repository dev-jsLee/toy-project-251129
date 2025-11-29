/**
 * 이벤트 버스 (Pub/Sub 패턴)
 * 컴포넌트 간 통신을 위한 이벤트 시스템
 */
class EventBus {
    constructor() {
        this.events = {};
    }

    /**
     * 이벤트 리스너 등록
     * @param {string} event - 이벤트 이름
     * @param {Function} callback - 콜백 함수
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    /**
     * 이벤트 발생
     * @param {string} event - 이벤트 이름
     * @param {*} data - 전달할 데이터
     */
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }

    /**
     * 이벤트 리스너 제거
     * @param {string} event - 이벤트 이름
     * @param {Function} callback - 제거할 콜백 함수
     */
    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }
}

export default new EventBus();

