const { memo, useRef, useMemo } = require("react");
const { default: SelectionBorder } = require("./SelectionBorder");
const { DoorClosed } = require("lucide-react");

/**
 * 문 모니터링 그리드 뷰 문 카드 컴포넌트
 * @param {Object} door - 문 정보
 * @param {boolean} isSelected - 선택 여부
 * @param {function} toggleSelection - 선택 토글 함수
 * @param {Object} globalGrapicItemColor - 전역 그래픽 아이템 색상 정보
 * @param {Object} childAlertStatus - 하위 문 경고 상태
 */
const DoorCard = memo(
    ({ door, isSelected, toggleSelection, globalGrapicItemColor, childAlertStatus }) => {
        // ============================== useRef ==============================
        const cardRef = useRef(null); // SVG 선택 테두리를 위한 카드 참조

        // ============================== 개별 변수 ==============================
        // 문 색상 정보
        const doorColor = useMemo(() => {
            return {
                default: door.coordinate.fill || globalGrapicItemColor.default,
                alert: door.coordinate.alertFill || globalGrapicItemColor.alert,
                checked: door.coordinate.checkedFill || globalGrapicItemColor.checked,
                autoChecked: door.coordinate.autoCheckedFill || globalGrapicItemColor.autoChecked,
            };
        }, [door.coordinate, globalGrapicItemColor]);

        // 카드 크기에 따른 스타일 설정
        const cardStyles = useMemo(() => {
            return {
                padding: "p-2",
                iconSize: "w-8 h-8",
                iconClass: "h-4 w-4",
                textSize: "text-xs",
                gap: "gap-1.5",
                badgeText: "text-[10px]",
                badgePadding: "px-1 py-0.5",
            };
        }, []);

        return (
            <div
                ref={cardRef}
                className={`relative ${
                    cardStyles.padding
                } rounded-lg cursor-pointer transition-all flex items-center justify-center
                    ${door.event_status === 1 || childAlertStatus?.hasActive ? "alert-card" : ""}
                    ${isSelected ? "selected-card" : ""}`}
                onClick={() => toggleSelection(door.code)}
            >
                {/* 테두리  - 선택 시 SVG 선택 테두리 */}
                {isSelected && <SelectionBorder cardRef={cardRef} />}

                {/* 테두리 - 경보 시 */}
                {(door.event_status === 1 || childAlertStatus?.hasActive) && !isSelected && (
                    <div className="absolute inset-0 rounded-lg pointer-events-none alert-border" />
                )}

                {/* 테두리 - 정상 시 */}
                {!(door.event_status === 1 || childAlertStatus?.hasActive) && !isSelected && (
                    <div className="absolute inset-0 rounded-lg pointer-events-none normal-border" />
                )}

                {/* 경보 발생 시 경보 표시 인디케이터 */}
                {(door.event_status === 1 || childAlertStatus?.hasActive) && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center alert-indicator">
                        <span className="text-white font-bold text-[8px]">!</span>
                    </div>
                )}

                {/* 문 정보 표시 */}
                <div className={`flex items-center ${cardStyles.gap} relative z-10 w-full`}>
                    <div
                        className={`${cardStyles.iconSize} flex items-center justify-center rounded-md transition-colors`}
                        style={{
                            backgroundColor:
                                door.event_status === 1 || childAlertStatus?.hasActive
                                    ? doorColor.alert
                                    : door.event_status === 2
                                    ? doorColor.checked
                                    : door.event_status === 3
                                    ? doorColor.autoChecked
                                    : doorColor.default,
                        }}
                    >
                        <DoorClosed className={`${cardStyles.iconClass} text-white`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <span
                            className={`font-medium ${cardStyles.textSize} truncate block w-full
                                ${door.event_status === 1 || childAlertStatus?.hasActive ? "alert-text" : ""}
                                ${isSelected && !(door.event_status === 1 || childAlertStatus?.hasActive) ? "text-blue-600" : ""}
                                ${!isSelected && !(door.event_status === 1 || childAlertStatus?.hasActive) ? "text-gray-800" : ""}`}
                            title={door.name || "문"}
                        >
                            {door.name || "문"}
                        </span>
                        {door.sub_name && (
                            <span
                                className={`${cardStyles.textSize} truncate block w-full mt-0.5
                                    ${door.event_status === 1 || childAlertStatus?.hasActive ? "alert-text opacity-80" : ""}
                                    ${isSelected && !(door.event_status === 1 || childAlertStatus?.hasActive) ? "text-blue-500" : ""}
                                    ${!isSelected && !(door.event_status === 1 || childAlertStatus?.hasActive) ? "text-gray-600" : ""}`}
                                title={door.sub_name}
                            >
                                {door.sub_name}
                            </span>
                        )}
                    </div>
                    {(door.event_status === 1 || childAlertStatus?.hasActive) && (
                        <div className={`flex-shrink-0 rounded-full p-1`} style={{ backgroundColor: doorColor.alert }}>
                            <div
                                className={`text-white ${cardStyles.badgeText} font-medium ${cardStyles.badgePadding} `}
                            >
                                경보
                            </div>
                        </div>
                    )}
                    {door.event_status === 2 && (
                        <div
                            className={`flex-shrink-0 rounded-full p-1`}
                            style={{ backgroundColor: doorColor.checked }}
                        >
                            <div
                                className={`text-white ${cardStyles.badgeText} font-medium ${cardStyles.badgePadding} `}
                            >
                                인지
                            </div>
                        </div>
                    )}
                    {door.event_status === 3 && (
                        <div
                            className={`flex-shrink-0 rounded-full p-1`}
                            style={{ backgroundColor: doorColor.autoChecked }}
                        >
                            <div
                                className={`text-white ${cardStyles.badgeText} font-medium ${cardStyles.badgePadding} `}
                            >
                                자동인지
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    },
    (prevProps, nextProps) => {
        // childAlertStatus 객체 참조가 바뀌면 항상 리렌더링
        if (prevProps.childAlertStatus !== nextProps.childAlertStatus) {
            return false;
        }
        
        return (
            prevProps.isSelected === nextProps.isSelected &&
            prevProps.door.code === nextProps.door.code &&
            prevProps.door.event_status === nextProps.door.event_status
        );
    }
);

export default DoorCard;
