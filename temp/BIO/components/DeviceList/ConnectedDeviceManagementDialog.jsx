import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { useAllDevices, useRemoveDevices, useUnregisteredDevices } from "../../hooks/reactQueryHooks/useDeviceApi";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";


const ConnectedDeviceManagementDialog = ({ onClose }) => {
    const { globalConfig } = useGlobalConfigStore();
    const messages = getMessages(globalConfig?.languageId);

    const { data: allDeviceData, isLoading: isAllDeviceDataLoading } = useAllDevices(); // 모든 장치 목록 조회
    const { data: unregisteredDeviceData, isLoading: isUnregisteredDeviceDataLoading } = useUnregisteredDevices(); // 등록되지 않은 장치 목록 조회
    const removeDevicesMutation = useRemoveDevices();

    const handleRemoveDevice = (deviceId) => {
        removeDevicesMutation.mutate([deviceId]);
    };

    return (
        <Dialog title={messages.connectedDeviceManagementDialog.title} onClose={onClose} width={1000}>
            <div className="p-3">
                <Grid
                    data={allDeviceData}
                    dataItemKey="id"
                    selectable={{
                        enabled: true,
                        mode: 'multiple',
                    }}
                    style={{
                        height: '400px',
                        border: 'none',
                        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                    }}
                    className="rounded-lg overflow-hidden"
                    scrollable="scrollable"
                    showLoader={isAllDeviceDataLoading || isUnregisteredDeviceDataLoading}
                >
                    <GridColumn field="device_id" title={messages.connectedDeviceManagementDialog.gridColumns.deviceId} width="120px" />
                    <GridColumn field="device_name" title={messages.connectedDeviceManagementDialog.gridColumns.deviceName} />
                    <GridColumn field="type_name" title={messages.connectedDeviceManagementDialog.gridColumns.deviceTypeName} />
                    <GridColumn field="ipv4_address" title={messages.connectedDeviceManagementDialog.gridColumns.deviceIp} width="150px" />
                    <GridColumn
                        field="onlineStatus"
                        title={messages.connectedDeviceManagementDialog.gridColumns.deviceStatus}
                        width="120px"
                        cells={{data: (props) => {
                            const isOnline = props.dataItem.is_connected === 1;

                            return (
                                <td>
                                    <div className="flex items-center">
                                        <div
                                            className={`w-2 h-2 rounded-full mr-2 ${
                                                isOnline ? 'bg-[var(--kendo-color-success)]' : 'bg-[var(--kendo-color-error)]'
                                            }`}
                                        ></div>
                                        <span
                                            className={`text-xs font-medium ${
                                                isOnline ? 'text-[var(--kendo-color-success-on-subtle)]' : 'text-[var(--kendo-color-error-on-subtle)]'
                                            }`}
                                        >
                                            {isOnline ? messages.common.online : messages.common.offline}
                                        </span>
                                    </div>
                                </td>
                            );
                        }}}
                    />
                    <GridColumn
                        field="registrationStatus"
                        title={messages.connectedDeviceManagementDialog.gridColumns.registrationStatus}
                        width="120px"
                        cells={{data: (props) => {
                            const isUnregistered = unregisteredDeviceData?.some(
                                (device) => device.device_id === props.dataItem.device_id
                            );

                            return (
                                <td>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            isUnregistered ? 'bg-[var(--kendo-color-base-subtle)] text-[var(--kendo-color-base-emphasis)]' : 'bg-[var(--kendo-color-primary-subtle)] text-[var(--kendo-color-primary)]'
                                        }`}
                                    >
                                        {isUnregistered ? messages.connectedDeviceManagementDialog.unregistered : messages.connectedDeviceManagementDialog.registered}
                                    </span>
                                </td>
                            );
                        }}}
                    />
                    <GridColumn
                        title={messages.connectedDeviceManagementDialog.gridColumns.deviceManagement}
                        width="120px"
                        cells={{data: (props) => {
                            const isOnline = props.dataItem.is_connected === 1;
                            const isUnregistered = unregisteredDeviceData?.some(
                                (device) => device.device_id === props.dataItem.device_id
                            );

                            return (
                                <td>
                                    <Button
                                        look="flat"
                                        themeColor="error"
                                        size="small"
                                        disabled={isOnline || !isUnregistered} // 오프라인이면서 미등록 상태일 때만 활성화
                                        onClick={() => handleRemoveDevice(props.dataItem.device_id)}
                                    >
                                        {messages.common.remove}
                                    </Button>
                                </td>
                            );
                        }}}
                    />
                </Grid>
            </div>
            <DialogActionsBar>
                <div className="flex gap-2 justify-end">
                    <Button look="outline" onClick={onClose}>
                        {messages.common.close}
                    </Button>
                </div>
            </DialogActionsBar>
        </Dialog>
    );
};

export default ConnectedDeviceManagementDialog;
