import { Button } from "@progress/kendo-react-buttons";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { plusCircleIcon } from "@progress/kendo-svg-icons";
import { memo, useState } from "react";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../../transMessages";
import { ParityTypeCell } from "../../common/GridCell";

const ParityBitSection = memo(({
    isReadOnly,
    parityFields,
    setParityFields,
    handleAddParityField,
    handleParityFieldSave,
    handleParityFieldCancel,
    handleParityFieldEdit,
}) => {
    const { globalConfig } = useGlobalConfigStore();
    const messages = getMessages(globalConfig?.languageId);
    
    // EditDescriptor 타입의 편집 상태 관리
    const [edit, setEdit] = useState({});

    const enterEdit = (dataItem) => {
        setEdit({ ...edit, [dataItem.id]: true });
        handleParityFieldEdit(dataItem);
    };

    const cancel = (dataItem) => {
        setEdit({ ...edit, [dataItem.id]: false });
        handleParityFieldCancel(dataItem);
    };

    const update = (dataItem) => {
        setEdit({ ...edit, [dataItem.id]: false });
        handleParityFieldSave(dataItem);
    };

    return (
        <div className="p-4 border rounded-md shadow-sm h-full">
            <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-bold">{messages.wiegandFormatDialog.parityBit.title}</div>
                <Button
                    look="flat"
                    type="button"
                    svgIcon={plusCircleIcon}
                    themeColor="primary"
                    onClick={handleAddParityField}
                    disabled={isReadOnly}
                >
                    {messages.common.add}
                </Button>
            </div>
            <Grid
                data={parityFields}
                dataItemKey="id"
                edit={edit}
                editable={true}
                scrollable="scrollable"
                onItemChange={(e) => {
                    const { dataItem, field, value } = e;
                    const updatedItem = { ...dataItem, [field]: value };
                    setParityFields(
                        parityFields.map((item) => (item.id === dataItem.id ? updatedItem : item))
                    );
                }}
                style={{ height: 'calc(100% - 50px)' }}
            >
                <GridColumn 
                    field="location" 
                    title={messages.wiegandFormatDialog.parityBit.loaction} 
                    width="100px" 
                    editor="numeric"
                    editable={true}
                />
                <GridColumn
                    field="type"
                    title={messages.wiegandFormatDialog.parityBit.type}
                    cells={{
                        data: (props) => {
                            const inEdit = edit[props.dataItem.id];
                            if (inEdit) {
                                return <ParityTypeCell {...props} />;
                            }
                            return <td>{props.dataItem.type === 'odd' ? messages.wiegandFormatDialog.parityBit.odd : messages.wiegandFormatDialog.parityBit.even}</td>;
                        }
                    }}
                />
                <GridColumn 
                    field="startBit" 
                    title={messages.wiegandFormatDialog.parityBit.startBit} 
                    editor="numeric"
                    editable={true}
                />
                <GridColumn 
                    field="endBit" 
                    title={messages.wiegandFormatDialog.parityBit.endBit} 
                    editor="numeric"
                    editable={true}
                />
                <GridColumn 
                    field="length" 
                    title={messages.wiegandFormatDialog.parityBit.length} 
                    editable={false} 
                />
                <GridColumn
                    width="200px"
                    cells={{
                        data: (props) => {
                            const inEdit = edit[props.dataItem.id];
                            return (
                                <td>
                                    {inEdit ? (
                                        <>
                                            <Button
                                                look="flat"
                                                themeColor="primary"
                                                size="small"
                                                onClick={() => update(props.dataItem)}
                                                className="mr-2"
                                                disabled={isReadOnly}
                                            >
                                                {messages.common.confirm}
                                            </Button>
                                            <Button
                                                look="flat"
                                                size="small"
                                                onClick={() => cancel(props.dataItem)}
                                                disabled={isReadOnly}
                                            >
                                                {messages.common.cancel}
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                look="flat"
                                                themeColor="primary"
                                                size="small"
                                                onClick={() => enterEdit(props.dataItem)}
                                                className="mr-2"
                                                disabled={isReadOnly}
                                            >
                                                {messages.common.edit}
                                            </Button>
                                            <Button
                                                look="flat"
                                                themeColor="error"
                                                size="small"
                                                onClick={() =>
                                                    setParityFields(
                                                        parityFields.filter(
                                                            (item) => item.id !== props.dataItem.id
                                                        )
                                                    )
                                                }
                                                disabled={isReadOnly}
                                            >
                                                {messages.common.remove}
                                            </Button>
                                        </>
                                    )}
                                </td>
                            );
                        }
                    }}
                />
            </Grid>
        </div>
    );
});

export default ParityBitSection;