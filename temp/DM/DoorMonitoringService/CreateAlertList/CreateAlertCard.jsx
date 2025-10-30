import { useDrag } from "react-dnd";
import { ItemTypes } from "../../constants/dndTypes";
import { AlertCircle } from "lucide-react";

/**
 * 출입통제 경보 생성 윈도우 리스트 카드
 * @param {Object} alert - 경보 정보
 * 
 * 출입통제 경보 생성 윈도우에서 사용되는 리스트 카드 컴포넌트
 */
const CreateAlertCard = ({ alert }) => {
    // ============================== Hooks ==============================
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.ALERT_CARD,
        item: { alertData: alert },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    })); // dnd 드래그 앤 드랍 훅

    return (
        <div ref={drag} className={`mb-2 cursor-move ${isDragging ? "opacity-50" : ""}`}>
            <div
                className={`
                border rounded-lg px-3 py-2 mb-1.5 cursor-pointer transition-colors
                flex flex-col gap-0.5
                border-[var(--kendo-color-base)]
                hover:bg-[var(--kendo-color-secondary-subtle)]
            `}
            >
                {/* 상단: 코드, 이름, 타입 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <span className="font-semibold text-xs">{alert.code}</span>
                        <span className="mx-1.5">·</span>
                        <span className="text-xs">{alert.name}</span>
                    </div>
                </div>

                {/* 이벤트 설명 */}
                <div className="flex items-center gap-1 text-[11px] truncate">
                    <AlertCircle size={12} className="text-[var(--kendo-color-info)]" />
                    <span>{alert.event_desc}</span>
                </div>

                {/* 장비 정보 (콤팩트하게 한 줄) */}
                <div className="flex items-center gap-1 text-[10px] truncate">
                    <span>{alert.product_name}</span>
                    <span className="mx-0.5 text-[var(--kendo-color-info)]">›</span>
                    <span>{alert.panel_desc}</span>
                    {alert.dev_desc && (
                        <>
                            <span className="mx-0.5 text-[var(--kendo-color-info)]">›</span>
                            <span className="text-[var(--kendo-color-primary)]">
                                {alert.dev_desc}
                                {alert.second_dev_desc && ` (${alert.second_dev_desc})`}
                            </span>
                        </>
                    )}
                </div>

                {/* 연결된 문 (있을 때만, 아주 작게) */}
                {alert.connectedDoor?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-0.5">
                        {alert.connectedDoor.map((door) => (
                            <span
                                key={door.code}
                                className="text-[10px] px-1 py-0.5 bg-[var(--kendo-color-secondary-subtle)] text-[var(--kendo-color-primary)] border border-[var(--kendo-color-emphasis)] rounded flex items-center"
                            >
                                <span className="inline-block w-1 h-1 rounded-full bg-current mr-1"></span>
                                {door.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateAlertCard;