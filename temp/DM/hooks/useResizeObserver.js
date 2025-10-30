import { useCallback, useEffect, useState } from "react";

/**
 * 참조 요소 크기 관찰 훅
 * @param {*} ref 참조 요소
 * @returns 참조 요소 크기
 * 
 * 참조 요소의 크기를 관찰하고 변경 사항을 감지
 * 참조 요소의 크기 변경 시 콜백 호출
 */
export const useResizeObserver = (ref) => {
    // ============================= 개별 변수 =============================
    const [size, setSize] = useState({ width: 0, height: 0 }); // 참조 요소 크기

    // ============================= 핸들러 =============================
    // 참조 요소 크기 변경 핸들러
    const handleResize = useCallback((entries) => {
        const entry = entries[0];
        if (entry) {
            const { width, height } = entry.contentRect;
            setSize({ width, height });
        }
    }, []);

    // 브라우저 창 크기 변경 핸들러
    const handleWindowResize = useCallback(() => {
        if (ref.current) {
            const { width, height } = ref.current.getBoundingClientRect();
            setSize({ width, height });
        }
    }, [ref]);

    // ============================= useEffect =============================
    // 참조 요소 크기 관찰
    useEffect(() => {
        if (!ref.current) return;

        const observer = new ResizeObserver(handleResize);
        observer.observe(ref.current);

        // 브라우저 창 크기 변경 이벤트 리스너 추가
        window.addEventListener('resize', handleWindowResize);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [ref, handleResize, handleWindowResize]);

    return size;
};