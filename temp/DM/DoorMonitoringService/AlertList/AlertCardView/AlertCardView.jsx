import { AlertCircle, CheckCircle, History, SortAsc, Filter } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import useDoorMonitoringStore from "../../../store/doorMonitoringStoreIndex";
import { ALERT_STATUS, ALERT_STATUS_CONFIG } from "../../../constants/dmConstants";
import { Button } from "@progress/kendo-react-buttons";
import { sortAscIcon } from "@progress/kendo-svg-icons";
import renderAlertItem from "./renderAlertitem";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../../transMessages";

/**
 * 출입통제 경보 카드 뷰 컴포넌트
 * @param {Object} alerts - 경보 리스트
 *
 * 출입통제 경보 리스트를 카드 뷰로 표시하는 컴포넌트
 */
const AlertCardView = ({ alerts }) => {
    // ======================= 전역 상태 =============================
    // 다국어 설정
    const globalConfig = useGlobalConfigStore((state) => state.globalConfig);
    const messages = getMessages(globalConfig?.languageId);

    // 문 모니터링 상태
    const connectedAlertCodeList = useDoorMonitoringStore((state) => state.connectedAlertCodeList); // 연결된 경보 코드 목록
    const activeViewAlertCodeList = useDoorMonitoringStore((state) => state.activeViewAlertCodeList); // 활성 뷰 경보 코드 목록
    const selectedDoorList = useDoorMonitoringStore((state) => state.selectedDoorList); // 선택된 문 목록

    // 문 모니터링 액션
    const applySelectedDoorWithAlertsById = useDoorMonitoringStore(
        (state) => state.actions.applySelectedDoorWithAlertsById
    ); // 선택된 문에 경보 적용
    const applyMapViewById = useDoorMonitoringStore((state) => state.actions.applyMapViewById); // 맵 뷰 적용
    const clearAlertFromActiveView = useDoorMonitoringStore((state) => state.actions.clearAlertFromActiveView); // 활성 뷰 경보 제거

    // ============================= 상태 관리 =============================
    const [searchTerm, setSearchTerm] = useState(""); // 검색어
    const [alertViewMode, setAlertViewMode] = useState("active"); // 'all' 또는 'active' 뷰 모드
    const [sortMode, setSortMode] = useState("status"); // 'status' 또는 'time' 정렬 모드
    const [showFilter, setShowFilter] = useState(false); // 필터 팝오버 표시 상태
    const [filterOptions, setFilterOptions] = useState({
        code: true,
        status: true,
        name: true,
        event_desc: true,
        product_name: true,
        panel_desc: true,
        dev_desc: true,
        connectedDoor: true,
        event_time: true
    }); // 필터 옵션 상태

    // ============================= Refs =============================
    const filterButtonRef = useRef(null); // 필터 버튼 ref
    const filterPopoverRef = useRef(null); // 필터 팝오버 ref

    // ============================= 핸들러 =============================
    // 완료된 경보 정리 핸들러
    const handleClearFinishedAlerts = () => {
        clearAlertFromActiveView();
    };

    // 선택된 문 클릭 이벤트 핸들러
    const handleDoorClick = (door) => {
        applySelectedDoorWithAlertsById([door.code]);
        applyMapViewById(door.parent_code);
    };

    // 필터 옵션 토글 핸들러
    const handleFilterToggle = (filterKey) => {
        setFilterOptions(prev => ({
            ...prev,
            [filterKey]: !prev[filterKey]
        }));
    };

    // 전체 선택/해제 핸들러
    const handleSelectAll = (selected) => {
        const newOptions = {};
        Object.keys(filterOptions).forEach(key => {
            newOptions[key] = selected;
        });
        setFilterOptions(newOptions);
    };

    // 필터 팝오버 토글 핸들러
    const handleFilterTogglePopover = () => {
        setShowFilter(prev => !prev);
    };

    // 외부 클릭시 팝오버 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showFilter &&
                filterButtonRef.current &&
                filterPopoverRef.current &&
                !filterButtonRef.current.contains(event.target) &&
                !filterPopoverRef.current.contains(event.target)) {
                setShowFilter(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showFilter]);

    // ============================= 유틸 함수 =============================
    // 날짜 포맷팅 함수 (renderAlertItem과 동일한 포맷 사용)
    const formatEventTime = (eventTime) => {
        if (!eventTime) return null;
        try {
            const date = new Date(eventTime);
            return date.toLocaleString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            });
        } catch (error) {
            return null;
        }
    };

    // 검색어에 따른 경보 필터링 함수
    const filterAlertsBySearchTerm = (alerts) => {
        if (!searchTerm?.trim()) return alerts;

        const lowercaseSearchTerm = searchTerm.toLowerCase().trim();
        return alerts.filter((alert) => {
            // 필터 옵션에 따라 검색 필드 결정
            const searchConditions = [];

            // 코드 검색
            if (filterOptions.code) {
                searchConditions.push(alert.code.toLowerCase().includes(lowercaseSearchTerm));
            }

            // 이름 검색
            if (filterOptions.name) {
                searchConditions.push(alert.name.toLowerCase().includes(lowercaseSearchTerm));
            }

            // 설명 검색
            if (filterOptions.event_desc) {
                searchConditions.push(alert.event_desc && alert.event_desc.toLowerCase().includes(lowercaseSearchTerm));
            }

            // 상태 검색
            if (filterOptions.status) {
                searchConditions.push((ALERT_STATUS_CONFIG[alert.status]?.label || "").toLowerCase().includes(lowercaseSearchTerm));
            }

            // 제품명 검색
            if (filterOptions.product_name) {
                searchConditions.push(alert.product_name.toLowerCase().includes(lowercaseSearchTerm));
            }

            // 패널명 검색
            if (filterOptions.panel_desc) {
                searchConditions.push(alert.panel_desc.toLowerCase().includes(lowercaseSearchTerm));
            }

            // 장비명 검색
            if (filterOptions.dev_desc) {
                searchConditions.push(alert.dev_desc.toLowerCase().includes(lowercaseSearchTerm));
            }

            // 연결된 문 검색
            if (filterOptions.connectedDoor) {
                searchConditions.push(
                    alert.connectedDoor?.some(
                        (door) => (door.name || "").toLowerCase().includes(lowercaseSearchTerm)
                    )
                );
            }

            // 발생 시간 검색 - 포맷팅된 날짜로 검색
            if (filterOptions.event_time) {
                const formattedTime = formatEventTime(alert.event_time);
                searchConditions.push(formattedTime && formattedTime.toLowerCase().includes(lowercaseSearchTerm));
            }

            // OR 조건으로 검색 (하나라도 true면 포함)
            return searchConditions.some(condition => condition);
        });
    };

    // 경보 필터링 및 정렬 로직
    const getFilteredAndSortedAlerts = () => {
        let filteredAlerts = filterAlertsBySearchTerm(alerts || []);

        // 뷰 모드에 따른 필터링
        if (alertViewMode === "active") {
            filteredAlerts = filteredAlerts.filter((alert) => {
                // 현재 활성이거나 한 번이라도 활성이었던 경보들
                return alert.status === ALERT_STATUS.ACTIVE || activeViewAlertCodeList?.includes(alert.code);
            });
        }

        // 정렬 모드에 따른 정렬
        if (sortMode === "time") {
            return [...filteredAlerts].sort((a, b) => new Date(b.event_time) - new Date(a.event_time));
        } else {
            // 상태별 정렬: 활성 > 종료 순서로 정렬
            return [...filteredAlerts].sort((a, b) => {
                const statusOrder = {
                    [ALERT_STATUS.ACTIVE]: 0,
                    [ALERT_STATUS.CLEARED]: 1,
                };
                const statusDiff = statusOrder[a.status] - statusOrder[b.status];
                if (statusDiff !== 0) return statusDiff;
                // 같은 상태 내에서는 최신순
                return new Date(b.event_time) - new Date(a.event_time);
            });
        }
    };

    // ============================= 개별 변수 =============================
    const processedAlerts = getFilteredAndSortedAlerts(); // 처리된 경보 목록
    const activeAlerts = processedAlerts.filter((alert) => alert.status === ALERT_STATUS.ACTIVE); // 활성 경보 목록
    const clearedAlerts = processedAlerts.filter((alert) => alert.status === ALERT_STATUS.CLEARED); // 종료 경보 목록

    // ============================= 렌더링 =============================
    const renderAlertWithInfo = (alert) => {
        const isConnectedToSelectedDoor = connectedAlertCodeList.includes(alert.code);
        const selectedDoor =
            selectedDoorList && selectedDoorList.length > 0 && alert.connectedDoor
                ? alert.connectedDoor.find((door) => door.code === selectedDoorList[0].code)
                : null;

        return renderAlertItem(alert, isConnectedToSelectedDoor, selectedDoor, handleDoorClick, messages);
    };

    // 필터 옵션 라벨 매핑
    const filterLabels = {
        code: messages.alertList.alertTableView?.code || "코드",
        name: messages.alertList.alertTableView?.name || "이름",
        event_desc: messages.alertList.alertTableView?.eventDesc || "이벤트 설명",
        status: messages.alertList.alertTableView?.status || "상태",
        product_name: messages.alertList.alertTableView?.productName || "제품명",
        panel_desc: messages.alertList.alertTableView?.panelDesc || "패널",
        dev_desc: messages.alertList.alertTableView?.devDesc || "장비",
        connectedDoor: messages.alertList.alertTableView?.connectedDoor || "연결된 문",
        event_time: "발생 시간"
    };

    // 활성화된 필터 개수 계산
    const activeFilterCount = Object.values(filterOptions).filter(Boolean).length;
    const totalFilterCount = Object.keys(filterOptions).length;

    return (
        <div className="flex flex-col h-full">
            {/* 검색 필드 */}
            <div className="px-4 py-2 flex-shrink-0">
                <div className="relative flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={messages.alertList.alertCardView.searchPlaceholder}
                            className="w-full pl-4 pr-4 py-2 text-sm border border-[var(--kendo-color-border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--kendo-color-primary)]"
                        />
                        {searchTerm && (
                            <div
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--kendo-color-primary-emphasis)] hover:text-[var(--kendo-color-primary)] cursor-pointer"
                            >
                                <span className="text-xs">✕</span>
                            </div>
                        )}
                    </div>

                    {/* 필터 버튼 및 팝오버 */}
                    <div
                        ref={filterButtonRef}
                        className="relative"
                    >
                        <div
                            onClick={handleFilterTogglePopover}
                            className={`relative px-3 py-2 text-sm border border-[var(--kendo-color-border)] rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                                showFilter
                                    ? "bg-[var(--kendo-color-primary-subtle)] border-[var(--kendo-color-primary)]"
                                    : "bg-[var(--kendo-color-surface)] hover:bg-[var(--kendo-color-surface-alt)]"
                            }`}
                        >
                            <Filter size={16} />
                            <span>필터</span>
                            {activeFilterCount < totalFilterCount && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[var(--kendo-color-primary)] text-white text-[10px] rounded-full flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                        </div>

                        {/* 필터 팝오버 */}
                        {showFilter && (
                            <div
                                ref={filterPopoverRef}
                                className="absolute right-0 top-full mt-1 w-64 bg-[var(--kendo-color-surface)] border border-[var(--kendo-color-border)] rounded-lg shadow-lg z-50"
                            >
                                <div className="p-3">
                                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-[var(--kendo-color-border)]">
                                        <span className="text-sm font-medium text-[var(--kendo-color-on-surface)]">검색 필터</span>
                                        <div className="flex gap-2">
                                            <div
                                                onClick={() => handleSelectAll(true)}
                                                className="text-xs text-[var(--kendo-color-primary)] hover:text-[var(--kendo-color-primary-hover)] cursor-pointer"
                                            >
                                                전체 선택
                                            </div>
                                            <div
                                                onClick={() => handleSelectAll(false)}
                                                className="text-xs text-[var(--kendo-color-subtle)] hover:text-[var(--kendo-color-on-surface)] cursor-pointer"
                                            >
                                                전체 해제
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {Object.entries(filterOptions).map(([key, value]) => (
                                            <label
                                                key={key}
                                                className="flex items-center gap-2 cursor-pointer hover:bg-[var(--kendo-color-base-hover)] p-1 rounded"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={value}
                                                    onChange={() => handleFilterToggle(key)}
                                                    className="w-4 h-4 accent-[var(--kendo-color-primary)] rounded"
                                                />
                                                <span className="text-sm text-[var(--kendo-color-on-surface)]">{filterLabels[key]}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 경보 뷰 모드 탭 */}
            <div className="border-b border-[var(--kendo-color-border)] flex text-sm flex-shrink-0">
                <div
                    onClick={() => setAlertViewMode("active")}
                    className={`flex-1 py-2 px-4 font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        alertViewMode === "active"
                            ? "border-b-2 border-[var(--kendo-color-primary)] bg-[var(--kendo-color-primary-subtle)] text-[var(--kendo-color-primary)]"
                            : "bg-[var(--kendo-color-secondary-subtle)] hover:bg-[var(--kendo-color-primary-subtle)] text-[var(--kendo-color-on-surface)]"
                    }`}
                >
                    <AlertCircle size={16} />
                    {messages.alertList.alertCardView.occurredAlerts} ({activeAlerts.length})
                </div>
                <div
                    onClick={() => setAlertViewMode("all")}
                    className={`flex-1 py-2 px-4 font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        alertViewMode === "all"
                            ? "border-b-2 border-[var(--kendo-color-primary)] bg-[var(--kendo-color-primary-subtle)] text-[var(--kendo-color-primary)]"
                            : "bg-[var(--kendo-color-secondary-subtle)] hover:bg-[var(--kendo-color-primary-subtle)] text-[var(--kendo-color-on-surface)]"
                    }`}
                >
                    <History size={16} />
                    {messages.alertList.alertCardView.allAlerts} ({(alerts || []).length})
                </div>
            </div>

            {/* 정렬 옵션 */}
            <div className="px-4 py-2 bg-[var(--kendo-color-surface-alt)] border-b border-[var(--kendo-color-border)] flex-shrink-0">
                <div className="flex items-center gap-2">
                    <SortAsc size={14} className="text-[var(--kendo-color-secondary)]" />
                    <span className="text-xs text-[var(--kendo-color-secondary)] mr-2">
                        {messages.alertList.alertCardView.sortBy}:
                    </span>
                    <div className="flex gap-1">
                        <Button
                            size="small"
                            look={sortMode === "status" ? "primary" : "outline"}
                            fillMode={sortMode === "status" ? "solid" : "flat"}
                            onClick={() => setSortMode("status")}
                            svgIcon={sortAscIcon}
                        >
                            {messages.alertList.alertCardView.status}
                        </Button>
                        <Button
                            onClick={() => setSortMode("time")}
                            size="small"
                            look={sortMode === "time" ? "primary" : "outline"}
                            fillMode={sortMode === "time" ? "solid" : "flat"}
                            svgIcon={sortAscIcon}
                        >
                            {messages.alertList.alertCardView.time}
                        </Button>
                    </div>
                </div>
            </div>

            {/* 경보 리스트 */}
            <div className="p-4 overflow-y-auto flex-1">
                {sortMode === "status" ? (
                    <div className="space-y-4">
                        {/* 활성 경보 섹션 */}
                        {activeAlerts.length > 0 && (
                            <div>
                                <div className="font-semibold text-[var(--kendo-color-error)] mb-2 flex items-center gap-1 px-2 py-1 rounded border border-[var(--kendo-color-error-subtle)]">
                                    <AlertCircle size={14} />
                                    {messages.alertList.alertCardView.activeAlerts} ({activeAlerts.length})
                                </div>
                                <div>{activeAlerts.map(renderAlertWithInfo)}</div>
                            </div>
                        )}

                        {/* 종료 경보 섹션 - 활성 모드에서도 표시 */}
                        {clearedAlerts.length > 0 && (
                            <div className={activeAlerts.length > 0 ? "mt-6" : ""}>
                                <div className="font-medium text-[var(--kendo-color-on-surface)] mb-2 flex items-center justify-between px-2 py-1 rounded border border-[var(--kendo-color-border)]">
                                    <div className="flex items-center gap-1">
                                        <CheckCircle size={14} />
                                        {messages.alertList.alertCardView.clearedAlerts} ({clearedAlerts.length})
                                    </div>
                                    {/* Clear 버튼 - 발생 경보 탭에서만 표시 */}
                                    {alertViewMode === "active" && (
                                        <Button
                                            size="small"
                                            look="outline"
                                            fillMode="flat"
                                            onClick={handleClearFinishedAlerts}
                                            className="text-xs"
                                        >
                                            {messages.alertList.alertCardView.clearFinishedAlerts}
                                        </Button>
                                    )}
                                </div>
                                <div>{clearedAlerts.map(renderAlertWithInfo)}</div>
                            </div>
                        )}

                        {processedAlerts.length === 0 && (
                            <div className="py-8 text-center text-[var(--kendo-color-secondary)]">
                                <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
                                <p>{messages.alertList.alertCardView.noDisplayedAlerts}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <div className="font-medium text-[var(--kendo-color-primary)] mb-4 flex items-center gap-1 px-2 py-1 rounded border border-[var(--kendo-color-primary-subtle)]">
                            <History size={14} />{messages.alertList.alertCardView.activeAlerts} {activeAlerts?.length}{" "}
                            / {messages.alertList.alertCardView.clearedAlerts} {clearedAlerts?.length}
                        </div>
                        {processedAlerts.length > 0 ? (
                            <div>{processedAlerts.map(renderAlertWithInfo)}</div>
                        ) : (
                            <div className="py-8 text-center text-[var(--kendo-color-secondary)]">
                                <History size={32} className="mx-auto mb-2 opacity-50" />
                                <p>{messages.alertList.alertCardView.noDisplayedAlertsHistory}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertCardView;
