import { ALERT_STATUS } from "../../constants/dmConstants";
import { findDoorsWithAlertCode, getConnectedAlertCode } from "../../utils/alertUtils";

export const createAlertSlice = (set, get) => ({
    // 상태
    alertList: [],
    connectedAlertCodeList: [],
    activeViewAlertCodeList: [], // 한 번이라도 활성 탭에 표시된 경보 코드들

    // 액션
    actions: {
        setAlertList: (alertList) => {
            // doorTreeList에서 alertId에 해당하는 도어 찾기
            const { doorList, activeViewAlertCodeList } = get();

            // 새로운 activeViewAlertCodeList 배열 생성
            const newActiveViewAlertCodeList = [...activeViewAlertCodeList];

            // 각 알람에 connectedDoor 속성 추가
            const enrichedAlertList = alertList?.map((alert) => {
                // doorList에서 해당 알람 ID를 가진 모든 도어 찾기
                const connectedDoor = findDoorsWithAlertCode(doorList, alert.code);

                // 활성 상태인 경보는 activeViewAlertCodeList에 추가 (중복 체크)
                if (alert.status === ALERT_STATUS.ACTIVE && !newActiveViewAlertCodeList.includes(alert.code)) {
                    newActiveViewAlertCodeList.push(alert.code);
                }

                // 알람 객체에 connectedDoor 속성 추가
                return {
                    ...alert,
                    connectedDoor,
                };
            });

            set(
                {
                    alertList: enrichedAlertList,
                    activeViewAlertCodeList: newActiveViewAlertCodeList,
                },
                false,
                "doorMonitoring/setAlertList"
            );
        },

        // 특정 alert에 connectedDoor 추가
        addConnectedDoorToAlert: (alertCode, connectedDoor) => {
            const { alertList } = get();

            // 업데이트할 알림 찾기
            const updatedAlertList = alertList.map((alert) => {
                if (alert.code === alertCode) {
                    // 현재 연결된 도어 목록
                    const currentconnectedDoor = alert.connectedDoor || [];

                    // 이미 연결되어 있는지 확인
                    if (!currentconnectedDoor.some((door) => door.code === connectedDoor.code)) {
                        return {
                            ...alert,
                            connectedDoor: [...currentconnectedDoor, connectedDoor],
                        };
                    }
                }
                return alert;
            });

            set({ alertList: updatedAlertList }, false, "doorMonitoring/addConnectedDoorToAlert");
        },

        // 특정 alert에서 연결된 door 제거하는 함수
        removeConnectedDoorFromAlert: (alertId, doorId) => {
            const { alertList } = get();

            // 업데이트할 알림 찾기
            const updatedAlertList = alertList.map((alert) => {
                if (alert.code === alertId && alert.connectedDoor) {
                    // doorId를 제외한 새로운 connectedDoor 생성
                    const updatedconnectedDoor = alert.connectedDoor.filter((door) => door.code !== doorId);

                    return {
                        ...alert,
                        connectedDoor: updatedconnectedDoor,
                    };
                }
                return alert;
            });

            set({ alertList: updatedAlertList }, false, "doorMonitoring/removeConnectedDoorFromAlert");
        },

        // 선택된 문의 연결된 경보 ID 목록 업데이트
        updateConnectedAlerts: () => {
            const { selectedDoorList } = get();

            // 서비스 함수 사용
            const connectedAlertCodeList = getConnectedAlertCode(selectedDoorList);

            set({ connectedAlertCodeList }, false, "doorMonitoring/updateConnectedAlerts");
        },

        // 직접 연결된 경보 ID 목록 설정
        setConnectedAlertCodeList: (connectedAlertCodeList) =>
            set({ connectedAlertCodeList }, false, "doorMonitoring/setConnectedAlertCodeList"),

        // 특정 경보 업데이트
        updateAlert: (alertCode, updateData) => {
            const { alertList, activeViewAlertCodeList } = get();
            let shouldAddToActiveView = false;

            // 업데이트할 알림 찾기
            const updatedAlertList = alertList.map((alert) => {
                if (alert.code === alertCode) {
                    const updatedAlert = {
                        ...alert,
                        ...updateData, // status, event_time 등 업데이트
                    };

                    // 활성 상태인지 확인
                    if (updatedAlert.status === ALERT_STATUS.ACTIVE) {
                        shouldAddToActiveView = true;
                    }

                    return updatedAlert;
                }
                return alert;
            });

            // 새로운 activeViewAlertCodeList 배열 생성
            const newActiveViewAlertCodeList = [...activeViewAlertCodeList];
            if (shouldAddToActiveView && !newActiveViewAlertCodeList.includes(alertCode)) {
                newActiveViewAlertCodeList.push(alertCode);
            }

            set(
                {
                    alertList: updatedAlertList,
                    activeViewAlertCodeList: newActiveViewAlertCodeList,
                },
                false,
                "doorMonitoring/updateAlert"
            );
        },

        // 활성 탭에서 경보 Clear
        clearAlertFromActiveView: () => {
            set(
                {
                    activeViewAlertCodeList: [],
                },
                false,
                "doorMonitoring/clearAlertFromActiveView"
            );
        },
    },
});
