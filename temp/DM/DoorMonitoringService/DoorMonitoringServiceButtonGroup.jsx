import { Button } from "@progress/kendo-react-buttons";
import AutoSaveIndicator from "../common/AutoSaveIndicator";
import { editAnnotationsIcon, fileTxtIcon, gearIcon, plusIcon, upgradeOutlineIcon } from "@progress/kendo-svg-icons";
import useDoorMonitoringStore from "../store/doorMonitoringStoreIndex";
import { useGlobalConfigStore, useLoginInfoStore } from "v2/libs";
import { getMessages } from "../transMessages";

/**
 * 문 모니터링 서비스 버튼 그룹
 * @param {*} handleOpenReport 보고서 열기
 * @param {*} handleOpenSettings 설정 열기
 * @param {*} handleSaveDoor 문 저장
 * @param {*} handleOpenCreateAlertWindow 경보 생성 창 열기
 * @returns
 *
 */
const DoorMonitoringServiceButtonGroup = ({
    handleOpenReport,
    handleOpenSettings,
    handleSaveDoor,
    handleOpenCreateAlertWindow,
}) => {
    // ============================== 전역 상태 ==============================
    // 다국어 설정
    const globalConfig = useGlobalConfigStore((state) => state.globalConfig);
    const messages = getMessages(globalConfig?.languageId);

    // 문 모니터링 상태
    const editState = useDoorMonitoringStore((state) => state.editState); // 편집 모드 여부
    const isAutoSaving = useDoorMonitoringStore((state) => state.isAutoSaving); // 자동 저장 여부
    const pendingChanges = useDoorMonitoringStore((state) => state.pendingChanges); // 변경 사항 여부
    const toggleEditable = useDoorMonitoringStore((state) => state.actions.toggleEditable); // 편집 모드 토글

    const { loginInfo } = useLoginInfoStore(); //로그인 정보

    return (
        <div className="flex justify-end items-center">
            <div className="flex gap-2 items-center">
                {/* 자동 저장 알림 */}
                <AutoSaveIndicator isAutoSaving={isAutoSaving} pendingChanges={pendingChanges} />

                {/* 버튼 그룹 - 수정 모드가 아닐 때 */}
                {!editState.isEditable && (
                    <>
                        <Button size="small" look="outline" svgIcon={fileTxtIcon} onClick={handleOpenReport}>
                            {messages.doorMonitoringServiceButtonGroup.report}
                        </Button>
                        {loginInfo?.admin === 1 && (
                            <Button size="small" look="outline" svgIcon={gearIcon} onClick={handleOpenSettings}>
                                {messages.doorMonitoringServiceButtonGroup.settings}
                            </Button>
                        )}
                    </>
                )}

                <div className="w-px h-4 bg-[var(--kendo-color-border)]"></div>

                {/* 버튼 그룹 - 수정 모드일 때 */}
                {editState.isEditable && (
                    <>
                        <Button
                            size="small"
                            themeColor="primary"
                            svgIcon={upgradeOutlineIcon}
                            onClick={handleSaveDoor}
                            className="gap-2"
                        >
                            {messages.doorMonitoringServiceButtonGroup.saveDoor}
                        </Button>

                        <Button size="small" svgIcon={plusIcon} onClick={handleOpenCreateAlertWindow} className="gap-2">
                            {messages.doorMonitoringServiceButtonGroup.createAlertList}
                        </Button>
                    </>
                )}

                {/* 수정 모드 토글 버튼 */}
                {loginInfo?.admin === 1 && (
                    <>
                        <Button
                            size="small"
                            togglable={true}
                            selected={editState.isEditable}
                            look={editState.isEditable ? "flat" : "outline"}
                            svgIcon={editAnnotationsIcon}
                            onClick={toggleEditable}
                            className="gap-2"
                        >
                            {editState.isEditable
                                ? messages.doorMonitoringServiceButtonGroup.editMode
                                : messages.doorMonitoringServiceButtonGroup.editModeButton}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default DoorMonitoringServiceButtonGroup;
