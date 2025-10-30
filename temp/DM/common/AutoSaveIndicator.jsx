import React from 'react';
import { Clock, Loader2 } from 'lucide-react';
import { useGlobalConfigStore } from 'v2/libs';
import { getMessages } from '../transMessages';

const AutoSaveIndicator = ({ isAutoSaving, pendingChanges = {}, className = '' }) => {
    // ============================== 전역 상태 ==============================
    // 다국어 설정
    const globalConfig = useGlobalConfigStore((state) => state.globalConfig);
    const messages = getMessages(globalConfig?.languageId);

    // pendingChanges 객체에서 저장할 요소가 있는지 확인
    const hasPendingChanges = Object.keys(pendingChanges).length > 0;
    
    // 자동저장 중이거나 저장할 요소가 없으면 표시하지 않음
    if (!isAutoSaving && !hasPendingChanges) return null;

    return (
        <div 
            className={`auto-save-indicator ${className}`}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                fontSize: '12px',
                color: 'var(--kendo-color-primary)',
                backgroundColor: 'var(--kendo-color-primary-subtle)',
                border: '1px solid var(--kendo-color-primary-subtle-active)',
                borderRadius: '4px',
                whiteSpace: 'nowrap'
            }}
        >
            {isAutoSaving ? (
                <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>{messages.autoSaveIndicator.autoSaveing}</span>
                </>
            ) : hasPendingChanges ? (
                <>
                    <Clock size={12} />
                    <span>{messages.autoSaveIndicator.waitingSave} ({Object.keys(pendingChanges).length})</span>
                </>
            ) : null}
        </div>
    );
};

export default AutoSaveIndicator;