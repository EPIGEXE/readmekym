import { useRef, useState, useCallback } from "react";
import { SvgIcon } from "@progress/kendo-react-common";
import { Button } from "@progress/kendo-react-buttons";
import { arrowLeftIcon } from "@progress/kendo-svg-icons";
import { useEvetLogAreaTreeList, useEventLogList } from "../../hooks/reactQueryHooks/useEventLogApi";
import SearchConditions from "./SearchConditions";
import SearchResults from "./SearchResults";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";

/**
 * 리포트 페이지
 * @param {Function} onClose 뒤로 가기 핸들러
 *
 * 리포트 페이지 검색 조건으로 검색하여 event log를 볼 수 있는 페이지
 */
const ReportPage = ({ onClose }) => {
    // ============================== 글로벌 상태 ==============================
    // 다국어 설정
    const globalConfig = useGlobalConfigStore((state) => state.globalConfig);
    const messages = getMessages(globalConfig?.languageId);

    // ============================== 쿼리 훅 ==============================
    // Get
    const { data: eventLogAreaTreeList } = useEvetLogAreaTreeList(); // 설정 값인 이벤트 영역 트리 목록

    // Post
    const eventLogListMutation = useEventLogList(); // 이벤트 로그 목록 조회

    // ============================== 상태 ==============================

    // 날짜 기본값 설정 (오늘부터 30일 전)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const [loading, setLoading] = useState(false); // 로딩 상태
    const [startDate, setStartDate] = useState(thirtyDaysAgo); // 시작일
    const [endDate, setEndDate] = useState(today); // 종료일
    const [selectedLevel1, setSelectedLevel1] = useState(null); // 1레벨 선택
    const [selectedLevel2, setSelectedLevel2] = useState(null); // 2레벨 선택
    const [selectedLevel3, setSelectedLevel3] = useState(null); // 3레벨 선택

    const [reportData, setReportData] = useState([]); // 검색 결과 데이터

    // ============================== useRef ==============================
    const excelRef = useRef(null); // 엑셀 참조
    const tempDataRef = useRef([]); // 임시 데이터 저장소
    const currentPageRef = useRef(1); // 현재 페이지 추적

    // ============================== 핸들러 ==============================
    // 날짜 변경 핸들러
    const handleDateChange = useCallback(
        (type, value) => {
            if (type === "start") {
                if (endDate && value > endDate) {
                    alert("시작일은 종료일보다 이후일 수 없습니다.");
                    return;
                }
                setStartDate(value);
            } else {
                if (startDate && value < startDate) {
                    alert("종료일은 시작일보다 이전일 수 없습니다.");
                    return;
                }
                setEndDate(value);
            }
        },
        [startDate, endDate]
    );

    // 레벨 선택 핸들러들
    const handleLevel1Change = useCallback((value) => {
        setSelectedLevel1(value);
        setSelectedLevel2(null); // 상위 레벨이 변경되면 하위 레벨 초기화
        setSelectedLevel3(null);
    }, []);

    const handleLevel2Change = useCallback((value) => {
        setSelectedLevel2(value);
        setSelectedLevel3(null); // 상위 레벨이 변경되면 하위 레벨 초기화
    }, []);

    const handleLevel3Change = useCallback((value) => {
        setSelectedLevel3(value);
    }, []);

    // 페이지별 데이터 로드 함수
    const loadPagedData = useCallback(async (page = 1) => {
        // 최대 100번 호출 제한 (안전장치)
        if (page > 100) {
            console.log("최대 페이지 수(100) 도달, 로딩 종료");
            setReportData(tempDataRef.current);
            setLoading(false);
            return;
        }

        const requestBody = {
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            area1: selectedLevel1?.value || null,
            area2: selectedLevel2?.value || null,
            area3: selectedLevel3?.value || null,
            paging_limit: 10000,
            paging_page_limit: 5000,
            paging_page: page, // 페이지 번호 전달
        };

        console.log(`페이지 ${page} API 호출:`, requestBody);

        try {
            const result = await eventLogListMutation.mutateAsync({ requestBody });
            console.log(`페이지 ${page} 응답:`, result?.length, "건");

            if (result && result.length > 0) {
                // 임시 저장소에 데이터 누적
                tempDataRef.current = [...tempDataRef.current, ...result];

                // 5000건 받았으면 더 있다고 판단 -> 다음 페이지 호출
                // 단, 최대 건수(10000건)에 도달하지 않았을 때만
                if (result.length === 5000 && tempDataRef.current.length < 10000) {
                    currentPageRef.current = currentPageRef.current + 1;
                    await loadPagedData(currentPageRef.current);
                } else {
                    // 5000건 미만이거나 최대 건수 도달 -> 로딩 종료
                    console.log("전체 데이터 로드 완료:", tempDataRef.current.length, "건");
                    setReportData(tempDataRef.current);
                    setLoading(false);
                }
            } else {
                // 빈 응답이면 종료
                console.log("전체 데이터 로드 완료:", tempDataRef.current.length, "건");
                setReportData(tempDataRef.current);
                setLoading(false);
            }
        } catch (error) {
            console.error("페이지 로드 실패:", error);
            alert("이벤트 로그 조회에 실패했습니다.");
            setReportData([]);
            setLoading(false);
        }
    }, [startDate, endDate, selectedLevel1, selectedLevel2, selectedLevel3, eventLogListMutation]);

    // 검색 실행 핸들러
    const handleSearch = useCallback(async () => {
        if (!startDate || !endDate) {
            alert("조회 기간을 설정해주세요.");
            return;
        }

        setLoading(true);

        // 초기화
        tempDataRef.current = [];
        currentPageRef.current = 1;
        setReportData([]);

        // 첫 페이지부터 재귀적으로 모든 데이터 로드
        await loadPagedData(1);
    }, [startDate, endDate, selectedLevel1, selectedLevel2, selectedLevel3, loadPagedData]);


    return (
        <div className="p-5 flex flex-col gap-4 h-full bg-[var(--kendo-color-app-surface)]">
            {/* 헤더 */}
            <div className="flex justify-start items-center">
                <Button size="small" look="outline" onClick={onClose} className="gap-2">
                    <SvgIcon icon={arrowLeftIcon} />
                    {messages.reportPage.goback}
                </Button>
            </div>

            {/* 메인 영역 */}
            <div className="flex flex-1 min-h-0 gap-3">
                {/* 검색 조건 */}
                <div className="w-[400px]">
                    <SearchConditions
                        startDate={startDate}
                        endDate={endDate}
                        selectedLevel1={selectedLevel1}
                        selectedLevel2={selectedLevel2}
                        selectedLevel3={selectedLevel3}
                        onDateChange={handleDateChange}
                        onLevel1Change={handleLevel1Change}
                        onLevel2Change={handleLevel2Change}
                        onLevel3Change={handleLevel3Change}
                        onSearch={handleSearch}
                        loading={loading}
                        eventLogAreaTreeList={eventLogAreaTreeList}
                        messages={messages}
                    />
                </div>

                {/* 검색 결과 */}
                <SearchResults
                    data={reportData}
                    loading={loading}
                    excelRef={excelRef}
                    onExport={() => excelRef.current?.save()}
                    messages={messages}
                />
            </div>
        </div>
    );
};

export default ReportPage;
