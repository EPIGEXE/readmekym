import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { memo, useCallback, useState, useEffect, useRef } from "react";
import { orderBy } from "@progress/kendo-data-query";
import { ALERT_STATUS, ALERT_STATUS_CONFIG } from "../../../constants/dmConstants";
import AlertTableViewConnectedDoor from "./AlertTableViewConnectedDoor";
import AlertTableViewSelectedRow from "./AlertTableViewSelectedRow";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../../transMessages";
import { Filter } from "lucide-react";

/**
 * 출입통제 경보 테이블 뷰 컴포넌트
 * @param {Object} alerts - 경보 리스트
 *
 * 출입통제 경보 리스트를 테이블 뷰로 표시하는 컴포넌트
 */
const AlertTableView = ({ alerts }) => {
    // ============================= 전역 상태 =============================
    // 다국어 설정
    const globalConfig = useGlobalConfigStore((state) => state.globalConfig);
    const messages = getMessages(globalConfig?.languageId);

    // ============================= 상태 관리 =============================
    const [sort, setSort] = useState([]); // 정렬 상태
    const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
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
    }); // 필터 옵션 상태
    const [gridData, setGridData] = useState([]); // 그리드 데이터 상태

    // ============================= Refs =============================
    const filterButtonRef = useRef(null); // 필터 버튼 ref
    const filterPopoverRef = useRef(null); // 필터 팝오버 ref

    // ============================= 유틸 함수 =============================
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
                searchConditions.push(
                    (ALERT_STATUS_CONFIG[alert.status]?.label || "").toLowerCase().includes(lowercaseSearchTerm)
                );
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
                    alert.connectedDoor?.some((door) => (door.name || "").toLowerCase().includes(lowercaseSearchTerm))
                );
            }

            // OR 조건으로 검색 (하나라도 true면 포함)
            return searchConditions.some((condition) => condition);
        });
    };

    // 테이블 뷰를 위한 데이터 변환
    const getGridData = (alerts) => {
        return alerts.map((alert) => ({
            ...alert,
            dev_desc: `${alert.dev_desc} ${alert.second_dev_desc ? `(${alert.second_dev_desc})` : ""}`,
            connectedDoor: alert.connectedDoor || null,
        }));
    };

    // ============================= Effect =============================
    // 필터링 및 정렬된 데이터 처리
    useEffect(() => {
        // 필터링 적용
        const filteredAlerts = filterAlertsBySearchTerm(alerts || []);

        // 정렬 적용
        const sortedAlerts =
            sort.length > 0 ? orderBy(filteredAlerts, sort) : orderBy(filteredAlerts, [{ field: "id", dir: "asc" }]);

        // 그리드 데이터 변환
        const newGridData = getGridData(sortedAlerts);
        setGridData(newGridData);
    }, [alerts, sort, searchTerm, filterOptions]);

    // ============================= 핸들러 =============================
    // 그리드 정렬 핸들러
    const handleGridSort = (event) => {
        setSort(event.sort);
    };

    // 검색어 지우기 핸들러
    const handleClearSearch = () => {
        setSearchTerm("");
    };

    // 검색어 입력 핸들러
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // 필터 옵션 토글 핸들러
    const handleFilterToggle = (filterKey) => {
        setFilterOptions((prev) => ({
            ...prev,
            [filterKey]: !prev[filterKey],
        }));
    };

    // 전체 선택/해제 핸들러
    const handleSelectAll = (selected) => {
        const newOptions = {};
        Object.keys(filterOptions).forEach((key) => {
            newOptions[key] = selected;
        });
        setFilterOptions(newOptions);
    };

    // 필터 팝오버 토글 핸들러
    const handleFilterTogglePopover = () => {
        setShowFilter((prev) => !prev);
    };

    // 외부 클릭시 팝오버 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                showFilter &&
                filterButtonRef.current &&
                filterPopoverRef.current &&
                !filterButtonRef.current.contains(event.target) &&
                !filterPopoverRef.current.contains(event.target)
            ) {
                setShowFilter(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showFilter]);

    // ============================= 렌더링 =============================
    // 셀 렌더러
    const StatusCell = memo((props) => {
        const { status } = props.dataItem;

        // 상태에 따른 config 가져오기
        let config;
        if (status === 0) {
            config = ALERT_STATUS_CONFIG[ALERT_STATUS.CLEARED];
        } else if (status === 1) {
            config = ALERT_STATUS_CONFIG[ALERT_STATUS.ACTIVE];
        }

        return (
            <td className="text-center">
                <div
                    className={`
                        inline-flex items-center px-2 py-0.5 rounded-full text-xs
                        ${config?.bgColor || ""}
                        ${config?.textColor || ""}
                    `}
                >
                    {config?.label ?? status}
                </div>
            </td>
        );
    });

    // 일반 텍스트 셀
    const TextCell = memo((props) => {
        return <td style={{ fontSize: "12px" }}>{props.dataItem[props.field]}</td>;
    });

    // 커스텀 행 컴포넌트 - 연결된 경보에 파란색 테두리 적용
    const CustomRow = useCallback((props) => {
        return <AlertTableViewSelectedRow {...props} />;
    }, []);

    // 필터 옵션 라벨 매핑
    const filterLabels = {
        code: messages.alertList.alertTableView.code || "코드",
        name: messages.alertList.alertTableView.name || "이름",
        event_desc: messages.alertList.alertTableView.eventDesc || "이벤트 설명",
        status: messages.alertList.alertTableView.status || "상태",
        product_name: messages.alertList.alertTableView.productName || "제품명",
        panel_desc: messages.alertList.alertTableView.panelDesc || "패널",
        dev_desc: messages.alertList.alertTableView.devDesc || "장비",
        connectedDoor: messages.alertList.alertTableView.connectedDoor || "연결된 문",
    };

    // 활성화된 필터 개수 계산
    const activeFilterCount = Object.values(filterOptions).filter(Boolean).length;
    const totalFilterCount = Object.keys(filterOptions).length;

    return (
        <div className="p-1 flex flex-col gap-1 h-full">
            <div className="px-4 py-2 border-b">
                <div className="relative flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder={messages.alertList.alertTableView.searchPlaceholder}
                            className="w-full pl-4 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {searchTerm && (
                            <div
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <span className="text-xs">✕</span>
                            </div>
                        )}
                    </div>

                    {/* 필터 버튼 및 팝오버 */}
                    <div ref={filterButtonRef} className="relative">
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
                                        <span className="text-sm font-medium text-[var(--kendo-color-on-surface)]">
                                            검색 필터
                                        </span>
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
                                                <span className="text-sm text-[var(--kendo-color-on-surface)]">
                                                    {filterLabels[key]}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Grid
                key={new Date().getTime()}
                data={gridData}
                dataItemKey="id"
                style={{ height: "calc(100% - 8px)" }}
                sortable={true}
                sort={sort}
                onSortChange={handleGridSort}
                className="rounded-lg overflow-hidden"
                rowHeight={36}
                resizable={true}
                scrollable="scrollable"
                rows={{
                    data: CustomRow,
                }}
            >
                <GridColumn
                    field="code"
                    title={messages.alertList.alertTableView.code}
                    cells={{ data: TextCell }}
                    width="55px"
                />
                <GridColumn
                    field="status"
                    title={messages.alertList.alertTableView.status}
                    cells={{ data: StatusCell }}
                    width="60px"
                />
                <GridColumn field="name" title={messages.alertList.alertTableView.name} cells={{ data: TextCell }} />
                <GridColumn
                    field="event_desc"
                    title={messages.alertList.alertTableView.eventDesc}
                    cells={{ data: TextCell }}
                />
                <GridColumn
                    field="product_name"
                    title={messages.alertList.alertTableView.productName}
                    cells={{ data: TextCell }}
                />
                <GridColumn
                    field="panel_desc"
                    title={messages.alertList.alertTableView.panelDesc}
                    cells={{ data: TextCell }}
                />
                <GridColumn
                    field="dev_desc"
                    title={messages.alertList.alertTableView.devDesc}
                    cells={{ data: TextCell }}
                />
                <GridColumn
                    field="connectedDoorCount"
                    title={messages.alertList.alertTableView.connectedDoor}
                    cells={{ data: AlertTableViewConnectedDoor }}
                    sortable={false}
                />
            </Grid>
        </div>
    );
};

export default AlertTableView;
