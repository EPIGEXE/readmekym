import { Button } from "@progress/kendo-react-buttons";
import { Volume2 } from "lucide-react";
import useAlarmAudioStore from "../../store/alarmAudioStore";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";

/**
 * 브라우저 오디오 활성화 플로팅 윈도우
 * @param {function} setShowAudioFloat - 플로팅 윈도우 닫기 함수
 * 
 * ViewArea 컴포넌트에서 사용되며, 브라우저 오디오 활성화 플로팅 윈도우를 표시합니다.
 */
const AudioFloat = ({ setShowAudioFloat }) => {
    // ============================== 전역 상태 ==============================
    // 다국어 설정
    const globalConfig = useGlobalConfigStore((state) => state.globalConfig);
    const messages = getMessages(globalConfig?.languageId);

    // 문 모니터링 상태
    const pendingAlarms = useAlarmAudioStore((state) => state.pendingAlarms); // 오디오 활성 전 경보가 울린 경우 대기 중인 경보 목록
    
    // 오디오 액션
    const enableAudio = useAlarmAudioStore((state) => state.actions.enableAudio); // 오디오 활성화

    // ============================== 오디오 제어 핸들러 ==============================
    // 오디오 활성화 핸들러
    const handleEnableAudio = async () => {
        const success = await enableAudio();
        if (success) {
            console.log("[ViewArea] 오디오 활성화 완료");
        }
    };

    return (
        <div
            className="fixed z-50 right-6 top-6 w-[380px] max-w-[90vw] bg-[var(--kendo-color-surface)] border border-[var(--kendo-color-warning)] rounded-lg shadow-lg"
            style={{
                animation: "slideInFromRight 0.3s ease-out",
            }}
        >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--kendo-color-border)] bg-[var(--kendo-color-surface-alt)] rounded-t-lg">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--kendo-color-warning)] rounded-full"></div>
                    <span className="text-sm text-[var(--kendo-color-on-app-surface)]">{messages.audioFloat.title}</span>
                </div>
            </div>

            {/* 본문 */}
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                        <div className="w-8 h-8 bg-[var(--kendo-color-warning)]/10 rounded-full flex items-center justify-center">
                            <Volume2 className="h-4 w-4 text-[var(--kendo-color-warning)]" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm leading-relaxed mb-2 text-[var(--kendo-color-on-app-surface)]">
                            {messages.audioFloat.body}
                        </div>
                        {pendingAlarms.length > 0 && (
                            <div className="flex items-center gap-2 text-xs text-[var(--kendo-color-on-app-surface)] bg-[var(--kendo-color-warning)]/5 px-2 py-1 rounded">
                                <div className="w-1.5 h-1.5 bg-[var(--kendo-color-warning)] rounded-full"></div>
                                <span>{messages.audioFloat.waitingAlarm} {pendingAlarms.length} {messages.audioFloat.unit}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 액션 버튼 */}
            <div className="px-4 pb-4">
                <Button
                    themeColor={"warning"}
                    fillMode="solid"
                    size="medium"
                    className="w-full"
                    onClick={async () => {
                        const success = await handleEnableAudio();
                        if (success !== false) setShowAudioFloat(false);
                    }}
                    startIcon={<Volume2 className="h-4 w-4" />}
                >
                    {messages.audioFloat.enableAudio}
                </Button>
            </div>
        </div>
    );
};

export default AudioFloat;
