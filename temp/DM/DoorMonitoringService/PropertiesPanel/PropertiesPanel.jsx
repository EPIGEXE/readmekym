// src/components/DoorMonitoringService/PropertiesPanel.jsx
import { ChevronLeft, ChevronRight, Palette, AlertTriangle, Square, MapPin, Volume2, Tag } from "lucide-react";
import { useState, useRef, useEffect, createElement, memo, useCallback, useMemo } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { pauseIcon, playIcon, trashIcon } from "@progress/kendo-svg-icons";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import AlertManagerDialog from "./AlertManagerDialog";
import ColorPickerDialog from "./ColorPickerDialog";
import useDoorMonitoringStore from "../../store/doorMonitoringStoreIndex";
import {
    ALERT_COLORS,
    AUTO_CHECKED_COLORS,
    CHECKED_COLORS,
    DEFAULT_COLORS,
    getShapes,
    LABEL_BACKGROUND_COLORS,
    LABEL_TEXT_COLORS,
} from "./properiesPanelConst";
import { useDoorItem } from "../../hooks/reactQueryHooks/useDoorListApi";
import { parseCoordinate } from "../../store/doorMonitoringSlice/doorSlice";
import { useAlertAudioList } from "../../hooks/reactQueryHooks/useAlertAudioApi";
import useDoorMonitoringGlobalStore from "../../store/doorMonitoringGlobalStore";
import ColorSettingItem from "./ColorSettingItem";
import { useAreaList } from "../../hooks/reactQueryHooks/useSetupApi";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";
import { Loader } from "@progress/kendo-react-indicators";
import useDebounce from "../../hooks/useDebounce";

/**
 * 문 속성 패널 컴포넌트
 *
 * 편집모드에서 우측에 문 속성 패널을 표시하는 컴포넌트
 * 선택한 문의 속성을 편집하는 섹션
 */
const PropertiesPanel = () => {
    // ============================= 전역 상태 =============================
    // 다국어 설정
    const globalConfig = useGlobalConfigStore((state) => state.globalConfig);
    const messages = getMessages(globalConfig?.languageId);

    // 문 모니터링 상태
    const selectedDoorCodeList = useDoorMonitoringStore((state) => state.selectedDoorCodeList); // 선택된 문 아이디 목록
    const mapDisplayDoorList = useDoorMonitoringStore((state) => state.mapDisplayDoorList); // 맵에 표시하는 문 목록
    const alertList = useDoorMonitoringStore((state) => state.alertList); // 경보 목록
    const pendingChanges = useDoorMonitoringStore((state) => state.pendingChanges); // 변경사항 목록
    const doorTypeList = useDoorMonitoringStore((state) => state.doorTypeList); // 문 타입 목록
    const isAutoSaving = useDoorMonitoringStore((state) => state.isAutoSaving); // 자동 저장 상태

    // 문 모니터링 액션
    const updateMapDisplayDoor = useDoorMonitoringStore((state) => state.actions.updateMapDisplayDoor); // 맵에 표시하는 문 업데이트
    const updateMapDisplayDoorWithoutChange = useDoorMonitoringStore(
        (state) => state.actions.updateMapDisplayDoorWithoutChange
    ); // 맵에 표시하는 문 업데이트 (변경사항 저장 안함)
    const deleteDoorsAndUpdateAlerts = useDoorMonitoringStore((state) => state.actions.deleteDoorsAndUpdateAlerts); // 맵에 표시하는 문 삭제
    const setAlertList = useDoorMonitoringStore((state) => state.actions.setAlertList); // 경보 목록 업데이트

    // 문 모니터링 전역 상태
    const { globalGrapicItemColor, globalAlarmSound } = useDoorMonitoringGlobalStore(
        (state) => state.doorMonitoringGlobal
    );

    // ============================= 상태 관리 =============================
    const [collapsed, setCollapsed] = useState(false); // 패널 접기/펼치기
    const [selectedDoor, setSelectedDoor] = useState(null); // 선택된 문

    // 편집 가능한 속성 상태
    const [editableProps, setEditableProps] = useState({
        name: "",
        subName: "",
        color: null,
        alertFill: null, // 경보 시 색상
        checkedFill: null, // 인지 시 색상
        autoCheckedFill: null, // 자동 인지 시 색상
        alerts: [], // 연결 경보 목록
        shape: "rect", // 도형 모양
        area: [], // 지역
        type_code: null, // 문 타입
        event_status_comdition: 0, // 이벤트 상태 조건
        event_status_reverse: 0, // 이벤트 상태 반전
        labelPosition: "bottom", // 라벨 위치
        labelFontSize: 12, // 라벨 텍스트 크기
        labelBackgroundToggle: true, // 라벨 배경 토글
        labelBackgroundColor: "#FFFFFF", // 라벨 배경색
        labelTextColor: "#333", // 라벨 텍스트 색상
    });

    // 디바운싱을 위한 임시 상태
    const [tempName, setTempName] = useState("");
    const [tempSubName, setTempSubName] = useState("");

    // 디바운싱된 값
    const debouncedName = useDebounce(tempName, 300);
    const debouncedSubName = useDebounce(tempSubName, 300);

    // 경보음 관련 상태
    const [selectedAlarmSound, setSelectedAlarmSound] = useState("default"); // 선택된 경보음
    const [isPlayingPreview, setIsPlayingPreview] = useState(false); // 경보음 재생 상태

    // 경보 목록 관련 상태
    const [showAlertManager, setShowAlertManager] = useState(false); // 경보 목록 표시 상태
    const [selectedAlerts, setSelectedAlerts] = useState([]); // 선택된 경보 목록

    // 색상 선택 다이올로그 관련
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [colorPickerType, setColorPickerType] = useState(null); // 'base' or 'alert' or 'checked'
    const [tempColor, setTempColor] = useState(null); // 색상 선택기로 전달할 임시 색상

    // ============================= 쿼리 훅 =============================
    // 선택된 문 데이터 조회
    const { data: doorItemData, isFetching } = useDoorItem(selectedDoorCodeList[0], {
        enabled:
            selectedDoorCodeList.length === 1 &&
            !selectedDoorCodeList[0].includes("new-") &&
            !isAutoSaving &&
            !pendingChanges[selectedDoorCodeList[0]], // 변경사항이 있으면 API 호출하지 않음
    });

    const { data: areaList } = useAreaList(); // 지역 목록 조회
    const { data: alarmSounds = [] } = useAlertAudioList(); // 경보음 목록 조회

    // ============================= 개별 변수 =============================
    // 선택된 door만 구독하도록 최적화 (new- 문이거나 pendingChanges가 있는 경우)
    const selectedDoorFromMap = useDoorMonitoringStore((state) => {
        if (selectedDoorCodeList.length === 1) {
            const code = selectedDoorCodeList[0];
            // new- 문이거나 pendingChanges가 있는 경우 mapDisplayDoorList에서 가져옴
            if (code.includes("new-") || pendingChanges[code]) {
                return state.mapDisplayDoorList.find((door) => door.code === code);
            }
        }
        return null;
    });

    // 로딩 상태 계산
    const isLoading = useMemo(() => {
        if (selectedDoorCodeList.length !== 1) return false;

        const code = selectedDoorCodeList[0];

        // new- 문의 경우: 로딩 없음 (mapDisplayDoorList에서 즉시 가져옴)
        if (code.includes("new-")) {
            return false;
        }

        // 기존 문의 경우
        const hasPendingChanges = pendingChanges[code];
        const isApiLoading = isFetching;
        const isSaving = isAutoSaving;

        // pendingChanges가 있으면 API 호출하지 않으므로 로딩 없음
        if (hasPendingChanges) {
            return isSaving; // 자동저장 중일 때만 로딩
        }

        // pendingChanges가 없으면 API 로딩 상태 또는 자동저장 상태
        return isApiLoading || isSaving;
    }, [selectedDoorCodeList, pendingChanges, isFetching, isAutoSaving]);

    // 도형 모양 목록
    const SHAPES = getShapes(messages);

    // ============================= useEffect =============================
    // 선택된 문 데이터 업데이트 (new- 문과 기존 문 통합 처리)
    useEffect(() => {
        if (selectedDoorCodeList.length === 1) {
            const code = selectedDoorCodeList[0];

            // new-로 시작하거나 pendingChanges가 있는 경우: mapDisplayDoorList에서 가져오기
            if (code.includes("new-") || pendingChanges[code]) {
                if (selectedDoorFromMap) {
                    console.log(selectedDoorFromMap);
                    setSelectedDoor(selectedDoorFromMap);
                }
            } else {
                // 기존 문의 경우: API 데이터 사용
                if (!isFetching && doorItemData && !isAutoSaving && !pendingChanges[code]) {
                    updateMapDisplayDoorWithoutChange(code, {
                        ...doorItemData,
                        coordinate: parseCoordinate(doorItemData.coordinate),
                    });
                    const parsedDoor = { ...doorItemData, coordinate: parseCoordinate(doorItemData?.coordinate || {}) };
                    setSelectedDoor(parsedDoor);
                }
            }
        }
    }, [
        selectedDoorCodeList,
        selectedDoorFromMap,
        doorItemData,
        isFetching,
        isAutoSaving,
        pendingChanges,
        updateMapDisplayDoorWithoutChange,
    ]);

    // 선택된 도어가 변경될 때 호출
    useEffect(() => {
        // 단일 선택
        if (selectedDoorCodeList.length === 1 && selectedDoor) {
            const initialProps = {
                name: selectedDoor.name || "",
                subName: selectedDoor.sub_name || "",
                color: selectedDoor.coordinate.fill || null,
                alertFill: selectedDoor.coordinate.alertFill || null,
                checkedFill: selectedDoor.coordinate.checkedFill || null,
                autoCheckedFill: selectedDoor.coordinate.autoCheckedFill || null,
                alerts: selectedDoor.event_code || "",
                shape: selectedDoor.coordinate.shape || "rect",
                area: selectedDoor.area_code_list || [],
                type_code: selectedDoor.type_code || null,
                event_status_comdition: 0,
                event_status_reverse: selectedDoor.event_status_reverse || 0,
                alarmSound: selectedDoor.coordinate?.alarmSound || null,
                labelPosition: selectedDoor.coordinate?.labelPosition || "bottom",
                labelFontSize: selectedDoor.coordinate?.labelFontSize || 12,
                labelBackgroundColor: selectedDoor.coordinate?.labelBackgroundColor || "#FFFFFF",
                labelBackgroundToggle:
                    selectedDoor.coordinate?.labelBackgroundToggle !== undefined
                        ? selectedDoor.coordinate.labelBackgroundToggle
                        : true,
                labelTextColor: selectedDoor.coordinate?.labelTextColor || "#333",
            };

            // 편집 속성 초기화
            setEditableProps({
                ...initialProps,
            });

            // 임시 상태도 초기화
            setTempName(selectedDoor.name || "");
            setTempSubName(selectedDoor.sub_name || "");

            // 경보음 상태 초기화
            const doorAlarmSound = selectedDoor.coordinate?.alarmSound;
            const displayAlarmSound = doorAlarmSound || globalAlarmSound;
            setSelectedAlarmSound(displayAlarmSound);

            // 선택된 경보 설정 (String)
            setSelectedAlerts(selectedDoor.event_code || "");
        }
        // 선택 없음
        else {
            // 선택된 도어가 없으면 초기화
            setEditableProps({
                name: "",
                subName: "",
                color: null,
                alertFill: null,
                checkedFill: null,
                autoCheckedFill: null,
                alerts: null,
                shape: null,
                area: [],
                type_code: null,
                event_status_comdition: 0,
                event_status_reverse: 0,
                alarmSound: null,
                labelPosition: null,
                labelFontSize: null,
                labelBackgroundToggle: true,
                labelBackgroundColor: null,
                labelTextColor: null,
            });

            // 임시 상태도 초기화
            setTempName("");
            setTempSubName("");

            setSelectedDoor(null);
            setSelectedAlerts(null);
            setSelectedAlarmSound(null);
        }
    }, [selectedDoor]);

    useEffect(() => {
        // 다중 선택
        if (selectedDoorCodeList.length > 1) {
            // 편집 속성도 빈 값으로 초기화
            setEditableProps({
                name: null,
                subName: null,
                color: null,
                alertFill: null,
                checkedFill: null,
                autoCheckedFill: null,
                alerts: null,
                shape: null,
                area: [],
                type_code: null,
                event_status_comdition: 0,
                event_status_reverse: 0,
                alarmSound: null,
                labelPosition: null,
                labelFontSize: null,
                labelBackgroundToggle: true,
                labelBackgroundColor: null,
                labelTextColor: null,
            });

            // 임시 상태도 초기화
            setTempName("");
            setTempSubName("");

            setSelectedDoor(null);

            // 선택된 경보 초기화
            setSelectedAlerts(null);
            setSelectedAlarmSound(null);
        }
    }, [selectedDoorCodeList]);

    // 컴포넌트 언마운트 시 오디오 정리
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // ============================= useRef =============================
    const audioRef = useRef(null); // 오디오 참조

    // ============================= useEffect (디바운싱) =============================
    // 디바운싱된 이름 변경 적용
    useEffect(() => {
        // selectedDoor가 있고, 디바운싱된 값이 tempName과 같을 때만 업데이트 (사용자가 입력을 멈춘 후)
        // 단, 단일 선택 상태이고 빈 문자열이 아닐 때만 적용 (다중 선택 → 단일 선택 전환 시 빈 값 저장 방지)
        if (selectedDoor &&
            selectedDoorCodeList.length === 1 &&
            debouncedName === tempName &&
            debouncedName !== editableProps.name &&
            debouncedName !== "") {
            setEditableProps((prev) => ({
                ...prev,
                name: debouncedName,
            }));
            updateMapDisplayDoor(selectedDoor.code, { name: debouncedName });
        }
    }, [debouncedName, tempName, selectedDoor, editableProps.name, selectedDoorCodeList.length, updateMapDisplayDoor]);

    // 디바운싱된 부 이름 변경 적용
    useEffect(() => {
        // selectedDoor가 있고, 디바운싱된 값이 tempSubName과 같을 때만 업데이트 (사용자가 입력을 멈춘 후)
        // 단, 단일 선택 상태이고 빈 문자열이 아닐 때만 적용 (다중 선택 → 단일 선택 전환 시 빈 값 저장 방지)
        if (selectedDoor &&
            selectedDoorCodeList.length === 1 &&
            debouncedSubName === tempSubName &&
            debouncedSubName !== editableProps.subName &&
            debouncedSubName !== "") {
            setEditableProps((prev) => ({
                ...prev,
                subName: debouncedSubName,
            }));
            updateMapDisplayDoor(selectedDoor.code, { sub_name: debouncedSubName });
        }
    }, [debouncedSubName, tempSubName, selectedDoor, editableProps.subName, selectedDoorCodeList.length, updateMapDisplayDoor]);

    // ============================= 패널 관련 핸들러 =============================
    // 패널 접기/펼치기
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    // 문 이름 변경 핸들러 (디바운싱 적용)
    const handleNameChange = (e) => {
        setTempName(e.value);
    };

    // 문 부 이름 변경 핸들러 (디바운싱 적용)
    const handleSubNameChange = (e) => {
        setTempSubName(e.value);
    };

    // 문 타입 변경 핸들러
    const handleTypeChange = (e) => {
        const selectedType = e.value;
        setEditableProps((prev) => ({
            ...prev,
            type_code: selectedType?.code || null,
        }));

        // 모든 선택된 문에 적용
        if (selectedDoorCodeList.length > 0) {
            selectedDoorCodeList.forEach((doorId) => {
                updateMapDisplayDoor(doorId, { type_code: selectedType?.code || null });
            });
        }
    };

    // 지역 변경 핸들러
    const handleAreaChange = (e) => {
        const newAreas = e.value.map((area) => area.code); // 선택된 객체들에서 code 값만 추출
        setEditableProps((prev) => ({
            ...prev,
            area: newAreas,
        }));

        // 모든 선택된 문에 적용
        if (selectedDoorCodeList.length > 0) {
            selectedDoorCodeList.forEach((doorId) => {
                updateMapDisplayDoor(doorId, { area_code_list: newAreas });
            });
        }
    };

    // 도형 모양 변경 핸들러
    const handleShapeChange = (newShape) => {
        setEditableProps((prev) => ({
            ...prev,
            shape: newShape,
        }));

        // 모든 선택된 문에 적용
        if (selectedDoorCodeList.length > 0) {
            selectedDoorCodeList.forEach((doorId) => {
                const door = mapDisplayDoorList.find((d) => d.code === doorId);
                if (door) {
                    updateMapDisplayDoor(doorId, {
                        coordinate: {
                            ...door.coordinate,
                            shape: newShape,
                        },
                    });
                }
            });
        }
    };

    // 이벤트 상태 반전 변경 핸들러
    const handleEventReverseChange = (value) => {
        setEditableProps((prev) => ({
            ...prev,
            event_status_reverse: value,
        }));

        // 모든 선택된 문에 적용
        if (selectedDoorCodeList.length > 0) {
            selectedDoorCodeList.forEach((doorId) => {
                updateMapDisplayDoor(doorId, { event_status_reverse: value });
            });
        }
    };

    // 삭제 핸들러
    const handleDelete = useCallback(() => {
        if (selectedDoorCodeList.length > 0) {
            deleteDoorsAndUpdateAlerts();
        }
    }, [selectedDoorCodeList, deleteDoorsAndUpdateAlerts]);

    // ============================= 색상 변경 핸들러 =============================

    // 색상 선택기 열기
    const handleOpenColorPicker = (type) => {
        // 현재 타입에 따른 색상 값 설정
        let initialColor;
        if (type === "base") {
            initialColor = editableProps.color;
        } else if (type === "alert") {
            initialColor = editableProps.alertFill;
        } else if (type === "checked") {
            initialColor = editableProps.checkedFill;
        } else if (type === "autoChecked") {
            initialColor = editableProps.autoCheckedFill;
        }

        setTempColor(initialColor);
        setColorPickerType(type);
        setShowColorPicker(true);
    };

    // 색상 변경 핸들러
    const handleColorChange = (color, colorType = "color") => {
        setEditableProps((prev) => ({
            ...prev,
            [colorType]: color,
        }));

        // UI에 바로 반영 - 모든 선택된 문에 적용
        if (selectedDoorCodeList.length > 0) {
            selectedDoorCodeList.forEach((doorId) => {
                const door = mapDisplayDoorList.find((d) => d.code === doorId);
                if (door) {
                    updateMapDisplayDoor(doorId, {
                        coordinate: {
                            ...door.coordinate,
                            [colorType === "color" ? "fill" : colorType]: color,
                        },
                    });
                }
            });
        }
    };

    // 경보 색상 변경 핸들러
    const handleAlertFillChange = (color) => {
        setEditableProps((prev) => ({
            ...prev,
            alertFill: color,
        }));

        // 모든 선택된 문에 적용
        if (selectedDoorCodeList.length > 0) {
            selectedDoorCodeList.forEach((doorId) => {
                const door = mapDisplayDoorList.find((d) => d.code === doorId);
                if (door) {
                    updateMapDisplayDoor(doorId, {
                        coordinate: {
                            ...door.coordinate,
                            alertFill: color,
                        },
                    });
                }
            });
        }
    };

    // 인지 색상 변경 핸들러
    const handleCheckedFillChange = (color) => {
        setEditableProps((prev) => ({
            ...prev,
            checkedFill: color,
        }));

        // 모든 선택된 문에 적용
        if (selectedDoorCodeList.length > 0) {
            selectedDoorCodeList.forEach((doorId) => {
                const door = mapDisplayDoorList.find((d) => d.code === doorId);
                if (door) {
                    updateMapDisplayDoor(doorId, {
                        coordinate: {
                            ...door.coordinate,
                            checkedFill: color,
                        },
                    });
                }
            });
        }
    };

    // 자동 인지 색상 변경 핸들러
    const handleAutoCheckedFillChange = (color) => {
        setEditableProps((prev) => ({
            ...prev,
            autoCheckedFill: color,
        }));

        // 모든 선택된 문에 적용
        if (selectedDoorCodeList.length > 0) {
            selectedDoorCodeList.forEach((doorId) => {
                const door = mapDisplayDoorList.find((d) => d.code === doorId);
                if (door) {
                    updateMapDisplayDoor(doorId, {
                        coordinate: {
                            ...door.coordinate,
                            autoCheckedFill: color,
                        },
                    });
                }
            });
        }
    };

    // 글로벌 색상으로 되돌리기
    const handleResetToGlobalColor = (colorType) => {
        setEditableProps((prev) => ({
            ...prev,
            [colorType]: null,
        }));

        // 모든 선택된 문에 적용
        if (selectedDoorCodeList.length > 0) {
            selectedDoorCodeList.forEach((doorId) => {
                const door = mapDisplayDoorList.find((d) => d.code === doorId);
                if (door) {
                    updateMapDisplayDoor(doorId, {
                        coordinate: {
                            ...door.coordinate,
                            [colorType === "color" ? "fill" : colorType]: null,
                        },
                    });
                }
            });
        }
    };

    // 색상 선택 확인 핸들러
    const handleColorConfirm = useCallback(
        (selectedColor) => {
            // 선택된 색상 타입에 따라 적절한 핸들러 호출
            if (colorPickerType === "base") {
                handleColorChange(selectedColor);
            } else if (colorPickerType === "alert") {
                handleAlertFillChange(selectedColor);
            } else if (colorPickerType === "checked") {
                handleCheckedFillChange(selectedColor);
            } else if (colorPickerType === "autoChecked") {
                handleAutoCheckedFillChange(selectedColor);
            } else if (colorPickerType === "labelBackground") {
                handleLabelBackgroundColorChange(selectedColor);
            } else if (colorPickerType === "labelText") {
                handleLabelTextColorChange(selectedColor);
            }

            setShowColorPicker(false);
        },
        [colorPickerType]
    );

    // ============================= 경보 관리 핸들러 =============================
    // 경보 관리 적용 핸들러
    const handleApplyAlerts = useCallback(
        (updatedAlerts) => {
            if (selectedDoorCodeList.length > 0) {
                // 선택된 경보 업데이트 (String으로 변경)
                setSelectedAlerts(updatedAlerts);

                // editableProps 업데이트
                setEditableProps((prev) => ({
                    ...prev,
                    alerts: updatedAlerts,
                }));

                // 모든 선택된 문에 적용
                selectedDoorCodeList.forEach((doorId) => {
                    updateMapDisplayDoor(doorId, { event_code: updatedAlerts });
                });

                setAlertList(alertList);

                // 다이얼로그 닫기
                setShowAlertManager(false);
            }
        },
        [selectedDoorCodeList, updateMapDisplayDoor, alertList, setAlertList]
    );

    // ============================= 경보음 관리 핸들러 =============================
    // 경보음 변경 핸들러
    const handleAlarmSoundChange = (e) => {
        setSelectedAlarmSound(e.value);

        // 변경 상태 업데이트
        setEditableProps((prev) => ({
            ...prev,
            alarmSound: e.value,
        }));

        // 모든 선택된 문에 적용
        if (selectedDoorCodeList.length > 0) {
            selectedDoorCodeList.forEach((doorId) => {
                const door = mapDisplayDoorList.find((d) => d.code === doorId);
                if (door) {
                    updateMapDisplayDoor(doorId, {
                        coordinate: {
                            ...door.coordinate,
                            alarmSound: e.value,
                        },
                    });
                }
            });
        }
    };

    // 경보음 글로벌로 되돌리기
    const handleResetToGlobalAlarmSound = () => {
        // 편집 가능한 속성에서 개별 경보음 제거
        setEditableProps((prev) => ({
            ...prev,
            alarmSound: null,
        }));

        // 글로벌 경보음으로 selectedAlarmSound 업데이트
        const safeGlobalAlarmSound = typeof globalAlarmSound === "string" ? globalAlarmSound : null;
        setSelectedAlarmSound(safeGlobalAlarmSound || "default");

        // 모든 선택된 문에 적용
        if (selectedDoorCodeList.length > 0) {
            selectedDoorCodeList.forEach((doorId) => {
                const door = mapDisplayDoorList.find((d) => d.code === doorId);
                if (door) {
                    updateMapDisplayDoor(doorId, {
                        coordinate: {
                            ...door.coordinate,
                            alarmSound: null, // coordinate에서 개별 경보음 제거
                        },
                    });
                }
            });
        }
    };

    // ============================= 라벨 관리 핸들러 =============================
    // 라벨 위치 변경 핸들러
    const handleLabelPositionChange = (position) => {
        setEditableProps((prev) => ({
            ...prev,
            labelPosition: position,
        }));

        // 모든 선택된 문에 적용
        if (selectedDoorCodeList.length > 0) {
            selectedDoorCodeList.forEach((doorId) => {
                const door = mapDisplayDoorList.find((d) => d.code === doorId);
                if (door) {
                    updateMapDisplayDoor(doorId, {
                        coordinate: {
                            ...door.coordinate,
                            labelPosition: position,
                        },
                    });
                }
            });
        }
    };

    // 라벨 폰트 크기 변경 핸들러
    const handleLabelFontSizeChange = (value) => {
        // 범위 제한 (8 ~ 24)

        setEditableProps((prev) => ({
            ...prev,
            labelFontSize: value,
        }));

        // 모든 선택된 문에 적용
        if (selectedDoorCodeList.length > 0) {
            selectedDoorCodeList.forEach((doorId) => {
                const door = mapDisplayDoorList.find((d) => d.code === doorId);
                if (door) {
                    updateMapDisplayDoor(doorId, {
                        coordinate: {
                            ...door.coordinate,
                            labelFontSize: value,
                        },
                    });
                }
            });
        }
    };

    // 라벨 배경색 변경 핸들러
    const handleLabelBackgroundColorChange = (color) => {
        setEditableProps((prev) => ({
            ...prev,
            labelBackgroundColor: color,
        }));

        // 모든 선택된 문에 적용
        if (selectedDoorCodeList.length > 0) {
            selectedDoorCodeList.forEach((doorId) => {
                const door = mapDisplayDoorList.find((d) => d.code === doorId);
                if (door) {
                    updateMapDisplayDoor(doorId, {
                        coordinate: {
                            ...door.coordinate,
                            labelBackgroundColor: color,
                        },
                    });
                }
            });
        }
    };

    // 라벨 배경 토글 변경 핸들러
    const handleLabelBackgroundToggleChange = (value) => {
        setEditableProps((prev) => ({
            ...prev,
            labelBackgroundToggle: value,
        }));

        // 모든 선택된 문에 적용
        if (selectedDoorCodeList.length > 0) {
            selectedDoorCodeList.forEach((doorId) => {
                const door = mapDisplayDoorList.find((d) => d.code === doorId);
                if (door) {
                    updateMapDisplayDoor(doorId, { coordinate: { ...door.coordinate, labelBackgroundToggle: value } });
                }
            });
        }
    };

    // 라벨 텍스트 색상 변경 핸들러
    const handleLabelTextColorChange = (color) => {
        setEditableProps((prev) => ({
            ...prev,
            labelTextColor: color,
        }));

        // 모든 선택된 문에 적용
        if (selectedDoorCodeList.length > 0) {
            selectedDoorCodeList.forEach((doorId) => {
                const door = mapDisplayDoorList.find((d) => d.code === doorId);
                if (door) {
                    updateMapDisplayDoor(doorId, {
                        coordinate: {
                            ...door.coordinate,
                            labelTextColor: color,
                        },
                    });
                }
            });
        }
    };

    // 경보음 미리듣기 핸들러
    const handlePreviewAlarm = () => {
        if (!selectedAlarmSound) {
            return;
        }

        // 이미 재생 중이면 정지
        if (isPlayingPreview && audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlayingPreview(false);
            return;
        }

        // 새로운 Audio 객체 생성 또는 기존 객체 재사용
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }
        // 한글 파일명을 위해 인코딩
        const encodedFileName = encodeURIComponent(selectedAlarmSound);

        // 백엔드 API를 통해 파일 스트리밍
        const soundPath = `${process.env.PUBLIC_URL}/front_resource/DM-Audio/${encodedFileName}`;

        audioRef.current.src = soundPath;

        // 재생 완료 이벤트
        audioRef.current.onended = () => {
            setIsPlayingPreview(false);
        };

        // 재생 시작
        audioRef.current
            .play()
            .then(() => {
                setIsPlayingPreview(true);
            })
            .catch((err) => {
                console.error("경보음 재생 실패:", err);
                alert("경보음 재생에 실패했습니다. 파일을 찾을 수 없거나 서버에 문제가 있습니다.");
                setIsPlayingPreview(false);
            });
    };

    // ============================= 유틸 함수 =============================
    // 경보음 표시 로직 - 개별 경보음 우선, 글로벌 경보음 사용
    const getDisplayAlarmSound = () => {
        const individualAlarmSound = editableProps.alarmSound;

        return {
            alarmSound: individualAlarmSound || globalAlarmSound || null,
            isUsingGlobal: !individualAlarmSound && globalAlarmSound,
            hasIndividualAlarmSound: !!individualAlarmSound,
        };
    };

    return (
        <div
            className={`${collapsed ? "w-10" : "w-[400px]"} ${
                collapsed ? "" : "border border-[var(--kendo-color-border)]"
            } flex flex-col h-full ${collapsed ? "" : "bg-[var(--kendo-color-app-surface)]"} overflow-hidden`}
        >
            {collapsed ? (
                <div className="flex items-start justify-center pt-4">
                    <div
                        onClick={toggleCollapse}
                        className="w-7 h-7 rounded-md bg-[var(--kendo-color-surface)] border border-[var(--kendo-color-border)] hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer transition-colors"
                    >
                        <ChevronLeft size={14} />
                    </div>
                </div>
            ) : (
                <>
                    <div className="bg-[var(--kendo-color-surface)] px-4 py-3 flex justify-between items-center flex-shrink-0">
                        <div className=" flex items-center gap-2">
                            <div className="flex items-center mr-2">
                                <div className="w-2 h-2 bg-[var(--kendo-color-primary)] mr-2"></div>
                                <h3 className="text-base font-semibold text-lg">{messages.propertiesPanel.title}</h3>
                            </div>
                            {selectedDoorCodeList.length > 0 && (
                                <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">
                                    {selectedDoorCodeList.length} {messages.propertiesPanel.selectedCount}
                                </span>
                            )}
                        </div>
                        <div
                            onClick={toggleCollapse}
                            className="w-7 h-7 rounded-md hover:bg-gray-200 text-gray-500 cursor-pointer transition-colors flex items-center justify-center"
                        >
                            <ChevronRight size={14} />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 ">
                        {selectedDoorCodeList.length === 0 ? (
                            <div className="text-center py-8">
                                <p>{messages.propertiesPanel.noSelected}</p>
                            </div>
                        ) : isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <Loader size="medium" type="converging-spinner" />
                                <span>
                                    {isAutoSaving ? messages.propertiesPanel.saving : messages.propertiesPanel.loading}
                                </span>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* 문 이름 표시 */}
                                <div className="text-base font-medium pb-3 border-b flex justify-between items-center">
                                    <span>
                                        {selectedDoorCodeList.length === 1
                                            ? selectedDoor?.name || `ID: ${selectedDoor?.id}`
                                            : `${selectedDoorCodeList.length} ${messages.propertiesPanel.selectedCount}`}
                                    </span>
                                </div>

                                {/* 이름 변경 */}
                                {selectedDoorCodeList.length === 1 && (
                                    <div className="p-4 rounded-lg border flex flex-col gap-4">
                                        <div className="flex flex-col">
                                            <div className="text-sm font-medium flex items-center gap-1.5 mb-3">
                                                <Square size={16} /> {messages.propertiesPanel.name}
                                            </div>
                                            <Input value={tempName} onChange={handleNameChange} />
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="text-sm font-medium flex items-center gap-1.5 mb-3">
                                                <Square size={16} /> {messages.propertiesPanel.subName}
                                            </div>
                                            <Input value={tempSubName} onChange={handleSubNameChange} />
                                        </div>
                                    </div>
                                )}

                                {/* 문 타입 선택 - 새로 추가 */}
                                <div className="p-4 rounded-lg border">
                                    <div className="text-sm font-medium flex items-center gap-1.5 mb-3">
                                        <Square size={16} /> {messages.propertiesPanel.type}
                                    </div>
                                    <DropDownList
                                        data={doorTypeList || []}
                                        textField="name"
                                        dataItemKey="code"
                                        value={
                                            doorTypeList?.find((type) => type.code === editableProps.type_code) || null
                                        }
                                        onChange={handleTypeChange}
                                        placeholder={messages.propertiesPanel.typeSelect}
                                    />
                                </div>

                                {/* 도형 모양 */}
                                <div className="p-4 rounded-lg border">
                                    <div className="text-sm font-medium flex items-center gap-1.5 mb-3">
                                        <Square size={16} /> {messages.propertiesPanel.shape}
                                    </div>

                                    <div className="space-y-4">
                                        {/* 도형 모양 선택 - 버튼 그룹으로 변경 */}
                                        <div>
                                            <label className="block text-sm mb-2">
                                                {messages.propertiesPanel.doorShape}
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {SHAPES.map((shape) => (
                                                    <div
                                                        key={shape.value}
                                                        onClick={() => handleShapeChange(shape.value)}
                                                        className={`
                                                        flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all border border-[var(--kendo-color-border)]
                                                        ${
                                                            editableProps.shape === shape.value
                                                                ? "bg-[var(--kendo-color-primary-subtle)] border-2 border-[var(--kendo-color-primary)] shadow-sm"
                                                                : "hover:border-[var(--kendo-color-primary)] hover:bg-[var(--kendo-color-primary-subtle)]"
                                                        }
                                                    `}
                                                    >
                                                        <div
                                                            className={`
                                                            flex items-center justify-center w-10 h-10 rounded-full mb-2
                                                            ${
                                                                editableProps.shape === shape.value
                                                                    ? "bg-[var(--kendo-color-primary-emphasis)]"
                                                                    : "bg-[var(--kendo-color-secondary-emphasis)]"
                                                            }
                                                        `}
                                                        >
                                                            {createElement(shape.icon, {
                                                                size: 24,
                                                                className:
                                                                    editableProps.shape === shape.value
                                                                        ? "text-[var(--kendo-color-primary)]"
                                                                        : "text-[var(--kendo-color-secondary)]",
                                                            })}
                                                        </div>
                                                        <span
                                                            className={`text-sm ${
                                                                editableProps.shape === shape.value
                                                                    ? "font-medium"
                                                                    : "text-gray-600"
                                                            }`}
                                                        >
                                                            {shape.text}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 지역 선택 */}
                                <div className="p-4 rounded-lg border">
                                    <div className="text-sm font-medium flex items-center gap-1.5 mb-3">
                                        <MapPin size={16} /> {messages.propertiesPanel.area}
                                    </div>

                                    <MultiSelect
                                        data={areaList || []}
                                        textField="name"
                                        dataItemKey="code"
                                        value={
                                            areaList?.filter((area) => editableProps.area?.includes(area.code)) || []
                                        }
                                        onChange={handleAreaChange}
                                        placeholder={messages.propertiesPanel.areaSelect}
                                    />
                                </div>

                                {/* 연결 경보 설정 섹션 */}
                                <div className="p-4 rounded-lg border">
                                    <div className="text-sm font-medium flex items-center gap-1.5 mb-3">
                                        <AlertTriangle size={16} /> {messages.propertiesPanel.connectedAlarm}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm">
                                                {selectedDoorCodeList.length > 1
                                                    ? messages.propertiesPanel.connectedAlarmInfo
                                                    : editableProps.alerts
                                                    ? messages.propertiesPanel.connectedAlarmInfoText
                                                    : messages.propertiesPanel.noConnectedAlarm}
                                            </div>
                                            <Button
                                                size="sm"
                                                look="flat"
                                                fillMode="solid"
                                                onClick={() => setShowAlertManager(true)}
                                            >
                                                {messages.propertiesPanel.alertManager}
                                            </Button>
                                        </div>

                                        {/* 경보 목록 표시 */}
                                        {editableProps.alerts && (
                                            <div className="max-h-40 overflow-y-auto rounded border">
                                                <div className="divide-y">
                                                    {(() => {
                                                        const alertInfo = alertList?.find(
                                                            (a) => a.code === editableProps.alerts
                                                        );

                                                        return (
                                                            <div
                                                                key={editableProps.alerts}
                                                                className="p-2 flex items-center justify-between"
                                                                style={{
                                                                    border: "1px solid var(--kendo-color-border)",
                                                                }}
                                                            >
                                                                <div>
                                                                    {/* 첫 줄: 원 + 이름/ID + 장치명(배지) */}
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
                                                                        <span className="font-medium text-xs">
                                                                            {alertInfo?.code}{" "}
                                                                            <span className="mx-1.5">·</span>{" "}
                                                                            {alertInfo?.name}
                                                                        </span>
                                                                    </div>
                                                                    {/* 둘째 줄: event_desc */}
                                                                    <div className="flex items-center gap-2">
                                                                        {alertInfo?.dev_desc && (
                                                                            <span className="bg-[var(--kendo-color-surface)] text-[var(--kendo-color-primary)] rounded px-2 py-0.5 text-[10px] ml-1">
                                                                                {alertInfo.dev_desc}
                                                                            </span>
                                                                        )}
                                                                        {alertInfo?.event_desc && (
                                                                            <div className="text-xs text-[var(--kendo-color-info)]">
                                                                                {alertInfo.event_desc}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 색상 설정 섹션 */}
                                <div className="p-4 rounded-lg border">
                                    <div className="text-sm font-medium flex items-center gap-1.5 mb-3">
                                        <Palette size={16} /> {messages.propertiesPanel.colorSetting}
                                    </div>

                                    <div className="space-y-3">
                                        {/* 기본 색상 */}
                                        <ColorSettingItem
                                            title={messages.propertiesPanel.base}
                                            colorType="color"
                                            presetColors={DEFAULT_COLORS}
                                            colorPickerType="base"
                                            editableProps={editableProps}
                                            globalGrapicItemColor={globalGrapicItemColor}
                                            handleColorChange={handleColorChange}
                                            handleOpenColorPicker={handleOpenColorPicker}
                                            handleResetToGlobalColor={handleResetToGlobalColor}
                                            messages={messages}
                                            useGlobalColor={true}
                                        />

                                        {/* 경보 색상 */}
                                        <ColorSettingItem
                                            title={messages.propertiesPanel.alert}
                                            colorType="alertFill"
                                            presetColors={ALERT_COLORS}
                                            colorPickerType="alert"
                                            editableProps={editableProps}
                                            globalGrapicItemColor={globalGrapicItemColor}
                                            handleColorChange={handleColorChange}
                                            handleOpenColorPicker={handleOpenColorPicker}
                                            handleResetToGlobalColor={handleResetToGlobalColor}
                                            messages={messages}
                                            useGlobalColor={true}
                                        />

                                        {/* 인지 색상 */}
                                        <ColorSettingItem
                                            title={messages.propertiesPanel.checked}
                                            colorType="checkedFill"
                                            presetColors={CHECKED_COLORS}
                                            colorPickerType="checked"
                                            editableProps={editableProps}
                                            globalGrapicItemColor={globalGrapicItemColor}
                                            handleColorChange={handleColorChange}
                                            handleOpenColorPicker={handleOpenColorPicker}
                                            handleResetToGlobalColor={handleResetToGlobalColor}
                                            messages={messages}
                                            useGlobalColor={true}
                                        />

                                        {/* 자동 인지 색상 */}
                                        <ColorSettingItem
                                            title={messages.propertiesPanel.autoChecked}
                                            colorType="autoCheckedFill"
                                            presetColors={AUTO_CHECKED_COLORS}
                                            colorPickerType="autoChecked"
                                            editableProps={editableProps}
                                            globalGrapicItemColor={globalGrapicItemColor}
                                            handleColorChange={handleColorChange}
                                            handleOpenColorPicker={handleOpenColorPicker}
                                            handleResetToGlobalColor={handleResetToGlobalColor}
                                            messages={messages}
                                            useGlobalColor={true}
                                        />
                                    </div>
                                </div>

                                {/* 이벤트 상태 설정 */}
                                <div className="p-4 rounded-lg border">
                                    <div className="text-sm font-medium flex items-center gap-1.5 mb-3">
                                        <AlertTriangle size={16} /> {messages.propertiesPanel.eventStatus}
                                    </div>

                                    <div className="space-y-4">
                                        {/* 이벤트 상태 반전 설정 */}
                                        <div>
                                            <label className="block text-sm mb-2">
                                                {messages.propertiesPanel.eventStatusReverse}
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div
                                                    onClick={() => handleEventReverseChange(0)}
                                                    className={`
                                                    flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all border border-[var(--kendo-color-border)]
                                                    ${
                                                        editableProps.event_status_reverse === 0
                                                            ? "bg-[var(--kendo-color-primary-subtle)] border-2 border-[var(--kendo-color-primary)] shadow-sm"
                                                            : "hover:border-[var(--kendo-color-primary)] hover:bg-[var(--kendo-color-primary-subtle)]"
                                                    }
                                                `}
                                                >
                                                    <span
                                                        className={`text-sm font-medium ${
                                                            editableProps.event_status_reverse === 0
                                                                ? "text-[var(--kendo-color-primary)]"
                                                                : "text-gray-600"
                                                        }`}
                                                    >
                                                        {messages.propertiesPanel.eventStatusReverseNormal}
                                                    </span>
                                                </div>
                                                <div
                                                    onClick={() => handleEventReverseChange(1)}
                                                    className={`
                                                    flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all border border-[var(--kendo-color-border)]
                                                    ${
                                                        editableProps.event_status_reverse === 1
                                                            ? "bg-[var(--kendo-color-primary-subtle)] border-2 border-[var(--kendo-color-primary)] shadow-sm"
                                                            : "hover:border-[var(--kendo-color-primary)] hover:bg-[var(--kendo-color-primary-subtle)]"
                                                    }
                                                `}
                                                >
                                                    <span
                                                        className={`text-sm font-medium ${
                                                            editableProps.event_status_reverse === 1
                                                                ? "text-[var(--kendo-color-primary)]"
                                                                : "text-gray-600"
                                                        }`}
                                                    >
                                                        {messages.propertiesPanel.reverse}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500">
                                                {messages.propertiesPanel.eventStatusReverseInfo}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 라벨 설정 섹션 */}
                                <div className="p-4 rounded-lg border">
                                    <div className="text-sm font-medium flex items-center gap-1.5 mb-3">
                                        <Tag size={16} /> {messages.propertiesPanel.labelConfig}
                                    </div>

                                    <div className="space-y-4">
                                        {/* 라벨 위치 선택 */}
                                        <div>
                                            <label className="block text-sm mb-2">{messages.propertiesPanel.labelPosition}</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { value: "top", text: "위" },
                                                    { value: "center", text: "중앙" },
                                                    { value: "bottom", text: "아래" },
                                                    { value: "left", text: "왼쪽" },
                                                    { value: "right", text: "오른쪽" },
                                                ].map((position) => (
                                                    <div
                                                        key={position.value}
                                                        onClick={() => handleLabelPositionChange(position.value)}
                                                        className={`
                                                        flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all border border-[var(--kendo-color-border)]
                                                        ${
                                                            editableProps.labelPosition === position.value
                                                                ? "bg-[var(--kendo-color-primary-subtle)] border-2 border-[var(--kendo-color-primary)] shadow-sm"
                                                                : "hover:border-[var(--kendo-color-primary)] hover:bg-[var(--kendo-color-primary-subtle)]"
                                                        }
                                                    `}
                                                    >
                                                        <span
                                                            className={`text-sm font-medium ${
                                                                editableProps.labelPosition === position.value
                                                                    ? "text-[var(--kendo-color-primary)]"
                                                                    : "text-gray-600"
                                                            }`}
                                                        >
                                                            {position.text}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 라벨 폰트 크기 */}
                                        <div>
                                            <label className="block text-sm mb-2">{messages.propertiesPanel.labelFontSize}</label>
                                            <NumericTextBox
                                                value={editableProps.labelFontSize}
                                                onChange={(e) => handleLabelFontSizeChange(e.value)}
                                                step={1}
                                                format="n0"
                                                className="w-full"
                                            />
                                        </div>

                                        {/* 라벨 배경 토글 */}
                                        <div>
                                            <label className="block text-sm mb-2">{messages.propertiesPanel.labelBackgroundToggle}</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { value: true, text: messages.propertiesPanel.labelBackgroundShow },
                                                    { value: false, text: messages.propertiesPanel.labelBackgroundHide },
                                                ].map((toggle) => (
                                                    <div
                                                        key={toggle.value ? "show" : "hide"}
                                                        onClick={() => handleLabelBackgroundToggleChange(toggle.value)}
                                                        className={`
                                                        flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all border border-[var(--kendo-color-border)]
                                                        ${
                                                            editableProps.labelBackgroundToggle === toggle.value
                                                                ? "bg-[var(--kendo-color-primary-subtle)] border-2 border-[var(--kendo-color-primary)] shadow-sm"
                                                                : "hover:border-[var(--kendo-color-primary)] hover:bg-[var(--kendo-color-primary-subtle)]"
                                                        }
                                                    `}
                                                    >
                                                        <span
                                                            className={`text-sm font-medium ${
                                                                editableProps.labelBackgroundToggle === toggle.value
                                                                    ? "text-[var(--kendo-color-primary)]"
                                                                    : "text-gray-600"
                                                            }`}
                                                        >
                                                            {toggle.text}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 라벨 배경색 */}
                                        <ColorSettingItem
                                            title="배경색"
                                            colorType="labelBackgroundColor"
                                            presetColors={LABEL_BACKGROUND_COLORS}
                                            colorPickerType="labelBackground"
                                            editableProps={editableProps}
                                            handleColorChange={(color) => handleLabelBackgroundColorChange(color)}
                                            handleOpenColorPicker={handleOpenColorPicker}
                                            messages={messages}
                                        />

                                        {/* 라벨 텍스트 색상 */}
                                        <ColorSettingItem
                                            title="텍스트 색상"
                                            colorType="labelTextColor"
                                            presetColors={LABEL_TEXT_COLORS}
                                            colorPickerType="labelText"
                                            editableProps={editableProps}
                                            handleColorChange={(color) => handleLabelTextColorChange(color)}
                                            handleOpenColorPicker={handleOpenColorPicker}
                                            messages={messages}
                                        />
                                    </div>
                                </div>

                                {/* 경보음 설정 섹션 */}
                                <div className="p-4 rounded-lg border">
                                    <div className="text-sm font-medium flex items-center gap-1.5 mb-3">
                                        <Volume2 size={16} /> {messages.propertiesPanel.alarmSound}
                                    </div>

                                    <div className="space-y-4">
                                        {/* 경보음 선택 */}
                                        <div>
                                            <label className="block text-sm mb-2">
                                                {messages.propertiesPanel.alarmSelect}
                                            </label>
                                            <div className="flex gap-2">
                                                <DropDownList
                                                    data={alarmSounds}
                                                    value={selectedAlarmSound}
                                                    onChange={handleAlarmSoundChange}
                                                    className="flex-1"
                                                    placeholder={messages.propertiesPanel.alarmSelect}
                                                />
                                                <Button
                                                    svgIcon={isPlayingPreview ? pauseIcon : playIcon}
                                                    look="flat"
                                                    onClick={handlePreviewAlarm}
                                                    title={messages.propertiesPanel.alarmSoundPreview}
                                                />
                                            </div>

                                            {/* 글로벌 경보음 사용 표시 */}
                                            {getDisplayAlarmSound().isUsingGlobal && (
                                                <div className="mt-2 text-xs text-[var(--kendo-color-primary)] flex items-center gap-1">
                                                    <span>{messages.propertiesPanel.globalAlarmSound}</span>
                                                </div>
                                            )}

                                            {/* 개별 경보음이 있을 때 글로벌로 되돌리기 버튼 */}
                                            {getDisplayAlarmSound().hasIndividualAlarmSound && (
                                                <div className="mt-2">
                                                    <Button
                                                        look="flat"
                                                        fillMode="outline"
                                                        size="sm"
                                                        onClick={handleResetToGlobalAlarmSound}
                                                        className="text-xs"
                                                    >
                                                        {messages.propertiesPanel.globalAlarmSoundReset}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 다중 선택 시 안내 메시지 */}
                                {selectedDoorCodeList.length > 1 && (
                                    <div className="p-2 bg-[var(--kendo-color-surface)] border border-[var(--kendo-color-border)] rounded-md flex items-center gap-2 text-sm">
                                        <AlertTriangle size={16} className="text-[var(--kendo-color-primary)]" />
                                        <span>{messages.propertiesPanel.allApply}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {selectedDoor && (
                        <div
                            className="p-4 flex justify-end"
                            style={{ borderTop: "1px solid var(--kendo-color-border)" }}
                        >
                            <Button
                                themeColor="error"
                                svgIcon={trashIcon}
                                disabled={selectedDoor.childs && selectedDoor.childs.length > 0}
                                onClick={handleDelete}
                            >
                                {messages.propertiesPanel.delete}
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* 경보 관리 다이얼로그 */}
            <AlertManagerDialog
                isOpen={showAlertManager}
                selectedDoor={selectedDoor}
                initialAlerts={selectedAlerts}
                onApply={handleApplyAlerts}
                onCancel={() => setShowAlertManager(false)}
            />

            {/* 색상 선택 다이얼로그 */}
            <ColorPickerDialog
                isOpen={showColorPicker}
                color={tempColor}
                onConfirm={(selectedColor) => handleColorConfirm(selectedColor)}
                onCancel={() => setShowColorPicker(false)}
                onColorChange={(newColor) => setTempColor(newColor)}
            />
        </div>
    );
};

// Custom comparison function for React.memo
const areEqual = (prevProps, nextProps) => {
    // PropertiesPanel은 props가 없으므로 항상 같다고 판단
    return true;
};

export default memo(PropertiesPanel, areEqual);
