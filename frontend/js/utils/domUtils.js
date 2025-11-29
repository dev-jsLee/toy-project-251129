/**
 * DOM 유틸리티 함수
 */

/**
 * 요소 선택
 * @param {string} selector - CSS 선택자
 * @param {Element} parent - 부모 요소 (선택사항)
 * @returns {Element|null} 선택된 요소
 */
export function $(selector, parent = document) {
    return parent.querySelector(selector);
}

/**
 * 여러 요소 선택
 * @param {string} selector - CSS 선택자
 * @param {Element} parent - 부모 요소 (선택사항)
 * @returns {NodeList} 선택된 요소들
 */
export function $$(selector, parent = document) {
    return parent.querySelectorAll(selector);
}

/**
 * 요소 생성
 * @param {string} tag - 태그 이름
 * @param {Object} attributes - 속성 객체
 * @param {string} textContent - 텍스트 내용
 * @returns {Element} 생성된 요소
 */
export function createElement(tag, attributes = {}, textContent = '') {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else {
            element.setAttribute(key, value);
        }
    });
    
    if (textContent) {
        element.textContent = textContent;
    }
    
    return element;
}

/**
 * 클래스 토글
 * @param {Element} element - 요소
 * @param {string} className - 클래스 이름
 */
export function toggleClass(element, className) {
    element.classList.toggle(className);
}

/**
 * 요소 표시/숨김
 * @param {Element} element - 요소
 * @param {boolean} show - 표시 여부
 */
export function showElement(element, show = true) {
    element.style.display = show ? '' : 'none';
}

