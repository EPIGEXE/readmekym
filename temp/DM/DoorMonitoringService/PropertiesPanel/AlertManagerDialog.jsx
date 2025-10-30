import { useState, useEffect, useMemo, useCallback } from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Button } from "@progress/kendo-react-buttons";
import { Input } from "@progress/kendo-react-inputs";
import { AlertCircle, X, Search } from "lucide-react";
import useDoorMonitoringStore from "../../store/doorMonitoringStoreIndex";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";

/**
 * 경보 설정 다이얼로그 컴포넌트
 * @param {boolean} isOpen - 다이얼로그 열림 여부
 * @param {Object} selectedDoor - 선택된 문 정보
 * @param {string} initialAlerts - 초기 선택된 경보 코드
 * @param {Function} onApply - 적용 핸들러
 * @param {Function} onCancel - 취소 핸들러
 *
 * PropertiesPanel의 경보 설정 다이얼로그 컴포넌트
 * 문 속성 편집에서 문에 연결된 경보 설정을 위한 다이얼로그 컴포넌트
 */
const AlertManagerDialog = ({ isOpen, selectedDoor, initialAlerts = "", onApply, onCancel }) => {
    // ============================= 전역 상태 =============================
    // 다국어 설정
    const globalConfig = useGlobalConfigStore((state) => state.globalConfig);
    const messages = getMessages(globalConfig?.languageId);

    // 문 모니터링 상태
    const alertList = useDoorMonitoringStore((state) => state.alertList); // 경보 목록

    // ============================= 개별 변수 =============================
    const [selectedAlertCode, setSelectedAlertCode] = useState(initialAlerts); // 선택된 경보 코드
    const [searchTerm, setSearchTerm] = useState(""); // 검색어

    // ============================= useEffect =============================
    // selectedDoor 변경 시 선택된 경보 업데이트
    useEffect(() => {
        if (isOpen) {
            setSelectedAlertCode(selectedDoor ? selectedDoor.event_code || "" : initialAlerts);
        }
    }, [selectedDoor, initialAlerts, isOpen]);

    // ============================= 개별 변수 =============================
    // 필터링된 경보 목록 (성능 최적화를 위해 useMemo 사용)
    const filteredAlertList = useMemo(() => {
        if (!alertList) return [];
        if (!searchTerm) return alertList;

        const lowerSearchTerm = searchTerm.toLowerCase();
        return alertList?.filter(
            (alert) =>
                alert.code.toLowerCase().includes(lowerSearchTerm) ||
                alert.name.toLowerCase().includes(lowerSearchTerm) ||
                alert.event_desc.toLowerCase().includes(lowerSearchTerm) ||
                alert.product_name.toLowerCase().includes(lowerSearchTerm) ||
                alert.panel_desc.toLowerCase().includes(lowerSearchTerm) ||
                alert.dev_desc.toLowerCase().includes(lowerSearchTerm)
        );
    }, [alertList, searchTerm]);

    // ============================= 핸들러 =============================
    // 경보 추가 핸들러
    const handleAddAlert = (alertCode) => {
        if (selectedAlertCode !== alertCode) {
            setSelectedAlertCode(alertCode);
        }
    };

    // 경보 제거 핸들러
    const handleRemoveAlert = () => {
        setSelectedAlertCode("");
    };

    // 확인 버튼 핸들러
    const handleApply = () => {
        onApply(selectedAlertCode);
    };

    // 검색어 변경 핸들러 (디바운싱을 위해 useCallback 사용)
    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.value);
    }, []);

    if (!isOpen) return null;

    return (
        <Dialog title={messages.propertiesPanel.alertManagerDialog.title} onClose={onCancel} width={600}>
            <div className="p-4">
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium">
                            {messages.propertiesPanel.alertManagerDialog.availableAlerts} ({filteredAlertList.length}개)
                        </label>
                    </div>

                    {/* 검색 입력 필드 */}
                    <div className="mb-3">
                        <Input
                            placeholder={messages.propertiesPanel.alertManagerDialog.searchPlaceholder}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            prefix={() => <Search size={16} className="text-[var(--kendo-color-subtle)]" />}
                            className="w-full"
                        />
                    </div>

                    {/* 경보 선택 목록 */}
                    <div className="max-h-[500px] overflow-y-auto border border-[var(--kendo-color-border)] rounded mb-4 bg-[var(--kendo-color-surface)]">
                        <div className="p-2 space-y-2">
                            {filteredAlertList && filteredAlertList.length > 0 ? (
                                filteredAlertList.map((alert) => (
                                    <div
                                        key={alert.code}
                                        className={`
                                            px-4 py-3 flex items-center justify-between transition-all duration-200
                                            rounded-lg border cursor-pointer
                                            ${
                                                selectedAlertCode === alert.code
                                                    ? "bg-[var(--kendo-color-primary-subtle)] border-[var(--kendo-color-primary)] shadow-md"
                                                    : "bg-[var(--kendo-color-surface-alt)] border-[var(--kendo-color-border)] hover:bg-[var(--kendo-color-secondary-subtle)] hover:border-[var(--kendo-color-secondary)]"
                                            }
                                        `}
                                        onClick={() =>
                                            selectedAlertCode === alert.code
                                                ? handleRemoveAlert()
                                                : handleAddAlert(alert.code)
                                        }
                                    >
                                        {/* 왼쪽: 코드, 이름, event_desc, 배지들, 연결문 */}
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span
                                                    className={`font-bold text-sm ${
                                                        selectedAlertCode === alert.code
                                                            ? "text-[var(--kendo-color-primary)]"
                                                            : ""
                                                    }`}
                                                >
                                                    {alert.code}
                                                </span>
                                                <span className="font-medium text-sm text-[var(--kendo-color-on-surface)]">
                                                    {alert.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertCircle
                                                    size={14}
                                                    className={
                                                        selectedAlertCode === alert.code
                                                            ? "text-[var(--kendo-color-primary)]"
                                                            : "text-[var(--kendo-color-subtle)]"
                                                    }
                                                />
                                                <span className="text-xs">
                                                    {alert.event_desc}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 m-1 text-xs">
                                                <span className="inline-block w-2 h-2 rounded-full bg-[var(--kendo-color-info)] mr-1"></span>
                                                <span>{alert.product_name}</span>
                                                <span className="mx-1 text-[var(--kendo-color-base)]">›</span>
                                                <span>{alert.panel_desc}</span>
                                                {alert.dev_desc && (
                                                    <>
                                                        <span className="mx-1 text-[var(--kendo-color-base)]">›</span>
                                                        <span className="text-[var(--kendo-color-primary)]">
                                                            {alert.dev_desc}
                                                            {alert.second_dev_desc && ` (${alert.second_dev_desc})`}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            {alert.connectedDoor?.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {alert.connectedDoor.map((door) => (
                                                        <span
                                                            key={door.code}
                                                            className={`
                                                                inline-flex items-center text-[10px] px-2 py-0.5 rounded-full
                                                                ${
                                                                    selectedAlertCode === alert.code
                                                                        ? "bg-[var(--kendo-color-primary)] text-[var(--kendo-color-on-primary)]"
                                                                        : "bg-[var(--kendo-color-surface-alt)] text-[var(--kendo-color-on-surface)] border border-[var(--kendo-color-border)]"
                                                                }
                                                            `}
                                                        >
                                                            <span
                                                                className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                                    selectedAlertCode === alert.code
                                                                        ? "bg-[var(--kendo-color-on-primary)]"
                                                                        : "bg-[var(--kendo-color-primary)]"
                                                                }`}
                                                            ></span>
                                                            {door.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {/* 오른쪽: 선택 상태 표시 */}
                                        <div className="ml-4 flex-shrink-0">
                                            {selectedAlertCode === alert.code && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-medium text-[var(--kendo-color-primary)]">
                                                        {messages.propertiesPanel.alertManagerDialog.selected}
                                                    </span>
                                                    <div className="w-6 h-6 rounded-full bg-[var(--kendo-color-primary)] flex items-center justify-center">
                                                        <svg
                                                            className="w-4 h-4 text-[var(--kendo-color-on-primary)]"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={3}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center">
                                    <AlertCircle size={48} className="mx-auto mb-3 text-[var(--kendo-color-subtle)]" />
                                    <p className="text-sm text-[var(--kendo-color-subtle)]">
                                        {searchTerm ? messages.propertiesPanel.alertManagerDialog.noSearchResults : messages.propertiesPanel.alertManagerDialog.noAvailableAlerts}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <DialogActionsBar>
                <Button themeColor="primary" fillMode="solid" onClick={handleApply}>
                    {messages.propertiesPanel.alertManagerDialog.apply}
                </Button>
                <Button onClick={onCancel}>{messages.propertiesPanel.alertManagerDialog.cancel}</Button>
            </DialogActionsBar>
        </Dialog>
    );
};

export default AlertManagerDialog;
