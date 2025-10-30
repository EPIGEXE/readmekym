import { Button } from "@progress/kendo-react-buttons";
import useDoorMonitoringStore from "../../store/doorMonitoringStoreIndex";
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    ChevronDown,
    Clock,
    DoorClosed,
    Eraser,
    Eye,
    Image,
    MousePointer,
    Move,
    Volume2,
    VolumeOff,
    VolumeX,
} from "lucide-react";
import useDoorMonitoringGlobalStore from "../../store/doorMonitoringGlobalStore";
import useAlarmAudioStore from "../../store/alarmAudioStore";
import { useMemo, useRef, useState, memo, useCallback } from "react";
import { List } from "react-window";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";
import { parseCoordinate } from "../../store/doorMonitoringSlice/doorSlice";
import { calculateChildAlertStatus } from "../../utils/alertUtils";

// 편집 모드 도구 그룹
const getEditToolGroups = (messages) => [
    {
        type: "TOGGLE",
        label: "토글",
        tools: [
            {
                mode: "SELECT",
                icon: <MousePointer className="h-4 w-4" />,
                label: messages.viewArea.header.toolGroup.select,
            },
            {
                mode: "MOVE",
                icon: <Move className="h-4 w-4" />,
                label: messages.viewArea.header.toolGroup.move,
            },
            {
                mode: "DOOR",
                icon: <DoorClosed className="h-4 w-4" />,
                label: messages.viewArea.header.toolGroup.door,
            },
            {
                mode: "BACKGROUND_IMAGE",
                icon: <Image className="h-4 w-4" />,
                label: messages.viewArea.header.toolGroup.backgroundImage,
            },
        ],
    },
    {
        type: "ACTION",
        label: "액션",
        tools: [
            {
                mode: "ERASE",
                icon: <Eraser className="h-4 w-4" />,
                label: messages.viewArea.header.toolGroup.erase,
            },
            {
                mode: "FOCUS",
                icon: <Eye className="h-4 w-4" />,
                label: messages.viewArea.header.toolGroup.focus,
            },
        ],
    },
];

// 뷰 모드 도구 그룹
const getViewToolGroups = (messages) => [
    {
        type: "ACTION",
        label: "액션",
        tools: [
            {
                mode: "ALERT_PROCESS",
                icon: <AlertCircle className="h-4 w-4" />,
                className: "text-[var(--kendo-color-primary)] font-semibold",
                needSelectedDoor: true,
                label: messages.viewArea.header.toolGroup.alarmProcess,
            },
            {
                mode: "FOCUS",
                icon: <Eye className="h-4 w-4" />,
                label: messages.viewArea.header.toolGroup.focus,
            },
        ],
    },
];

/**
 * 뷰 영역 도구 그룹
 * @param {function} setShowAlertProcessDialog - 경보 처리 다이얼로그 표시 함수
 *
 * 경보처리, 배경 이미지 포커스, 경보음 제어, 전체 경보 표시 종합 기능
 */
const ViewAreaToolGroup = ({ setShowAlertProcessDialog }) => {
    // ============================== 전역 상태 ==============================
    // 다국어 설정
    const globalConfig = useGlobalConfigStore((state) => state.globalConfig);
    const messages = getMessages(globalConfig?.languageId);

    // 문 모니터링 상태
    const editState = useDoorMonitoringStore((state) => state.editState); // 편집 모드 여부
    const selectedDoorList = useDoorMonitoringStore((state) => state.selectedDoorList); // 선택된 문 목록
    const selectedDoorCodeList = useDoorMonitoringStore((state) => state.selectedDoorCodeList); // 선택된 문 코드 목록
    const stageSize = useDoorMonitoringStore((state) => state.stageSize); // 캔버스 크기
    const mapDisplayDoorList = useDoorMonitoringStore((state) => state.mapDisplayDoorList); // 맵 표시 문 목록
    const doorList = useDoorMonitoringStore((state) => state.doorList); // 전체 문 목록

    // 문 모니터링 액션
    const deleteDoorsAndUpdateAlerts = useDoorMonitoringStore((state) => state.actions.deleteDoorsAndUpdateAlerts); // 문 삭제 및 경보 업데이트
    const focusBackgroundImage = useDoorMonitoringStore((state) => state.actions.focusBackgroundImage); // 배경 이미지 포커스
    const setMode = useDoorMonitoringStore((state) => state.actions.setMode); // 모드 설정
    const setGlobalVolume = useAlarmAudioStore((state) => state.actions.setGlobalVolume); // 전체 음량 설정
    const setAudioVolume = useAlarmAudioStore((state) => state.actions.setAudioVolume); // 개별 음량 설정

    // 오디오 상태
    const isGlobalMuted = useAlarmAudioStore((state) => state.isGlobalMuted); // 전체 음소거 여부
    const globalVolume = useAlarmAudioStore((state) => state.globalVolume); // 전체 음량
    const activeAlarms = useAlarmAudioStore((state) => state.activeAlarms); // 활성 경보 목록

    // 오디오 액션
    const stopAllAlarms = useAlarmAudioStore((state) => state.actions.stopAllAlarms); // 모든 경보 정지
    const toggleGlobalMute = useAlarmAudioStore((state) => state.actions.toggleGlobalMute); // 전체 음소거 토글
    const stopDoorAlarm = useAlarmAudioStore((state) => state.actions.stopDoorAlarm); // 문 경보 정지
    const playDoorAlarm = useAlarmAudioStore((state) => state.actions.playDoorAlarm); // 문 경보 재생

    // 오디오 큐 상태를 직접 구독 (실시간 업데이트를 위해)
    const audioQueue = useAlarmAudioStore((state) => state.audioQueue);

    // 전역 속성 상태
    const { globalAlarmSound } = useDoorMonitoringGlobalStore((state) => state.doorMonitoringGlobal); // 전역 경보음
    const { globalGrapicItemColor } = useDoorMonitoringGlobalStore((state) => state.doorMonitoringGlobal); // 전역 그래픽 색상

    // ============================== 상태 ==============================
    const [isAlarmDropdownOpen, setIsAlarmDropdownOpen] = useState(false); // 경보음 제어 드롭다운 여부
    const [isIndividualVolumeExpanded, setIsIndividualVolumeExpanded] = useState(false); // 경보음 개별 제어 확장 여부

    // ============================== 개별 변수 ==============================
    const isAlert = selectedDoorList.length === 1 && selectedDoorList[0].event_status === 1 ? true : false; // 선택된 문이 경보 상태인지 여부

    // 하위 경보 상태 계산
    const childAlertStatusMap = useMemo(() => {
        return calculateChildAlertStatus(mapDisplayDoorList);
    }, [mapDisplayDoorList]);

    // 문 상태별 통계 계산 (하위 경보 포함)
    const doorStats = useMemo(() => {
        const total = mapDisplayDoorList.length;

        // childAlertStatusMap을 사용하여 하위 경보가 있는 문도 경보로 계산
        const alert = mapDisplayDoorList.filter((door) => {
            // 자체가 경보 상태이거나
            if (door.event_status === 1) return true;
            // 하위에 경보가 있는 경우
            const childStatus = childAlertStatusMap[door.code];
            return childStatus?.hasActive === true;
        }).length;

        const checked = mapDisplayDoorList.filter((door) => door.event_status === 2).length;
        const autoChecked = mapDisplayDoorList.filter((door) => door.event_status === 3).length;
        const normal = total - alert - checked - autoChecked;

        return { total, alert, checked, autoChecked, normal };
    }, [mapDisplayDoorList, childAlertStatusMap]);

    // 전체 경보 상태 문들 (트리 구조에서 activeAlarms에 포함된 도어만 필터링)
    const alertStatusDoors = useMemo(() => {
        // 트리 구조에서 activeAlarms에 포함된 도어를 재귀적으로 찾는 함수
        const findActiveAlarmDoors = (doors) => {
            const result = [];

            for (const door of doors) {
                // 현재 도어가 activeAlarms에 포함되어 있는지 확인
                if (door.event_status === 1) {
                    const coordinate = door.coordinate ? parseCoordinate(door.coordinate) : null;
                    result.push({
                        ...door,
                        isPlaying: activeAlarms.includes(door.code) ? true : false,
                        alarmSound: coordinate?.alarmSound,
                    });
                }

                // 자식 도어들도 재귀적으로 탐색
                if (door.childs && door.childs.length > 0) {
                    const childResults = findActiveAlarmDoors(door.childs);
                    result.push(...childResults);
                }
            }

            return result;
        };

        return findActiveAlarmDoors(doorList);
    }, [doorList, activeAlarms]);

    const editToolGroups = getEditToolGroups(messages);
    const viewToolGroups = getViewToolGroups(messages);

    // ============================== useRef ==============================
    const dropdownTimeoutRef = useRef(null); // 경보음 드랍다운을 원활하게 표시하기 위한 Timeout

    // ============================== 버튼 액션 핸들러 ==============================
    // 편집 모드 버튼 액션 핸들러
    const actionButtonHandler = {
        ERASE: () => {
            if (selectedDoorCodeList.length > 0) {
                deleteDoorsAndUpdateAlerts();
            }
        },
        FOCUS: () => {
            // 배경 이미지 포커스 로직
            focusBackgroundImage(stageSize);
        },
        ALERT_PROCESS: () => {
            // 경보 처리 로직
            setShowAlertProcessDialog(true);
        },
    };

    // ============================== 메모이제이션된 AlarmItem 컴포넌트 ==============================
    const AlarmItem = memo((props) => {
        const { index, style, door, messages, globalAlarmSound, handleStopSingleAlarm, handlePlaySingleAlarm } = props;

        const doorItem = door[index];
        if (!doorItem) {
            return <div style={style}>No data</div>;
        }

        const isPlaying = doorItem.isPlaying || false;
        const doorName = doorItem.name || "Unknown";
        const doorCode = doorItem.code || "";
        const alarmSound = doorItem.alarmSound || "";

        return (
            <div style={style}>
                <div
                    className={`group flex items-center justify-between p-2 mb-1 rounded border transition-colors ${
                        isPlaying
                            ? "bg-[var(--kendo-color-primary)]/5 border-[var(--kendo-color-primary)]/20"
                            : "bg-[var(--kendo-color-surface)] border-[var(--kendo-color-border)] hover:bg-[var(--kendo-color-surface-alt)]"
                    }`}
                >
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-2 h-2 rounded-full ${
                                    isPlaying
                                        ? "bg-[var(--kendo-color-success)] animate-pulse"
                                        : "bg-[var(--kendo-color-base-emphasis)]"
                                }`}
                            />
                            <span
                                className={`text-sm font-medium truncate ${
                                    isPlaying
                                        ? "text-[var(--kendo-color-primary)]"
                                        : "text-[var(--kendo-color-on-surface)]"
                                }`}
                            >
                                {doorName}
                            </span>
                            {isPlaying && (
                                <div className="text-[10px] bg-[var(--kendo-color-success)] text-white px-1.5 py-0.5 rounded flex-shrink-0">
                                    {messages.viewArea.header.alarmProcess.playingCount}
                                </div>
                            )}
                        </div>
                        <span className="text-xs text-[var(--kendo-color-primary)] mt-1 truncate">
                            {alarmSound || globalAlarmSound || messages.viewArea.header.alarmProcess.noAlarmSound}
                        </span>
                    </div>

                    <div className="flex-shrink-0 ml-2">
                        {isPlaying ? (
                            <Button
                                fillMode="flat"
                                size="small"
                                onClick={() => handleStopSingleAlarm(doorCode)}
                                className="k-button-xs"
                                title={`${doorName} ${messages.viewArea.header.alarmProcess.stopAlarm}`}
                            >
                                <Volume2 className="h-3 w-3" />
                            </Button>
                        ) : (
                            <Button
                                fillMode="flat"
                                size="small"
                                onClick={() => handlePlaySingleAlarm(doorCode, alarmSound, globalAlarmSound)}
                                className="k-button-xs"
                                title={`${doorName} ${messages.viewArea.header.alarmProcess.playAlarm}`}
                            >
                                <VolumeX className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    });

    // AlarmItem 컴포넌트에 displayName 설정 (디버깅 용이성)
    AlarmItem.displayName = "AlarmItem";

    // ============================== 오디오 제어 핸들러 ==============================
    // 경보음 드롭다운 hover Enter 핸들러
    const handleDropdownMouseEnter = () => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
            dropdownTimeoutRef.current = null;
        }
        setIsAlarmDropdownOpen(true);
    };

    // 경보음 드롭다운 hover Leave 핸들러
    const handleDropdownMouseLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => {
            setIsAlarmDropdownOpen(false);
        }, 150); // 150ms 지연으로 안정성 향상
    };

    // 개별 경보음 정지 핸들러 (useCallback으로 메모이제이션)
    const handleStopSingleAlarm = useCallback(
        (doorCode) => {
            console.log("handleStopSingleAlarm", doorCode);
            stopDoorAlarm(doorCode);
        },
        [stopDoorAlarm]
    );

    // 개별 경보음 재생 핸들러 (useCallback으로 메모이제이션)
    const handlePlaySingleAlarm = useCallback(
        (doorCode, alarmSound, globalAlarmSound) => {
            playDoorAlarm(doorCode, alarmSound, globalAlarmSound);
        },
        [playDoorAlarm]
    );

    // 가상화된 리스트에 전달할 데이터 (메모이제이션)
    const virtualizedListData = useMemo(() => {
        if (!Array.isArray(alertStatusDoors) || alertStatusDoors.length === 0) {
            return null;
        }

        return {
            door: alertStatusDoors,
            messages: messages,
            globalAlarmSound: globalAlarmSound || "",
            isGlobalMuted: Boolean(isGlobalMuted),
            handleStopSingleAlarm: handleStopSingleAlarm,
            handlePlaySingleAlarm: handlePlaySingleAlarm,
        };
    }, [alertStatusDoors, messages, globalAlarmSound, isGlobalMuted, handleStopSingleAlarm, handlePlaySingleAlarm]);

    return (
        <div className="flex flex-col gap-2 p-2 bg-background border">
            <div className="flex justify-between items-center py-1">
                {/* 왼쪽: 도구 그룹 */}
                <div className="flex gap-4">
                    {(editState.isEditable ? editToolGroups : viewToolGroups).map((group, index) => (
                        <div key={group.label} className="flex gap-2 items-center">
                            {/* 그룹 구분선 (첫 번째 그룹 제외) */}
                            {index !== 0 && <div className="h-8 w-px bg-border" />}

                            {/* 그룹 도구들 */}
                            <div className="flex gap-1">
                                {group.type === "TOGGLE"
                                    ? group.tools.map((tool) => (
                                          <Button
                                              key={tool.mode}
                                              look={editState.currentMode === tool.mode ? "primary" : "outline"}
                                              fillMode={editState.currentMode === tool.mode ? "solid" : "flat"}
                                              size="small"
                                              rounded="medium"
                                              onClick={() => setMode(tool.mode)}
                                              disabled={false}
                                              startIcon={tool.icon}
                                              className="k-button-xs"
                                          >
                                              {tool.label}
                                          </Button>
                                      ))
                                    : group.tools.map((tool) => (
                                          <Button
                                              key={tool.mode}
                                              look="outline"
                                              fillMode="flat"
                                              size="small"
                                              rounded="medium"
                                              disabled={tool.needSelectedDoor && !isAlert}
                                              startIcon={tool.icon}
                                              onClick={() => actionButtonHandler[tool.mode]?.()}
                                              className={`k-button-xs ${tool.className || ""}`}
                                          >
                                              {tool.label}
                                          </Button>
                                      ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 오른쪽: 경보음 제어 버튼 */}
                <div className="flex gap-2 items-center">
                    {/* 구분선 */}
                    <div className="h-8 w-px bg-border" />

                    {/* 전체 음소거 버튼 */}
                    <Button
                        fillMode="flat"
                        size="small"
                        rounded="medium"
                        onClick={toggleGlobalMute}
                        title={
                            isGlobalMuted
                                ? messages.viewArea.header.alarmProcess.unmute
                                : messages.viewArea.header.alarmProcess.mute
                        }
                        className="k-button-xs"
                    >
                        {isGlobalMuted ? <Volume2 className="h-4 w-4" /> : <VolumeOff className="h-4 w-4" />}
                        <span className="ml-1">
                            {isGlobalMuted
                                ? messages.viewArea.header.alarmProcess.unmute
                                : messages.viewArea.header.alarmProcess.mute}
                        </span>
                    </Button>

                    {/* 경보음 제어 드롭다운 */}
                    <div
                        className="relative"
                        onMouseEnter={handleDropdownMouseEnter}
                        onMouseLeave={handleDropdownMouseLeave}
                    >
                        <Button
                            look={isAlarmDropdownOpen ? "primary" : "outline"}
                            fillMode={isAlarmDropdownOpen ? "solid" : "flat"}
                            size="small"
                            rounded="medium"
                            title="경보음 제어"
                            className="k-button-xs relative"
                            disabled={alertStatusDoors.length === 0}
                            startIcon={<VolumeX className="h-4 w-4" />}
                            endIcon={
                                <ChevronDown
                                    className={`h-3 w-3 transition-transform duration-200 ${
                                        isAlarmDropdownOpen ? "rotate-180" : ""
                                    }`}
                                />
                            }
                        >
                            {messages.viewArea.header.alarmProcess.control}
                            {activeAlarms.length > 0 && (
                                <span className="ml-1 px-1 py-0.5 bg-[var(--kendo-color-error)] text-white text-xs rounded">
                                    {activeAlarms.length}
                                </span>
                            )}
                        </Button>

                        {/* 드롭다운 메뉴 */}
                        {isAlarmDropdownOpen && alertStatusDoors.length > 0 && (
                            <div className="absolute right-0 top-full mt-1 min-w-80 bg-[var(--kendo-color-surface)] border border-[var(--kendo-color-border)] rounded shadow-lg z-50">
                                {/* 헤더 */}
                                <div className="px-3 py-2 border-b border-[var(--kendo-color-border)] bg-[var(--kendo-color-surface-alt)]">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-[var(--kendo-color-on-surface)]">
                                            {messages.viewArea.header.alarmProcess.alarmSoundControl}
                                        </span>
                                        <span className="text-[var(--kendo-color-on-surface-variant)]">
                                            {messages.viewArea.header.alarmProcess.playingCount} {activeAlarms.length}/
                                            {alertStatusDoors.length}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-2">
                                    {/* 전역 음량 설정 */}
                                    <div className="mb-3 p-3 bg-[var(--kendo-color-surface-alt)] rounded border border-[var(--kendo-color-border)]">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-[var(--kendo-color-on-surface)]">
                                                {messages.viewArea.header.alarmProcess.globalVolumeControl}
                                            </span>
                                            <span className="text-xs text-[var(--kendo-color-on-surface-variant)]">
                                                {Math.round(globalVolume * 100)}%
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Volume2 className="h-3 w-3 text-[var(--kendo-color-on-surface-variant)]" />
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={globalVolume}
                                                onChange={(e) => setGlobalVolume(parseFloat(e.target.value))}
                                                className="flex-1 h-2 bg-[var(--kendo-color-border)] rounded-lg appearance-none cursor-pointer slider"
                                                style={{
                                                    background: `linear-gradient(to right, var(--kendo-color-primary) 0%, var(--kendo-color-primary) ${
                                                        globalVolume * 100
                                                    }%, var(--kendo-color-border) ${
                                                        globalVolume * 100
                                                    }%, var(--kendo-color-border) 100%)`,
                                                }}
                                            />
                                            <VolumeX className="h-3 w-3 text-[var(--kendo-color-on-surface-variant)]" />
                                        </div>
                                    </div>

                                    {/* 개별 오디오 음량 설정 */}
                                    <div className="mb-3">
                                        <div
                                            onClick={() => setIsIndividualVolumeExpanded(!isIndividualVolumeExpanded)}
                                            className="w-full flex items-center justify-between p-2 bg-[var(--kendo-color-surface)] rounded border border-[var(--kendo-color-border)] hover:bg-[var(--kendo-color-surface-alt)] transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Volume2 className="h-3 w-3" />
                                                <span className="text-sm font-medium">
                                                    {messages.viewArea.header.alarmProcess.individualVolumeControl}
                                                </span>
                                                <span className="text-xs text-[var(--kendo-color-on-surface-variant)] bg-[var(--kendo-color-primary)]/10 text-[var(--kendo-color-primary)] px-1.5 py-0.5 rounded">
                                                    {audioQueue.length}개
                                                </span>
                                            </div>
                                            <ChevronDown
                                                className={`h-3 w-3 text-[var(--kendo-color-on-surface-variant)] transition-transform duration-200 ${
                                                    isIndividualVolumeExpanded ? "rotate-180" : ""
                                                }`}
                                            />
                                        </div>

                                        {/* 펼쳐진 내용 */}
                                        {isIndividualVolumeExpanded && (
                                            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                                                {audioQueue.map((audioItem, index) => (
                                                    <div
                                                        key={`${audioItem.soundFile}-${index}`}
                                                        className="p-2 bg-[var(--kendo-color-surface)] rounded border border-[var(--kendo-color-border)]"
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs font-medium text-[var(--kendo-color-on-surface)] truncate">
                                                                {audioItem.soundFile}
                                                            </span>
                                                            <span className="text-xs text-[var(--kendo-color-on-surface-variant)]">
                                                                {Math.round(audioItem.volume * 100)}%
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Volume2 className="h-2 w-2 text-[var(--kendo-color-on-surface-variant)]" />
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="1"
                                                                step="0.1"
                                                                value={audioItem.volume}
                                                                onChange={(e) =>
                                                                    setAudioVolume(
                                                                        audioItem.soundFile,
                                                                        parseFloat(e.target.value)
                                                                    )
                                                                }
                                                                className="flex-1 h-1.5 bg-[var(--kendo-color-border)] rounded-lg appearance-none cursor-pointer slider"
                                                                style={{
                                                                    background: `linear-gradient(to right, var(--kendo-color-primary) 0%, var(--kendo-color-primary) ${
                                                                        audioItem.volume * 100
                                                                    }%, var(--kendo-color-border) ${
                                                                        audioItem.volume * 100
                                                                    }%, var(--kendo-color-border) 100%)`,
                                                                }}
                                                            />
                                                            <VolumeX className="h-2 w-2 text-[var(--kendo-color-on-surface-variant)]" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* 모두 정지 버튼 */}
                                    <div className="mb-2">
                                        <Button
                                            look="primary"
                                            fillMode="solid"
                                            size="small"
                                            onClick={stopAllAlarms}
                                            className="w-full k-button-xs"
                                            startIcon={<VolumeX className="h-4 w-4" />}
                                            disabled={activeAlarms.length === 0}
                                        >
                                            {messages.viewArea.header.alarmProcess.allStop} ({activeAlarms.length})
                                        </Button>
                                    </div>

                                    {/* 경보 상태 문들 리스트 - 가상화 적용 */}
                                    <div className="h-64">
                                        {virtualizedListData ? (
                                            <List
                                                defaultHeight={256}
                                                rowCount={virtualizedListData.door.length}
                                                rowHeight={76}
                                                rowProps={virtualizedListData}
                                                rowComponent={AlarmItem}
                                                overscanCount={5}
                                                className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300"
                                                style={{ height: "256px" }}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-[var(--kendo-color-on-surface-variant)] text-sm">
                                                {messages?.viewArea?.header?.alarmProcess?.noAlarms ||
                                                    "경보가 없습니다"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 종합 표시기 - 도구 그룹 아래에 추가 */}
            <div className="flex items-center justify-between px-3 py-2 bg-[var(--kendo-color-surface)] rounded-lg border border-[var(--kendo-color-border)]">
                {/* 전체 문 수 */}
                <div className="flex items-center gap-2">
                    <DoorClosed size={14} className="text-[var(--kendo-color-primary)]" />
                    <span className="text-sm font-medium">{messages.viewArea.header.multifulIndicator.total}</span>
                    <span className="text-base font-bold text-[var(--kendo-color-primary)]">{doorStats.total}</span>
                </div>

                {/* 상태별 통계 */}
                <div className="flex items-center gap-4">
                    {/* 정상 */}
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        <span className="text-xs">{messages.viewArea.header.multifulIndicator.normal}</span>
                        <span className="text-sm font-medium">{doorStats.normal}</span>
                    </div>

                    {/* 경보 - 강조 디자인 */}
                    <div className="flex items-center gap-1.5">
                        <AlertTriangle size={12} style={{ color: globalGrapicItemColor.alert }} />
                        <span className="text-xs">{messages.viewArea.header.multifulIndicator.alert}</span>
                        <span
                            className={`text-sm font-bold px-2 py-0.5 rounded border ${
                                doorStats.alert > 0 ? "animate-pulse" : ""
                            }`}
                            style={{
                                color: doorStats.alert > 0 ? "#ffffff" : globalGrapicItemColor.alert,
                                backgroundColor: doorStats.alert > 0 ? globalGrapicItemColor.alert : "transparent",
                                borderColor: globalGrapicItemColor.alert,
                            }}
                        >
                            {doorStats.alert}
                        </span>
                    </div>

                    {/* 인지 */}
                    <div className="flex items-center gap-1.5">
                        <CheckCircle size={12} style={{ color: globalGrapicItemColor.checked }} />
                        <span className="text-xs">{messages.viewArea.header.multifulIndicator.checked}</span>
                        <span className="text-sm font-medium" style={{ color: globalGrapicItemColor.checked }}>
                            {doorStats.checked}
                        </span>
                    </div>

                    {/* 자동 인지 */}
                    <div className="flex items-center gap-1.5">
                        <Clock size={12} style={{ color: globalGrapicItemColor.autoChecked }} />
                        <span className="text-xs">{messages.viewArea.header.multifulIndicator.autoChecked}</span>
                        <span className="text-sm font-medium" style={{ color: globalGrapicItemColor.autoChecked }}>
                            {doorStats.autoChecked}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewAreaToolGroup;
