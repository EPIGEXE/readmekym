import { useEffect, useMemo, useRef, useState } from "react";
import { gridIcon, mapMarkerIcon } from "@progress/kendo-svg-icons";
import { Button } from "@progress/kendo-react-buttons";
import MapView from "./MapView/MapView";
import DoorBreadcrumb from "./DoorBreadcrumb";
import GridView from "./GridView/GridView";
import AlertProcessDialog from "./AlertProcessDialog";
import useDoorMonitoringStore from "../../store/doorMonitoringStoreIndex";
import "../../styles/ViewArea.css";
import useDoorMonitoringGlobalStore from "../../store/doorMonitoringGlobalStore";
import useAlarmAudioStore from "../../store/alarmAudioStore";
import { createPortal } from "react-dom";
import ViewAreaToolGroup from "./ViewAreaToolGroup";
import AudioFloat from "./AudioFloat";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";
import { parseCoordinate } from "../../store/doorMonitoringSlice/doorSlice";

/**
 * DMS 중앙 뷰 영역
 *
 * 중앙 View 영역 그리드 뷰나 맵 뷰 표시
 */
const ViewArea = () => {
    // ============================== 전역 상태 ==============================
    // 다국어 설정
    const globalConfig = useGlobalConfigStore((state) => state.globalConfig);
    const messages = getMessages(globalConfig?.languageId);

    // 문 모니터링 상태
    const editState = useDoorMonitoringStore((state) => state.editState); // 편집 모드 여부
    const backgroundImage = useDoorMonitoringStore((state) => state.backgroundImage); // 배경 이미지
    const canvasScale = useDoorMonitoringStore((state) => state.canvasScale); // 캔버스 줌 배율
    const selectedDoorMapCode = useDoorMonitoringStore((state) => state.selectedDoorMapCode); // 선택된 문 맵 코드
    const selectedDoorCodeList = useDoorMonitoringStore((state) => state.selectedDoorCodeList); // 선택된 문 코드 목록
    const selectedDoorList = useDoorMonitoringStore((state) => state.selectedDoorList); // 선택된 문 목록
    const doorList = useDoorMonitoringStore((state) => state.doorList); // 전체 문 목록

    // 오디오 상태
    const isAudioEnabled = useAlarmAudioStore((state) => state.isAudioEnabled); // 오디오 활성 여부

    // 오디오 액션
    const playDoorAlarm = useAlarmAudioStore((state) => state.actions.playDoorAlarm); // 문 경보 재생

    // 전역 속성 상태
    const { globalAlarmSound } = useDoorMonitoringGlobalStore((state) => state.doorMonitoringGlobal); // 전역 경보음

    // =============================== 상태 ===============================
    const [viewMode, setViewMode] = useState("map"); // 뷰 모드

    const [showAudioFloat, setShowAudioFloat] = useState(true); // 브라우저 오디오 활성화 창 표시 여부
    const [showAlertProcessDialog, setShowAlertProcessDialog] = useState(false); // 경보 처리 다이얼로그 표시 여부

    // ============================== useRef ==============================
    const hasInitialized = useRef(false); // 경보 상태 문들을 1회 경보음 재생 상태로 만들기 위한 플래그

    // 경보 상태의 모든 문들 (event_status === 1)
    const alertStatusDoors = useMemo(() => {
        // 트리 구조에서 event_status가 1인 도어를 재귀적으로 찾는 함수
        const findAlertStatusDoors = (doors) => {
            const result = [];

            for (const door of doors) {
                // 현재 도어의 event_status가 1인지 확인
                if (door.event_status === 1) {
                    const coordinate = door.coordinate ? parseCoordinate(door.coordinate) : null;
                    result.push({
                        ...door,
                        coordinate: coordinate,
                    });
                }

                // 자식 도어들도 재귀적으로 탐색
                if (door.childs && door.childs.length > 0) {
                    const childResults = findAlertStatusDoors(door.childs);
                    result.push(...childResults);
                }
            }

            return result;
        };

        return findAlertStatusDoors(doorList);
    }, [doorList]);

    // =============================== useEffect ===============================
    // 컴포넌트 마운트 시 1회만 경보 상태의 문들에 대해 경보음 재생
    useEffect(() => {
        // doorList가 로드되고 초기화되지 않은 경우에만 실행
        if (doorList.length > 0 && !hasInitialized.current) {
            hasInitialized.current = true; // 최초 실행 완료 표시

            if (alertStatusDoors.length > 0) {
                alertStatusDoors.forEach((door) => {
                    playDoorAlarm(door.code, door.coordinate?.alarmSound, globalAlarmSound);
                });
            }
        }
    }, [doorList, globalAlarmSound, playDoorAlarm]);

    useEffect(() => {
        if (editState.isEditable && viewMode === "grid") {
            setViewMode("map");
        }
    }, [editState.isEditable]);

    // ============================== 토글 핸들러 ==============================
    // 뷰 모드 토글 핸들러 - 그리드뷰, 맵뷰 토글
    const toggleViewMode = () => {
        setViewMode((prev) => (prev === "map" ? "grid" : "map"));
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 border border-[var(--kendo-color-border)]">
            {/* ViewArea 헤더 */}
            <div className="flex justify-between items-center px-4 py-3 bg-[var(--kendo-color-surface)] border-x border-t">
                <div className="flex items-center">
                    <div className="flex items-center mr-2">
                        <div className="w-2 h-2 bg-[var(--kendo-color-primary)] mr-2"></div>
                        <h3 className="text-base font-semibold text-lg">{messages.viewArea.header.title}</h3>
                    </div>

                    {/* Breadcrumb - 선택된 문 맵의 경로 표시 */}
                    {selectedDoorMapCode && (
                        <div className="flex items-center text-sm">
                            <DoorBreadcrumb doorCode={selectedDoorMapCode} />
                        </div>
                    )}

                    {/* 배경 이미지 줌 비율 표시 */}
                    {backgroundImage.image && <span className="ml-2 text-xs">({Math.round(canvasScale * 100)}%)</span>}
                </div>

                {/* 헤더 버튼 그룹 */}
                <div className="flex gap-2 items-center">
                    {editState.isEditable && (
                        <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
                            {messages.viewArea.header.editMode}
                        </span>
                    )}
                    {selectedDoorCodeList?.length > 0 && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">
                            선택됨: {selectedDoorCodeList.length}
                        </span>
                    )}
                    <Button
                        size="small"
                        look="outline"
                        fillMode="flat"
                        svgIcon={viewMode === "map" ? gridIcon : mapMarkerIcon}
                        onClick={toggleViewMode}
                        className="flex items-center gap-1"
                        disabled={editState.isEditable}
                    >
                        {viewMode === "map" ? "그리드뷰" : "맵뷰"}
                    </Button>
                </div>
            </div>

            {/* ViewArea 도구 모음 */}
            <ViewAreaToolGroup setShowAlertProcessDialog={setShowAlertProcessDialog} />

            {/* 캔버스 컨테이너 */}
            <div className="relative flex-1 border overflow-hidden bg-white" style={{ contain: "size" }}>
                {viewMode === "map" ? (
                    <MapView />
                ) : (
                    /* 그리드뷰 */
                    <GridView />
                )}
            </div>

            {!isAudioEnabled &&
                showAudioFloat &&
                createPortal(<AudioFloat setShowAudioFloat={setShowAudioFloat} />, document.body)}

            {showAlertProcessDialog && (
                <AlertProcessDialog
                    selectedDoor={selectedDoorList.length > 0 ? selectedDoorList[0] : null}
                    onClose={() => setShowAlertProcessDialog(false)}
                />
            )}
        </div>
    );
};

export default ViewArea;
