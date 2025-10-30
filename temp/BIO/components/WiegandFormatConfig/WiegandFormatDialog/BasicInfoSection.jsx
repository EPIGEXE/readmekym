import { useGlobalConfigStore } from "v2/libs";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import { memo } from "react";
import { getMessages } from "../../../transMessages";

const BasicInfoSection = memo(
    ({
        isReadOnly,
        description,
        totalBits,
        errors,
        handleInputChange,
        control,
    }) => {
        const { globalConfig } = useGlobalConfigStore();
        const messages = getMessages(globalConfig?.languageId);

        return (
            <div className="p-4 border rounded-md shadow-sm">
                <div className="text-lg font-bold mb-4">
                    {messages.wiegandFormatDialog.basicInfo.title}
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center">
                        <label className="w-24 flex-shrink-0">
                            {messages.wiegandFormatDialog.basicInfo.description}
                        </label>
                        <Input
                            value={description}
                            className="w-full"
                            onChange={handleInputChange("description")}
                            disabled={isReadOnly}
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="w-24 flex-shrink-0">
                            {messages.wiegandFormatDialog.basicInfo.totalBits}
                        </label>
                        <div className="w-full">
                            <NumericTextBox
                                value={totalBits}
                                onChange={handleInputChange("totalBits")}
                                format="n0"
                                className="w-full"
                                disabled={isReadOnly}
                            />
                            {errors.totalBits && (
                                <span className="text-[var(--kendo-color-error)] text-sm">
                                    {errors.totalBits.message}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

export default BasicInfoSection;
