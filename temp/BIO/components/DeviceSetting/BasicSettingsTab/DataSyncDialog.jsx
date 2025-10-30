import { useDataSync } from "../../../hooks/reactQueryHooks/useDeviceSettingsDataApi";
import useBioDeviceStore from "../../../store/bioDeviceStore";

const { Button } = require("@progress/kendo-react-buttons");
const { Dialog, DialogActionsBar } = require("@progress/kendo-react-dialogs");
const { AlertTriangle, Loader2 } = require("lucide-react");

const DataSyncDialog = ({ isOpen, onClose }) => {
    const { selectedSettingDevice } = useBioDeviceStore();
    const { mutate: dataSync, isPending: isDataSyncPending } =
        useDataSync();

    const addSyncDevice = useBioDeviceStore(state => state.actions.addSyncDevice);

    const handleDataSync = () => {
        dataSync(selectedSettingDevice.device_id, {
            onSuccess: () => {
                addSyncDevice([selectedSettingDevice.device_id]);
                onClose();
            },
        });
    };

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
                        <h3 className="text-lg font-medium">데이터 동기화</h3>
                    </div>

                    {/* 메시지는 아래에 표시 */}
                    <div>
                        <p className="text-sm">
                            데이터 동기화를 진행하시겠습니까?
                            <br />
                            데이터 동기화는 10분 이상의 시간이 소요 될 수
                            있습니다.
                        </p>
                    </div>
                </div>
            </div>
            <DialogActionsBar>
                <div className="flex gap-2 justify-end">
                    <Button onClick={onClose} disabled={isDataSyncPending}>
                        취소
                    </Button>
                    <Button
                        themeColor="primary"
                        onClick={handleDataSync}
                        disabled={isDataSyncPending}
                    >
                        {isDataSyncPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            "확인"
                        )}
                    </Button>
                </div>
            </DialogActionsBar>
        </Dialog>
    );
};

export default DataSyncDialog;
