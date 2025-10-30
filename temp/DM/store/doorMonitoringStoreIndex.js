// src/store/index.js

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createDoorSlice } from "./doorMonitoringSlice/doorSlice";
import { createAlertSlice } from "./doorMonitoringSlice/alertSlice";
import { createEditStateSlice } from "./doorMonitoringSlice/editStateSlice";
import { createBackgroundImageSlice } from "./doorMonitoringSlice/backgroundImageSlice";
import { createChangesSlice } from "./doorMonitoringSlice/changesSlice";

const useDoorMonitoringStore = create(
    devtools(
        (...args) => {
            const [set, get] = args;

            // 모든 슬라이스 생성
            const editStateSlice = createEditStateSlice(...args);
            const backgroundImageSlice = createBackgroundImageSlice(...args);
            const doorSlice = createDoorSlice(...args);
            const alertSlice = createAlertSlice(...args);
            const changesSlice = createChangesSlice(...args);

            // 슬라이스 간 상호작용 설정을 위한 추가 액션
            const interactionActions = {
                actions: {
                    // 선택된 도어가 바뀔 때 연결된 경보도 업데이트
                    applySelectedDoorWithAlertsById: (doorIdList) => {
                        // 먼저 도어 선택 업데이트
                        doorSlice.actions.applySelectedDoorListById(doorIdList);

                        // 그 다음 연결된 경보 업데이트
                        alertSlice.actions.updateConnectedAlerts();
                    },

                    applySelectedDoorWithAlerts: (doorList) => {
                        // 먼저 도어 선택 업데이트
                        doorSlice.actions.applySelectedDoorList(doorList);

                        // 그 다음 연결된 경보 업데이트
                        alertSlice.actions.updateConnectedAlerts();
                    },

                    clearSelectionWithAlerts: () => {
                        // 문 관련 선택 초기화
                        set(
                            {
                                selectedDoorCodeList: [],
                                selectedDoorList: [],
                                connectedAlertCodeList: [], // 연결된 경보 목록도 함께 초기화
                            },
                            false,
                            "doorMonitoring/clearSelectionWithAlerts"
                        );
                    },

                    updateSelectedDoorWithAlerts: (id, updates) => {
                        doorSlice.actions.updateMapDisplayDoor(id, updates);
                        alertSlice.actions.updateConnectedAlerts();
                    },

                    deleteDoorsAndUpdateAlerts: () => {
                        const state = get();

                        const { selectedDoorList } = state;

                        const deletableDoors = selectedDoorList.filter(
                            (door) => !door.childs || door.childs.length === 0
                        );

                        // 삭제될 도어와 관련된 경보 연결 정보 수집
                        const alertConnectionsToRemove = [];
                        deletableDoors.forEach((door) => {
                            if (door && door.event_code) {
                                alertConnectionsToRemove.push({
                                    doorId: door.code,
                                    alertId: door.event_code,
                                });
                            }
                        });

                        // 우선 도어 삭제 수행
                        doorSlice.actions.deleteMapDisplayDoor();

                        // 경보 연결 정보 업데이트
                        alertConnectionsToRemove.forEach(({ doorId, alertId }) => {
                            alertSlice.actions.removeConnectedDoorFromAlert(alertId, doorId);
                        });
                    },
                },
            };

            // 슬라이스 결합 및 액션 추가
            return {
                ...editStateSlice,
                ...doorSlice,
                ...alertSlice,
                ...backgroundImageSlice,
                ...changesSlice,
                actions: {
                    ...interactionActions.actions,
                    ...editStateSlice.actions,
                    ...doorSlice.actions,
                    ...alertSlice.actions,
                    ...backgroundImageSlice.actions,
                    ...changesSlice.actions,
                },
            };
        },
        { name: "doorMonitoringStore" }
    )
);

export default useDoorMonitoringStore;
