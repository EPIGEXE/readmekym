import { Button } from "@progress/kendo-react-buttons";
import { SvgIcon } from "@progress/kendo-react-common";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { searchIcon } from "@progress/kendo-svg-icons";

/**
 * 리포트 검색 조건 컴포넌트
 * @param {Date} startDate 시작일
 * @param {Date} endDate 종료일
 * @param {Object} selectedLevel1 1레벨 선택
 * @param {Object} selectedLevel2 2레벨 선택
 * @param {Object} selectedLevel3 3레벨 선택
 * @param {Function} onDateChange 날짜 변경 핸들러
 * @param {Function} onLevel1Change 1레벨 선택 핸들러
 * @param {Function} onLevel2Change 2레벨 선택 핸들러
 * @param {Function} onLevel3Change 3레벨 선택 핸들러
 * @param {Function} onSearch 검색 핸들러
 * @param {boolean} loading 로딩 상태
 * @param {Array} eventLogAreaTreeList 이벤트 로그 영역 트리 목록
 * 
 * 리포트 페이지의 검색 조건 컴포넌트
 * 조회 기간과 발전소, 시설, 층 설정
 * 
 */
const SearchConditions = ({
    startDate,
    endDate,
    selectedLevel1,
    selectedLevel2,
    selectedLevel3,
    onDateChange,
    onLevel1Change,
    onLevel2Change,
    onLevel3Change,
    onSearch,
    loading,
    eventLogAreaTreeList,
    messages,
}) => {
    // ============================== 개별 변수 ==============================
    // 레벨별 데이터 생성
    const level1Options =
        eventLogAreaTreeList?.map((item) => ({
            text: item.name,
            value: item.name,
        })) || [];

    const level2Options =
        selectedLevel1 && selectedLevel1.value && eventLogAreaTreeList
            ? (() => {
                const level1Item = eventLogAreaTreeList.find((item) => item.name === selectedLevel1.value);
                return level1Item?.childs?.map((child) => ({
                    text: child.name,
                    value: child.name,
                })) || [];
              })()
            : [];

    const level3Options =
        selectedLevel1?.value && selectedLevel2?.value && eventLogAreaTreeList
            ? (() => {
                const level1Item = eventLogAreaTreeList.find((item) => item.name === selectedLevel1.value);
                const level2Item = level1Item?.childs?.find((child) => child.name === selectedLevel2.value);
                return level2Item?.childs?.map((grandChild) => ({
                    text: grandChild.name,
                    value: grandChild.name,
                })) || [];
              })()
            : [];

    return (
        <div className="flex-1 border border-[var(--kendo-color-border)] flex flex-col h-full">
            {/* 헤더 */}
            <div className="border-b bg-[var(--kendo-color-surface)] px-4 py-3 flex items-center gap-2 flex-shrink-0">
                <div className="w-2 h-2 bg-[var(--kendo-color-primary)]"></div>
                <h3 className="text-base font-semibold">{messages.reportPage.searchConditions}</h3>
            </div>

            {/* 검색 조건 내용 */}
            <div className="flex-1 overflow-auto p-4">
                <div className="space-y-6">
                    {/* 조회 기간 */}
                    <div className="space-y-2">
                        <label className="block text-[13px] font-medium">{messages.reportPage.searchPeriod}</label>
                        <div className="flex items-center gap-2">
                            <DatePicker
                                value={startDate}
                                onChange={(e) => onDateChange("start", e.value)}
                                placeholder={messages.reportPage.startDate}
                                format="yyyy-MM-dd"
                                className="flex-1"
                            />
                            <span className="text-gray-400">~</span>
                            <DatePicker
                                value={endDate}
                                onChange={(e) => onDateChange("end", e.value)}
                                placeholder={messages.reportPage.endDate}
                                format="yyyy-MM-dd"
                                className="flex-1"
                            />
                        </div>
                    </div>

                    {/* 1레벨 선택 */}
                    <div className="space-y-2">
                        <label className="block text-[13px] font-medium">
                            {messages.reportPage.level1}
                            {selectedLevel1?.value && (
                                <span className="ml-2 text-xs text-blue-600">{messages.reportPage.selected}: {selectedLevel1.text}</span>
                            )}
                        </label>
                        <DropDownList
                            data={level1Options}
                            textField="text"
                            dataItemKey="value"
                            value={selectedLevel1}
                            onChange={(e) => onLevel1Change(e.value)}
                            placeholder={messages.reportPage.allSelect}
                            className="w-full"
                            defaultItem={{ text: messages.reportPage.all, value: null }}
                        />
                    </div>

                    {/* 2레벨 선택 */}
                    <div className="space-y-2">
                        <label className="block text-[13px] font-medium">
                            {messages.reportPage.level2}
                            {selectedLevel2?.value && (
                                <span className="ml-2 text-xs text-blue-600">{messages.reportPage.selected}: {selectedLevel2.text}</span>
                            )}
                        </label>
                        <DropDownList
                            data={level2Options}
                            textField="text"
                            dataItemKey="value"
                            value={selectedLevel2}
                            onChange={(e) => onLevel2Change(e.value)}
                            placeholder={messages.reportPage.allSelect}
                            className="w-full"
                            disabled={!selectedLevel1?.value}
                            defaultItem={selectedLevel1?.value ? { text: messages.reportPage.all, value: null } : null}
                        />
                    </div>

                    {/* 3레벨 선택 */}
                    <div className="space-y-2">
                        <label className="block text-[13px] font-medium">
                            {messages.reportPage.level3}
                            {selectedLevel3?.value && (
                                <span className="ml-2 text-xs text-blue-600">{messages.reportPage.selected}: {selectedLevel3.text}</span>
                            )}
                        </label>
                        <DropDownList
                            data={level3Options}
                            textField="text"
                            dataItemKey="value"
                            value={selectedLevel3}
                            onChange={(e) => onLevel3Change(e.value)}
                            placeholder={messages.reportPage.allSelect}
                            className="w-full"
                            disabled={!selectedLevel2?.value}
                            defaultItem={selectedLevel2?.value ? { text: messages.reportPage.all, value: null } : null}
                        />
                    </div>
                </div>
            </div>

            {/* 검색 버튼 */}
            <div className="p-4 border-t">
                <Button themeColor="primary" className="w-full" onClick={onSearch} disabled={loading}>
                    <SvgIcon icon={searchIcon} className="mr-2" />
                    {loading ? messages.reportPage.searching : messages.reportPage.search}
                </Button>
            </div>
        </div>
    );
};

export default SearchConditions;