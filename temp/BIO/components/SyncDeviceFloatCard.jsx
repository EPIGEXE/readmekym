import React, { useEffect, useState } from "react";
import { Loader2, ChevronUp, ChevronDown } from "lucide-react";
import useBioDeviceStore from "../store/bioDeviceStore";
import { useDataProgressList } from "../hooks/reactQueryHooks/useDataSyncApi";

const SyncDeviceFloatCard = () => {
    const syncDeviceList = useBioDeviceStore((state) => state.syncDeviceList);
    const removeSyncDevice = useBioDeviceStore((state) => state.actions.removeSyncDevice);

    const { data: progressData = {} } = useDataProgressList(syncDeviceList);

    const [isExpanded, setIsExpanded] = useState(true);

    // 진행률 100% 또는 issync가 false인 장치 자동 제거
    useEffect(() => {
        if (Object.keys(progressData).length === 0) return;

        const completedDevices = syncDeviceList.filter((deviceId) => {
            const data = progressData[deviceId];
            if (!data) return false;

            const progress = getProgress(deviceId);
            // issync가 false이거나 진행률이 100%면 완료된 것으로 간주
            return data.issync === false || progress === 100;
        });

        if (completedDevices.length > 0) {
            removeSyncDevice(completedDevices);
        }
    }, [progressData, syncDeviceList, removeSyncDevice]);

    // 접기/펼치기 토글
    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const getProgress = (deviceId) => {
        const data = progressData[deviceId];
        if (!data) return 0;

        const { sync_user_count, synced_user_count } = data;

        // 총 동기화할 사용자가 0이면 100% (완료 상태)
        if (sync_user_count === 0) return 100;

        // 진행률 계산 (0-100%)
        return Math.round((synced_user_count / sync_user_count) * 100);
    };

    return (
        <div className="fixed bottom-11 left-8 z-50">
            <div className="bg-[var(--kendo-color-app-surface)] shadow-lg border border-[var(--kendo-color-primary)] rounded-lg overflow-hidden min-w-[280px] max-w-[350px]">
                {/* 헤더 - 항상 보이는 부분 */}
                <div
                    className="flex items-center justify-between p-3 bg-[var(--kendo-color-primary)] text-white cursor-pointer hover:bg-[var(--kendo-color-primary-hover)] transition-colors"
                    onClick={toggleExpanded}
                >
                    <div className="flex items-center">
                        <span className="font-medium text-sm">
                            데이터 동기화 중 ({syncDeviceList.length})
                        </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronUp className="w-4 h-4" />
                        )}
                    </div>
                </div>

                {/* 펼쳐진 내용 */}
                {isExpanded && (
                    <div className="p-3">
                        {/* 동기화 중인 장치 목록 */}
                        <div className="space-y-3 max-h-[200px] overflow-y-auto">
                            {syncDeviceList.map((deviceId) => {
                                const progress = getProgress(deviceId);
                                const data = progressData[deviceId];

                                return (
                                    <div
                                        key={deviceId}
                                        className="p-3 bg-[var(--kendo-color-base-subtle)] rounded hover:bg-[var(--kendo-color-base-subtle-hover)] transition-colors"
                                    >
                                        {/* 장치 정보 및 제거 버튼 */}
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <div
                                                    className={`w-2 h-2 rounded-full mr-2 bg-[var(--kendo-color-primary)]`}
                                                ></div>
                                                <span className="text-sm font-medium mr-2">
                                                    장치 {deviceId}
                                                </span>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            </div>
                                        </div>

                                        {/* 진행률 바 */}
                                        {data && (
                                            <div className="mb-2">
                                                <div className="flex justify-between text-xs text-[var(--kendo-color-text-secondary)] mb-1">
                                                    <span>진행률</span>
                                                    <span>
                                                        {progress}% (
                                                        {data.synced_user_count ||
                                                            0}
                                                        /
                                                        {data.sync_user_count ||
                                                            0}
                                                        )
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                    <div
                                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                                            progress === 100
                                                                ? "bg-[var(--kendo-color-success)]"
                                                                : "bg-[var(--kendo-color-primary)]"
                                                        }`}
                                                        style={{
                                                            width: `${progress}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SyncDeviceFloatCard;
