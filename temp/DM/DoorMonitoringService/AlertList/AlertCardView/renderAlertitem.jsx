import { AlertCircle, Clock, Link } from "lucide-react";

/**
 * 경보 카드 뷰의 경보 아이템 렌더링 함수
 * @param {Object} alert - 경보 정보
 * @param {boolean} isConnectedToSelectedDoor - 선택된 문과 연결되어 있는지 여부
 * @param {Object} selectedDoor - 선택된 문 정보
 * @param {Function} handleDoorClick - 문 클릭 이벤트 핸들러
 * @returns {JSX.Element} 경보 아이템 렌더링 결과
 *
 * 경보 카드 뷰의 경보 아이템을 렌더링하는 함수
 */
const renderAlertItem = (alert, isConnectedToSelectedDoor, selectedDoor, handleDoorClick, messages) => {
    // ============================= 개별 변수 =============================
    const statusLabel = alert.status === 0 ? messages.alertList.alertCardView.end : messages.alertList.alertCardView.alarm; // 상태 라벨
    const statusColor =
        alert.status === 0
            ? "bg-[var(--kendo-color-dark-subtle)] text-[var(--kendo-color-on-dark)]"
            : "bg-[var(--kendo-color-error-subtle)] text-[var(--kendo-color-error)]"; // 상태 색상

    // ============================= 유틸 함수 =============================
    // 발생 시간 포맷팅 함수
    const formatEventTime = (eventTime) => {
        if (!eventTime) return null;
        try {
            const date = new Date(eventTime);
            return date.toLocaleString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            });
        } catch (error) {
            return null;
        }
    };

    const formattedEventTime = formatEventTime(alert.event_time); // 발생 시간 포맷팅

    return (
        <div
            key={alert.code}
            className={`flex flex-col p-4 border rounded-lg mb-3 transition-colors ${
                isConnectedToSelectedDoor ? "border-[var(--kendo-color-primary)]" : "border-[var(--kendo-color-base)]"
            }`}
        >
            {/* 상단 영역을 2줄로 구성 */}
            <div className="mb-2">
                {/* 첫 번째 줄: 발생시간만 오른쪽에 */}
                <div className="flex justify-between mb-2">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${statusColor}`}>{statusLabel}</span>
                    {formattedEventTime && (
                        <div className="flex items-center gap-1 text-xs">
                            <Clock size={12} />
                            <span>{formattedEventTime}</span>
                        </div>
                    )}
                    {!formattedEventTime && alert.event_time === null && (
                        <div className="flex items-center gap-1 text-xs">
                            <Clock size={12} />
                            <span>{messages.alertList.alertCardView.noEventTime}</span>
                        </div>
                    )}
                </div>

                {/* 두 번째 줄: 코드/이름과 상태가 같은 줄에 */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span
                            className={`font-bold text-base ${
                                isConnectedToSelectedDoor ? "text-[var(--kendo-color-primary)]" : ""
                            }`}
                        >
                            {alert.code} <span className="mx-1.5">·</span> {alert.name}
                        </span>
                    </div>
                </div>
            </div>

            {/* 이벤트 설명 */}
            <div className="flex items-center gap-2 mb-3 p-2 rounded bg-[var(--kendo-color-secondary-subtle)]">
                <AlertCircle size={16} className="text-[var(--kendo-color-info)]" />
                <span className={`text-sm ${statusColor}`}>{alert.event_desc}</span>
            </div>

            {/* 장비 정보 */}
            <div className="flex items-center gap-1 mb-3 text-xs">
                <span className="inline-block w-2 h-2 rounded-full bg-[var(--kendo-color-info)] mr-1"></span>
                <span>{alert.product_name}</span>
                <span className="mx-1 text-[var(--kendo-color-base)]">›</span>
                <span>{alert.panel_desc}</span>
                {alert.dev_desc && (
                    <>
                        <span className="mx-1 text-[var(--kendo-color-base)]">›</span>
                        <span className="text-[var(--kendo-color-primary)]">
                            {alert.dev_desc}
                            {alert.second_dev_desc && ` (${alert.second_dev_desc})`}
                        </span>
                    </>
                )}
            </div>

            {/* 연결된 문 */}
            {alert.connectedDoor && alert.connectedDoor.length > 0 && (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center">
                        <Link size={13} className="mr-1.5 text-[var(--kendo-color-secondary)]" />
                        <span className="text-xs">{messages.alertList.alertCardView.connectedDoor}</span>
                        <span className="ml-1 px-1.5 py-0.5 text-[10px] font-medium bg-[var(--kendo-color-secondary-subtle)] text-[var(--kendo-color-secondary)] rounded">
                            {alert.connectedDoor.length}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                        {alert.connectedDoor.map((door) => (
                            <div
                                key={door.code}
                                onClick={() => handleDoorClick(door)}
                                className={`
                                    inline-flex items-center px-2 py-0.5 rounded text-xs border
                                    ${
                                        selectedDoor?.code === door.code
                                            ? "bg-[var(--kendo-color-primary-subtle)] border-[var(--kendo-color-primary)] text-[var(--kendo-color-primary)]"
                                            : "bg-[var(--kendo-color-surface)] border-[var(--kendo-color-emphasis)] text-[var(--kendo-color-primary)]"
                                    }
                                    cursor-pointer transition-colors
                                `}
                            >
                                <div className="w-1 h-1 rounded-full bg-current mr-1.5" />
                                {door.name || door.code}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default renderAlertItem;