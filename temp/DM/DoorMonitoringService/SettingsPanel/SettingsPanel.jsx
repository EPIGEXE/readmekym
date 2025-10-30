import { Button } from "@progress/kendo-react-buttons";
import { arrowLeftIcon } from "@progress/kendo-svg-icons";
import { useState } from "react";
import SettingsList from "./SettingsList";
import SettingsContent from "./SettingsContent/SettingsContent";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";

/**
 * 설정 패널 컴포넌트
 * @param {Function} onClose - 닫기 핸들러
 *
 * 문 모니터링 서비스의 설정 패널 컴포넌트
 * 출입통제 이벤트 설정, 문 속성 편집, 알람음 설정, 기타 설정 등을 표시
 */
const SettingsPanel = ({ onClose }) => {
    // ============================= 전역 상태 =============================
    // 다국어 설정
    const globalConfig = useGlobalConfigStore((state) => state.globalConfig);
    const messages = getMessages(globalConfig?.languageId);

    // ============================= 상태 관리 =============================
    const [activeSection, setActiveSection] = useState("eventSetting"); // 활성 섹션

    return (
        <div className="p-5 flex flex-col gap-4 h-full bg-[var(--kendo-color-app-surface)]">
            {/* 헤더 */}
            <div className="flex justify-start items-center">
                <Button size="small" look="outline" svgIcon={arrowLeftIcon} onClick={onClose} className="gap-2">
                    {messages.settingsPanel.goback}
                </Button>
            </div>

            {/* 메인 영역 - 문리스트, 뷰영역, 경보패널 처럼 분리된 패널들 */}
            <div className="flex flex-1 min-h-0 gap-3">
                {/* 설정 분류 리스트 */}
                <SettingsList activeSection={activeSection} onSectionChange={setActiveSection} messages={messages} />

                {/* 설정 내용 */}
                <SettingsContent activeSection={activeSection} messages={messages} />
            </div>
        </div>
    );
};

export default SettingsPanel;
