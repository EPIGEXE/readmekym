import { Button } from "@progress/kendo-react-buttons";
import { ColorPicker } from "@progress/kendo-react-inputs";
import { Checkbox } from "@progress/kendo-react-inputs";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import { Dialog } from "@progress/kendo-react-dialogs";
import { useState, useCallback, useMemo, useEffect } from "react";
import useDoorMonitoringStore from "../../../../store/doorMonitoringStoreIndex";
import { useBatchUpdateDoor, useDoorList } from "../../../../hooks/reactQueryHooks/useDoorListApi";
import useDoorMonitoringGlobalStore from "../../../../store/doorMonitoringGlobalStore";
import { useAlertAudioList } from "../../../../hooks/reactQueryHooks/useAlertAudioApi";
import { useAlertList } from "../../../../hooks/reactQueryHooks/useAlertApi";
import { useAreaList } from "../../../../hooks/reactQueryHooks/useSetupApi";
import SearchInput from "./SearchInput";
import DoorPropertyGrid from "./DoorPropertyGrid";

/**
 * 문 속성 설정 컴포넌트
 *
 * 문 속성을 일괄 편집할 수 있는 그리드 컴포넌트
 */
const DoorPropertySettings = ({ messages }) => {
    // ============================= 전역 상태 =============================
    // 전역 속성
    const { areaList } = useDoorMonitoringGlobalStore((state) => state.dmConfig); // 지역 목록

    // 문 모니터링 속성
    const doorTypeList = useDoorMonitoringStore((state) => state.doorTypeList); // 문 타입 목록

    // ============================= 개별 변수 =============================
    const areaValue = areaList?.map((area) => area.value); // 지역 목록 속성 쿼리 훅에서 호출용

    // ============================= 쿼리 훅 =============================
    // Get
    const { data: doorList, isLoading: isDoorListLoading, refetch: refetchDoorList } = useDoorList(areaValue); // 문 목록
    const { data: areaApiList } = useAreaList(); // 지역 목록
    const { data: alarmSounds = [] } = useAlertAudioList(); // 알람음 목록
    const { data: alertList } = useAlertList(); // 경보 목록

    //Put
    const batchUpdateDoor = useBatchUpdateDoor(); // 문 일괄 업데이트 훅

    // ============================= 상태 관리 =============================
    const [debouncedSearchValue, setDebouncedSearchValue] = useState(""); // 디바운스된 검색값
    const [filterColumns, setFilterColumns] = useState([]); // 검색 필터 컬럼
    const [showFilterDialog, setShowFilterDialog] = useState(false); // 필터 다이얼로그

    const [selectedDoors, setSelectedDoors] = useState(new Set()); // 선택된 문 목록
    const [isMultiEditing, setIsMultiEditing] = useState(false); // 다중 편집 상태
    const [multiEditValues, setMultiEditValues] = useState({
        // 다중 편집 값
        type_code: null,
        fill: null,
        alertFill: null,
        checkedFill: null,
        autoCheckedFill: null,
        alarmSound: null,
        area_code_list: null,
    });

    const [skip, setSkip] = useState(0); // 그리드 스크롤 위치
    const take = 30; // 그리드 페이지 크기

    // ============================= 개별 변수 =============================
    const memoizedDoorList = useMemo(() => {
        return doorList ? [...doorList] : []; // 메모이제이션된 문 목록
    }, [doorList]);

    // 검색 가능한 컬럼 정의
    const searchColumns = [
        { field: "name", title: messages.settingsPanel.doorProperty.doorName },
        { field: "type_code", title: messages.settingsPanel.doorProperty.doorType },
        { field: "coordinate.fill", title: messages.settingsPanel.doorProperty.defaultColor },
        { field: "coordinate.alertFill", title: messages.settingsPanel.doorProperty.alertColor },
        { field: "coordinate.checkedFill", title: messages.settingsPanel.doorProperty.checkedColor },
        { field: "coordinate.autoCheckedFill", title: messages.settingsPanel.doorProperty.autoCheckedColor },
        { field: "coordinate.alarmSound", title: messages.settingsPanel.doorProperty.alarmSound },
        { field: "area_code_list", title: messages.settingsPanel.doorProperty.area },
        { field: "event_code", title: messages.settingsPanel.doorProperty.connectedAlarm },
    ];

    // 필터링된 데이터 (디바운스된 검색값 사용)
    const filteredDoorList = useMemo(() => {
        if (!debouncedSearchValue.trim()) {
            return memoizedDoorList;
        }

        const searchLower = debouncedSearchValue.toLowerCase();
        return memoizedDoorList.filter((door) => {
            // 문 타입 - 화면에 표시되는 이름으로 검색
            const doorType = doorTypeList?.find((type) => type.code === door.type_code);
            const typeDisplayName = doorType
                ? doorType.name
                : door.type_code || messages.settingsPanel.doorProperty.notSet;

            // 지역 - 화면에 표시되는 이름으로 검색
            const areaDisplayNames =
                door.area_code_list?.map((code) => {
                    const areaInfo = areaApiList?.find((area) => area.code === code);
                    return areaInfo ? areaInfo.name : code;
                }) || [];

            // 연결 경보 - 화면에 표시되는 이름으로 검색
            const acsEventDisplayName =
                door.event_code && alertList?.find((alert) => alert.code === door.event_code)
                    ? `${door.event_code} (${alertList?.find((alert) => alert.code === door.event_code).name})`
                    : door.event_code || "";

            // 필터링된 컬럼이 선택된 경우 해당 컬럼에서만 검색
            if (filterColumns.length > 0) {
                return filterColumns.some((column) => {
                    switch (column) {
                        case "code":
                            return door.code?.toLowerCase().includes(searchLower);
                        case "name":
                            return door.name?.toLowerCase().includes(searchLower);
                        case "type_code":
                            return typeDisplayName.toLowerCase().includes(searchLower);
                        case "coordinate.fill":
                            return door.coordinate?.fill?.toLowerCase().includes(searchLower);
                        case "coordinate.alertFill":
                            return door.coordinate?.alertFill?.toLowerCase().includes(searchLower);
                        case "coordinate.checkedFill":
                            return door.coordinate?.checkedFill?.toLowerCase().includes(searchLower);
                        case "coordinate.autoCheckedFill":
                            return door.coordinate?.autoCheckedFill?.toLowerCase().includes(searchLower);
                        case "coordinate.alarmSound":
                            return door.coordinate?.alarmSound?.toLowerCase().includes(searchLower);
                        case "area_code_list":
                            return (
                                areaDisplayNames &&
                                areaDisplayNames.some((name) => name.toLowerCase().includes(searchLower))
                            );
                        case "event_code":
                            return acsEventDisplayName.toLowerCase().includes(searchLower);
                        default:
                            return false;
                    }
                });
            } else {
                // 모든 컬럼에서 검색 (기본값)
                return (
                    door.name?.toLowerCase().includes(searchLower) ||
                    typeDisplayName.toLowerCase().includes(searchLower) ||
                    door.coordinate?.fill?.toLowerCase().includes(searchLower) ||
                    door.coordinate?.alertFill?.toLowerCase().includes(searchLower) ||
                    door.coordinate?.checkedFill?.toLowerCase().includes(searchLower) ||
                    door.coordinate?.autoCheckedFill?.toLowerCase().includes(searchLower) ||
                    door.coordinate?.alarmSound?.toLowerCase().includes(searchLower) ||
                    (areaDisplayNames && areaDisplayNames?.some((name) => name.toLowerCase().includes(searchLower))) ||
                    acsEventDisplayName.toLowerCase().includes(searchLower)
                );
            }
        });
    }, [memoizedDoorList, debouncedSearchValue, doorTypeList, areaApiList, alertList, filterColumns]);

    // 필터링된 데이터에서 선택된 항목들
    const selectedFilteredDoors = useMemo(() => {
        return filteredDoorList.filter((door) => selectedDoors.has(door.code));
    }, [filteredDoorList, selectedDoors]);

    // ============================= useEffect =============================
    // 다중 편집 상태 변경
    useEffect(() => {
        if (selectedDoors.size > 0) {
            setIsMultiEditing(true);
        } else {
            setIsMultiEditing(false);
        }
    }, [selectedDoors.size]);

    // ============================= 핸들러 =============================
    // 디바운스된 검색값 변경 핸들러
    const handleDebouncedSearchChange = useCallback((debouncedValue) => {
        setDebouncedSearchValue(debouncedValue);
        setSkip(0); // 검색 시 그리드를 맨 위로 이동
    }, []);

    // 필터 다이얼로그 열기
    const handleOpenFilterDialog = useCallback(() => {
        setShowFilterDialog(true);
    }, []);

    // 필터 다이얼로그 닫기
    const handleCloseFilterDialog = useCallback(() => {
        setShowFilterDialog(false);
    }, []);

    // 필터 컬럼 체크박스 변경
    const handleFilterColumnChange = useCallback((field, checked) => {
        if (checked) {
            setFilterColumns((prev) => [...prev, field]);
        } else {
            setFilterColumns((prev) => prev.filter((f) => f !== field));
        }
        setSkip(0); // 필터 변경 시 그리드를 맨 위로 이동
    }, []);

    // 필터 초기화
    const handleFilterReset = useCallback(() => {
        setFilterColumns([]);
        setShowFilterDialog(false);
        setSkip(0); // 필터 초기화 시 그리드를 맨 위로 이동
    }, []);

    // 다중 선택 관련 함수들
    const handleSelectDoor = useCallback((doorCode) => {
        setSelectedDoors((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(doorCode)) {
                newSet.delete(doorCode);
            } else {
                newSet.add(doorCode);
            }
            return newSet;
        });
    }, []);

    // 다중 편집 취소
    const handleMultiEditCancel = useCallback(() => {
        setIsMultiEditing(false);
        setMultiEditValues({
            type_code: null,
            fill: null,
            alertFill: null,
            checkedFill: null,
            autoCheckedFill: null,
            alarmSound: null,
            area_code_list: null,
        });
    }, []);

    // 다중 편집 저장
    const handleMultiEditSave = useCallback(() => {
        if (selectedDoors.size === 0) return;

        const batchRequests = [];

        selectedDoors.forEach((doorCode) => {
            const door = doorList.find((d) => d.code === doorCode);
            if (door) {
                const updateParams = { code: doorCode };

                // 빈 값이 아닌 경우에만 업데이트
                if (multiEditValues.name && multiEditValues.name.trim()) {
                    updateParams.name = multiEditValues.name;
                }

                // 문 타입 업데이트 - null이 아닌 경우에만
                if (multiEditValues.type_code !== null) {
                    updateParams.type_code = multiEditValues.type_code;
                }

                // 지역 정보 업데이트 - null이 아니고 길이가 0보다 큰 경우에만
                if (multiEditValues.area_code_list !== null && multiEditValues.area_code_list.length > 0) {
                    updateParams.area_code_list = multiEditValues.area_code_list;
                }

                // 좌표 정보 업데이트 - 기존 좌표와 병합
                const updatedCoordinate = {
                    ...door.coordinate,
                };

                // 각 좌표 필드가 null이 아닌 경우에만 업데이트
                if (multiEditValues.fill !== null) {
                    updatedCoordinate.fill = multiEditValues.fill;
                }
                if (multiEditValues.alertFill !== null) {
                    updatedCoordinate.alertFill = multiEditValues.alertFill;
                }
                if (multiEditValues.checkedFill !== null) {
                    updatedCoordinate.checkedFill = multiEditValues.checkedFill;
                }
                if (multiEditValues.autoCheckedFill !== null) {
                    updatedCoordinate.autoCheckedFill = multiEditValues.autoCheckedFill;
                }
                if (multiEditValues.shape !== null) {
                    updatedCoordinate.shape = multiEditValues.shape;
                }
                if (multiEditValues.alarmSound !== null) {
                    updatedCoordinate.alarmSound = multiEditValues.alarmSound;
                }

                updateParams.coordinate = JSON.stringify(updatedCoordinate);

                // 배치 요청에 추가
                batchRequests.push({
                    method: "U",
                    params: updateParams,
                });
            }
        });

        if (batchRequests.length > 0) {
            batchUpdateDoor.mutate(batchRequests, {
                onSuccess: () => {
                    refetchDoorList();
                },
            });
        }

        setIsMultiEditing(false);
        setSelectedDoors(new Set());
        setMultiEditValues({
            type_code: null,
            fill: null,
            alertFill: null,
            checkedFill: null,
            autoCheckedFill: null,
            alarmSound: null,
            area_code_list: null,
        });
    }, [selectedDoors, doorList, multiEditValues]);

    // 다중 편집 값 변경
    const handleMultiEditValueChange = useCallback((field, value) => {
        setMultiEditValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    // 색상 변경 핸들러
    const handleColorChange = useCallback(
        (field, event) => {
            const rgbaValue = event.target.value;
            // RGBA를 HEX로 변환하는 함수
            const rgbaToHex = (rgba) => {
                const rgbaMatch = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
                if (!rgbaMatch) return rgba;

                const r = parseInt(rgbaMatch[1]);
                const g = parseInt(rgbaMatch[2]);
                const b = parseInt(rgbaMatch[3]);

                const toHex = (n) => {
                    const hex = n.toString(16);
                    return hex.length === 1 ? "0" + hex : hex;
                };

                return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
            };

            const hexValue = rgbaToHex(rgbaValue);
            handleMultiEditValueChange(field, hexValue);
        },
        [handleMultiEditValueChange]
    );

    return (
        <div className="p-4 h-full bg-[var(--kendo-color-app-surface)] flex flex-col gap-4">
            {/* 검색 필터 */}
            <div className="flex items-center gap-2">
                <SearchInput
                    onDebouncedSearchChange={handleDebouncedSearchChange}
                    onFilterDialogOpen={handleOpenFilterDialog}
                    filterColumns={filterColumns}
                    filteredCount={filteredDoorList.length}
                    messages={messages}
                />
            </div>

            {/* 다중 편집 패널 */}
            <div className="border border-[var(--kendo-color-border)] rounded bg-[var(--kendo-color-surface)] p-3">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                            {messages.settingsPanel.doorProperty.doorBatchEdit} ({selectedDoors.size}{" "}
                            {messages.settingsPanel.doorProperty.selectedCount})
                        </span>
                        <div className="flex flex-wrap gap-1 max-w-md overflow-hidden">
                            {Array.from(selectedDoors)
                                .slice(0, 3)
                                .map((code) => {
                                    const door = doorList?.find((d) => d.code === code);
                                    return (
                                        <span
                                            key={code}
                                            className="px-2 py-1 bg-[var(--kendo-color-primary-subtle)] text-[var(--kendo-color-primary)] text-xs rounded"
                                        >
                                            {door?.name || code}
                                        </span>
                                    );
                                })}
                            {selectedDoors.size > 3 && (
                                <span className="px-2 py-1 bg-[var(--kendo-color-surface-alt)] text-[var(--kendo-color-subtle)] text-xs rounded">
                                    +{selectedDoors.size - 3} {messages.settingsPanel.doorProperty.more}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="small"
                            look="solid"
                            themeColor="primary"
                            onClick={handleMultiEditSave}
                            disabled={!isMultiEditing}
                        >
                            {messages.settingsPanel.doorProperty.apply}
                        </Button>
                        <Button size="small" look="outline" onClick={handleMultiEditCancel}>
                            {messages.settingsPanel.doorProperty.cancel}
                        </Button>
                    </div>
                </div>

                <div className="flex gap-4 items-end justify-end">
                    <div className="flex gap-2 items-end">
                        {/* 기본 설정 그룹 */}
                        <div className="flex gap-2 items-end border-r border-[var(--kendo-color-border)] pr-4">
                            <div>
                                <label className="text-xs mb-1 block">{messages.settingsPanel.doorProperty.type}</label>
                                <DropDownList
                                    size="small"
                                    style={{ width: "120px" }}
                                    data={doorTypeList || []}
                                    textField="name"
                                    dataItemKey="code"
                                    value={
                                        doorTypeList?.find((type) => type.code === multiEditValues.type_code) || null
                                    }
                                    onChange={(e) => handleMultiEditValueChange("type_code", e.value?.code || null)}
                                    placeholder={messages.settingsPanel.doorProperty.select}
                                />
                            </div>
                        </div>

                        <div className="w-[90px]"></div>

                        {/* 색상 그룹 */}
                        <div className="flex gap-2 items-end border-r border-[var(--kendo-color-border)] pr-4">
                            <div>
                                <label className="text-xs mb-1 block">
                                    {messages.settingsPanel.doorProperty.defaultColor}
                                </label>
                                <ColorPicker
                                    size="small"
                                    views={["gradient"]}
                                    value={multiEditValues.fill}
                                    onChange={(e) => handleColorChange("fill", e)}
                                />
                            </div>

                            <div>
                                <label className="text-xs mb-1 block">
                                    {messages.settingsPanel.doorProperty.alertColor}
                                </label>
                                <ColorPicker
                                    size="small"
                                    views={["gradient"]}
                                    value={multiEditValues.alertFill}
                                    onChange={(e) => handleColorChange("alertFill", e)}
                                />
                            </div>

                            <div>
                                <label className="text-xs mb-1 block">
                                    {messages.settingsPanel.doorProperty.checkedColor}
                                </label>
                                <ColorPicker
                                    size="small"
                                    views={["gradient"]}
                                    value={multiEditValues.checkedFill}
                                    onChange={(e) => handleColorChange("checkedFill", e)}
                                />
                            </div>

                            <div>
                                <label className="text-xs mb-1 block">
                                    {messages.settingsPanel.doorProperty.autoCheckedColor}
                                </label>
                                <ColorPicker
                                    size="small"
                                    views={["gradient"]}
                                    value={multiEditValues.autoCheckedFill}
                                    onChange={(e) => handleColorChange("autoCheckedFill", e)}
                                />
                            </div>
                        </div>

                        <div className="w-[70px]"></div>

                        {/* 미디어 & 위치 그룹 */}
                        <div className="flex gap-2 items-end flex-1">
                            <div>
                                <label className="text-xs mb-1 block">
                                    {messages.settingsPanel.doorProperty.alarmSound}
                                </label>
                                <DropDownList
                                    size="small"
                                    style={{ width: "120px" }}
                                    data={alarmSounds}
                                    value={multiEditValues.alarmSound}
                                    onChange={(e) => handleMultiEditValueChange("alarmSound", e.target.value)}
                                    placeholder={messages.settingsPanel.doorProperty.select}
                                />
                            </div>

                            <div className="flex-1">
                                <label className="text-xs mb-1 block">{messages.settingsPanel.doorProperty.area}</label>
                                <MultiSelect
                                    size="small"
                                    style={{ width: "120px" }}
                                    data={areaApiList || []}
                                    textField="name"
                                    dataItemKey="code"
                                    value={
                                        areaApiList?.filter((area) =>
                                            multiEditValues.area_code_list?.includes(area.code)
                                        ) || []
                                    }
                                    onChange={(e) =>
                                        handleMultiEditValueChange(
                                            "area_code_list",
                                            e.value.map((area) => area.code)
                                        )
                                    }
                                    placeholder={messages.settingsPanel.doorProperty.areaSelect}
                                />
                            </div>
                            <div className="w-[150px]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 그리드 */}
            <DoorPropertyGrid
                filteredDoorList={filteredDoorList}
                selectedFilteredDoors={selectedFilteredDoors}
                selectedDoors={selectedDoors}
                setSelectedDoors={setSelectedDoors}
                handleSelectDoor={handleSelectDoor}
                isDoorListLoading={isDoorListLoading}
                messages={messages}
                doorTypeList={doorTypeList}
                areaApiList={areaApiList}
                alertList={alertList}
                skip={skip}
                setSkip={setSkip}
                take={take}
            />

            {/* 필터 다이얼로그 */}
            {showFilterDialog && (
                <Dialog title="검색 필터 설정" onClose={handleCloseFilterDialog} width={400} height={550}>
                    <div className="flex flex-col h-full">
                        <div className="flex-1 p-4">
                            <div className="mb-3 text-sm">
                                검색할 열을 선택하세요. 선택하지 않으면 모든 열에서 검색합니다.
                            </div>
                            <div className="space-y-2">
                                {searchColumns.map((column) => (
                                    <label key={column.field} className="flex items-center gap-2">
                                        <Checkbox
                                            checked={filterColumns.includes(column.field)}
                                            onChange={(e) => handleFilterColumnChange(column.field, e.value)}
                                        />
                                        <span className="text-sm">{column.title}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 p-4 border-t">
                            <Button look="outline" onClick={handleFilterReset}>
                                초기화
                            </Button>
                            <Button themeColor="primary" onClick={handleCloseFilterDialog}>
                                확인
                            </Button>
                        </div>
                    </div>
                </Dialog>
            )}
        </div>
    );
};

export default DoorPropertySettings;
