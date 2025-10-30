import { memo } from "react";
import DoorPropertySettings from "./DoorPropertySettings/DoorPropertySettings";
import AlarmSoundSettings from "./AlarmSoundSettings";
import EtcSettings from "./EtcSettings";
import EventSetting from "./EventSetting";

// 설정 섹션 컴포넌트 매핑
const getSettingComponents = (messages) => ({
    eventSetting: {
        title: messages.settingsPanel.settingsList.eventSetting,
        component: <EventSetting messages={messages} />,
    },
    doorProperty: {
        title: messages.settingsPanel.settingsList.doorProperty,
        component: <DoorPropertySettings messages={messages} />,
    },
    alarmSound: {
        title: messages.settingsPanel.settingsList.alarmSound,
        component: <AlarmSoundSettings messages={messages} />,
    },
    etc: {
        title: messages.settingsPanel.settingsList.etc,
        component: <EtcSettings messages={messages} />,
    },
});

/**
 * 설정 컨텐츠 컴포넌트
 * @param {string} activeSection - 활성 섹션
 *
 * 설정 패널의 각 섹션에 대한 컨텐츠를 표시
 */
const SettingsContent = ({ activeSection, messages }) => {
    // ============================= 개별 변수 =============================
    const currentSetting = getSettingComponents(messages)[activeSection];

    return (
        <div className="flex-1 border border-[var(--kendo-color-border)] flex flex-col h-full">
            {/* 헤더 */}
            <div className="border-b bg-[var(--kendo-color-surface)] px-4 py-3 flex items-center gap-2 flex-shrink-0">
                <div className="w-2 h-2 bg-[var(--kendo-color-primary)]"></div>
                <h3 className="text-base font-semibold text-lg">{currentSetting?.title}</h3>
            </div>

            {/* 설정 내용 */}
            <div className="flex-1 overflow-hidden">{currentSetting?.component}</div>
        </div>
    );
};

export default memo(SettingsContent);
