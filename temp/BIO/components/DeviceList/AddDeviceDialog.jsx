import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { useUnregisteredDevices } from "../../hooks/reactQueryHooks/useDeviceApi";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { DeviceStatusCell } from "../common/GridCell";
import { Button } from "@progress/kendo-react-buttons";
import { Loader } from "lucide-react";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";

/**
 * 생체 장치 추가 다이올로그
 */
const AddDeviceDialog = ({
    onClose,
    onDeviceSelect,
    onDeviceAdd,
    selectedDevices,
    isAddDevicesPending,
}) => {
    const { globalConfig } = useGlobalConfigStore();
    const messages = getMessages(globalConfig?.languageId);

    const { data: availableDevices = [], isLoading } = useUnregisteredDevices();

    const DeviceNameCell = (props) => {
        const deviceName = props.dataItem.device_name;
        // 장치 이름이 빈 문자열이면 '새 장치'로 표시
        const displayName = deviceName === "" ? messages.addDeviceDialog.newDevice : deviceName;

        return (
            <td className="k-grid-td" data-grid-col-index={props.columnIndex}>
                {displayName}
            </td>
        );
    };

    return (
        <Dialog title={messages.addDeviceDialog.title} onClose={onClose} width={1000}>
            <div className="p-3">
                <div className="mb-4">
                    {messages.addDeviceDialog.description}
                    <br />
                    <span className="font-semibold text-[var(--kendo-color-primary)]">
                        {messages.addDeviceDialog.ctrlKey}
                    </span>
                    {messages.addDeviceDialog.multipleSelect}
                </div>
                <Grid
                    data={availableDevices}
                    dataItemKey="device_id"
                    onSelectionChange={onDeviceSelect}
                    selectable={{
                        enabled: isAddDevicesPending ? false : true,
                        mode: "multiple",
                    }}
                    scrollable="scrollable"
                    style={{
                        height: "400px",
                        border: "none",
                        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                    }}
                    showLoader={isLoading}
                    className="rounded-lg overflow-hidden"
                >
                    <GridColumn
                        field="is_connected"
                        title={messages.addDeviceDialog.gridColumns.deviceStatus}
                        width="150px"
                        cells={{data: (props) => DeviceStatusCell(props)}}
                    />
                    <GridColumn
                        field="device_id"
                        title={messages.addDeviceDialog.gridColumns.deviceId}
                        width="150px"
                    />
                    <GridColumn
                        field="device_name"
                        title={messages.addDeviceDialog.gridColumns.deviceName}
                        cells={{data: (props) => DeviceNameCell(props)}}
                    />
                    <GridColumn field="type_name" title={messages.addDeviceDialog.gridColumns.deviceTypeName} />
                    <GridColumn
                        field="ipv4_address"
                        title={messages.addDeviceDialog.gridColumns.deviceIp}
                        width="150px"
                    />
                </Grid>
            </div>
            <DialogActionsBar>
                <div className="flex gap-2 justify-end">
                    <Button
                        look="outline"
                        onClick={onClose}
                        disabled={isAddDevicesPending}
                        themeColor="light"
                    >
                        {messages.common.cancel}
                    </Button>
                    <Button
                        look="flat"
                        onClick={onDeviceAdd}
                        themeColor="primary"
                        disabled={
                            selectedDevices.length === 0 || isAddDevicesPending
                        }
                    >
                        {isAddDevicesPending ? (
                            <div className="flex items-center gap-2">
                                <Loader size={16} className="animate-spin" />
                                <span>{messages.common.adding}</span>
                            </div>
                        ) : (
                            messages.common.deviceAdd
                        )}
                    </Button>
                </div>
            </DialogActionsBar>
        </Dialog>
    );
};

export default AddDeviceDialog;
