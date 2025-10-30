import { produce } from "immer";
import {
    getMapDisplayDoors,
    getSelectedDoorMap,
    getDoorListFromIds,
    createNewDoor,
    toggleDoorSelection,
    updateParentInTree,
    deleteNodeFromTree,
    saveMapViewIdToStorage,
    loadMapViewIdFromStorage,
} from "../../utils/doorUtils";
import { getConnectedAlertCode } from "../../utils/alertUtils";
import { CHANGE_TYPE } from "./changesSlice";
import { shallow } from "zustand/shallow";

export const parseCoordinate = (coordinateStr) => {
    // 이미 객체인 경우 그대로 반환
    if (typeof coordinateStr === "object" && coordinateStr !== null) {
        return coordinateStr;
    }

    // 문자열이 아닌 경우 null 반환
    if (typeof coordinateStr !== "string") {
        return null;
    }

    try {
        return JSON.parse(coordinateStr);
    } catch (e) {
        console.error("coordinate 파싱 실패:", e);
        return null;
    }
};

export const createDoorSlice = (set, get) => ({
    // ===================== 상태 =====================
    doorList: [], // 문 트리 목록
    selectedDoorMapCode: null, // 맵으로 표시되는 맵 아이디, 맵 빠르게 찾기 위해서 따로 저장
    selectedDoorMap: null, // 맵으로 표시되는 문 맵 객체
    selectedDoorCodeList: [], // 선택된 문 아이디 목록, 선택 문 빠르게 찾기 위해서 따로 저장
    selectedDoorList: [], // 선택된 문 객체 목록
    mapDisplayDoorList: [], // 캔버스에 표시되는 문 목록
    isMapViewLoading: false, // 맵뷰 로딩 상태
    mapViewLoadingTimeout: null, // 맵뷰 로딩 타임아웃 ID
    
    // TODO: 문코드 매핑 테이블은 자동 저장 용이었으나 자동 저장 기능 제거 해서 나중에 doorCodeMapping 속성 삭제해야함
    doorCodeMapping: {}, // 문 코드 임시 값과 실제 값 매핑 테이블
    doorTypeList: [], // 문 타입 목록

    // ===================== 액션 =====================
    actions: {
        // 문 트리 목록 설정
        setDoorList: (doorList) => set({ doorList }, false, "doorMonitoring/setDoorList"),

        // 맵뷰 로딩 상태 제어
        setMapViewLoading: (loading) => {
            const state = get();
            // 로딩 종료 시 타임아웃 클리어
            if (!loading && state.mapViewLoadingTimeout) {
                clearTimeout(state.mapViewLoadingTimeout);
                console.log(`[MapLoading] 정상 종료 - 안전장치 타임아웃 클리어`);
            }
            set({ 
                isMapViewLoading: loading,
                mapViewLoadingTimeout: loading ? state.mapViewLoadingTimeout : null
            }, false, "doorMonitoring/setMapViewLoading");
        },

        /**
         * 맵 뷰 관련 상태 설정
         * @param {Object} doorMap - 맵으로 표시되는 문 객체
         */
        applyMapView: (doorMap) => {
            // 맵 객체가 없으면 모든 상태 초기화
            if (!doorMap) {
                set(
                    {
                        selectedDoorMapCode: null,
                        selectedDoorMap: null,
                        mapDisplayDoorList: [],
                    },
                    false,
                    "doorMonitoring/applyMapView"
                );
                saveMapViewIdToStorage(null);
                return;
            }

            // 맵으로 표시되는 문 목록 계산
            const mapDisplayDoorList = getMapDisplayDoors(get().doorList, doorMap.code);

            const parsedDoorMap = mapDisplayDoorList.map((item) => ({
                ...item,
                coordinate: parseCoordinate(item.coordinate),
            }));

            // 맵 뷰 관련 상태 설정
            set(
                {
                    selectedDoorMapCode: doorMap.code,
                    selectedDoorMap: doorMap,
                    mapDisplayDoorList: parsedDoorMap,
                },
                false,
                "doorMonitoring/applyMapView"
            );
            saveMapViewIdToStorage(doorMap.code);
        },

        /**
         * 맵 뷰 관련 상태 설정 - 맵으로 설정되는 문 객체 아이디로 설정
         * @param {string} doorId - 맵으로 설정되는 문 객체 아이디
         */
        applyMapViewById: (doorId, force = false) => {
            // 현재 doorId와 같으면 처리하지 않음
            const currentState = get();
            if (currentState.selectedDoorMapCode === doorId && !force) {
                console.log(`[MapLoading] 이미 같은 doorId로 설정됨 - 처리 안함: ${doorId}`);
                return;
            }

            console.log(`[MapLoading] 맵 데이터 설정 시작 - doorId: ${doorId}`);

            // 맵으로 설정되는 문 객체의 ID가 없으면 모든 상태 초기화
            if (!doorId) {
                set(
                    {
                        selectedDoorMapCode: null,
                        selectedDoorMap: null,
                        mapDisplayDoorList: [],
                    },
                    false,
                    "doorMonitoring/applyMapViewById"
                );
                saveMapViewIdToStorage(null);
                return;
            }

            // 현재 상태 조회
            const state = get();

            // 맵으로 설정되는 문 객체 조회
            const doorMap = getSelectedDoorMap(state.doorList, doorId);

            // 캔버스에 표시되는 문 목록 계산
            const mapDisplayDoorList = getMapDisplayDoors(state.doorList, doorId);

            const parsedDoorMap = mapDisplayDoorList.map((item) => ({
                ...item,
                coordinate: parseCoordinate(item.coordinate),
            }));

            // 맵 뷰 관련 상태 설정
            set(
                {
                    selectedDoorMapCode: doorId,
                    selectedDoorMap: doorMap,
                    mapDisplayDoorList: parsedDoorMap,
                },
                false,
                "doorMonitoring/applyMapViewById"
            );
            saveMapViewIdToStorage(doorId);
        },

        loadAndApplyStoredMapViewId: () => {
            const storedDoorId = loadMapViewIdFromStorage();
            if (storedDoorId) {
                const state = get();
                // doorList가 로드된 후에만 적용
                if (state.doorList && state.doorList.length > 0) {
                    const doorMap = getSelectedDoorMap(state.doorList, storedDoorId);
                    // 저장된 doorId에 해당하는 문이 실제로 존재하는지 확인
                    if (doorMap) {
                        get().actions.applyMapViewById(storedDoorId, true);
                    } else {
                        // 존재하지 않는 doorId인 경우 localStorage에서 제거
                        saveMapViewIdToStorage(null);
                    }
                }
            }
        },

        /**
         * 선택된 문 목록 설정
         * @param {string[]} doorIdList - 선택된 문 아이디 목록
         */
        applySelectedDoorListById: (doorIdList) => {
            const state = get();

            // 선택된 문 객체 목록 계산
            const selectedDoorList = getDoorListFromIds(state.doorList, doorIdList);

            const parsedSelectedDoorList = selectedDoorList.map((door) => ({
                ...door,
                coordinate: door.coordinate ? parseCoordinate(door.coordinate) : door.coordinate,
            }));

            // 선택된 문 아이디 목록 설정
            set(
                {
                    selectedDoorCodeList: doorIdList,
                    selectedDoorList: parsedSelectedDoorList,
                },
                false,
                "doorMonitoring/applySelectedDoorListById"
            );

            // 연결된 경보 업데이트를 위해 alertSlice의 updateConnectedAlerts 호출
            // 이 부분은 alertSlice 액션이 완성된 후 store/index.js에서 처리
        },

        /**
         * 선택된 문 목록 설정
         * @param {Object[]} doorList - 선택된 문 객체 목록
         */
        applySelectedDoorList: (doorList) => {
            const parsedSelectedDoorList = doorList.map((door) => ({
                ...door,
                coordinate: door.coordinate ? parseCoordinate(door.coordinate) : door.coordinate,
            }));

            set(
                {
                    selectedDoorCodeList: doorList.map((door) => door.code),
                    selectedDoorList: parsedSelectedDoorList,
                },
                false,
                "doorMonitoring/applySelectedDoorList"
            );

            // 연결된 경보 업데이트를 위해 alertSlice의 updateConnectedAlerts 호출
            // 이 부분은 alertSlice 액션이 완성된 후 store/index.js에서 처리
        },

        /**
         * 캔버스에 새 문 추가
         * @param {number} x - 문 객체의 x 좌표
         * @param {number} y - 문 객체의 y 좌표
         * @returns {Object} - 생성된 문 객체
         */
        addMapDisplayDoor: (x, y, additionalProps) => {
            // 먼저 newDoor 생성
            const newDoor = createNewDoor(x, y, additionalProps);

            // 그 다음 상태 업데이트
            set(
                produce(
                    (state) => {
                        state.mapDisplayDoorList.push(newDoor);

                        if (state.selectedDoorMapCode) {
                            updateParentInTree(state.doorList, state.selectedDoorMapCode, newDoor);
                        }

                        return state;
                    },
                    false,
                    "doorMonitoring/addMapDisplayDoor"
                )
            );

            // changesSlice 액션 호출
            get().actions.addChange(newDoor.code, CHANGE_TYPE.CREATE, {
                id: newDoor.id,
                name: newDoor.name,
                event_code: newDoor.event_code,
                area_code_list: newDoor.area_code_list,
                parent_code: newDoor.parent_code,
                coordinate: newDoor.coordinate,
                code: newDoor.code,
                type_code: newDoor.type_code,
            });
        },

        /**
         * 선택된 문 삭제
         */
        deleteMapDisplayDoor: () => {
            const state = get();
            const { selectedDoorCodeList, selectedDoorList } = state;

            // 삭제 가능한 도어와 불가능한 도어 분리
            const deletableDoors = selectedDoorList.filter((door) => !door.childs || door.childs.length === 0);
            const undeletableDoors = selectedDoorList.filter((door) => door && door.childs && door.childs.length > 0);

            const deletableDoorCodes = deletableDoors.map((door) => door.code);

            // 먼저 상태 업데이트
            set(
                produce(
                    (state) => {
                        // mapDisplayDoorList에서 삭제 가능한 문만 제거
                        state.mapDisplayDoorList = state.mapDisplayDoorList.filter(
                            (door) => !deletableDoorCodes.includes(door.code)
                        );

                        // doorList에서도 삭제 가능한 문만 제거
                        deleteNodeFromTree(state.doorList, deletableDoorCodes);

                        // 선택된 문 목록을 삭제 불가능한 문들로 업데이트 (있다면)
                        state.selectedDoorCodeList = undeletableDoors.map((door) => door.code);
                        state.selectedDoorList = undeletableDoors;

                        return state;
                    },
                    false,
                    "doorMonitoring/deleteMapDisplayDoor"
                )
            );

            // 삭제된 각 문에 대해 변경 사항 기록 (삭제 가능한 문만)
            deletableDoors.forEach((door) => {
                get().actions.addChange(door.code, CHANGE_TYPE.DELETE, {
                    id: door.id,
                    name: door.name,
                    event_code: door.event_code,
                    area_code_list: door.area_code_list,
                    parent_code: door.parent_code,
                    coordinate: door.coordinate,
                    code: door.code,
                });
            });
        },

        /**
         * 문 속성 업데이트 (위치, 각도 등)
         * @param {string} id - 문 객체의 ID
         * @param {Object} updates - 업데이트할 속성 객체
         */
        updateMapDisplayDoor: (id, updates) => {
            set(
                produce(
                    (state) => {
                        const doorIndex = state.mapDisplayDoorList.findIndex((door) => door.code === id);
                        if (doorIndex >= 0) {
                            Object.assign(state.mapDisplayDoorList[doorIndex], updates);

                            if (updates.coordinate) {
                                if (!state.mapDisplayDoorList[doorIndex].coordinate) {
                                    state.mapDisplayDoorList[doorIndex].coordinate = {};
                                }
                                Object.assign(state.mapDisplayDoorList[doorIndex].coordinate, updates.coordinate);
                            }

                            // type_code가 변경된 경우 childable 속성도 업데이트
                            if (updates.type_code) {
                                const doorType = state.doorTypeList?.find((type) => type.code === updates.type_code);
                                if (doorType) {
                                    state.mapDisplayDoorList[doorIndex].childable = doorType.childable;
                                }
                            }
                        }

                        const updateNodeInTree = (nodes) => {
                            for (const node of nodes) {
                                if (node.code === id) {
                                    // 기본 속성 업데이트
                                    Object.assign(node, updates);

                                    // coordinate 내부 속성 업데이트 특별 처리
                                    if (updates.coordinate) {
                                        if (!node.coordinate) {
                                            node.coordinate = {};
                                        }
                                        Object.assign(node.coordinate, updates.coordinate);
                                    }

                                    // type_code가 변경된 경우 childable 속성도 업데이트
                                    if (updates.type_code) {
                                        const doorType = state.doorTypeList?.find(
                                            (type) => type.code === updates.type_code
                                        );
                                        if (doorType) {
                                            node.childable = doorType.childable;
                                        }
                                    }
                                    return true;
                                }
                                if (node.childs && updateNodeInTree(node.childs)) {
                                    return true;
                                }
                            }
                            return false;
                        };

                        updateNodeInTree(state.doorList);
                        return state;
                    },
                    false,
                    "doorMonitoring/updateMapDisplayDoor"
                )
            );

            // 변경사항 저장
            console.log("updateMapDisplayDoor", id, updates);
            get().actions.addChange(id, CHANGE_TYPE.UPDATE, updates);
        },

        /**
         * 문 속성 업데이트 (위치, 각도 등)
         * @param {string} id - 문 객체의 ID
         * @param {Object} updates - 업데이트할 속성 객체
         */
        updateMapDisplayDoorWithoutChange: (id, updates) => {
            set(
                produce(
                    (state) => {
                        const doorIndex = state.mapDisplayDoorList.findIndex((door) => door.code === id);
                        if (doorIndex >= 0) {
                            Object.assign(state.mapDisplayDoorList[doorIndex], updates);

                            if (updates.coordinate) {
                                if (!state.mapDisplayDoorList[doorIndex].coordinate) {
                                    state.mapDisplayDoorList[doorIndex].coordinate = {};
                                }
                                Object.assign(state.mapDisplayDoorList[doorIndex].coordinate, updates.coordinate);
                            }
                        }

                        const updateNodeInTree = (nodes) => {
                            for (const node of nodes) {
                                if (node.code === id) {
                                    // 기본 속성 업데이트
                                    Object.assign(node, updates);

                                    // coordinate 내부 속성 업데이트 특별 처리
                                    if (updates.coordinate) {
                                        if (!node.coordinate) {
                                            node.coordinate = {};
                                        }
                                        Object.assign(node.coordinate, updates.coordinate);
                                    }
                                    return true;
                                }
                                if (node.childs && updateNodeInTree(node.childs)) {
                                    return true;
                                }
                            }
                            return false;
                        };

                        updateNodeInTree(state.doorList);
                        return state;
                    },
                    false,
                    "doorMonitoring/updateMapDisplayDoorWithoutChange"
                )
            );
        },

        /**
         * 선택 상태 토글
         * @param {string} doorId - 문 객체의 ID
         * @param {boolean} isShiftKey - 쉬프트 키 여부
         *
         * 문 객체의 ID와 쉬프트 키 여부를 받아서 선택 상태 토글
         * 쉬프트 키 입력 시 다중 선택, 아니면 단일 선택
         */
        toggleSelection: (doorId, isShiftKey) => {
            // 서비스 함수를 사용하여 새로운 선택 ID 목록 계산
            const state = get();
            const newselectedDoorCodeList = toggleDoorSelection(state.selectedDoorCodeList, doorId, isShiftKey);

            // 선택된 문 객체 목록 계산
            const selectedDoorList = getDoorListFromIds(state.doorList, newselectedDoorCodeList);

            const parsedSelectedDoorList = selectedDoorList.map((door) => ({
                ...door,
                coordinate: door.coordinate ? parseCoordinate(door.coordinate) : door.coordinate,
            }));

            // 연결된 경보 ID 목록 계산
            const connectedAlertCodeList = getConnectedAlertCode(selectedDoorList);

            // 상태 업데이트
            set(
                {
                    selectedDoorCodeList: newselectedDoorCodeList,
                    selectedDoorList: parsedSelectedDoorList,
                    connectedAlertCodeList,
                },
                false,
                "doorMonitoring/toggleSelection"
            );
        },

        // 맵에 표시되는 문 객체 리스트 설정
        applyMapDisplayDoorList: (doorList) => {
            const state = get();

            set(
                produce(
                    (state) => {
                        state.mapDisplayDoorList = doorList;

                        // doorList에도 반영
                        if (state.selectedDoorMapCode) {
                            const updateParentDoorsInTree = (nodes) => {
                                for (const node of nodes) {
                                    if (node.code === state.selectedDoorMapCode) {
                                        node.childs = doorList;
                                        return true;
                                    }
                                    if (node.childs && updateParentDoorsInTree(node.childs)) {
                                        return true;
                                    }
                                }
                                return false;
                            };

                            updateParentDoorsInTree(state.doorList);
                        }

                        return state;
                    },
                    false,
                    "doorMonitoring/applyMapDisplayDoorList"
                )
            );

            // shallow 비교를 사용하여 변경된 coordinate만 저장
            // 얕은 비교 안하면 하나 수정해도 mapDisplayDoorList가 전부 변경 사항으로 저장됨
            doorList.forEach((door) => {
                const prevDoor = state.mapDisplayDoorList.find((d) => d.code === door.code);
                if (prevDoor && door.coordinate) {
                    // shallow 비교로 coordinate 변경 확인
                    if (!shallow(prevDoor.coordinate, door.coordinate)) {
                        get().actions.addChange(door.code, CHANGE_TYPE.UPDATE, {
                            coordinate: door.coordinate,
                        });
                    }
                }
            });
        },

        updateDoorIdMapping: (tempCode, realCode) => {
            set((state) => ({
                doorCodeMapping: {
                    ...state.doorCodeMapping,
                    [tempCode]: realCode,
                },
            }));
        },

        getRealDoorCode: (checkCode) => {
            const state = get();
            return state.doorCodeMapping[checkCode] || checkCode;
        },

        clearDoorCodeMapping: () => {
            set(
                (state) => {
                    state.doorCodeMapping = {};
                },
                false,
                "doorMonitoring/clearDoorCodeMapping"
            );
        },

        setDoorTypeList: (doorTypeList) => {
            set(
                (state) => {
                    state.doorTypeList = doorTypeList;
                },
                false,
                "doorMonitoring/setDoorTypeList"
            );
        },

        // 특정 문 상태 업데이트 (웹소켓 메시지 처리용)
        updateDoorStatus: (doorCode, updateData) => {
            const { doorList, mapDisplayDoorList } = get();

            console.log("updateDoorStatus 호출:", {
                doorCode,
                updateData,
            });

            // doorList와 mapDisplayDoorList 모두 업데이트
            set(
                produce((state) => {
                    // doorList 업데이트 (재귀 함수로 깊은 트리 탐색)
                    const updateNodeInTree = (nodes) => {
                        for (const node of nodes) {
                            if (node.code === doorCode) {
                                Object.assign(node, updateData);
                                console.log("doorList에서 문 상태 업데이트:", node);
                                return true;
                            }
                            if (node.childs && updateNodeInTree(node.childs)) {
                                return true;
                            }
                        }
                        return false;
                    };

                    updateNodeInTree(state.doorList);

                    // mapDisplayDoorList 업데이트
                    const doorIndex = state.mapDisplayDoorList.findIndex((door) => door.code === doorCode);
                    if (doorIndex >= 0) {
                        Object.assign(state.mapDisplayDoorList[doorIndex], updateData);
                        console.log("mapDisplayDoorList에서 문 상태 업데이트:", state.mapDisplayDoorList[doorIndex]);
                    }

                    return state;
                }),
                false,
                "doorMonitoring/updateDoorStatus"
            );
        },

        // 여러 문 상태 일괄 업데이트 (성능 최적화용)
        updateMultipleDoorStatus: (updates) => {
            console.log("updateMultipleDoorStatus 호출:", {
                count: updates.length,
                updates: updates.slice(0, 3) // 처음 3개만 로그
            });

            set(
                produce((state) => {
                    // 업데이트할 문들을 Map으로 변환 (빠른 조회용)
                    const updateMap = new Map(updates.map(update => [update.doorCode, update.updateData]));

                    // doorList 일괄 업데이트 (단일 재귀 탐색)
                    const updateNodesInTree = (nodes) => {
                        for (const node of nodes) {
                            if (updateMap.has(node.code)) {
                                Object.assign(node, updateMap.get(node.code));
                                // console.log("doorList 일괄 업데이트:", node.code);
                            }
                            if (node.childs) {
                                updateNodesInTree(node.childs);
                            }
                        }
                    };

                    updateNodesInTree(state.doorList);

                    // 업데이트된 doorList에서 mapDisplayDoorList 재구성
                    if (state.selectedDoorMapCode) {
                        const newMapDisplayDoorList = getMapDisplayDoors(state.doorList, state.selectedDoorMapCode);
                        state.mapDisplayDoorList = newMapDisplayDoorList.map((item) => ({
                            ...item,
                            coordinate: parseCoordinate(item.coordinate),
                        }));
                        console.log("mapDisplayDoorList 재구성 완료:", state.mapDisplayDoorList.length);
                    }

                    return state;
                }),
                false,
                "doorMonitoring/updateMultipleDoorStatus"
            );
        },

        // 문 정보 조회
        getDoorInfo: (doorCode) => {
            const state = get();

            // doorList에서 찾기
            const findDoor = (doors) => {
                for (const door of doors) {
                    if (door.code === doorCode) return door;
                    if (door.childs) {
                        const found = findDoor(door.childs);
                        if (found) return found;
                    }
                }
                return null;
            };

            return findDoor(state.doorList);
        },
    },
});
