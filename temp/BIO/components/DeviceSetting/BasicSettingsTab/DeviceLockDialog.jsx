import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { lockIcon, unlockIcon } from '@progress/kendo-svg-icons';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useLockDevice, useUnlockDevice } from '../../../hooks/reactQueryHooks/useDeviceSettingsDataApi';
import useBioDeviceStore from '../../../store/bioDeviceStore';

const DeviceLockDialog = ({ isOpen, onClose }) => {
    const { selectedSettingDevice } = useBioDeviceStore();
    const { mutateAsync: lockDevice, isPending: isLockDevicePending } = useLockDevice();
    const { mutateAsync: unlockDevice, isPending: isUnlockDevicePending } = useUnlockDevice();

    const isPending = isLockDevicePending || isUnlockDevicePending;

    const handleLockDevice = async () => {
        await lockDevice(selectedSettingDevice.device_id);
        onClose();
    };

    const handleUnlockDevice = async () => {
        await unlockDevice(selectedSettingDevice.device_id);
        onClose();
    };

    return (
        <Dialog title={null}>
            <div className="p-5">
                <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                        {/* 경고 아이콘 */}
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--kendo-color-warning-subtle)] mr-2">
                            <AlertTriangle className="w-4 h-4 text-[var(--kendo-color-warning)]" />
                        </div>

                        {/* 제목 */}
                        <h3 className="text-lg font-medium">장치 잠금 확인</h3>
                    </div>

                    {/* 메시지는 아래에 표시 */}
                    <div>
                        <p className="text-sm">
                            장치를 잠금 상태로 전환하면 사용자 인증을 할 수 없는 상태가 됩니다.
                            <br />
                            전환하시겠습니까?
                        </p>
                    </div>
                </div>
            </div>
            <DialogActionsBar>
                <div className="flex gap-2 justify-end">
                    <Button themeColor="error" svgIcon={lockIcon} onClick={handleLockDevice} disabled={isPending}>
                        {isLockDevicePending ? <Loader2 className="w-4 h-4 animate-spin" /> : '장치 잠금'}
                    </Button>
                    <Button themeColor="primary" svgIcon={unlockIcon} onClick={handleUnlockDevice} disabled={isPending}>
                        {isUnlockDevicePending ? <Loader2 className="w-4 h-4 animate-spin" /> : '장치 잠금 해제'}
                    </Button>

                    <Button onClick={onClose} disabled={isPending}>
                        취소
                    </Button>
                </div>
            </DialogActionsBar>
        </Dialog>
    );
};

export default DeviceLockDialog;
