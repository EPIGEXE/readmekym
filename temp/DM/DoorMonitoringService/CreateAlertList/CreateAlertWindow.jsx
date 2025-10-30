import { Window, WindowActionsBar } from "@progress/kendo-react-dialogs";
import CreateAlertList from "./CreateAlertList";
import { Button } from "@progress/kendo-react-buttons";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";

/**
 * 출입통제 경보 생성 윈도우
 * @param {function} handleCloseCreateAlertWindow - 경보 생성 윈도우 닫기 함수
 * 
 * 수정 상태에서 출입통제 경보 리스트 버튼을 누르면 나오는 윈도우
 * 드래그 & 드랍으로 경보를 포함한 문을 생성할 수 있음
 */
const CreateAlertWindow = ({ handleCloseCreateAlertWindow }) => {
    // ============================= 전역 상태 =============================
    // 다국어 설정
    const globalConfig = useGlobalConfigStore((state) => state.globalConfig);
    const messages = getMessages(globalConfig?.languageId);

    return (
        <Window
            title={messages.createAlertWindow.title}
            onClose={handleCloseCreateAlertWindow}
            initialWidth={400}
            initialHeight={800}
            initialLeft={window.innerWidth / 2 - 200}
            initialTop={window.innerHeight / 2 - 400}
            resizable={false}
            draggable={true}
            minimizeButton={() => null}
            maximizeButton={() => null}
            appendTo={document.body}
            className="alert-window"
            style={{
                borderColor: "var(--kendo-color-primary)",
            }}
        >
            <div className="p-3 h-full border-t border-[var(--kendo-color-primary-subtle)]">
                <CreateAlertList messages={messages} />
            </div>
            <WindowActionsBar className="border-[var(--kendo-color-primary-subtle)]">
                <Button look="outline" onClick={handleCloseCreateAlertWindow}>
                    {messages.createAlertWindow.close}
                </Button>
            </WindowActionsBar>
        </Window>
    );
};

export default CreateAlertWindow;
