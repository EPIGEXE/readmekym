import { useState } from "react";
import { useFirmwareList, useFirmwareVersion } from "../../hooks/reactQueryHooks/useFirmwareApi";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { AlertTriangle, HardDriveDownload, Tag } from "lucide-react";
import { Button } from "@progress/kendo-react-buttons";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";
import { Loader } from "@progress/kendo-react-indicators";

/**
 * 펌웨어 업데이트 다이얼로그
 */
const FirmwareUpdateDialog = ({ isOpen, onClose, deviceData, onFirmwareUpdate }) => {

    const { globalConfig } = useGlobalConfigStore();
    const messages = getMessages(globalConfig?.languageId);

    const { data: firmwareList, isLoading: isFirmwareListLoading } = useFirmwareList();
    const { data: firmwareVersion } = useFirmwareVersion(deviceData?.device_id);

    const [selectedFirmware, setSelectedFirmware] = useState(null);

    if (!isOpen) return null;

    const handleFirmwareChange = (firmwareId) => {
        setSelectedFirmware(firmwareId);
    };

    const handleUpdateClick = () => {
        if (!selectedFirmware) return;

        console.log(deviceData.device_id, selectedFirmware);
        onFirmwareUpdate(deviceData.device_id, selectedFirmware);
        onClose();
    };

    return (
        <Dialog title={messages.firmwareUpdateDialog.title} onClose={onClose} width={600}>
            <div className="p-5">
                {/* 장치 정보 카드 */}
                <div className="flex items-center p-3 mb-5 border border-gray-100 rounded-md shadow-sm">
                    <div className="flex-shrink-0 mr-3 bg-[var(--kendo-color-primary-subtle)] rounded-full p-1">
                        <HardDriveDownload size={30} className="m-1 text-[var(--kendo-color-primary)]" />
                    </div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-baseline mb-1">
                            <label className="text-xs uppercase tracking-wider font-semibold text-[var(--kendo-color-primary)]">{messages.firmwareUpdateDialog.deviceInfo}</label>
                            <label className="text-xs">ID: {deviceData?.device_id}</label>
                        </div>
                        <div className="flex items-center space-x-4">
                            <label>{deviceData?.device_name}</label>
                            <label className="text-sm flex items-center">
                                <Tag size={15} className="mr-1" />
                                {firmwareVersion || messages.firmwareUpdateDialog.noFirmwareVersion}
                            </label>
                        </div>
                    </div>
                </div>

                {/* 펌웨어 선택 섹션 */}
                <div className="mb-5">
                    <h3 className="text-lg font-semibold mb-3">{messages.firmwareUpdateDialog.firmwareVersion}</h3>
                    <div className="text-sm text-[var(--kendo-color-warning)] p-3 bg-[var(--kendo-color-warning-subtle)] rounded-lg mb-4 flex items-start">
                        <AlertTriangle size={20} className="mr-1" />
                        <span>
                            {messages.firmwareUpdateDialog.warning} {messages.firmwareUpdateDialog.firmwareUpdateWarning}
                        </span>
                    </div>
                </div>
                <div className="space-y-2 h-[300px] overflow-y-auto">
                    {isFirmwareListLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader type="infinite-spinner" size="large" />
                        </div>
                    ) : (
                        firmwareList?.map((firmware) => (
                        <div
                            key={firmware}
                            className={`py-2 px-3 border rounded-md cursor-pointer transition-all ${
                                selectedFirmware === firmware
                                    ? 'border-[var(--kendo-color-primary)] bg-[var(--kendo-color-primary-subtle)]'
                                    : 'border-[var(--kendo-color-secondary)] hover:border-[var(--kendo-color-secondary)] hover:bg-[var(--kendo-color-secondary-subtle)]'
                            }`}
                            onClick={() => handleFirmwareChange(firmware)}
                        >
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    className="w-3.5 h-3.5 text-[var(--kendo-color-primary)] border-[var(--kendo-color-secondary)]"
                                    checked={selectedFirmware === firmware}
                                    onChange={() => handleFirmwareChange(firmware)}
                                />
                                <div className="ml-2 flex-grow">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-medium text-sm">{firmware}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))
                    )}
                </div>
            </div>
            <DialogActionsBar>
                <div className="flex gap-2 justify-end">
                    <Button look="outline" onClick={onClose} themeColor="light">
                        {messages.common.cancel}
                    </Button>
                    <Button
                        look="flat"
                        onClick={handleUpdateClick}
                        themeColor="primary"
                        disabled={!selectedFirmware}
                    >
                        {messages.firmwareUpdateDialog.updateStart}
                    </Button>
                </div>
            </DialogActionsBar>
        </Dialog>
    );
};

export default FirmwareUpdateDialog;
