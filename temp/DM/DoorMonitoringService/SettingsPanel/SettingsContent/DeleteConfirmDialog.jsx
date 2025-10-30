import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Button } from "@progress/kendo-react-buttons";
import { AlertTriangle } from "lucide-react";

const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, itemName, messages }) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Dialog title={messages.settingsPanel.deleteConfirm.title} onClose={onClose} width={400}>
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-[var(--kendo-color-error)]" />
                    </div>
                    <div className="flex-1">
                        <span className="font-semibold">"{itemName}"</span>
                        {messages.settingsPanel.deleteConfirm.message}
                    </div>
                </div>
            </div>
            <DialogActionsBar>
                <Button look="outline" onClick={onClose}>
                    {messages.settingsPanel.deleteConfirm.cancel}
                </Button>
                <Button look="primary" themeColor="error" onClick={handleConfirm}>
                    {messages.settingsPanel.deleteConfirm.confirm}
                </Button>
            </DialogActionsBar>
        </Dialog>
    );
};

export default DeleteConfirmDialog;
