import { useState, useMemo } from "react";
import { ArrowDownFromLine, ChevronDown, ChevronRight, Link } from "lucide-react";
import { AlertBadge, AutoCheckedBadge, CheckedBadge } from "../../common/AlertBadge";
import { parseCoordinate } from "../../store/doorMonitoringSlice/doorSlice";
import { checkChildAlerts } from "../../utils/alertUtils";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";

/**
 * 문 목록 내 문 노드 컴포넌트
 * @param {*} node 문 노드 정보
 * @param {*} selectedDoorCodeList 선택된 문 코드 목록
 * @param {*} selectedDoorMapCode 선택된 문 맵 코드
 * @param {*} doorMonitoringActions 문 모니터링 액션들
 * @param {*} globalGrapicItemColor 전역 그래픽 색상
 * @param {*} level 노드 레벨
 *
 * 문 노드 컴포넌트는 재귀호출로 하위 노드를 표시
 * 모든 노드가 최상위 노드에서 시작됨
 */
const TreeNode = ({
    node,
    selectedDoorCodeList,
    selectedDoorMapCode,
    doorMonitoringActions,
    globalGrapicItemColor,
    level = 0,
}) => {
    // ============================== 전역 상태 ==============================
    // 다국어 설정
    const globalConfig = useGlobalConfigStore((state) => state.globalConfig);
    const messages = getMessages(globalConfig?.languageId);

    // ============================== 개별 변수 ==============================
    const hasChildren = node.childable === 1; // 하위 노드 존재 여부
    const alertCount = node.event_code ? true : false; // 연결 경보 이벤트 개수
    const hasActiveAlert = node.event_status === 1; // 활성 경보 여부
    const isNewNode = node.code?.startsWith('new-'); // 신규 생성 노드 여부

    const isSelected = selectedDoorCodeList.includes(node.code); // 문 노드가 선택 중인지 여부
    const isSelectedMap = selectedDoorMapCode === node.code; // 문 노드가 맵으로 선택 중인지 여부

    const coordinate = node?.coordinate && parseCoordinate(node.coordinate); // 문의 맵 표시 정보

    const doorColor = {
        alert: coordinate?.alertFill || globalGrapicItemColor.alert, // 경보 색상
        checked: coordinate?.checkedFill || globalGrapicItemColor.checked, // 체크 색상
        autoChecked: coordinate?.autoCheckedFill || globalGrapicItemColor.autoChecked, // 자동 체크 색상
    };

    const childAlertStatus = useMemo(() => checkChildAlerts(node), [node.childs, node.event_status]); // 하위 노드의 경보 상태

    // ============================== 상태 ==============================
    const [expanded, setExpanded] = useState(() => {
        // 최상위 레벨(level 0)이거나 경보가 있는 노드만 기본 확장
        return level === 0;
    }); // 접기 펼치기 상태

    // ============================== 핸들러 ==============================
    const toggleExpand = (e) => {
        e.stopPropagation();
        if (isNewNode) return; // 신규 노드면 확장/축소 불가
        setExpanded(!expanded);
    };

    // 문 노드 선택 핸들러
    const handleSelect = () => {
        if (hasChildren) {
            // 신규 노드면 맵 설정 불가
            if (isNewNode) {
                doorMonitoringActions.applySelectedDoorWithAlertsById([node.code]);
                return;
            }

            // Root 노드인지 확인
            const isRootNode = !node.parent_code;

            if (isRootNode) {
                // Root 노드는 선택도 되고 맵도 설정
                doorMonitoringActions.applySelectedDoorWithAlertsById([node.code]);
                doorMonitoringActions.applyMapViewById(node.code);
            } else {
                // 중간 부모 노드는 기존 로직
                doorMonitoringActions.applyMapViewById(node.code);
                doorMonitoringActions.applySelectedDoorWithAlertsById([]);
            }
        } else {
            // 자식 노드는 기존 로직
            doorMonitoringActions.applySelectedDoorWithAlertsById([node.code]);
            if (!isNewNode) {
                const parentMapId = node.parent_code || node.code;
                doorMonitoringActions.applyMapViewById(parentMapId);
            }
        }
    };

    return (
        <div className="mb-1">
            <div
                className={`flex items-center h-10 rounded-md cursor-pointer transition-colors duration-150 pl-2 ${
                    hasActiveAlert
                        ? "bg-[var(--kendo-color-error-subtle)] hover:bg-[var(--kendo-color-error-subtle-hover)]"
                        : childAlertStatus.hasActive
                        ? "bg-[var(--kendo-color-warning-subtle)] hover:bg-[var(--kendo-color-warning-subtle-hover)]"
                        : "hover:bg-[var(--kendo-color-base-hover)]"
                }`}
                onClick={handleSelect}
                style={{
                    width: "230px",
                    border: isSelected ? "2px solid var(--kendo-color-primary)" : "1px solid transparent",
                }}
            >
                {/* 확장/축소 버튼 */}
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    {hasChildren && (
                        <div 
                            onClick={toggleExpand} 
                            className={`flex items-center justify-center ${isNewNode ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {isNewNode ? (
                                <ChevronRight size={16} />
                            ) : (
                                expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                            )}
                        </div>
                    )}
                </div>

                {/* 노드 이름 */}
                <span className="text-sm font-medium ml-1 flex-1 truncate flex items-center">
                    <span className={`truncate ${isSelectedMap ? "text-[var(--kendo-color-primary)] font-bold" : ""}`}>
                        {node.name}
                    </span>

                    {/* 하위 노드 경보 표시 아이콘 */}
                    {childAlertStatus.hasActive && (
                        <span className="ml-1 inline-flex items-center flex-shrink-0">
                            <span className={`flex items-center justify-center text-red-500`}>
                                <ArrowDownFromLine size={12} strokeWidth={2.5} />
                                <span className="text-xs font-medium ml-0.5 flex gap-1">
                                    {childAlertStatus.activeCount > 0 && (
                                        <span className={"text-red-500"}>{childAlertStatus.activeCount}</span>
                                    )}
                                </span>
                            </span>
                        </span>
                    )}

                    {/* 현재 노드의 직접 경보 배지 */}
                    {alertCount && (
                        <span className="ml-2 inline-flex items-center gap-2 flex-shrink-0 mr-2">
                            {node.event_status === 1 && <AlertBadge color={doorColor.alert} label={messages.alertBadge.alert} />}
                            {node.event_status === 2 && <CheckedBadge color={doorColor.checked} label={messages.alertBadge.checked} />}
                            {node.event_status === 3 && <AutoCheckedBadge color={doorColor.autoChecked} label={messages.alertBadge.autoChecked} />}

                            <span className="flex items-center px-1.5 py-0.5 rounded-full bg-[var(--kendo-color-surface)] border border-[var(--kendo-color-on-surface-active)]">
                                <Link size={10} className="text-[var(--kendo-color-on-surface)] mr-0.5" />
                            </span>
                        </span>
                    )}
                </span>
            </div>

            {/* 하위 노드 TreeNode 컴포넌트 재귀 호출 */}
            {expanded && hasChildren && node.childs && node.childs.length > 0 && !isNewNode && (
                <div>
                    {node.childs.map((child) => (
                        <div
                            key={child.code}
                            className="ml-4 pl-1"
                            style={{
                                borderLeft: "2px solid #E5E7EB",
                            }}
                        >
                            <TreeNode
                                key={child.code}
                                node={child}
                                selectedDoorCodeList={selectedDoorCodeList}
                                selectedDoorMapCode={selectedDoorMapCode}
                                doorMonitoringActions={doorMonitoringActions}
                                globalGrapicItemColor={globalGrapicItemColor}
                                level={level + 1}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TreeNode;
