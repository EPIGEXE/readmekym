import { orderBy } from "@progress/kendo-data-query";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { Button } from "@progress/kendo-react-buttons";
import { SvgIcon } from "@progress/kendo-react-common";
import { printIcon, fileExcelIcon } from "@progress/kendo-svg-icons";

/**
 * 검색 결과창 컴포넌트
 * @param {Array} data 데이터
 * @param {Object} excelRef 엑셀 참조
 * @param {Function} onPrint 인쇄 핸들러
 * @param {Function} onExport 엑셀 내보내기 핸들러
 * @param {Function} onPageLoad 페이지 로드 핸들러
 * @param {Number} currentPage 현재 페이지
 * @param {Number} totalCount 전체 데이터 개수
 *
 * 리포트 페이지의 검색 결과창 컴포넌트
 * 데이터를 가상 스크롤로 표시하고, 정렬 기능 제공
 * 엑셀 내보내기 기능 제공
 * 인쇄 기능 제공
 *
 */
const SearchResults = ({ data, excelRef, onExport, messages }) => {
    // ============================== 상태 관리 ==============================
    const [sort, setSort] = useState([]); // 정렬 상태
    const [page, setPage] = useState({ skip: 0, take: 25 }); // 페이지 상태

    // 데이터가 변경되면 페이지를 첫 페이지로 초기화
    useEffect(() => {
        setPage({ skip: 0, take: 25 });
    }, [data.length]);

    // ============================== 개별 변수 ==============================
    // 정렬된 데이터 계산
    const sortedData = useMemo(() => {
        if (sort.length > 0) {
            return orderBy(data, sort);
        }
        return data;
    }, [data, sort]);

    // ============================== 핸들러 ==============================
    // 정렬 핸들러
    const handleGridSort = (event) => setSort(event.sort);

    // 페이지 변경 핸들러
    const handlePageChange = useCallback((event) => {
        const newPage = event.page;
        setPage(newPage);
    }, []);

    // ============================== 렌더링 ==============================
    // 일반 텍스트 셀
    const TextCell = ({ dataItem, field }) => {
        return <td style={{ fontSize: "12px" }}>{dataItem[field] || ""}</td>;
    };

    // 시간 셀
    const TimeCell = ({ dataItem }) => {
        return (
            <td style={{ fontSize: "12px" }}>
                {dataItem.event_time
                    ? new Date(dataItem.event_time).toLocaleString("ko-KR", {
                          hour12: false,
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                      })
                    : ""}
            </td>
        );
    };

    // 상태 셀
    const StatusCell = ({ dataItem, messages }) => {
        const isActive = dataItem.status === 1;
        return (
            <td className="text-center">
                <div
                    className={`
                        inline-flex items-center px-2 py-0.5 rounded-full text-xs
                        ${isActive ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                    `}
                >
                    {isActive ? messages.reportPage.occurred : messages.reportPage.released}
                </div>
            </td>
        );
    };

    // ============================== 엑셀 옵션 ==============================
    const workbookOptions = {
        sheets: [
            {
                columns: [
                    { field: "area1", title: messages.reportPage.powerPlant, width: 100 },
                    { field: "area2", title: messages.reportPage.facility, width: 100 },
                    { field: "area3", title: messages.reportPage.floor, width: 100 },
                    { field: "dev_desc", title: messages.reportPage.deviceName, width: 150 },
                    { field: "event_desc", title: messages.reportPage.eventDesc, width: 200 },
                    { field: "event_time", title: messages.reportPage.eventTime, width: 160 },
                    { field: "status", title: messages.reportPage.status, width: 80 },
                    { field: "graphic_ack_account", title: messages.reportPage.graphicAckAccount, width: 120 },
                    { field: "graphic_ack_desc", title: messages.reportPage.graphicAckDesc, width: 200 },
                ],
                rows: data.map((item) => ({
                    ...item,
                    event_time: item.event_time
                        ? new Date(item.event_time).toLocaleString("ko-KR", {
                              hour12: false,
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                          })
                        : "",
                    status: item.status === 1 ? messages.reportPage.occurred : messages.reportPage.released,
                })),
            },
        ],
    };

    return (
        <div className="flex-[2] border border-[var(--kendo-color-border)] flex flex-col h-full min-w-0">
            {/* 헤더 */}
            <div className="border-b bg-[var(--kendo-color-surface)] px-4 py-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--kendo-color-primary)]"></div>
                    <h3 className="text-base font-semibold">
                        {messages.reportPage.searchResults}
                        {data.length > 0 && <span className="text-sm text-gray-500 ml-2">{messages.reportPage.total} {data.length} {messages.reportPage.unit}</span>}
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <Button look="flat" disabled={data.length === 0} onClick={onExport} title={messages.reportPage.export}>
                        <SvgIcon icon={fileExcelIcon} />
                    </Button>
                </div>
            </div>

            {/* 그리드 */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <ExcelExport
                    data={sortedData}
                    ref={excelRef}
                    fileName="Door Monitoring 출입기록.xlsx"
                    {...workbookOptions}
                >
                    <div
                        style={{
                            height: "100%",
                            width: "100%",
                        }}
                        className="rounded-lg"
                    >
                        <Grid
                            data={sortedData}
                            dataItemKey="id"
                            autoProcessData={true}
                            style={{
                                height: "100%",
                            }}
                            sortable={true}
                            sort={sort}
                            onSortChange={handleGridSort}
                            resizable={true}
                            rowHeight={36}
                            pageable={{
                                buttonCount: 5,
                                pageSizes: [25, 50, 100, 200, 500],
                                pageSize: page.take,
                                info: true,
                            }}
                            scrollable="scrollable"
                            skip={page.skip}
                            take={page.take}
                            total={data.length}
                            onPageChange={handlePageChange}
                        >
                            <GridColumn field="area1" title={messages.reportPage.powerPlant} width="100px" cells={{ data: TextCell }} />
                            <GridColumn field="area2" title={messages.reportPage.facility} width="100px" cells={{ data: TextCell }} />
                            <GridColumn field="area3" title={messages.reportPage.floor} width="100px" cells={{ data: TextCell }} />
                            <GridColumn field="dev_desc" title={messages.reportPage.deviceName} width="150px" cells={{ data: TextCell }} />
                            <GridColumn field="event_desc" title={messages.reportPage.eventDesc} cells={{ data: TextCell }} />
                            <GridColumn field="event_time" title={messages.reportPage.eventTime} width="160px" cells={{ data: TimeCell }} />
                            <GridColumn field="status" title={messages.reportPage.status} width="80px" cells={{ data: (props) => StatusCell({ ...props, messages }) }} />
                            <GridColumn
                                field="graphic_ack_account"
                                title={messages.reportPage.graphicAckAccount}
                                width="120px"
                                cells={{ data: TextCell }}
                            />
                            <GridColumn field="graphic_ack_desc" title={messages.reportPage.graphicAckDesc} cells={{ data: TextCell }} />
                        </Grid>
                    </div>
                </ExcelExport>
            </div>
        </div>
    );
};

export default SearchResults;
