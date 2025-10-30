import { useState, useEffect } from "react";

/**
 * 문 모니터링 그리드 뷰 선택 테두리 컴포넌트
 * @param {Object} cardRef - 카드 참조
 */
const SelectionBorder = ({ cardRef }) => {
    // ============================== 상태 ==============================
    const [size, setSize] = useState({ width: 0, height: 0 }); // 카드 크기

    // ============================== useEffect ==============================
    // 카드 참조를 통한 카드 크기 감지
    useEffect(() => {
        if (!cardRef.current) return;

        const updateSize = () => {
            const rect = cardRef.current.getBoundingClientRect();
            setSize({
                width: rect.width,
                height: rect.height,
            });
        };

        updateSize();

        const resizeObserver = new ResizeObserver(() => {
            updateSize();
        });

        resizeObserver.observe(cardRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [cardRef]);

    if (size.width === 0 || size.height === 0) {
        return null;
    }

    return (
        <div className="absolute inset-0 overflow-visible pointer-events-none">
            <svg
                width="100%"
                height="100%"
                className="absolute inset-0"
                style={{ overflow: 'visible' }}
                preserveAspectRatio="none"
            >
                <rect
                    x="1"
                    y="1"
                    width={size.width - 2}
                    height={size.height - 2}
                    rx="8"
                    ry="8"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeDasharray="10,6"
                    className="animate-dash"
                />
            </svg>
        </div>
    );
};

export default SelectionBorder;