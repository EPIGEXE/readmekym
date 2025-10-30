import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { AlertTriangle } from 'lucide-react';

const SaveConfirmDialog = ({ handleCancelSave, handleConfirmSave }) => {
    return (
        <Dialog title={null}>
            <div className="p-5">
                <div className="flex flex-col">
                    {/* 제목과 아이콘을 같은 줄에 표시 */}
                    <div className="flex items-center mb-2">
                        {/* 경고 아이콘 */}
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--kendo-color-warning-subtle)] mr-2">
                            <AlertTriangle className="w-4 h-4 text-[var(--kendo-color-warning)]" />
                        </div>

                        {/* 제목 */}
                        <h3 className="text-lg font-medium">저장 확인</h3>
                    </div>

                    {/* 메시지는 아래에 표시 */}
                    <div>
                        <p className="text-sm">저장되지 않은 변경 사항이 있습니다. 저장하시겠습니까?</p>
                    </div>
                </div>
            </div>
            <DialogActionsBar>
                <div className="flex gap-2 justify-end">
                    <Button look="outline" onClick={handleCancelSave}>
                        취소
                    </Button>
                    <Button look="flat" themeColor="primary" onClick={handleConfirmSave}>
                        저장
                    </Button>
                </div>
            </DialogActionsBar>
        </Dialog>
    );
};

export default SaveConfirmDialog;
