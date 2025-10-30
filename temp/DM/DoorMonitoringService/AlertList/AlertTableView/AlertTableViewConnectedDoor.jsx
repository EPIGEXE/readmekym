import { memo } from "react";
import useDoorMonitoringStore from "../../../store/doorMonitoringStoreIndex";
import { useShallow } from "zustand/shallow";
import AlertTableViewConnectedDoorButton from "./AlertTableViewConnectedDoorButton";

/**
 * AlertTableView의 연결된 문 Cell
 * @param {Object} dataItem - 데이터 아이템
 * @returns {JSX.Element} 연결된 문 Cell
 * 
 * 최적화를 위한 메모제이션으로 별도 컴포넌트로 분리
 * selecetdDoorList의 변화가 다른 셀에 영향이 없도록 분리한 것임
 */
const AlertTableViewConnectedDoor = memo(({ dataItem }) => {
    const selectedDoorList = useDoorMonitoringStore(useShallow((state) => state.selectedDoorList));
    const applySelectedDoorWithAlertsById = useDoorMonitoringStore(
        (state) => state.actions.applySelectedDoorWithAlertsById
    );
    const applyMapViewById = useDoorMonitoringStore((state) => state.actions.applyMapViewById);

    const handleDoorClick = (door) => {
        applySelectedDoorWithAlertsById([door.code]);
        applyMapViewById(door.parent_code);
    };

    const connectedDoor = dataItem.connectedDoor || [];
    const selectedDoorId =
        selectedDoorList && selectedDoorList.length > 0 ? selectedDoorList[0].code : null;

    if (connectedDoor.length === 0) {
        return <td style={{ fontSize: '12px' }}>-</td>;
    }
    
    return (
        <td className="text-center">
            <div className="flex flex-wrap gap-1">
                {connectedDoor.map((door, index) => (
                    <AlertTableViewConnectedDoorButton
                        key={door.code || index}
                        door={door}
                        isSelected={selectedDoorId === door.code}
                        onClick={handleDoorClick}
                    />
                ))}
            </div>
        </td>
    );
});

export default AlertTableViewConnectedDoor;