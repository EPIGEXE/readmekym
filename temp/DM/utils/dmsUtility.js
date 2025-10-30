 // 트리에서 해당 ID를 가진 노드의 mapId를 찾는 함수
export const findMapIdByDoorId = (nodes, doorCode) => {
    for (const node of nodes) {
        if (node.code === doorCode) {
            return node.parent_code;
        }
        if (node.childs) {
            const found = findMapIdByDoorId(node.childs, doorCode);
            if (found) return found;
        }
    }
    return null;
};

// 트리에서 해당 ID를 가진 노드를 찾는 함수
export const findNodeById = (nodes, doorId) => {
    for (const node of nodes) {
        if (node.code === doorId) {
            return node;
        }
        if (node.childs) {
            const found = findNodeById(node.childs, doorId);
            if (found) return found;
        }
    }
    return null;
};

// 트리에서 해당 경보 ID를 가진 노드를 찾는 함수
export const findNodeByAlertId = (nodes, alertCode) => {
    for (const node of nodes) {
        if (node.event_code === alertCode) {
            return node;
        }
        if (node.childs) {
            const found = findNodeByAlertId(node.childs, alertCode);
            if (found) return found;
        }
    }
    return null;
};