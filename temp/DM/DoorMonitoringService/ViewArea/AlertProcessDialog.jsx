import { useState } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { Dialog } from "@progress/kendo-react-dialogs";
import { TextArea } from "@progress/kendo-react-inputs";
import { AlertCircle, Link, MessageCircle } from "lucide-react";
import useDoorMonitoringStore from "../../store/doorMonitoringStoreIndex";
import { useUpdateDoorAlarm } from "../../hooks/reactQueryHooks/useDoorListApi";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";

/**
 * 경보 처리 다이얼로그
 * @param {Object} selectedDoor - 선택된 문 정보
 * @param {Function} onClose - 다이얼로그 닫기 함수
 * 
 * View Area에서 경보 처리를 한 경우 경보 처리 다이올로그
 */
const AlertProcessDialog = ({ selectedDoor, onClose }) => {
    // ============================== 전역 상태 ==============================
    // 다국어 설정
    const globalConfig = useGlobalConfigStore((state) => state.globalConfig);
    const messages = getMessages(globalConfig?.languageId);

    // 문 모니터링 상태
    const alertList = useDoorMonitoringStore((state) => state.alertList); // 경보 목록

    // 문 모니터링 액션
    const toggleSelection = useDoorMonitoringStore((state) => state.actions.toggleSelection); // 선택 상태 토글

    // ============================== 쿼리 훅 ==============================
    const { mutateAsync: updateDoorAlarm, isPending } = useUpdateDoorAlarm();

    // ============================== 상태 ==============================
    const [comment, setComment] = useState(""); // 처리 내용

    // ============================== 개별 변수 ==============================
    // 선택된 문에 연결된 경보 목록
    const doorAlert = alertList.find((alert) => alert.code === selectedDoor.event_code);

    // ============================== 핸들러 ==============================
    // 경보 처리 핸들러
    const handleProcess = async () => {
        try {
            await updateDoorAlarm({ code: doorAlert.code, ack_note: comment });
            toggleSelection(selectedDoor.code);
            onClose();
        } catch (error) {
            console.error("경보 처리 실패:", error);
            toggleSelection(selectedDoor.code);
            onClose();
        }
    };

    return (
        <Dialog
            title={
                <div className="flex items-center gap-2 py-1">
                    <AlertCircle className="text-[var(--kendo-color-primary)]" size={20} />
                    <span className="font-semibold">{messages.alertProcessDialog.title}</span>
                </div>
            }
            onClose={onClose}
            width={500}
            className="alert-process-dialog"
        >
            <div className="p-5">
                {/* 선택된 문 정보 */}
                <div className="flex items-center bg-[var(--kendo-color-error-subtle)] p-3 rounded-lg mb-5">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--kendo-color-error)] flex items-center justify-center text-white mr-3">
                        <span className="text-xl font-bold">!</span>
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-[var(--kendo-color-error)]">{selectedDoor.name}</div>
                    </div>
                </div>

                {/* 경보 목록 */}
                {doorAlert ? (
                    <div className="mb-5">
                        <div className="font-medium text-sm mb-3 flex items-center">
                            <Link size={16} className="mr-1.5 text-[var(--kendo-color-error)]" />
                            {messages.alertProcessDialog.occurredAlarmInfo}
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            <div
                                key={doorAlert.code}
                                className="px-4 py-3 border border-[var(--kendo-color-border)] rounded-lg bg-[var(--kendo-color-surface)]"
                            >
                                {/* 첫 번째 줄: 코드, 이름, 시간 */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm text-[var(--kendo-color-primary)]">
                                            {doorAlert.code}
                                        </span>
                                        <span className="font-semibold text-sm">{doorAlert.name}</span>
                                    </div>
                                    <span className="text-xs text-[var(--kendo-color-subtle)]">
                                        {doorAlert.event_time
                                            ? new Date(doorAlert.event_time).toLocaleString("ko-KR", {
                                                  year: "numeric",
                                                  month: "2-digit",
                                                  day: "2-digit",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                  second: "2-digit",
                                              })
                                            : messages.alertProcessDialog.unknown}
                                    </span>
                                </div>

                                {/* 두 번째 줄: 이벤트 설명 */}
                                {doorAlert.event_desc && (
                                    <div className="flex items-center gap-1 text-[var(--kendo-color-error)] text-sm mb-4">
                                        <AlertCircle
                                            size={14}
                                            className="text-[var(--kendo-color-error)] flex-shrink-0"
                                        />
                                        <span className="truncate">{doorAlert.event_desc}</span>
                                    </div>
                                )}

                                {/* 세 번째 줄: 배지들 (부가 정보) */}
                                <div className="flex items-center gap-1 text-xs">
                                    {doorAlert.product_name && (
                                        <span className="bg-[var(--kendo-color-base-subtle)] rounded px-2 py-0.5">
                                            {doorAlert.product_name}
                                        </span>
                                    )}
                                    {doorAlert.panel_desc && (
                                        <span className="bg-[var(--kendo-color-base-subtle)] rounded px-2 py-0.5">
                                            {doorAlert.panel_desc}
                                        </span>
                                    )}
                                    {doorAlert.dev_desc && (
                                        <span className="bg-[var(--kendo-color-primary-subtle)] text-[var(--kendo-color-primary)] rounded px-2 py-0.5 font-medium">
                                            {doorAlert.dev_desc}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center p-5 mb-4 rounded-md border border-gray-200">
                        <span className="text-gray-500 text-sm">{messages.alertProcessDialog.noActiveAlarm}</span>
                    </div>
                )}

                {/* 처리 내용 입력 */}
                <div className="mb-5">
                    <label className="flex items-center text-sm font-medium mb-2">
                        <MessageCircle size={16} className="mr-1.5 text-[var(--kendo-color-primary)]" />
                        {messages.alertProcessDialog.comment}
                    </label>
                    <TextArea
                        value={comment}
                        onChange={(e) => setComment(e.value)}
                        placeholder={messages.alertProcessDialog.commentPlaceholder}
                        rows={3}
                        resizable="vertical"
                        style={{ maxHeight: "150px" }}
                    />
                </div>

                {/* 버튼 영역 */}
                <div className="flex justify-end gap-3 mt-5 pt-3 border-t border-gray-100">
                    <Button look="outline" onClick={onClose} disabled={isPending}>
                        {messages.alertProcessDialog.cancel}
                    </Button>
                    <Button
                        look="primary"
                        onClick={handleProcess}
                        disabled={!doorAlert || isPending}
                        themeColor="primary"
                    >
                        {isPending ? messages.alertProcessDialog.processing : messages.alertProcessDialog.process}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

export default AlertProcessDialog;
