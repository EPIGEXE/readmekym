import React, { memo, useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import useDoorMonitoringStore from "../../store/doorMonitoringStoreIndex";

/**
 * 문 맵 경로 표시 컴포넌트
 * @param {string} doorCode - 선택된 문 코드
 * 
 * ViewArea 헤더에 표시되는 문 맵 경로 표시 컴포넌트
 */
const DoorBreadcrumb = ({ doorCode }) => {
    // ============================== 전역 상태 ==============================
    // 문 모니터링 상태
    const doorList = useDoorMonitoringStore(state => state.doorList);

    // 문 모니터링 액션
    const applySelectedDoorWithAlertsById = useDoorMonitoringStore(state => state.actions.applySelectedDoorWithAlertsById); // 선택된 문 설정
    const applyMapViewById = useDoorMonitoringStore(state => state.actions.applyMapViewById); // 맵 뷰 ID 설정

    // ============================== 상태 ==============================
    const [breadcrumb, setBreadcrumb] = useState([]); // 문 맵 경로
    
    // ============================== useEffect ==============================
    // 문 맵 경로 설정
    useEffect(() => {
        if (!doorCode || !doorList) return;
        
        // 선택된 노드에서 루트까지의 경로 찾기
        const findPath = (nodes, targetCode, currentPath = []) => {
            for (const node of nodes) {
                // 현재 노드를 경로에 추가
                const newPath = [...currentPath, node];
                
                // 노드를 찾았으면 경로 반환
                if (node.code === targetCode) {
                    return newPath;
                }

                // 자식 노드가 있으면 재귀적으로 탐색
                if (node.childs && node.childs.length > 0) {
                    const result = findPath(node.childs, targetCode, newPath);
                    if (result) return result;
                }
            }
            
            return null;
        };
        
        const path = findPath(doorList, doorCode);
        setBreadcrumb(path || []);
    }, [doorCode, doorList]);
    
    // ============================== 핸들러 ==============================
    // 항목 클릭시 해당 Door로 이동하는 핸들러
    const handleItemClick = (door) => {
        // 선택한 door의 ID 설정
        applySelectedDoorWithAlertsById([]);
        
        // 맵 ID 설정 (레벨 0의 door가 맵)
        applyMapViewById(door.code);
    };
    
    if (breadcrumb.length === 0) return null;
    
    return (
        <div className="flex items-center">
            {breadcrumb.map((item, index) => (
                <React.Fragment key={item.code}>
                    {index > 0 && <ChevronRight size={12} className="mx-1" />}
                    <span 
                        className={`${
                            index === breadcrumb.length - 1 
                                ? 'font-medium text-[var(--kendo-color-primary)]' 
                                : 'hover:text-[var(--kendo-color-primary)] cursor-pointer'
                        }`}
                        onClick={() => handleItemClick(item)}
                    >
                        {item.name}
                    </span>
                </React.Fragment>
            ))}
        </div>
    );
};

export default memo(DoorBreadcrumb);