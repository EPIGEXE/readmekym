import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { useEffect, useState, useRef } from "react";
import { orderBy, filterBy } from "@progress/kendo-data-query";
import BioDeviceSettingHeader from "../common/BioDeviceSettingHeader";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";
import { Button } from "@progress/kendo-react-buttons";
import { trashIcon } from "@progress/kendo-svg-icons";
import useBioWebSocketStore from "../../store/bioWebSocketStore";
import { useAllBioLogApi } from "../../hooks/reactQueryHooks/useBioLogApi";

const MAX_LOGS = 200;

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

const toEventRow = (log) => ({
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
});

const RealTimeEvent = ({ onBack }) => {
    const { globalConfig } = useGlobalConfigStore();
    const messages = getMessages(globalConfig?.languageId);

    // 초기 데이터
    const { data: initialLogData, isLoading: isInitialLogDataLoading } =
        useAllBioLogApi();
    const { isConnected } = useBioWebSocketStore((state) => state);
    const { subscribe } = useBioWebSocketStore((state) => state.actions);

    const [events, setEvents] = useState([]);
    const [sort, setSort] = useState([{ field: "timestamp", dir: "desc" }]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

    // 초기 데이터 세팅
    useEffect(() => {
        if (initialLogData) {
            const formatted = initialLogData.map(toEventRow);
            setEvents(formatted.slice(0, MAX_LOGS));
        }
    }, [initialLogData]);

    // 웹소켓 실시간 수신
    useEffect(() => {
        const unsubscribe = subscribe((msg) => {
            const newEvent = toEventRow(msg);
            console.log('웹소켓 실시간 수신', newEvent);
            setEvents((prev) => [newEvent, ...prev].slice(0, MAX_LOGS));
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        setIsWebSocketConnected(isConnected);
    }, [isConnected]);

    // 검색/정렬
    const filtered = searchTerm
        ? filterBy(events, {
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
                  { field: "userId", operator: "contains", value: searchTerm },
                  {
                      field: "moreInfo",
                      operator: "contains",
                      value: searchTerm,
                  },
              ],
          })
        : events;
    const sortedEvents = orderBy(filtered, sort);

    // 로그 전체 삭제
    const handleClear = () => setEvents([]);

    // 셀 렌더링
    const CustomCell = (props) => (
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

    return (
        <div className="p-5 flex flex-col gap-2 h-full">
            <BioDeviceSettingHeader
                onBack={onBack}
                title={messages.realTimeEvent.title}
            />
            <div
                className="flex-grow"
                id="contain-size"
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
                    onSortChange={(e) => setSort(e.sort)}
                    className="rounded-lg overflow-hidden"
                    resizable={true}
                    rowHeight={26}
                    showLoader={isInitialLogDataLoading}
                    cells={{ data: (props) => CustomCell(props) }}
                    scrollable="scrollable"
                >
                    <GridToolbar>
                        <div className="flex w-full items-center gap-2 p-2">
                            <div className="flex items-center ml-2">
                                <div
                                    className={`w-3 h-3 rounded-full mr-2 ${
                                        isWebSocketConnected
                                            ? "bg-[var(--kendo-color-success)]"
                                            : "bg-[var(--kendo-color-error)]"
                                    }`}
                                />
                                <span className="text-xs">
                                    {isWebSocketConnected
                                        ? messages.realTimeEvent.connected
                                        : messages.realTimeEvent.connecting}
                                </span>
                            </div>
                            <Button
                                themeColor="light"
                                look="outline"
                                className="text-sm px-2 py-1"
                                svgIcon={trashIcon}
                                onClick={handleClear}
                            >
                                {messages.eventLog?.clear}
                            </Button>
                            <div className="flex-1" />

                            <input
                                type="text"
                                className="rounded border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                placeholder={
                                    messages.realTimeEvent.searchPlaceholder
                                }
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                }}
                                style={{ width: 250 }}
                            />
                        </div>
                    </GridToolbar>
                    <GridColumn
                        field="timestamp"
                        title={messages.realTimeEvent.gridColumns.timestamp}
                        width="180px"
                    />
                    <GridColumn
                        field="device_id"
                        title={messages.realTimeEvent.gridColumns.deviceId}
                        width="120px"
                    />
                    <GridColumn
                        field="description"
                        title={messages.realTimeEvent.gridColumns.description}
                    />
                    <GridColumn
                        field="userId"
                        title={messages.realTimeEvent.gridColumns.userId}
                        width="140px"
                    />
                    <GridColumn
                        field="logType"
                        title={messages.realTimeEvent.gridColumns.logType}
                        width="140px"
                    />
                    <GridColumn
                        field="moreInfo"
                        title={messages.realTimeEvent.gridColumns.moreInfo}
                        width="200px"
                    />
                    <GridColumn
                        field="eventCode"
                        title={messages.realTimeEvent.gridColumns.eventCode}
                        width="120px"
                    />
                    <GridColumn
                        field="mainCode"
                        title={messages.realTimeEvent.gridColumns.mainCode}
                        width="120px"
                    />
                    <GridColumn
                        field="subCode"
                        title={messages.realTimeEvent.gridColumns.subCode}
                        width="120px"
                    />
                    <GridColumn
                        field="param"
                        title={messages.realTimeEvent.gridColumns.param}
                        width="100px"
                    />
                </Grid>
            </div>
        </div>
    );
};

export default RealTimeEvent;
