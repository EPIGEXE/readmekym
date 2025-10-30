import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { Loader2 } from "lucide-react";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";

const WiegandFormatDeleteDialog = ({ 
    isOpen, 
    onClose, 
    wiegandFormatData,
    onWiegandFormatSelect,
    onWiegandFormatRemove,
    selectedWiegandFormat,
    isPending
}) => {
    const { globalConfig } = useGlobalConfigStore();
    const messages = getMessages(globalConfig?.languageId);

    if (!isOpen) return null;


    return (
        <Dialog title={messages.wiegandFormatDeleteDialog.title} onClose={onClose} width={1000}>
            <div className="p-3">
                <div className="mb-4">
                    {messages.wiegandFormatDeleteDialog.description}
                </div>
                <Grid
                    data={wiegandFormatData}
                    dataItemKey="id"
                    onSelectionChange={onWiegandFormatSelect}
                    scrollable="scrollable"
                    selectable={{
                        enabled: isPending ? false : true,
                        mode: 'multiple',
                    }}
                    style={{
                        height: '400px',
                        border: "none",
                        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)"
                    }}
                    className="rounded-lg overflow-hidden"
                >
                    <GridColumn field="id" title={messages.wiegandFormatDeleteDialog.gridColumns.id} width="120px" />
                    <GridColumn field="description" title={messages.wiegandFormatDeleteDialog.gridColumns.description} />
                    <GridColumn field="format_length" title={messages.wiegandFormatDeleteDialog.gridColumns.formatLength} width="150px" />
                </Grid>
            </div>
            <DialogActionsBar>
                <div className="flex gap-2 justify-end">
                    <Button 
                        look="outline" 
                        onClick={onClose}
                    >
                        {messages.common.cancel}
                    </Button>
                    <Button 
                        look="flat" 
                        onClick={onWiegandFormatRemove}
                        themeColor="error"
                        disabled={selectedWiegandFormat.length === 0 || isPending}
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : messages.common.remove}
                    </Button>
                </div>
            </DialogActionsBar>
        </Dialog>
    );
};

export default WiegandFormatDeleteDialog;