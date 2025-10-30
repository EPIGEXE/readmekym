import { memo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TreeNode from "./TreeNode";
import useDoorMonitoringStore from "../../store/doorMonitoringStoreIndex";
import useDoorMonitoringGlobalStore from "../../store/doorMonitoringGlobalStore";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";

/**
 * DMS 좌측 문 목록 섹션
 */
const DoorList = () => {
    // ============================== 전역 상태 ==============================
    // 문 모니터링 전역 상태
    const { globalGrapicItemColor } = useDoorMonitoringGlobalStore((state) => state.doorMonitoringGlobal); // 그래픽 아이템 색상

    // 문 모니터링 상태
    const doorList = useDoorMonitoringStore((state) => state.doorList); // 문 목록
    const selectedDoorCodeList = useDoorMonitoringStore((state) => state.selectedDoorCodeList); // 선택된 문 코드 목록
    const selectedDoorMapCode = useDoorMonitoringStore((state) => state.selectedDoorMapCode); // 선택된 문 맵 코드
    const doorMonitoringActions = useDoorMonitoringStore((state) => state.actions); // 문 모니터링 액션

    // 다국어 설정
    const globalConfig = useGlobalConfigStore((state) => state.globalConfig);
    const messages = getMessages(globalConfig?.languageId);

    // ============================== 상태 ==============================
    const [collapsed, setCollapsed] = useState(false); // 문 목록 패널 접힘 상태

    // ============================== 개별 변수 ==============================
    const rootNode = doorList?.find((door) => !door.parent_code); // 루트 노드

    // ============================== 핸들러 ==============================
    // 문 목록 패널 접힘 상태 토글
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div
            className={`${collapsed ? "w-10" : "w-80"} ${
                collapsed ? "" : "border border-[var(--kendo-color-border)]"
            } flex flex-col h-full ${collapsed ? "" : "bg-[var(--kendo-color-app-surface)]"}`}
        >
            {collapsed ? (
                <div className="flex items-start justify-center pt-4">
                    <div
                        onClick={toggleCollapse}
                        className="w-7 h-7 rounded-md bg-[var(--kendo-color-surface)] border border-[var(--kendo-color-border)] hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer transition-colors"
                    >
                        <ChevronRight size={14} />
                    </div>
                </div>
            ) : (
                <>
                    {/* 헤더 */}
                    <div className="border-b bg-[var(--kendo-color-surface)] px-4 py-3 flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-[var(--kendo-color-primary)] mr-2"></div>
                            <h3 className="text-base font-semibold text-lg">{messages.doorListPanel.title}</h3>
                        </div>
                        <div
                            onClick={toggleCollapse}
                            className="w-7 h-7 rounded-md hover:bg-gray-200 text-gray-500 cursor-pointer transition-colors flex items-center justify-center"
                        >
                            <ChevronLeft size={14} />
                        </div>
                    </div>

                    {/* 문 목록 컨테이너 */}
                    <div className="flex-1 overflow-hidden">
                        <div className="h-full overflow-auto">
                            <div className="p-2">
                                {rootNode && (
                                    <TreeNode
                                        node={rootNode}
                                        selectedDoorCodeList={selectedDoorCodeList}
                                        selectedDoorMapCode={selectedDoorMapCode}
                                        doorMonitoringActions={doorMonitoringActions}
                                        globalGrapicItemColor={globalGrapicItemColor}
                                        level={0}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default memo(DoorList);
