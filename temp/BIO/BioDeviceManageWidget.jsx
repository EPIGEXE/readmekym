/**
 * SampleWidget
 *-------------------------------------------------------------------------------------------
 
 */

import * as React from "react";
import { Button } from "@progress/kendo-react-buttons";
import { FloatingActionButton } from "@progress/kendo-react-buttons";

//import { JSONTree } from 'react-json-tree';
//import ReactJson from 'react-json-view'
import { useGet, useLoginInfoStore, useServerConfigStore, useGlobalConfigStore, FullLoading } from "v2/libs";
import { useRealtimeEvent, StompClient, eventBus } from "v2/libs/utils/stomp";
import { getMessages } from "./transMessages";
import { MessageDialog } from "v2/components/common/MessageDialog";
import BioDevice from "./BioDevice";
import useBioDeviceStore from "./store/bioDeviceStore";
import useBioWebSocketStore from "./store/bioWebSocketStore";

export const BioDeviceManageWidget = (props) => {
    const { widgetData, widgetConfigValues, widgetSetting, widgetSize } = props;

    const { loginInfo } = useLoginInfoStore(); //로그인 정보
    const { serverConfig } = useServerConfigStore(); //서버설정 정보
    const { globalConfig } = useGlobalConfigStore(); //전역설정 정보

    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);
    const setProductCode = useBioDeviceStore((state) => state.actions.setProductCode);
    const setAcsCode = useBioDeviceStore((state) => state.actions.setAcsCode);
    const { connect, disconnect } = useBioWebSocketStore((state) => state.actions);

    // 위젯 마운트 시 설정값 초기화
    React.useEffect(() => {
        if (widgetConfigValues?.bioLinkInfo?.value) {
            setProductCode(widgetConfigValues.bioLinkInfo.value);
        }
        if (widgetConfigValues?.systemInfo?.value) {
            setAcsCode(widgetConfigValues.systemInfo.value);
        }
    }, []);

    React.useEffect(() => {
        connect("axistationx.com", productCode);
        return () => disconnect();
    }, [serverConfig, productCode]);

    return (
        <div className="p-0 m-0 d-block w-100" style={{ height: `100%`, overflow: "auto" }}>
            {productCode && <BioDevice />}
        </div>
    );
};
