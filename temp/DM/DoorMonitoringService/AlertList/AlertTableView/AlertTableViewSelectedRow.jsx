import { memo } from "react";
import { useShallow } from "zustand/shallow";
import useDoorMonitoringStore from "../../../store/doorMonitoringStoreIndex";

/**
 * AlertTableView의 커스텀 행 컴포넌트 (최신 Kendo React Grid API 사용)
 * @param {Object} props - GridCustomRowProps
 * @returns {JSX.Element} 커스텀 행 컴포넌트
 */
const AlertTableViewSelectedRow = memo((props) => {
    const { trProps, children, dataItem } = props;
    const dataItemId = dataItem?.code;
    
    const isConnected = useDoorMonitoringStore(
        useShallow((state) => state.connectedAlertCodeList.includes(dataItemId))
    );

    const customTrProps = {
        ...trProps,
        'data-row-key': dataItemId,
        className: `${trProps?.className || ''} ${
            isConnected ? 'bg-[var(--kendo-color-primary-subtle)] font-medium text-[var(--kendo-color-primary)]' : ''
        }`.trim(),
        style: {
            ...trProps?.style,
            ...(isConnected && {
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
            }),
        },
    };

    return (
        <tr {...customTrProps}>
            {children}
        </tr>
    );
});

export default AlertTableViewSelectedRow;