import { useGlobalConfigStore } from "v2/libs";
import { filterBy, orderBy } from "@progress/kendo-data-query";
import { Button } from "@progress/kendo-react-buttons";
import { Window } from "@progress/kendo-react-dialogs";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { useEffect, useState } from "react";
import { getMessages } from "../../transMessages";
import useBioWebSocketStore from "../../store/bioWebSocketStore";
import { useBioLogApi } from "../../hooks/reactQueryHooks/useBioLogApi";
import { trashIcon } from "@progress/kendo-svg-icons";

/**
 * 이벤트 창의 그리드 셀 렌더링 컴포넌트
 */
const CustomCell = (props) => {
    return (
        <td
            style={{
                fontSize: "12px",
                padding: "4px 8px",
                whiteSpace: "nowrap",
            }}
        >
            {props.dataItem[props.field]}
        </td>
    );
};

// 날짜 포맷팅 함수
const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
    )}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(
        2,
        "0"
    )}:${String(d.getMinutes()).padStart(2, "0")}:${String(
        d.getSeconds()
    ).padStart(2, "0")}`;
};

const toEventRow = (log) => {
    return {
        id: `${log.log_id}-${log.record_time}`,
        timestamp: formatDate(log.record_time),
        device_id: log.device_id,
        description: log.event_message,
        userId: log.user_id,
        moreInfo: log.more_info,
        logType: log.log_type,
        eventCode: log.event_code,
        mainCode: log.main_code,
        subCode: log.sub_code,
        param: log.param,
    };
};

/**
 * 생체 장치 이벤트 로그 윈도우 (특정 장치)
 */
const EventWindow = ({ isOpen, deviceData, onClose }) => {
    // ========================== State & Store ================================
    const { globalConfig } = useGlobalConfigStore();
    const messages = getMessages(globalConfig?.languageId);
    const { subscribe } = useBioWebSocketStore((state) => state.actions);

    // 초기 로그 데이터 가져오기
    const { data: initialLogData, isLoading: isInitialLogDataLoading } =
        useBioLogApi({
            deviceId: deviceData.device_id,
        });

    const [events, setEvents] = useState([]);
    const [sort, setSort] = useState([{ field: "timestamp", dir: "desc" }]);
    const [sortedEvents, setSortedEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [position, setPosition] = useState({
        left: 400,
        top: 150,
        width: 1200,
        height: 800,
    });

    // ========================== useEffect ==============================

    // 초기 로그 데이터 설정
    useEffect(() => {
        if (initialLogData) {
            const formattedLogs = initialLogData.map(toEventRow);
            setEvents(formattedLogs.slice(0, 200));
        }
    }, [initialLogData]);

    // WebSocket 연결 및 특정 장치 이벤트 수신
    useEffect(() => {
        if (!isOpen) return;
        const unsubscribe = subscribe((message) => {
            if (message.device_id === deviceData.device_id) {
                console.log('웹소켓 실시간 수신 EventWindow', deviceData.device_id, message);
                const newEvent = toEventRow(message);
                setEvents((prev) => [newEvent, ...prev].slice(0, 200));
            }
        });
        return () => unsubscribe();
    }, [isOpen, deviceData]);

    // 창 닫기 핸들러
    const handleClose = () => {
        setSearchTerm("");
        setSort([{ field: "timestamp", dir: "desc" }]);
        setEvents([]);
        onClose();
    };

    // 검색 및 정렬 로직
    useEffect(() => {
        let filteredData = events.length > 0 ? [...events] : [];

        if (searchTerm) {
            filteredData = filterBy(filteredData, {
                logic: "or",
                filters: [
                    {
                        field: "timestamp",
                        operator: "contains",
                        value: searchTerm,
                    },
                    {
                        field: "description",
                        operator: "contains",
                        value: searchTerm,
                    },
                ],
            });
        }

        setSortedEvents(orderBy(filteredData, sort));
    }, [events, searchTerm, sort]);

    // ========================== 이벤트 처리 ==============================
    const handleGridSort = (event) => setSort(event.sort);
    const handleMove = (event) =>
        setPosition({ ...position, left: event.left, top: event.top });
    const handleResize = (event) => setPosition({ ...event });
    const handleClear = () => setEvents([]);

    if (!isOpen) return null;

    return (
        <div
            id="window-container"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                pointerEvents: "none",
                zIndex: 9999,
            }}
        >
            <Window
                title={`${messages.eventLog.title} - ${deviceData.device_name} (${deviceData.device_id})`}
                onClose={handleClose}
                left={position.left}
                top={position.top}
                width={position.width}
                height={position.height}
                onMove={handleMove}
                onResize={handleResize}
                resizable={true}
                draggable={true}
                appendTo={document.querySelector("#window-container")}
                style={{ pointerEvents: "auto", zIndex: 10000 }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%", // Window 내부 전체 높이 사용
                        minHeight: 0, // flex 아이템에서 overflow 스크롤 허용
                    }}
                >
                    <Grid
                        data={sortedEvents}
                        style={{ flex: 1, minHeight: 0 }}
                        sortable={true}
                        sort={sort}
                        scrollable="scrollable"
                        onSortChange={handleGridSort}
                        resizable={true}
                        showLoader={isInitialLogDataLoading}
                        cells={{ data: (props) => CustomCell(props) }}
                    >
                        <GridToolbar>
                            <div className="flex w-full items-center gap-2 p-2">
                                {/* 로그 전체 삭제 버튼 (왼쪽) */}
                                <div className="text-sm mr-4">
                                    {messages.eventLog.totalEvents}{" "}
                                    {sortedEvents.length}
                                </div>
                                <Button
                                    themeColor="light"
                                    look="outline"
                                    className="text-sm px-2 py-1"
                                    svgIcon={trashIcon}
                                    onClick={handleClear}
                                >
                                    {messages.eventLog.clear ||
                                        "로그 전체 삭제"}
                                </Button>
                                <div className="flex-1" />

                                {/* 검색창 (오른쪽, 모던 스타일) */}
                                <input
                                    type="text"
                                    className="rounded border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    placeholder={
                                        messages.eventLog.searchPlaceholder
                                    }
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    style={{ width: 250 }}
                                />
                            </div>
                        </GridToolbar>

                        <GridColumn
                            field="timestamp"
                            title={messages.eventLog.gridColumns.timestamp}
                            width="180px"
                        />
                        <GridColumn
                            field="description"
                            title={messages.eventLog.gridColumns.description}
                            width="250px"
                        />
                        <GridColumn
                            field="userId"
                            title={messages.eventLog.gridColumns.userId}
                            width="140px"
                        />
                        <GridColumn
                            field="logType"
                            title={messages.eventLog.gridColumns.logType}
                            width="120px"
                        />
                        <GridColumn
                            field="moreInfo"
                            title={messages.eventLog.gridColumns.moreInfo}
                            width="140px"
                        />
                        <GridColumn
                            field="eventCode"
                            title={messages.eventLog.gridColumns.eventCode}
                            width="120px"
                        />
                        <GridColumn
                            field="mainCode"
                            title={messages.eventLog.gridColumns.mainCode}
                            width="120px"
                        />
                        <GridColumn
                            field="subCode"
                            title={messages.eventLog.gridColumns.subCode}
                            width="120px"
                        />
                        <GridColumn
                            field="param"
                            title={messages.eventLog.gridColumns.param}
                            width="100px"
                        />
                    </Grid>
                    <div className="flex gap-2 justify-end p-2 border-t">
                        <Button
                            look="outline"
                            onClick={handleClose}
                            themeColor="light"
                        >
                            {messages.common.close}
                        </Button>
                    </div>
                </div>
            </Window>
        </div>
    );
};

export default EventWindow;
