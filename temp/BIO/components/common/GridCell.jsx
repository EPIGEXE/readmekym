import { useGlobalConfigStore } from "v2/libs";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { getMessages } from "../../transMessages";

// Wiegand 포맷 - 패리티 타입 셀
export const ParityTypeCell = (props) => {
    const { dataItem } = props;
    const field = props.field || "";

    const parityTypes = [
        { text: "홀수", value: "odd" },
        { text: "짝수", value: "even" },
    ];

    const handleChange = (e) => {
        if (props.onChange) {
            props.onChange({
                dataItem: dataItem,
                field: field,
                value: e.value.value,
            });
        }
    };

    return (
        <td>
            <DropDownList
                data={parityTypes}
                textField="text"
                dataItemKey="value"
                value={parityTypes.find(
                    (item) => item.value === dataItem[field]
                )}
                onChange={handleChange}
            />
        </td>
    );
};

// 장치 상태 셀
export const DeviceStatusCell = (props) => {
    const { globalConfig } = useGlobalConfigStore();
    const messages = getMessages(globalConfig?.languageId);

    const isOnline = props.dataItem.is_connected === 1;

    return (
        <td
            className="text-center k-grid-td"
            data-grid-col-index={props.columnIndex}
        >
            <div
                className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-md ${
                    isOnline
                        ? "bg-[var(--kendo-color-base-subtle)]"
                        : "bg-[var(--kendo-color-error-subtle)]"
                }`}
            >
                <div className="relative flex items-center">
                    <div
                        className={`w-2 h-2 rounded-full ${
                            isOnline
                                ? "bg-[var(--kendo-color-success)]"
                                : "bg-[var(--kendo-color-error)]"
                        }`}
                    ></div>
                    {isOnline && (
                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 opacity-30"></div>
                    )}
                </div>
                <span
                    className={`text-xs font-medium tracking-wide ${
                        isOnline
                            ? "text-[var(--kendo-color-base-on-subtle)]"
                            : "text-[var(--kendo-color-error-on-subtle)]"
                    }`}
                >
                    {isOnline ? messages.common.online : messages.common.offline}
                </span>
            </div>
        </td>
    );
};

// 삭제 버튼 셀
export const DeleteCommandCell = (props) => {
    return (
        <td>
            <Button
                look="flat"
                themeColor="error"
                size="small"
                onClick={() => props.onDelete(props.dataItem)}
                className="k-button-sm"
                title="항목 삭제"
            >
                삭제
            </Button>
        </td>
    );
};
