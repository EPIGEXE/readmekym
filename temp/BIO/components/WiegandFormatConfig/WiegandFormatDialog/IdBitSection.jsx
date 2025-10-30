import { useGlobalConfigStore } from "v2/libs";
import { Button } from "@progress/kendo-react-buttons";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { plusCircleIcon } from "@progress/kendo-svg-icons";
import { memo, useState } from "react";
import { getMessages } from "../../../transMessages";

const IdBitSection = memo(
    ({
        isReadOnly,
        idFields,
        setIdFields,
        handleAddIdField,
        handleIdFieldSave,
        handleIdFieldCancel,
        handleIdFieldEdit,
    }) => {
        const { globalConfig } = useGlobalConfigStore();
        const messages = getMessages(globalConfig?.languageId);

        const [edit, setEdit] = useState({});

        const enterEdit = (dataItem) => {
            setEdit({ ...edit, [dataItem.id]: true });
            handleIdFieldEdit(dataItem);
        };

        const cancel = (dataItem) => {
            setEdit({ ...edit, [dataItem.id]: false });
            handleIdFieldCancel(dataItem);
        };

        const update = (dataItem) => {
            setEdit({ ...edit, [dataItem.id]: false });
            handleIdFieldSave(dataItem);
        };

        return (
            <div className="p-4 border rounded-md shadow-sm h-full">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-lg font-bold">
                        {messages.wiegandFormatDialog.idBit.title}
                    </div>
                    <Button
                        look="flat"
                        type="button"
                        svgIcon={plusCircleIcon}
                        themeColor="primary"
                        onClick={handleAddIdField}
                        disabled={isReadOnly}
                    >
                        {messages.common.add}
                    </Button>
                </div>
                <Grid
                    data={idFields}
                    dataItemKey="id"
                    edit={edit}
                    editable={true}
                    scrollable="scrollable"
                    onItemChange={(e) => {
                        const { dataItem, field, value } = e;
                        const updatedItem = { ...dataItem, [field]: value };
                        setIdFields(
                            idFields.map((item) =>
                                item.id === dataItem.id ? updatedItem : item
                            )
                        );
                    }}
                    style={{ height: "calc(100% - 50px)" }}
                >
                    <GridColumn
                        field="startBit"
                        title={messages.wiegandFormatDialog.idBit.startBit}
                        editor="numeric"
                        editable={true}
                    />
                    <GridColumn
                        field="endBit"
                        title={messages.wiegandFormatDialog.idBit.endBit}
                        editor="numeric"
                        editable={true}
                    />
                    <GridColumn
                        field="length"
                        title={messages.wiegandFormatDialog.idBit.length}
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
                                                    onClick={() =>
                                                        update(props.dataItem)
                                                    }
                                                    disabled={isReadOnly}
                                                    className="mr-2"
                                                >
                                                    {messages.common.confirm}
                                                </Button>
                                                <Button
                                                    look="flat"
                                                    size="small"
                                                    onClick={() =>
                                                        cancel(props.dataItem)
                                                    }
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
                                                    onClick={() =>
                                                        enterEdit(
                                                            props.dataItem
                                                        )
                                                    }
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
                                                        setIdFields(
                                                            idFields.filter(
                                                                (item) =>
                                                                    item.id !==
                                                                    props
                                                                        .dataItem
                                                                        .id
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
                            },
                        }}
                    />
                </Grid>
            </div>
        );
    }
);

export default IdBitSection;
