import { useGlobalConfigStore } from 'v2/libs';
import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { ColorGradient } from '@progress/kendo-react-inputs';
import { useEffect, useState } from 'react';
import { getMessages } from '../../transMessages';

/**
 * 색상 선택 다이얼로그 컴포넌트
 * @param {boolean} isOpen - 다이얼로그 열림 여부
 * @param {string} color - 초기 선택된 색상
 * @param {Function} onConfirm - 확인 핸들러
 * @param {Function} onCancel - 취소 핸들러
 * @param {Function} onColorChange - 색상 변경 핸들러
 *
 * PropertiesPanel의 색상 선택 다이얼로그 컴포넌트
 * 문 속성 편집에서 색상을 선택하는 다이얼로그 컴포넌트
 */
const ColorPickerDialog = ({ isOpen, color, onConfirm, onCancel, onColorChange }) => {
    // ============================= 전역 상태 =============================
    // 다국어 설정
    const globalConfig = useGlobalConfigStore((state) => state.globalConfig);
    const messages = getMessages(globalConfig?.languageId);

    // ============================= 상태 관리 =============================
    const [localColor, setLocalColor] = useState(color || '#94a3b8'); // Colorpicker 초기 색상

    // ============================= useEffect =============================
    // 다이얼로그 열림 시 초기 색상 설정
    useEffect(() => {
        if (isOpen && color) {
            setLocalColor(color);
        }
    }, [isOpen, color]);

    // ============================= 핸들러 =============================
    // 색상 변경 핸들러
    const handleColorChange = (e) => {
        const newColor = e.value;
        setLocalColor(newColor);
        if (onColorChange) {
            onColorChange(newColor);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog title={messages.propertiesPanel.colorPickerDialog.title} onClose={onCancel}>
            <div className="p-4">
                <ColorGradient value={localColor} onChange={handleColorChange} format="hex" />
            </div>
            <DialogActionsBar>
                <Button themeColor="primary" fillMode="solid" onClick={() => onConfirm(localColor)}>
                    {messages.propertiesPanel.colorPickerDialog.confirm}
                </Button>
                <Button onClick={onCancel}>{messages.propertiesPanel.colorPickerDialog.cancel}</Button>
            </DialogActionsBar>
        </Dialog>
    );
};

export default ColorPickerDialog;
