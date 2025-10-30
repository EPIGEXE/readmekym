import { useCallback, useEffect, useState } from "react";
import useBioDeviceStore from "./store/bioDeviceStore";
import DeviceList from "./components/DeviceList/DeviceList";
import RealTimeEvent from "./components/RealTimeEvent/RealTimeEvent";
import AdminSetting from "./components/AdminSetting/AdminSetting";
import WiegandFormatConfig from "./components/WiegandFormatConfig/WiegandFormatConfig";
import DeviceSetting from "./components/DeviceSetting/DeviceSetting";
import SyncDeviceFloatCard from "./components/SyncDeviceFloatCard";

/**
 * 생체 장치 리스트 페이지
 *
 * 생체 장치들을 리스트 하고 추가, 설정, 삭제 등의 작업을 한다.
 * 하나의 위젯으로 들어가야하기 때문에 라우터로 화면을 전환하지 않고 페이지 내에서 화면을 전환한다.
 */
const BioDevice = () => {
    const selectedSettingDevice = useBioDeviceStore(
        (state) => state.selectedSettingDevice
    );
    const setSelectedSettingDevice = useBioDeviceStore(
        (state) => state.actions.setSelectedSettingDevice
    );

    const syncDeviceList = useBioDeviceStore((state) => state.syncDeviceList);

    // 현재 페이지 선택 상태
    const [displayMode, setDisplayMode] = useState("deviceList");

    // 페이지 이동 핸들러
    const handleBack = useCallback(() => setDisplayMode("deviceList"), []);
    const handleWiegandClick = useCallback(
        () => setDisplayMode("wiegandConfig"),
        []
    );
    const handleAdminSettingClick = useCallback(
        () => setDisplayMode("adminSetting"),
        []
    );
    const handleRealTimeEventClick = useCallback(
        () => setDisplayMode("realTimeEvent"),
        []
    );

    // 현재 페이지 선택에 따라 컴포넌트 렌더링
    const content = () => {
        if (selectedSettingDevice) {
            return (
                <DeviceSetting
                    isOpen={true}
                    deviceData={selectedSettingDevice}
                    onBack={() => setSelectedSettingDevice(null)}
                />
            );
        }

        switch (displayMode) {
            case "realTimeEvent":
                return <RealTimeEvent onBack={handleBack} />;
            case "wiegandConfig":
                return <WiegandFormatConfig onBack={handleBack} />;
            case "adminSetting":
                return <AdminSetting onBack={handleBack} />;
            default:
                return (
                    <DeviceList
                        onWiegandClick={handleWiegandClick}
                        onAdminSettingClick={handleAdminSettingClick}
                        onRealTimeEventClick={handleRealTimeEventClick}
                    />
                );
        }
    };

    return (
        <div className="relative h-full">
            {content()}

            {/* 동기화 중인 장치 표시 Float 카드 - 전역에서 보이도록 */}
            {syncDeviceList.length > 0 && <SyncDeviceFloatCard />}
        </div>
    );
};

export default BioDevice;
