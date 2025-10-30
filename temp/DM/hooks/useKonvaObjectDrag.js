import { useRef } from 'react';

/**
 * Konva 자체에서 문 드래그 이벤트 처리하는 훅, 선택된 문이 여러 개이면 같이 움직이게 만든다.
 * @param {function} onDragEnd 드래그 종료 후 호출될 콜백 함수
 * @param {React.RefObject} stageRef 스테이지 참조
 * 
 * 선택된 문 객체가 여러 개일 수 있는데 선택 상태를 리액트 상태로 쓰면 
 * 드래그가 움직일 때 마다 리렌더링이 발생해서 엄청나게 버벅거린다.
 * 그걸 피하기 위해서 konva에서 자체적으로 선택된 객체를 찾아서 문이 움직이게 만든다.
 * 
 * onDragEnd 콜백 함수에서 선택된 문 객체의 위치를 리액트 상태에 업데이트 해야 한다.
 */
export const useKonvaObjectDrag = (onDragEnd, stageRef) => {
    const initialPositionsRef = useRef({});  // 초기 위치 저장
    const selectedDoorsRef = useRef([]);    // 선택된 문 목록 저장
    const isDraggingRef = useRef(false);   // 드래그 상태 저장
    const mainDoorIdRef = useRef(null);    // 메인 문 ID 저장

    /**
     * 드래그 시작 이벤트 처리
     * @param {*} e 드래그 이벤트 객체
     * @param {*} doorId 드래그 하는 문의 ID
     * @param {*} doors 모든 문 목록
     * @param {*} selectedDoorIds 선택된 문의 ID 목록
     */
    const handleDragStart = (e, doorId, doors, selectedDoorIds) => {
        isDraggingRef.current = true;
        mainDoorIdRef.current = doorId;

        // 선택된 문 목록 저장
        selectedDoorsRef.current = doors.filter((door) => selectedDoorIds.includes(door.code));

        // 초기 위치 저장
        initialPositionsRef.current = {};
        selectedDoorsRef.current.forEach((door) => {
            initialPositionsRef.current[door.code] = {
                x: door.coordinate.x,
                y: door.coordinate.y,
            };
        });
    };

    /**
     * 드래그 이동 이벤트 처리
     * @param {*} e 드래그 이벤트 객체
     * @param {*} doorId 드래그 하는 문의 ID
     */
    const handleDragMove = (e, doorId) => {
        if (!isDraggingRef.current || doorId !== mainDoorIdRef.current) return;

        // 메인 문의 이동 거리 계산
        const mainInitPos = initialPositionsRef.current[doorId];
        const target = e.target;
        const dx = target.x() - mainInitPos.x;
        const dy = target.y() - mainInitPos.y;

        const stage = stageRef.current;

        // 메인 레이어 찾기
        // IMPORTANT: 메인 레이어는 문 도형들이 들어있는 레이어이다, 지금은 하드 코딩 해놓음
        const layer = stage.findOne('#main-layer');

        // 드래그 중인 메인 도형을 제외한 다른 선택된 도형들 이동
        selectedDoorsRef.current.forEach((door) => {
            if (door.code === doorId) return; // 메인 문 제외

            // ID로 메인 도형 찾기
            const doorShape = layer.findOne(`#door-${door.code}`);

            // 위치 업데이트
            const initPos = initialPositionsRef.current[door.code];
            doorShape.x(initPos.x + dx);
            doorShape.y(initPos.y + dy);

            // 도형 위치 변경 후 updateVisualElementsDirect 트리거를 위한 커스텀 이벤트
            doorShape.fire('positionChanged', { cancelBubble: true });
        });

        layer.batchDraw();
    };

    /**
     * 드래그 종료 이벤트 처리
     * @param {*} e 드래그 이벤트 객체
     * @param {*} doorId 드래그 하는 문의 ID
     * @returns 위치가 업데이트된 선택된 문 목록
     */
    const handleDragEnd = (e, doorId) => {
        if (!isDraggingRef.current || doorId !== mainDoorIdRef.current) {
            return;
        }

        // 메인 문의 최종 이동 거리 계산
        const mainInitPos = initialPositionsRef.current[doorId];
        const target = e.target;
        const dx = target.x() - mainInitPos.x;
        const dy = target.y() - mainInitPos.y;

        // 모든 선택된 문의 최종 위치 계산
        const updatedDoors = selectedDoorsRef.current.map((door) => {
            const initPos = initialPositionsRef.current[door.code];
            return {
                code: door.code,
                coordinate: {
                    ...door.coordinate,
                    x: initPos.x + dx,
                    y: initPos.y + dy,
                },
            };
        });

        // 부모 컴포넌트에 결과 전달
        onDragEnd(updatedDoors);

        // 상태 초기화
        isDraggingRef.current = false;
        selectedDoorsRef.current = [];
        initialPositionsRef.current = {};
        mainDoorIdRef.current = null;
    };

    return {
        handleDragStart,
        handleDragMove,
        handleDragEnd,
    };
};
