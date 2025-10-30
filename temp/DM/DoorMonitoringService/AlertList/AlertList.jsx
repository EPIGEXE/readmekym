import { memo, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Globe, CloudIcon } from "lucide-react";
import { Button } from "@progress/kendo-react-buttons";
import { bordersAllIcon, groupFooterSectionIcon } from "@progress/kendo-svg-icons";
import AlertTableView from "./AlertTableView/AlertTableView";
import AlertCardView from "./AlertCardView/AlertCardView";
import useDoorMonitoringStore from "../../store/doorMonitoringStoreIndex";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";

/**
 * 출입통제 경보 리스트 컴포넌트
 *
 * 우측 패널에서 출입통제 경보 리스트를 표시하는 컴포넌트
 */
const AlertList = () => {
    // ============================= 전역 상태 =============================
    // 다국어 설정
    const globalConfig = useGlobalConfigStore((state) => state.globalConfig);
    const messages = getMessages(globalConfig?.languageId);

    // 문 모니터링 상태
    const alerts = useDoorMonitoringStore((state) => state.alertList); // 경보 리스트

    // ============================= 상태 관리 =============================
    const [collapsed, setCollapsed] = useState(false); // 경보 리스트 접기 펼치기
    const [viewMode, setViewMode] = useState("card"); // 'card' or 'table' 뷰 모드 설정

    // ============================= 핸들러 =============================
    // 경보 리스트 접기 펼치기 토글
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    // ============================= 렌더링 =============================
    // 테이블 뷰 - 최적화를 위한 메모제이션
    const tableView = useMemo(() => {
        return <AlertTableView alerts={alerts} />;
    }, [alerts]);

    // 카드 뷰 - 최적화를 위한 메모제이션
    const cardView = useMemo(() => {
        return <AlertCardView alerts={alerts} />;
    }, [alerts]);

    return (
        <div
            className={`${
                collapsed ? "w-10" : viewMode === "card" ? "w-[450px]" : "w-[800px]"
            } ${
                collapsed ? "" : "border border-2 border-[var(--kendo-color-primary-subtle)] rounded-md"
            } flex flex-col h-full overflow-hidden`}
        >
            {collapsed ? (
                <div className="flex items-start justify-center pt-4">
                    <div
                        onClick={toggleCollapse}
                        className="w-7 h-7 rounded-md bg-[var(--kendo-color-primary-subtle)] border border-[var(--kendo-color-primary-subtle)] hover:bg-[var(--kendo-color-primary-subtle-hover)] text-[var(--kendo-color-primary)] flex items-center justify-center cursor-pointer transition-colors"
                    >
                        <ChevronLeft size={14} />
                    </div>
                </div>
            ) : (
                <>
                    {/* 헤더 */}
                    <div className=" bg-[var(--kendo-color-primary-subtle)] px-4 py-3 flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center justify-between flex-1">
                            <div className="font-medium text-[var(--kendo-color-primary)] flex items-center gap-2">
                                <Globe size={16} className="text-[var(--kendo-color-primary)]" />
                                <span>{messages.alertList.title}</span>
                            </div>
                            <Button
                                size="small"
                                look="outline"
                                fillMode="flat"
                                className="flex items-center text-[var(--kendo-color-primary)]"
                                svgIcon={viewMode === "card" ? groupFooterSectionIcon : bordersAllIcon}
                                onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}
                            >
                                {viewMode === "card" ? messages.alertList.tableView : messages.alertList.cardView}
                            </Button>
                        </div>
                        <div
                            onClick={toggleCollapse}
                            className="w-7 h-7 rounded-md hover:bg-[var(--kendo-color-primary-subtle-hover)] text-[var(--kendo-color-primary)] ml-2 flex items-center justify-center cursor-pointer transition-colors"
                        >
                            <ChevronRight size={14} />
                        </div>
                    </div>

                    {/* 메인 컨텐츠 */}
                    <div className="flex-1 overflow-hidden flex flex-col bg-[var(--kendo-color-app-surface)]">
                        {!alerts || alerts.length === 0 ? (
                            <div className="p-4 text-indigo-500 text-sm rounded-md bg-indigo-50 border border-indigo-100 m-4 flex items-center gap-2">
                                <CloudIcon size={16} />
                                <span>{messages.alertList.noAlarm}</span>
                            </div>
                        ) : (
                            <div className="w-full h-full">
                                {viewMode === "card" ? cardView : tableView}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default memo(AlertList);
