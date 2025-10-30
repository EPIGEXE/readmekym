import { Button } from '@progress/kendo-react-buttons';

const AdminSettingActionButtonGroup = ({
    isLoading,
    isPending,
    handleSave,
    handleCancel,
    showTitle,
    setShowTitle,
    showManualSetting,
    setShowManualSetting,
    currentTableName,
}) => {
    return (
        <>
            <div className="flex w-full justify-end items-center gap-2">
                <Button
                    disabled={isLoading || isPending}
                    togglable={true}
                    selected={showTitle}
                    onClick={() => setShowTitle(!showTitle)}
                    look={showTitle ? 'flat' : 'outline'}
                    size="small"
                >
                    {showTitle ? '타이틀 표시' : '컬럼명 표시'}
                </Button>
                <Button
                    disabled={isLoading || isPending}
                    togglable={true}
                    selected={showManualSetting}
                    onClick={() => setShowManualSetting(!showManualSetting)}
                    look={showManualSetting ? 'flat' : 'outline'}
                    size="small"
                >
                    {showManualSetting ? '값 자동 설정' : '값 수동 설정'}
                </Button>
                <div className="h-6 w-px bg-gray-200 mx-2"></div> {/* 구분선 */}
                <Button
                    disabled={isLoading || isPending}
                    onClick={() => handleSave(currentTableName)}
                    themeColor="primary"
                    className="k-button k-button-sm"
                >
                    저장
                </Button>
                <Button
                    disabled={isLoading || isPending}
                    onClick={() => handleCancel(currentTableName)}
                    look="outline"
                    className="k-button k-button-sm"
                >
                    취소
                </Button>
            </div>
        </>
    );
};

export default AdminSettingActionButtonGroup;
