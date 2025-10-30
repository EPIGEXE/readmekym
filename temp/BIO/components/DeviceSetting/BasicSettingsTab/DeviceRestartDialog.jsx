import { Button } from "@progress/kendo-react-buttons";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { AlertTriangle, Loader2 } from "lucide-react";
import useBioDeviceStore from "../../../store/bioDeviceStore";
import { useRestartDevice } from "../../../hooks/reactQueryHooks/useDeviceSettingsDataApi";

const DeviceRestartDialog = ({ isOpen, onClose }) => {

    const { selectedSettingDevice } = useBioDeviceStore();
    const { mutateAsync: restartDevice, isPending } = useRestartDevice();

    const handleRestartDevice = async () => {
        await restartDevice(selectedSettingDevice.device_id);
        onClose();
    }

    return (
        <Dialog title={null}>
            <div className="p-5 min-w-[300px]">
                <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                        {/* 경고 아이콘 */}
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--kendo-color-warning-subtle)] mr-2">
                            <AlertTriangle className="w-4 h-4 text-[var(--kendo-color-warning)]" />
                        </div>

                        {/* 제목 */}
                        <h3 className="text-lg font-medium">장치 재시작</h3>
                    </div>

                    {/* 메시지는 아래에 표시 */}
                    <div>
                        <p className="text-sm">장치를 재시작 하시겠습니까?</p>
                    </div>
                </div>
            </div>
            <DialogActionsBar>
                <div className="flex gap-2 justify-end">
                    <Button onClick={onClose} disabled={isPending}>취소</Button>
                    <Button themeColor="primary" onClick={handleRestartDevice} disabled={isPending}>
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : '확인'}
                    </Button>
                </div>
            </DialogActionsBar>
        </Dialog>
    );
};

export default DeviceRestartDialog;
