const { memo } = require("react");

/**
 * 테이블의 연결된 문 Cell의 버튼 컴포넌트
 * @param {Object} door - 문 정보
 * @param {boolean} isSelected - 선택 상태
 * @param {Function} onClick - 클릭 이벤트 핸들러
 *
 * 최적화를 위한 메모제이션으로 별도 컴포넌트로 분리
 */
const AlertTableViewConnectedDoorButton = memo(
    ({ door, isSelected, onClick }) => {

        return (
            <div
                onClick={() => onClick(door)}
                className={`
                        inline-flex items-center px-2 py-0.5 rounded text-xs  text-[var(--kendo-color-primary)] border border-[var(--kendo-color-emphasis)]
                        ${
                            isSelected
                                ? 'bg-[var(--kendo-color-primary-subtle)]'
                                : 'bg-[var(--kendo-color-secondary-subtle)]'
                        }
                        hover:bg-[var(--kendo-color-primary-subtle)]
                        transition-colors cursor-pointer
                        active:bg-[var(--kendo-color-primary-subtle)]
                    `}
            >
                <div className="w-1 h-1 rounded-full bg-current mr-1.5" />
                {door.name || door.code}
            </div>
        );
    },
    (prev, next) => {
        // 도어 ID가 같고 선택 상태가 같으면 리렌더링 안 함
        return prev.door.code === next.door.code && prev.isSelected === next.isSelected;
    }
);

export default AlertTableViewConnectedDoorButton;