import { useRef, useEffect } from 'react';
import Konva from 'konva';

/**
 *  캔버스 객체 선택 훅
 * @param {*} stageRef 캔버스 참조
 * @param {*} onSelectionEnd 선택 영역 이동 종료 시 콜백
 * @returns 선택 영역 이동 종료 시 콜백
 *
 * 캔버스 객체를 선택하고 이동하는 훅
 * 선택 영역을 그리고 이동하는 기능 제공
 * 선택 영역 이동 종료 시 콜백 호출
 */
export const useKonvaObjectSelection = (stageRef, onSelectionEnd) => {
    // ============================= useRef =============================
    const selectionRectRef = useRef(null); // 선택 영역 참조
    const isSelectionActive = useRef(false); // 선택 상태 참조
    const selectionStartPoint = useRef({ x: 0, y: 0 }); // 선택 시작점 참조

    // ============================= useEffect =============================
    useEffect(() => {
        return () => {
            // 컴포넌트 언마운트 시 선택 영역 정리
            if (selectionRectRef.current) {
                selectionRectRef.current.destroy();
            }
        };
    }, []);

    // ============================= 핸들러 =============================
    // 선택 시작 핸들러
    const handleSelectionStart = (e) => {
        const stage = e.target.getStage();
        if (!stage) return;

        const { x, y } = stage.getRelativePointerPosition();

        // 선택 시작점 저장
        selectionStartPoint.current = { x, y };
        isSelectionActive.current = true;

        // 마지막 레이어 가져오기
        const layer = stage.findOne('#main-layer');

        // 기존 Rect가 있으면 제거
        if (selectionRectRef.current) {
            selectionRectRef.current.remove();
            selectionRectRef.current.destroy();
            selectionRectRef.current = null;
        }

        // 새 Rect 생성 및 추가
        selectionRectRef.current = new Konva.Rect({
            x,
            y,
            width: 0,
            height: 0,
            fill: 'rgba(0, 100, 255, 0.1)',
            stroke: 'rgba(0, 100, 255, 0.3)',
            strokeWidth: 1,
            visible: true,
        });

        // 레이어에 추가
        layer.add(selectionRectRef.current);
        layer.batchDraw();
    };

    // 선택 이동 핸들러
    const handleSelectionMove = (e) => {
        if (!isSelectionActive.current || !selectionRectRef.current) return;

        const stage = e.target.getStage();
        if (!stage) return;

        const { x, y } = stage.getRelativePointerPosition();
        const startPoint = selectionStartPoint.current;

        // 사각형 너비와 높이 계산
        const width = x - startPoint.x;
        const height = y - startPoint.y;

        // 선택 영역 업데이트
        selectionRectRef.current.setAttrs({
            width,
            height,
        });

        // 부모 확인 후 그리기
        const parent = selectionRectRef.current.getParent();

        if (!parent) {
            console.error('Rect의 부모가 없습니다. 다시 추가합니다.');
            const layer = stage.findOne('Layer:last');
            if (layer) {
                layer.add(selectionRectRef.current);
                layer.batchDraw();
            }
        } else {
            parent.batchDraw();
        }
    };

    // 선택 종료 핸들러
    const handleSelectionEnd = (e) => {
        if (!isSelectionActive.current || !selectionRectRef.current) return;

        // 선택 영역의 실제 범위 계산
        const startPoint = selectionStartPoint.current;
        const rect = selectionRectRef.current;
        const width = rect.width();
        const height = rect.height();

        const x = Math.min(startPoint.x, startPoint.x + width);
        const y = Math.min(startPoint.y, startPoint.y + height);
        const absWidth = Math.abs(width);
        const absHeight = Math.abs(height);

        // 선택 영역 숨기기
        const parent = selectionRectRef.current.getParent();
        if (parent) {
            selectionRectRef.current.visible(false);
            parent.batchDraw();
        }

        // 선택 상태 초기화
        isSelectionActive.current = false;

        // 콜백 호출
        if (onSelectionEnd) {
            onSelectionEnd(e, { x, y, width: absWidth, height: absHeight });
        }
    };

    return {
        handleSelectionStart,
        handleSelectionMove,
        handleSelectionEnd,
    };
};
