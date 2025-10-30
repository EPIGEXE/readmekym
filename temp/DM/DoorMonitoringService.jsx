import { useCallback, useEffect, useState } from "react";
import DoorList from "./DoorMonitoringService/DoorList/DoorList";
import AlertList from "./DoorMonitoringService/AlertList/AlertList";
import PropertiesPanel from "./DoorMonitoringService/PropertiesPanel/PropertiesPanel";
import ViewArea from "./DoorMonitoringService/ViewArea/ViewArea";
import "./styles/DoorMonitoringService.css";
import useDoorMonitoringStore from "./store/doorMonitoringStoreIndex";
import SettingsPanel from "./DoorMonitoringService/SettingsPanel/SettingsPanel";
import ReportPage from "./DoorMonitoringService/ReportPage/ReportPage";
import { useDoorTreeList, useUpdateDoorStructureBackend } from "./hooks/reactQueryHooks/useDoorListApi";
import DoorMonitoringServiceButtonGroup from "./DoorMonitoringService/DoorMonitoringServiceButtonGroup";
import useDoorMonitoringWebSocketStore from "./store/doorMonitoringWebSocketStore";
import useAlarmAudioStore from "./store/alarmAudioStore";
import useDoorMonitoringGlobalStore from "./store/doorMonitoringGlobalStore";
import { parseCoordinate } from "./store/doorMonitoringSlice/doorSlice";
import { useAlertList } from "./hooks/reactQueryHooks/useAlertApi";
import CreateAlertWindow from "./DoorMonitoringService/CreateAlertList/CreateAlertWindow";
import { useDoorSave } from "./hooks/useDoorSave";

/**
 * 문 모니터링 서비스 메인 컴포넌트
 */
const DoorMonitoringService = () => {
    // ============================== 전역 상태 ==============================
    // 전역 속성 상태
    const { globalAlarmSound } = useDoorMonitoringGlobalStore((state) => state.doorMonitoringGlobal); // 글로벌 그래픽 색상, 경보음
    const { areaList } = useDoorMonitoringGlobalStore((state) => state.dmConfig); // area 목록

    // 웹소켓 액션
    const subscribeTopic = useDoorMonitoringWebSocketStore((state) => state.actions.subscribeTopic); // 웹소켓 토픽 구독

    // 오디오 액션
    const playDoorAlarm = useAlarmAudioStore((state) => state.actions.playDoorAlarm); // 문 경보음 재생
    const stopDoorAlarm = useAlarmAudioStore((state) => state.actions.stopDoorAlarm); // 문 경보음 정지
    const dispose = useAlarmAudioStore((state) => state.actions.dispose); // 문 경보음 해제

    // 문 모니터링 상태
    const editState = useDoorMonitoringStore((state) => state.editState); // 편집 모드 여부

    // 문 모니터링 액션
    const applySelectedDoorWithAlertsById = useDoorMonitoringStore(
        (state) => state.actions.applySelectedDoorWithAlertsById
    ); // 선택된 문 업데이트
    const updateMultipleDoorStatus = useDoorMonitoringStore((state) => state.actions.updateMultipleDoorStatus); // 여러 문 일괄 상태 업데이트
    const setDoorList = useDoorMonitoringStore((state) => state.actions.setDoorList); // 문 목록 설정
    const setAlertList = useDoorMonitoringStore((state) => state.actions.setAlertList); // 경보 목록 설정
    const loadAndApplyStoredMapViewId = useDoorMonitoringStore((state) => state.actions.loadAndApplyStoredMapViewId); // 저장된 맵 뷰 ID 로드 및 적용
    const getDoorInfo = useDoorMonitoringStore((state) => state.actions.getDoorInfo); // 문 정보 조회
    const clearDoorCodeMapping = useDoorMonitoringStore((state) => state.actions.clearDoorCodeMapping); // 문 코드 매핑 초기화
    const updateAlert = useDoorMonitoringStore((state) => state.actions.updateAlert); // 경보 업데이트
    
    // ============================== 개별 변수 ==============================
    const areaValue = areaList?.map((area) => area.value); // area 목록 - 문 트리 데이터 호출 용

    const executeSave = useDoorSave(); // 문 저장

    // ============================== 쿼리 훅 ==============================
    // Get
    const { data: doorTreeData, refetch: refetchDoorTree } = useDoorTreeList(areaValue); // 문 트리 데이터
    const { data: alertListData, refetch: refetchAlert } = useAlertList(); // 경보 목록 데이터

    // Post
    const updateDoorStructureBackend = useUpdateDoorStructureBackend(); // 문 구조 업데이트

    // ============================== 상태 ==============================
    const [currentView, setCurrentView] = useState("main"); // 'main' 또는 'settings' 표시할 화면 결정
    const [showCreateAlertWindow, setShowCreateAlertWindow] = useState(false); // 경보 생성 창 표시 여부

    // ============================== useCallback 핸들러 ==============================
    // 경보음 배치 처리 핸들러 (성능 최적화)
    const handleAlarmBatch = useCallback((message) => {
        const { graphic_code, graphic_status } = message;
        
        if (graphic_status === 1) {
            // 경보 발생 - 같은 경보음별로 그룹화하여 처리
            const alarmGroups = new Map(); // soundFile별로 doorCode들을 그룹화
            
            graphic_code.forEach((code) => {
                const doorInfo = getDoorInfo(code);
                const doorCoordinate = parseCoordinate(doorInfo?.coordinate);
                
                if (doorInfo) {
                    const doorAlarmSound = doorCoordinate?.alarmSound || globalAlarmSound;
                    
                    if (!alarmGroups.has(doorAlarmSound)) {
                        alarmGroups.set(doorAlarmSound, []);
                    }
                    alarmGroups.get(doorAlarmSound).push(code);
                }
            });
            
            // 경보음별로 한 번씩만 재생 (같은 경보음 사용하는 문들은 자동으로 그룹핑됨)
            alarmGroups.forEach((doorCodes, soundFile) => {
                // 첫 번째 doorCode로 재생하면, alarmAudioStore에서 나머지 doorCode들을 자동으로 추가함
                playDoorAlarm(doorCodes[0], soundFile, globalAlarmSound);
                
                // 나머지 doorCode들을 같은 soundFile에 추가
                doorCodes.slice(1).forEach(code => {
                    playDoorAlarm(code, soundFile, globalAlarmSound);
                });
            });
        } else {
            // 경보 해제 - 병렬 처리 (Promise.all 사용하지 않고 단순 forEach)
            graphic_code.forEach((code) => {
                stopDoorAlarm(code);
            });
        }
    }, [getDoorInfo, globalAlarmSound, playDoorAlarm, stopDoorAlarm]);

    // 웹소켓 메시지 수신 처리 핸들러 (배치 처리 최적화)
    const handleWebSocketMessage = useCallback(
        (message) => {
            console.log("문 상태 변경 (배치):", {
                codes: message.graphic_code?.length || 0,
                status: message.graphic_status
            });

            // 메시지 형식: { product_code, code, status, event_desc, event_time }
            if (message && message.code) {
                updateAlert(message.code, {
                    status: message.status,
                    event_time: message.event_time,
                    event_desc: message.event_desc,
                });
            }

            // 메시지 형식: { graphic_code: ["G0070", "G0071"], graphic_status: 1 }
            if (message && message.graphic_code && Array.isArray(message.graphic_code)) {
                // 1. 상태 업데이트 배치 처리
                const updates = message.graphic_code.map(code => ({
                    doorCode: code,
                    updateData: { event_status: message.graphic_status }
                }));

                // 한 번에 모든 문 상태 업데이트
                updateMultipleDoorStatus(updates);

                // 2. 경보음 배치 처리
                handleAlarmBatch(message);
            }
        },
        [updateMultipleDoorStatus, handleAlarmBatch]
    );

    // ============================== 유틸 함수 ==============================
    // 트리 데이터 정렬 함수 (name 기준)
    const sortTreeData = (data) => {
        // 재귀적으로 트리를 정렬하는 함수
        const sortNode = (node) => {
            // 하위 노드가 있으면 재귀적으로 정렬
            let sortedChildren = [];
            if (node.childs && node.childs.length > 0) {
                sortedChildren = node.childs
                    .map(child => sortNode(child)) // 각 자식 노드도 재귀적으로 정렬
                    .sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { numeric: true })); // name 순으로 자연스럽게 정렬
            }
            
            // 현재 노드 반환 (정렬된 하위 노드 포함)
            return {
                ...node,
                childs: sortedChildren
            };
        };
        
        // 배열인 경우 각 루트 노드 처리
        let result;
        if (Array.isArray(data)) {
            result = data
                .map(root => sortNode(root))
                .sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { numeric: true }));
        } else {
            // 단일 객체인 경우
            result = sortNode(data);
            result = result ? [result] : [];
        }
        
        return result;
    };

    // ============================== useEffect ==============================
    // 웹소켓 메시지 수신 처리
    useEffect(() => {
        console.log("DoorStatusMonitor - DM_EVENT 구독 시작");

        const unsubscribe = subscribeTopic("DM_EVENT", handleWebSocketMessage);

        return () => {
            console.log("DoorStatusMonitor - 구독 해제");
            unsubscribe();
            // 컴포넌트 언마운트 시 모든 경보음 정지
            dispose();
        };
    }, [handleWebSocketMessage, dispose, subscribeTopic]);

    // 전역 문 트리 데이터, 경보 데이터 설정
    useEffect(() => {
        if (doorTreeData) {
            // 트리 데이터 정렬 (name 기준)
            const sortedTree = sortTreeData(doorTreeData);
            
            // 정렬된 트리 데이터 설정
            if (sortedTree && sortedTree.length > 0) {
                setDoorList(sortedTree);
            }

            // doorList 설정이 완료된 후 localStorage에서 저장된 MapViewID 복원
            loadAndApplyStoredMapViewId();
        }

        // 경보 목록 설정
        setAlertList(alertListData);
    }, [doorTreeData, alertListData, setDoorList, setAlertList, loadAndApplyStoredMapViewId]);

    useEffect(() => {
        if (!editState.isEditable) {
            setShowCreateAlertWindow(false);
        }
    }, [editState.isEditable]);

    // 편집 모드 종료 시 데이터 리프레시 (remountKey 변경 감지)
    useEffect(() => {
        // 초기 렌더링이 아닌 경우에만 실행 (remountKey > 0)
        if (editState.remountKey > 0) {
            // 1. doorCodeMapping 초기화 (임시 ID 매핑 테이블 클리어)
            clearDoorCodeMapping();

            // 2. 서버에서 데이터 다시 가져오기
            refetchDoorTree();
            refetchAlert();
        }
    }, [editState.remountKey, clearDoorCodeMapping, refetchDoorTree, refetchAlert]);

    // ============================== 핸들러 ==============================
    // 경보 생성 창 열기/닫기 핸들러
    const handleOpenCreateAlertWindow = () => setShowCreateAlertWindow(true);
    const handleCloseCreateAlertWindow = () => setShowCreateAlertWindow(false);

    // 설정 화면 전환 핸들러
    const handleOpenSettings = () => setCurrentView("settings");
    const handleCloseSettings = () => setCurrentView("main");

    // 보고서 화면 전환 핸들러
    const handleOpenReport = () => setCurrentView("report");
    const handleCloseReport = () => setCurrentView("main");

    // 문 구조 업데이트 핸들러
    const handleSaveDoor = async () => {
        try {
            // 1단계: 저장 실행
            await executeSave();

            // 2단계: 백엔드 구조 업데이트 (Promise로 감싸서 await 처리)
            await new Promise((resolve, reject) => {
                updateDoorStructureBackend.mutate(undefined, {
                    onSuccess: () => resolve(),
                    onError: (error) => reject(error),
                });
            });

            // 3단계: 문 트리 다시 가져오기
            await refetchDoorTree();

            applySelectedDoorWithAlertsById([]);

            console.log("모든 작업이 순차적으로 완료되었습니다.");
        } catch (error) {
            console.error("작업 중 오류 발생:", error);
        }
    };

    // ============================== 렌더링 ==============================
    // 설정 화면 렌더링
    if (currentView === "settings") {
        return (
            <div className="h-full">
                <SettingsPanel onClose={handleCloseSettings} />
            </div>
        );
    }

    // 보고서 화면 렌더링
    if (currentView === "report") {
        return (
            <div className="h-full">
                <ReportPage onClose={handleCloseReport} />
            </div>
        );
    }

    // 메인 화면 렌더링 - remountKey를 key prop으로 사용하여 편집 모드 종료 시 전체 리렌더링
    return (
        <div key={editState.remountKey} className="p-5 flex flex-col gap-4 h-full bg-[var(--kendo-color-app-surface)]">
            {/* 헤더 */}
            <DoorMonitoringServiceButtonGroup
                handleOpenReport={handleOpenReport}
                handleOpenSettings={handleOpenSettings}
                handleSaveDoor={handleSaveDoor}
                handleOpenCreateAlertWindow={handleOpenCreateAlertWindow}
            />

            {/* 메인 영역 */}
            <div className="flex flex-1 min-h-0 gap-3">
                {/* 문 리스트 */}
                <DoorList />

                {/* 뷰 영역 */}
                <ViewArea />

                {/* 경보 패널 */}
                {!editState.isEditable ? <AlertList /> : <PropertiesPanel />}
            </div>

            {/* 경보 생성 윈도우 */}
            {showCreateAlertWindow && editState.isEditable && (
                <CreateAlertWindow handleCloseCreateAlertWindow={handleCloseCreateAlertWindow} />
            )}
        </div>
    );
};

export default DoorMonitoringService;
