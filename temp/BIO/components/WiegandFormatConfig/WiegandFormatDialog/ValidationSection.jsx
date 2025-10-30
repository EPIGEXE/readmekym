import { useGlobalConfigStore } from "v2/libs";
import { memo, useMemo } from "react";
import { getMessages } from "../../../transMessages";

const ValidationSection = memo(({ errors }) => {
    const { globalConfig } = useGlobalConfigStore();
    const messages = getMessages(globalConfig?.languageId);
    
    const validationItems = useMemo(() => {
        const items = [];
        
        // 필드 범위 오류
        if (errors.bitRangeError) {
            items.push({
                type: 'error',
                message: errors.bitRangeError.message
            });
        }
        
        // 비트 순서 오류
        if (errors.bitOrderError) {
            items.push({
                type: 'error',
                message: errors.bitOrderError.message
            });
        }
        
        // 비트 중복 오류
        if (errors.bitOverlapError) {
            items.push({
                type: 'error',
                message: errors.bitOverlapError.message
            });
        }
        
        // 할당되지 않은 비트 오류
        if (errors.unassignedBitError) {
            items.push({
                type: 'error',
                message: errors.unassignedBitError.message
            });
        }
        
        // ID 필드 오류
        if (errors.Idfields) {
            items.push({
                type: 'error',
                message: typeof errors.Idfields === 'string' 
                    ? errors.Idfields 
                    : errors.Idfields.message || 'ID 필드에 오류가 있습니다'
            });
        }
        
        // 패리티 필드 오류
        if (errors.parityField) {
            items.push({
                type: 'error',
                message: typeof errors.parityField === 'string' 
                    ? errors.parityField 
                    : errors.parityField.message || '패리티 필드에 오류가 있습니다'
            });
        }
        return items;
    }, [errors]);
    
    if (validationItems.length === 0) return null;
    
    const errorItems = validationItems.filter(item => item.type === 'error');

    
    return (
        <div className="mt-4 mb-2">
            {errorItems.length > 0 && (
                <div className="p-3 border border-[var(--kendo-color-error)] bg-[var(--kendo-color-error-subtle)] rounded-md mb-2">
                    <div className="text-lg font-sm font-bold text-[var(--kendo-color-error)] mb-2">{messages.wiegandFormatDialog.validationMessages.validationTitle}</div>
                    <ul className="list-disc pl-5">
                        {errorItems.map((item, index) => (
                            <li key={index} className="text-[var(--kendo-color-error)] text-sm">{item.message}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
});

export default ValidationSection;