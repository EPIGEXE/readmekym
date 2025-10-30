/**
 * 선택된 문에 연결된 경보 ID 목록을 가져옴
 */
export const getConnectedAlertCode = (selectedDoorList) => {
    if (!selectedDoorList || selectedDoorList.length !== 1) return [];
    
    const selectedDoor = selectedDoorList[0];
    
    if (!selectedDoor.event_code) return [];
    
    return selectedDoor.event_code;
};

/**
 * doorList에서 특정 알람 ID를 가진 모든 도어를 찾는 함수
 * @param {Array} doorList - 도어 트리 목록
 * @param {string} alertCode - 찾을 알람 Code
 * @returns {Array} - 해당 알람 ID를 가진 도어 목록
 */
export const findDoorsWithAlertCode = (doorList, alertCode) => {
    const result = [];
    
    // 재귀적으로 도어 트리를 탐색하는 함수
    const searchDoors = (doors) => {
        if (!doors || !Array.isArray(doors)) return;
        
        for (const door of doors) {
            // 현재, 도어가 해당 알람 ID를 가지고 있는지 확인
            if (door.event_code && door.event_code === alertCode) {
                // 기본 정보만 추출해서 결과에 추가
                result.push({
                    code: door.code,
                    name: door.name,
                    fill: door.fill,
                    parent_code: door.parent_code,
                    coordinate: door.coordinate
                });
            }
            
            // 자식 도어가 있으면 재귀적으로 탐색
            if (door.childs) {
                searchDoors(door.childs);
            }
        }
    };
    
    // 도어 트리 탐색 시작
    searchDoors(doorList);
    
    return result;
};

/**
 * 하위 노드의 경보 상태를 확인하는 유틸리티 함수
 * @param {Object} currentNode - 현재 노드
 * @returns {Object} { hasActive: boolean, activeCount: number }
 */
export const checkChildAlerts = (currentNode) => {
    if (!currentNode || !currentNode.childs || currentNode.childs.length === 0)
        return { hasActive: false, activeCount: 0 };

    let activeCount = 0;

    for (const child of currentNode.childs) {
        if (child.event_code) {
            const childAlerts = child.event_status === 1;
            if (childAlerts) {
                activeCount += 1;
            }
        }

        const deepChildStatus = checkChildAlerts(child);
        activeCount += deepChildStatus.activeCount;
    }

    return {
        hasActive: activeCount > 0,
        activeCount,
    };
};

/**
 * 문 목록에서 각 문의 하위 경보 상태를 계산하는 함수
 * @param {Array} doorList - 문 목록
 * @returns {Object} 각 문의 하위 경보 상태 맵
 */
export const calculateChildAlertStatus = (doorList) => {
    const childAlertMap = {};
    
    doorList.forEach(door => {
        childAlertMap[door.code] = checkChildAlerts(door);
    });
    
    return childAlertMap;
};