/**
 * DMWidget
 *-------------------------------------------------------------------------------------------
 */

import * as React from "react";
import { useLoginInfoStore, useServerConfigStore } from "v2/libs";
import DoorMonitoringService from "./DoorMonitoringService";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useDoorMonitoringGlobalStore from "./store/doorMonitoringGlobalStore";
import useDoorMonitoringWebSocketStore from "./store/doorMonitoringWebSocketStore";

export const DMWidget = (props) => {
    const { widgetConfigValues } = props;

    const { serverConfig } = useServerConfigStore(); // 서버설정 정보

    // 글로벌 스토어 액션
    const setGlobalAlarmSound = useDoorMonitoringGlobalStore((state) => state.actions.setGlobalAlarmSound); // 글로벌 경보음 설정
    const setGlobalGrapicItemColor = useDoorMonitoringGlobalStore((state) => state.actions.setGlobalGrapicItemColor); // 글로벌 그래픽 색상 설정
    const setAreaList = useDoorMonitoringGlobalStore((state) => state.actions.setAreaList); // 현재 태스크 지역 설정

    // 웹소켓 스토어 액션
    const initialize = useDoorMonitoringWebSocketStore((state) => state.actions.initialize); // 웹소켓 초기화
    const disconnectAll = useDoorMonitoringWebSocketStore((state) => state.actions.disconnectAll); // 웹소켓 연결 해제

    // 웹소켓 초기화
    React.useEffect(() => {
        initialize("axistationx.com");

        return () => {
            disconnectAll();
        };
    }, [serverConfig]);

    // 설정 정보 초기화
    React.useEffect(() => {
        // 글로벌 그래픽 색상 설정
        if (widgetConfigValues?.globalColor) {
            const convertedColor = widgetConfigValues.globalColor.reduce((acc, colorItem) => {
                acc[colorItem.state] = colorItem.bg;
                return acc;
            }, {});
            setGlobalGrapicItemColor(convertedColor);
        }

        // 글로벌 경보음 설정
        if (widgetConfigValues?.globalAlertSound) {
            setGlobalAlarmSound(widgetConfigValues.globalAlertSound);
        }

        // 현재 태스크 지역 설정
        if (widgetConfigValues?.dmAreaInfo) {
            setAreaList(widgetConfigValues.dmAreaInfo);
        }
    }, [widgetConfigValues]);

    return (
        <div className="p-0 m-0 d-block w-100" style={{ height: `100%`, overflow: "auto" }}>
            <DndProvider backend={HTML5Backend}>
                <DoorMonitoringService />
            </DndProvider>
        </div>
    );
};
