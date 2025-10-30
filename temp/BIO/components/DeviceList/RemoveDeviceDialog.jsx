import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { cloneElement } from 'react';
import { DeviceStatusCell } from '../common/GridCell';
import { Loader } from 'lucide-react';
import { useGlobalConfigStore } from 'v2/libs';
import { getMessages } from '../../transMessages';

/**
 * 생체 장치 제거 다이올로그
 */
const RemoveDeviceDialog = ({
    bioDeviceData,
    onClose,
    onDeviceSelect,
    onDeviceRemove,
    selectedDevices,
    isRemoveDevicesPending,
}) => {
    const { globalConfig } = useGlobalConfigStore();
    const messages = getMessages(globalConfig?.languageId);

    const onSelectionChange = (e) => {
        // e.select 객체에서 선택된 device_id 확인
        const selectedDeviceId = Object.keys(e.select)[0];

        // dataItems에서 선택된 장치 찾기
        const selectedDevice = e.dataItems.find((device) => device.device_id === parseInt(selectedDeviceId));

        if (selectedDevice && selectedDevice.is_connected === 1) {
            // is_connected가 1인 항목은 선택 막기
            return;
        }

        onDeviceSelect(e, 'registered');
    };
    const customRow = (props) => {
        const isConnected = props.dataItem.is_connected === 1;

        const trProps = {
            ...props.trProps,
            className: `${props.trProps.className || ''} ${isConnected ? 'k-disabled' : ''}`,
        };

        return (
            <tr {...trProps}>
                {props.children}
            </tr>
        )
    };

    return (
        <Dialog title={messages.removeDeviceDialog.title} onClose={onClose} width={1000}>
            <div className="p-3">
                <div className="mb-4">
                    {messages.removeDeviceDialog.description}
                    <br />
                    <span className="font-semibold text-[var(--kendo-color-primary)]">
                        {messages.removeDeviceDialog.ctrlKey}
                    </span>
                    {messages.removeDeviceDialog.multipleSelect}
                </div>

                {/* 등록된 장치 섹션 */}
                <div className="mb-6">
                    <Grid
                        data={bioDeviceData}
                        dataItemKey="device_id"
                        onSelectionChange={onSelectionChange}
                        rows={{data: customRow}}
                        scrollable="scrollable"
                        selectable={{
                            enabled: isRemoveDevicesPending ? false : true,
                            mode: 'multiple',
                        }}
                        style={{
                            height: '400px',
                            border: 'none',
                            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                        }}
                        className="rounded-b-lg overflow-hidden"
                    >
                        <GridColumn field="is_connected" title={messages.removeDeviceDialog.gridColumns.deviceStatus} width="150px" cells={{data: (props) => DeviceStatusCell(props)}} />
                        <GridColumn field="device_id" title={messages.removeDeviceDialog.gridColumns.deviceId} width="120px" />
                        <GridColumn field="device_name" title={messages.removeDeviceDialog.gridColumns.deviceName} />
                        <GridColumn field="type_name" title={messages.removeDeviceDialog.gridColumns.deviceTypeName} />
                        <GridColumn field="ipv4_address" title={messages.removeDeviceDialog.gridColumns.deviceIp} width="150px" />
                    </Grid>
                </div>
            </div>

            <DialogActionsBar>
                <div className="flex gap-2 justify-end">
                    <Button look="outline" onClick={onClose} disabled={isRemoveDevicesPending}>
                        {messages.common.cancel}
                    </Button>
                    <Button
                        look="flat"
                        onClick={onDeviceRemove}
                        themeColor="error"
                        disabled={selectedDevices.registeredDevices.length === 0 || isRemoveDevicesPending}
                    >
                        {isRemoveDevicesPending ? (
                            <div className="flex items-center gap-2">
                                <Loader size={16} className="animate-spin" />
                                <span>{messages.common.removing}</span>
                            </div>
                        ) : (
                            messages.common.deviceRemove
                        )}
                    </Button>
                </div>
            </DialogActionsBar>
        </Dialog>
    );
};

export default RemoveDeviceDialog;
