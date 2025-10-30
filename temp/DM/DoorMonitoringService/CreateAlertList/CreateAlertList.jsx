import { Globe } from "lucide-react";
import useDoorMonitoringStore from "../../store/doorMonitoringStoreIndex";
import CreateAlertCard from "./CreateAlertCard";

/**
 * 출입통제 경보 생성 윈도우 리스트
 * 
 * 출입통제 경보 생성 윈도우에서 사용되는 리스트 컴포넌트
 */
const CreateAlertList = ({ messages }) => {
    // ============================== 전역 상태 ==============================
    const alertList = useDoorMonitoringStore((state) => state.alertList); // 경보 목록

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 font-medium mb-3 pb-2">
                <Globe size={18} />
                <span>{messages.createAlertWindow.subTitle}</span>
            </div>
            <div className="mb-4">
                <div className="text-sm  mb-3 p-3 rounded-md border border-gray-200 flex items-start gap-2">
                    <div>
                        {messages.createAlertWindow.subTitleInfo.prefix}
                        <span className="font-bold text-[var(--kendo-color-primary)]">
                            {messages.createAlertWindow.subTitleInfo.drag}
                        </span>
                        {messages.createAlertWindow.subTitleInfo.middle}
                        <span className="font-bold text-[var(--kendo-color-primary)]">
                            {messages.createAlertWindow.subTitleInfo.mapView}
                        </span>
                        {messages.createAlertWindow.subTitleInfo.suffix}
                    </div>
                </div>
                <div className="h-px bg-gray-200 w-full"></div>
            </div>

            <div className="flex-1 overflow-auto pr-1">
                {alertList.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">{messages.alertList.noAlarm}</div>
                ) : (
                    alertList.map((alert) => <CreateAlertCard key={alert.code} alert={alert} />)
                )}
            </div>
        </div>
    );
};

export default CreateAlertList;
