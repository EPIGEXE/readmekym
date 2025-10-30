import { cloneElement, memo, useCallback, useEffect } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { bellIcon, gearIcon, uploadIcon } from "@progress/kendo-svg-icons";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import DeviceListActionButtonGroup from "./DeviceListActionButtonGroup";
import { DeviceStatusCell } from "../common/GridCell";
import { getMessages } from "../../transMessages";
import { useGlobalConfigStore, useServerConfigStore } from "v2/libs";
import useBioDeviceStore from "../../store/bioDeviceStore";
import { StompClient } from "v2/libs/utils/stomp";
import useBioWebSocketStore from "../../store/bioWebSocketStore";

/**
 * 생체 장치 리스트 그리드
 */
const DeviceGrid = memo(
    ({
        isLoading,
        sortedDevices,
        setSortedDevices,
        sort,
        handleGridSort,
        handleAddDeviceOpen,
        handleRemoveDeviceOpen,
        onRealTimeEventClick,
        onWiegandClick,
        onAdminSettingClick,
        handleEventClick,
        handleUpdateFirmware,
        handleConnectedDeviceManagementOpen,
    }) => {
        const { globalConfig } = useGlobalConfigStore();
        const messages = getMessages(globalConfig?.languageId);
        const { subscribe } = useBioWebSocketStore((state) => state.actions);

        // 장치 연결 상태 업데이트 핸들러
        const handleDeviceConnectionUpdate = useCallback(
            (eventData) => {
                if (!eventData.main_code || !eventData.device_id) return;

                // 연결 상태 변경 이벤트인 경우만 처리
                if (eventData.main_code === "0x3b" || eventData.main_code === "0x3c") {
                    console.log(
                        "웹소켓 실시간 수신 DeviceGrid",
                        eventData.device_id,
                        eventData.main_code === "0x3b" ? "online" : "offline"
                    );
                    const updatedDevices = sortedDevices.map((device) => {
                        if (device.device_id === eventData.device_id) {
                            return {
                                ...device,
                                is_connected: eventData.main_code === "0x3b" ? 1 : 0,
                            };
                        }
                        return device;
                    });

                    // 단순히 devices 업데이트만 하면 됨
                    setSortedDevices(updatedDevices);
                }
            },
            [sortedDevices, setSortedDevices]
        );

        useEffect(() => {
            // 메시지 구독만 수행
            const unsubscribe = subscribe((message) => {
                try {
                    handleDeviceConnectionUpdate(message);
                } catch (error) {
                    console.error("메시지 처리 중 오류:", error);
                }
            });

            // cleanup - 구독 해제만 수행
            return () => unsubscribe();
        }, [handleDeviceConnectionUpdate]);

        const setSelectedSettingDevice = useBioDeviceStore((state) => state.actions.setSelectedSettingDevice);

        const handleSettingClick = (props) => {
            setSelectedSettingDevice(props.dataItem);
        };

        // ========================== 그리드 각 행의 버튼 그룹 ==========================
        const ActionButtons = (props) => {
            const isOffline = props.dataItem.is_connected != 1;

            return (
                <td>
                    <div className="flex gap-2">
                        <Button
                            look="flat"
                            size="small"
                            svgIcon={gearIcon}
                            title={messages.deviceGrid.cellActionButtons.settings}
                            onClick={() => handleSettingClick(props)}
                        >
                            {messages.deviceGrid.cellActionButtons.settings}
                        </Button>
                        <Button
                            look="flat"
                            size="small"
                            svgIcon={bellIcon}
                            title={messages.deviceGrid.cellActionButtons.eventLog}
                            onClick={() => handleEventClick(props)}
                        >
                            {messages.deviceGrid.cellActionButtons.eventLog}
                        </Button>
                        <Button
                            look="flat"
                            size="small"
                            svgIcon={uploadIcon}
                            onClick={() => handleUpdateFirmware(props.dataItem.device_id)}
                            disabled={isOffline}
                            title={messages.deviceGrid.cellActionButtons.firmwareUpdate}
                        >
                            {messages.deviceGrid.cellActionButtons.firmwareUpdate}
                        </Button>
                    </div>
                </td>
            );
        };

        const customRow = (props) => {
            const isOffline = props.dataItem.is_connected != 1;

            const trProps = {
                ...props.trProps,
                className: `${props.trProps.className || ""} ${isOffline ? "text-[var(--kendo-color-error)]" : ""}`,
            };

            return <tr {...trProps}>{props.children}</tr>;
        };

        return (
            <Grid
                data={sortedDevices}
                style={{ height: "100%" }}
                sortable={true}
                sort={sort}
                onSortChange={handleGridSort}
                scrollable="scrollable"
                className="rounded-lg overflow-hidden"
                rows={{ data: customRow }}
                showLoader={isLoading}
            >
                {/* 그리드 상단 툴바 */}
                <GridToolbar>
                    <DeviceListActionButtonGroup
                        onAddDeviceOpen={handleAddDeviceOpen}
                        onRemoveDeviceOpen={handleRemoveDeviceOpen}
                        onRealTimeEventClick={onRealTimeEventClick}
                        onWiegandClick={onWiegandClick}
                        onAdminSettingClick={onAdminSettingClick}
                        onConnectedDeviceManagementOpen={handleConnectedDeviceManagementOpen}
                    />
                </GridToolbar>

                <GridColumn
                    field="is_connected"
                    title={messages.deviceGrid.gridColumns.deviceStatus}
                    width="150px"
                    cells={{ data: (props) => DeviceStatusCell(props) }}
                />
                <GridColumn field="device_id" title={messages.deviceGrid.gridColumns.deviceId} width="150px" />
                <GridColumn field="device_name" title={messages.deviceGrid.gridColumns.deviceName} />
                <GridColumn field="type_name" title={messages.deviceGrid.gridColumns.deviceTypeName} />
                <GridColumn field="ipv4_address" title={messages.deviceGrid.gridColumns.deviceIp} width="150px" />
                <GridColumn
                    title={messages.deviceGrid.gridColumns.deviceManagement}
                    width="450px"
                    cells={{ data: (props) => ActionButtons(props) }}
                />
            </Grid>
        );
    }
);

export default DeviceGrid;
