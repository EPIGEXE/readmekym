import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo, useState } from "react";

// 설정 섹션 정의
const getSettingSections = (messages) => [
    {
        id: "eventSetting",
        title: messages.settingsPanel.settingsList.eventSetting,
    },
    {
        id: "doorProperty",
        title: messages.settingsPanel.settingsList.doorProperty,
    },
    {
        id: "alarmSound",
        title: messages.settingsPanel.settingsList.alarmSound,
    },
    {
        id: "etc",
        title: messages.settingsPanel.settingsList.etc,
    },
];

/**
 * 설정 패널 컴포넌트
 * @param {string} activeSection - 활성 섹션
 * @param {Function} onSectionChange - 섹션 변경 핸들러
 *
 * 문 모니터링 서비스의 설정 패널 컴포넌트
 * 설정 패널을 클릭하면 컨텐츠 패널이 변경
 */
const SettingsList = ({ activeSection, onSectionChange, messages }) => {
    // ============================= 상태 관리 =============================
    const [collapsed, setCollapsed] = useState(false); // 설정 패널 접기/펼치기

    // ============================= 개별 변수 =============================
    // 설정 분류 목록
    const settingSections = getSettingSections(messages);

    // ============================= 핸들러 =============================
    // 설정 패널 접기/펼치기
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div
            className={`${collapsed ? "w-10" : "w-60"} ${
                collapsed ? "" : "border border-[var(--kendo-color-border)]"
            } flex flex-col h-full`}
        >
            {collapsed ? (
                <div className="flex items-start justify-center pt-4">
                    <div
                        onClick={toggleCollapse}
                        className="w-7 h-7 rounded-md bg-[var(--kendo-color-surface)] border border-[var(--kendo-color-border)] hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer transition-colors"
                    >
                        <ChevronRight size={14} />
                    </div>
                </div>
            ) : (
                <>
                    {/* 헤더 */}
                    <div className="border-b bg-[var(--kendo-color-surface)] px-4 py-3 flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-[var(--kendo-color-primary)] mr-2"></div>
                            <h3 className="text-base font-semibold text-lg">{messages.settingsPanel.settingsList.title}</h3>
                        </div>
                        <div
                            onClick={toggleCollapse}
                            className="w-7 h-7 rounded-md hover:bg-gray-200 text-gray-500 cursor-pointer transition-colors flex items-center justify-center"
                        >
                            <ChevronLeft size={14} />
                        </div>
                    </div>

                    {/* 설정 분류 목록 */}
                    <div className="flex-1 overflow-hidden bg-[var(--kendo-color-app-surface)]">
                    <div className="h-full overflow-auto">
                        <div className="p-2">
                            {settingSections.map((section) => (
                                <div
                                    key={section.id}
                                    onClick={() => onSectionChange(section.id)}
                                    className={`
                                    flex items-center h-10 rounded-md cursor-pointer transition-colors duration-150 pl-2 mb-1
                                    ${
                                        activeSection === section.id
                                            ? "bg-[var(--kendo-color-primary-subtle)] hover:bg-[var(--kendo-color-primary-subtle-hover)]"
                                            : "hover:bg-[var(--kendo-color-base-hover)]"
                                    }
                                `}
                                    style={{
                                        border:
                                            activeSection === section.id
                                                ? "2px solid var(--kendo-color-primary)"
                                                : "1px solid transparent",
                                    }}
                                >
                                    {/* 섹션 이름 */}
                                    <span
                                        className={`text-sm font-medium truncate ${
                                            activeSection === section.id
                                                ? "text-[var(--kendo-color-primary)] font-bold"
                                                : ""
                                        }`}
                                    >
                                        {section.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                </>
            )}
        </div>
    );
};

export default memo(SettingsList);
