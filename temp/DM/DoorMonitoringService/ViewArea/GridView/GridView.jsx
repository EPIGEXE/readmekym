import { useEffect, useState, useRef, useMemo } from "react";
import useDoorMonitoringStore from "../../../store/doorMonitoringStoreIndex";
import "../../../styles/GridView.css";
import DoorCard from "./DoorCard";
import useDoorMonitoringGlobalStore from "../../../store/doorMonitoringGlobalStore";
import { calculateChildAlertStatus } from "../../../utils/alertUtils";

export const GridView = () => {
    // ============================== 전역 상태 ==============================
    // 문 모니터링 상태
    const mapDisplayDoorList = useDoorMonitoringStore((state) => state.mapDisplayDoorList); // 맵 뷰 문 목록
    const selectedDoorCodeList = useDoorMonitoringStore((state) => state.selectedDoorCodeList); // 선택된 문 코드 목록

    // 문 모니터링 액션
    const toggleSelection = useDoorMonitoringStore((state) => state.actions.toggleSelection); // 문 선택 토글

    // 전역 속성 상태
    const globalGrapicItemColor = useDoorMonitoringGlobalStore(
        (state) => state.doorMonitoringGlobal.globalGrapicItemColor
    ); // 전역 그래픽 아이템 색상 정보

    // ============================== 상태 ==============================
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 }); // 컨테이너 크기

    // ============================== useRef ==============================
    const containerRef = useRef(null); // 컨테이너 참조

    // ============================== useEffect ==============================
    // 컨테이너 크기 감지
    useEffect(() => {
        if (!containerRef.current) return;

        const updateSize = () => {
            if (!containerRef.current) return;
            
            const rect = containerRef.current.getBoundingClientRect();
            setContainerSize({
                width: rect.width,
                height: rect.height,
            });
        };

        updateSize();

        const resizeObserver = new ResizeObserver(() => {
            updateSize();
        });

        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    // ============================== 개별 변수 ==============================
    // 하위 경보 상태 계산
    const childAlertStatusMap = useMemo(() => {
        return calculateChildAlertStatus(mapDisplayDoorList);
    }, [mapDisplayDoorList]);

    // 카드 크기와 그리드 레이아웃 계산
    const { gridCols, gridRows } = useMemo(() => {
        const totalCards = mapDisplayDoorList.length;
        if (totalCards === 0 || containerSize.width === 0 || containerSize.height === 0) {
            return { gridCols: 3, gridRows: 1 };
        }

        const padding = 16; // 컨테이너 패딩
        const gap = 16; // 카드 간격
        const cardWidth = 200; // small 카드 너비 고정
        const availableWidth = containerSize.width - padding * 2;

        // 가능한 최대 열 수 계산
        const maxCols = Math.floor((availableWidth + gap) / (cardWidth + gap));
        const actualCols = Math.min(maxCols, totalCards);
        const rows = Math.ceil(totalCards / actualCols);

        return {
            gridCols: actualCols,
            gridRows: rows,
        };
    }, [mapDisplayDoorList.length, containerSize]);

    return (
        <div ref={containerRef} className="h-full w-full overflow-scroll p-4">
            <div
                className={`grid gap-4 h-full`}
                style={{
                    gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${gridRows}, 60px)`, // 고정 높이로 변경
                    gridAutoRows: "60px", // 추가 행도 고정 높이
                }}
            >
                {mapDisplayDoorList.map((door) => (
                    <DoorCard
                        key={door.code}
                        door={door}
                        globalGrapicItemColor={globalGrapicItemColor}
                        isSelected={selectedDoorCodeList.includes(door.code)}
                        toggleSelection={toggleSelection}
                        childAlertStatus={childAlertStatusMap[door.code]}
                    />
                ))}
            </div>
        </div>
    );
};

export default GridView;
