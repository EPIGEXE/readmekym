import { findNodeByAlertId, findNodeById } from "./dmsUtility";

//선택된 맵에 표시할 문 목록을 가져옴
export const getMapDisplayDoors = (doorList, selectedDoorMapCode) => {
    if (!doorList || !selectedDoorMapCode) return [];

    const doorMap = findNodeById(doorList, selectedDoorMapCode);

    if (!doorMap || !doorMap.childs) return [];

    return doorMap.childs.filter((door) => {
        // coordinate가 있는지 확인
        return door;
    });
};

//선택된 맵 객체를 가져옴
export const getSelectedDoorMap = (doorList, selectedDoorMapCode) => {
    if (!doorList || !selectedDoorMapCode) return null;
    return findNodeById(doorList, selectedDoorMapCode);
};

// 문 트리 리스트에서 노드를 찾아 업데이트
export const updateNodeInTree = (nodes, doorId, updates) => {
    return nodes.map((node) => {
        if (node.code === doorId) {
            return { ...node, ...updates, childs: node.childs };
        }
        if (node.childs && node.childs.length > 0) {
            return { ...node, childs: updateNodeInTree(node.childs, doorId, updates) };
        }
        return node;
    });
};

// 문 트리 리스트에서 부모 노드를 찾아 업데이트
export const updateParentInTree = (nodes, parent_code, newDoor) => {
    for (const node of nodes) {
        if (node.code === parent_code) {
            // doors 배열이 없으면 생성
            if (!node.childs) {
                node.childs = [];
            }

            node.childs.push(newDoor);
            return true;
        }

        if (node.childs && node.childs.length) {
            const found = updateParentInTree(node.childs, parent_code, newDoor);
            if (found) return true;
        }
    }

    return false;
};

// doorList에서도 선택된 문 제거
export const deleteNodeFromTree = (nodes, selectedDoorCodeList) => {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // 이 노드가 삭제 대상인지 확인
        if (selectedDoorCodeList.includes(node.code)) {
            nodes.splice(i, 1);
            i--;
            continue;
        }

        // 자식 노드 확인
        if (node.childs && node.childs.length) {
            deleteNodeFromTree(node.childs, selectedDoorCodeList);
        }
    }
};

//문 ID 목록을 이용해 문 객체 목록을 가져옴
export const getDoorListFromIds = (doorList, doorIdList) => {
    if (!doorList || !doorIdList || !doorIdList.length) return [];

    return doorIdList.map((code) => findNodeById(doorList, code)).filter(Boolean);
};

//경보 ID 목록을 이용해 문 객체 목록을 가져옴
export const getDoorListFromAlertIds = (doorList, alertIdList) => {
    if (!doorList || !alertIdList || !alertIdList.length) return [];

    return alertIdList.map((code) => findNodeByAlertId(doorList, code)).filter(Boolean);
};

//새로운 문 객체 생성
export const createNewDoor = (x, y, additionalProps = {}) => ({
    id: crypto.randomUUID(),
    name: "문",
    alerts: [],
    alertStatus: "clear",
    area: null,
    parent_code: null,
    coordinate: {
        shape: "rect",
        x,
        y,
        width: 40,
        height: 10,
        ...additionalProps.coordinate,
    },
    ...additionalProps,
});

//문 선택 상태 토글하기
export const toggleDoorSelection = (selectedDoorCodeList, doorId, isShiftKey) => {
    if (isShiftKey) {
        // 다중 선택 로직
        if (selectedDoorCodeList.includes(doorId)) {
            // 이미 선택된 ID면 제거
            return selectedDoorCodeList.filter((code) => code !== doorId);
        } else {
            // 아니면 추가
            return [...selectedDoorCodeList, doorId];
        }
    } else {
        // 단일 선택 로직
        if (selectedDoorCodeList.includes(doorId) && selectedDoorCodeList.length === 1) {
            // 이미 단독으로 선택된 상태면 선택 해제
            return [];
        } else {
            // 아니면, 이 ID만 선택
            return [doorId];
        }
    }
};

const STORAGE_KEY_MAP_VIEW_ID = "AXISTATIONX_DMS_MAP_VIEW_ID";

export const saveMapViewIdToStorage = (doorCode) => {
    try {
        if (doorCode) {
            localStorage.setItem(STORAGE_KEY_MAP_VIEW_ID, doorCode);
        }
    } catch (error) {
        console.warn("localStorage 저장 실패:", error);
    }
};

export const loadMapViewIdFromStorage = () => {
    try {
        return localStorage.getItem(STORAGE_KEY_MAP_VIEW_ID);
    } catch (error) {
        console.warn("localStorage 불러오기 실패:", error);
        return null;
    }
};
