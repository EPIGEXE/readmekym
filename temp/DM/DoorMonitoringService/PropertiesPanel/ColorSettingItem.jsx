import { Button } from "@progress/kendo-react-buttons";

/**
 * 색상 설정 아이템 컴포넌트
 * @param {Object} param0
 * @param {string} param0.title - 색상 설정 아이템 제목
 * @param {string} param0.colorType - 색상 타입
 * @param {string[]} param0.presetColors - 색상 프리셋 목록
 * @param {string} param0.colorPickerType - 색상 선택기 타입
 * @param {Object} param0.editableProps - 편집 가능한 속성 상태
 * @param {Object} [param0.globalGrapicItemColor] - 글로벌 그래픽 색상 설정 (useGlobalColor=true일 때 필수)
 * @param {Function} param0.handleColorChange - 색상 변경 핸들러
 * @param {Function} param0.handleOpenColorPicker - 색상 선택기 열기 핸들러
 * @param {Function} [param0.handleResetToGlobalColor] - 글로벌 색상으로 되돌리기 핸들러 (useGlobalColor=true일 때 필수)
 * @param {boolean} [param0.useGlobalColor=true] - 글로벌 색상 사용 여부
 * 
 * PropertiesPanel의 색상 설정 아이템 컴포넌트
 * 문 속성 편집에서 기본, 경보, 인지, 자동인지 색상을 설정하는 컴포넌트
 */
const ColorSettingItem = ({
    title,
    colorType,
    presetColors,
    colorPickerType,
    editableProps,
    globalGrapicItemColor,
    handleColorChange,
    handleOpenColorPicker,
    handleResetToGlobalColor,
    messages,
    useGlobalColor = false, // 글로벌 색상 사용 여부 (옵션)
}) => {
    // ============================= 유틸 함수 =============================
    // 색상 표시 로직 - 글로벌 색상 우선, 개별 색상이 있으면 개별 색상 사용
    const getDisplayColor = (colorType) => {
        const individualColor = editableProps[colorType];

        // 글로벌 색상을 사용하지 않는 경우
        if (!useGlobalColor) {
            return {
                color: individualColor || "#eeeeee",
                isUsingGlobal: false,
                hasIndividualColor: !!individualColor,
            };
        }

        // colorType을 globalGrapicItemColor의 키에 맞게 매핑
        let globalColorKey;
        switch (colorType) {
            case "color":
                globalColorKey = "default";
                break;
            case "alertFill":
                globalColorKey = "alert";
                break;
            case "checkedFill":
                globalColorKey = "checked";
                break;
            case "autoCheckedFill":
                globalColorKey = "autoChecked";
                break;
            default:
                globalColorKey = colorType;
        }

        const globalColor = globalGrapicItemColor?.[globalColorKey];

        return {
            color: individualColor || globalColor || "#eeeeee",
            isUsingGlobal: !individualColor && !!globalColor,
            hasIndividualColor: !!individualColor,
        };
    };

    // ============================= 개별 변수 =============================
    const displayColor = getDisplayColor(colorType);

    return (
        <div className="border border-[var(--kendo-color-border)] rounded p-3 bg-[var(--kendo-color-surface)]">
            {/* 제목과 상태 */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{title}</span>
                {useGlobalColor && displayColor.isUsingGlobal && (
                    <span className="text-xs px-2 py-0.5 rounded bg-[var(--kendo-color-primary-subtle)] text-[var(--kendo-color-primary)]">
                        {messages.propertiesPanel.colorSettingItem.global}
                    </span>
                )}
            </div>

            {/* 현재 색상과 프리셋 색상 */}
            <div className="flex items-center gap-3 mb-3">
                <div
                    className="w-8 h-8 rounded border border-[var(--kendo-color-border)] flex-shrink-0"
                    style={{ backgroundColor: displayColor.color }}
                    title={displayColor.color}
                />
                <div className="flex gap-1.5 flex-1 flex-wrap">
                    {presetColors.map((color) => (
                        <button
                            key={color}
                            className={`
                                w-6 h-6 rounded border transition-all hover:scale-110
                                ${
                                    displayColor.color === color
                                        ? "border-[var(--kendo-color-primary)] border-2 shadow-sm"
                                        : "border-[var(--kendo-color-border)]"
                                }
                            `}
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange(color, colorType)}
                            title={color}
                        />
                    ))}
                </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex gap-2">
                <Button
                    look="flat"
                    fillMode="outline"
                    size="sm"
                    onClick={() => handleOpenColorPicker(colorPickerType)}
                    className="flex-1 text-xs"
                >
                    {messages.propertiesPanel.colorSettingItem.select}
                </Button>

                {useGlobalColor && displayColor.hasIndividualColor && handleResetToGlobalColor && (
                    <Button
                        look="flat"
                        fillMode="outline"
                        size="sm"
                        onClick={() => handleResetToGlobalColor(colorType)}
                        title={messages.propertiesPanel.colorSettingItem.globalReset}
                        className="text-xs"
                    >
                        {messages.propertiesPanel.colorSettingItem.globalApply}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ColorSettingItem;