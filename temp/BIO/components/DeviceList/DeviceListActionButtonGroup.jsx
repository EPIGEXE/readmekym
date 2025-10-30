import { useGlobalConfigStore, useLoginInfoStore } from "v2/libs";
import { Button } from "@progress/kendo-react-buttons";
import { bellIcon, dataIcon, gearIcon, linkIcon, plusCircleIcon, trashIcon } from "@progress/kendo-svg-icons";
import { memo } from "react";
import { getMessages } from "../../transMessages";

/**
 * 생체 장치 그리드 상단 툴바 버튼 그룹
 */
const DeviceListActionButtonGroup = memo(({
    onRealTimeEventClick,
    onWiegandClick,
    onAdminSettingClick,
    onAddDeviceOpen,
    onRemoveDeviceOpen,
    onConnectedDeviceManagementOpen,
}) => {
    const { globalConfig } = useGlobalConfigStore();
    const messages = getMessages(globalConfig?.languageId);
    const { loginInfo } = useLoginInfoStore();

    const isAdmin = loginInfo?.admin === 1;

    return (
        <div className="flex justify-end w-full gap-2 p-2">
            <Button look="flat" onClick={onConnectedDeviceManagementOpen} svgIcon={linkIcon} size="small">
                {messages.deviceGrid.gridActionButtons.connectedDeviceManagement}
            </Button>
            <Button look="flat" onClick={onRealTimeEventClick} svgIcon={bellIcon} size="small">
                {messages.deviceGrid.gridActionButtons.realTimeEvent}
            </Button>
            <Button look="flat" onClick={onWiegandClick} svgIcon={dataIcon} size="small">
                {messages.deviceGrid.gridActionButtons.wiegandFormat}
            </Button>
            {isAdmin && (
                <Button look="flat" onClick={onAdminSettingClick} svgIcon={gearIcon} size="small">
                    {messages.deviceGrid.gridActionButtons.adminSetting}
                </Button>
            )}
            <div className="border-l border-gray-300 mx-2" />
            <Button
                look="flat"
                onClick={onAddDeviceOpen}
                svgIcon={plusCircleIcon}
                themeColor={'primary'}
                size="medium"
            >
                {messages.deviceGrid.gridActionButtons.addDevice}
            </Button>
            <Button
                look="flat"
                onClick={onRemoveDeviceOpen}
                svgIcon={trashIcon}
                themeColor={'error'}
                size="medium"
            >
                {messages.deviceGrid.gridActionButtons.removeDevice}
            </Button>
        </div>
    );
});

export default DeviceListActionButtonGroup;
