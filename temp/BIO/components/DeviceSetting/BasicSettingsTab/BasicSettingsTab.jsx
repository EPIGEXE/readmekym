/**
 * BasicSettingsTab 컴포넌트
 *
 * 장치 설정 다이얼로그의 기본 설정 탭을 구성하는 컴포넌트입니다.
 * 장치의 기본 정보, 하드웨어 정보, 시스템 설정 및 네트워크 설정을 관리합니다.
 */
import React, { useEffect, useState } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { Input, Checkbox } from "@progress/kendo-react-inputs";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { GridLayout, GridLayoutItem } from "@progress/kendo-react-layout";
import { LocalizationProvider } from "@progress/kendo-react-intl";
import {
    arrowRotateCwIcon,
    connectorIcon,
    lockIcon,
    playSmIcon,
    saveIcon,
} from "@progress/kendo-svg-icons";
import {
    Divider,
    FormField,
    readOnlyStyle,
    Section,
    SectionTitle,
} from "../DeviceSettingCommon";
import DeviceLockDialog from "./DeviceLockDialog";
import DeviceResetDialog from "./DeviceResetDialog";
import DeviceRestartDialog from "./DeviceRestartDialog";
import { ComboBox, DropDownList } from "@progress/kendo-react-dropdowns";
import { Loader2 } from "lucide-react";
import { ipConnectionModeOptions } from "../../../utils/deviceSettingsOptions";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../../transMessages";
import DataSyncDialog from "./DataSyncDialog";
import useBioDeviceStore from "../../../store/bioDeviceStore";
import {
    useApplyServerTime,
    useDeivceTime,
} from "../../../hooks/reactQueryHooks/useDeviceSettingsDataApi";
import { useReaderList } from "../../../hooks/reactQueryHooks/useReaderApi";

/**
 * BasicSettingsTab 컴포넌트
 */
const BasicSettingsTab = ({
    isPending,
    isDeviceOffline,
    deviceSettings,
    handleInputChange,
    handleDateChange,
    handleDropdownChange,
    handleCheckboxChange,
    handleSaveButtonClick,
    setIsFirmwareUpdateOpen,
}) => {
    const { globalConfig } = useGlobalConfigStore();
    const messages = getMessages(globalConfig?.languageId);

    const selectedDevice = useBioDeviceStore(
        (state) => state.selectedSettingDevice
    );
    const setSelectedDevice = useBioDeviceStore(
        (state) => state.actions.setSelectedSettingDevice
    );
    const {
        data: deviceTimeData,
        refetch: refetchDeviceTime,
        isFetching,
    } = useDeivceTime(selectedDevice.device_id);

    const { mutateAsync: applyServerTime, isPending: isApplyingServerTime } =
        useApplyServerTime();

    const [isDataSyncOpen, setIsDataSyncOpen] = useState(false);
    const [isDeviceRestartOpen, setIsDeviceRestartOpen] = useState(false);
    const [isDeviceLockOpen, setIsDeviceLockOpen] = useState(false);
    const [isDeviceResetOpen, setIsDeviceResetOpen] = useState(false);

    const [deviceTime, setDeviceTime] = useState(null);

    const hardwareVersion =
        [
            deviceSettings.board_ver_major,
            deviceSettings.board_ver_minor,
            deviceSettings.board_ver_ext,
        ]
            .filter((v) => v !== undefined && v !== null && v !== "")
            .join(".") || "";

    const kernelVersion =
        [
            deviceSettings.kernel_ver_major,
            deviceSettings.kernel_ver_minor,
            deviceSettings.kernel_ver_ext,
        ]
            .filter((v) => v !== undefined && v !== null && v !== "")
            .join(".") || "";

    const bioStarCoreVersion =
        [
            deviceSettings.bscore_ver_major,
            deviceSettings.bscore_ver_minor,
            deviceSettings.bscore_ver_ext,
        ]
            .filter((v) => v !== undefined && v !== null && v !== "")
            .join(".") || "";

    const firmwareVersion =
        [
            deviceSettings.firmware_ver_major,
            deviceSettings.firmware_ver_minor,
            deviceSettings.firmware_ver_ext,
        ]
            .filter((v) => v !== undefined && v !== null && v !== "")
            .join(".") || "";

    // 리더 목록 데이터 가져오기
    const { data: readerList } = useReaderList();

    // 드롭다운 옵션 생성
    const options = readerList?.map((reader) => ({
        text: reader.name || reader.reader_id.toString(),
        value: reader.reader_id.toString(),
    }));

    useEffect(() => {
        if (deviceTimeData?.device_time) {
            // ISO 문자열을 Date 객체로 변환
            const date = new Date(deviceTimeData.device_time);
            setDeviceTime(date);
        }
    }, [deviceTimeData]);

    const handleGetDeviceTime = () => {
        refetchDeviceTime();
    };

    const handleApplyServerTime = () => {
        applyServerTime(
            { deviceId: selectedDevice.device_id },
            {
                onSuccess: () => {
                    refetchDeviceTime();
                },
            }
        );
    };

    const handleReaderSelect = (e) => {
        setSelectedDevice({
            ...selectedDevice,
            linked_reader_key: e.value?.value,
        });
    };

    return (
        <div className="mx-[60px]">
            {/* 상단 액션 버튼 영역 */}
            <div className="flex justify-end items-center mb-4">
                <div className="flex gap-2">
                    <Button
                        look="outline"
                        onClick={() => setIsDeviceRestartOpen(true)}
                        svgIcon={playSmIcon}
                        disabled={isDeviceOffline || isPending}
                        size="small"
                    >
                        {
                            messages.deviceSetting.basicSettings.actionButtons
                                .restart
                        }
                    </Button>
                    <Button
                        look="outline"
                        onClick={() => setIsDataSyncOpen(true)}
                        svgIcon={connectorIcon}
                        disabled={isDeviceOffline || isPending}
                        size="small"
                    >
                        {
                            messages.deviceSetting.basicSettings.actionButtons
                                .dataSync
                        }
                    </Button>
                    <Button
                        look="outline"
                        onClick={() => setIsDeviceLockOpen(true)}
                        svgIcon={lockIcon}
                        disabled={isDeviceOffline || isPending}
                        size="small"
                    >
                        {
                            messages.deviceSetting.basicSettings.actionButtons
                                .lock
                        }
                    </Button>
                    <Button
                        look="outline"
                        onClick={() => setIsDeviceResetOpen(true)}
                        svgIcon={arrowRotateCwIcon}
                        disabled={isDeviceOffline || isPending}
                        size="small"
                    >
                        {
                            messages.deviceSetting.basicSettings.actionButtons
                                .reset
                        }
                    </Button>
                    <div className="border-l border-gray-300 mx-1" />
                    <Button
                        look="flat"
                        svgIcon={saveIcon}
                        themeColor="primary"
                        className="px-4"
                        onClick={handleSaveButtonClick}
                        disabled={isDeviceOffline || isPending}
                    >
                        {isPending ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin" size={16} />
                                <span>{messages.common.saving}</span>
                            </div>
                        ) : (
                            messages.common.save
                        )}
                    </Button>
                </div>
            </div>

            {/* 기본 정보 섹션 */}
            <Section>
                <SectionTitle
                    title={messages.deviceSetting.basicSettings.baseInfo.title}
                />
                <div className="pl-2">
                    <GridLayout
                        gap={{ rows: 16, cols: 24 }}
                        cols={[{ width: "1fr" }, { width: "1fr" }]}
                    >
                        {/* 첫 번째 행 - 장치 기본 정보(이름, 종류) */}
                        <GridLayoutItem row={1} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .baseInfo.deviceName
                                }
                            >
                                <Input
                                    name="device_name"
                                    value={deviceSettings.device_name}
                                    onChange={handleInputChange}
                                    placeholder="장치 이름을 입력하세요"
                                    maxLength={50}
                                    required={true}
                                    disabled={isDeviceOffline || isPending}
                                />
                            </FormField>
                        </GridLayoutItem>
                        <GridLayoutItem row={1} col={2}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .baseInfo.modelName
                                }
                            >
                                <Input
                                    name="model_name"
                                    value={deviceSettings.model_name}
                                    onChange={handleInputChange}
                                    readOnly={true}
                                    style={readOnlyStyle}
                                    className="w-full rounded-md"
                                />
                            </FormField>
                        </GridLayoutItem>

                        {/* 두 번째 행 - 장치 ID와 모델명(읽기 전용) */}
                        <GridLayoutItem row={2} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .baseInfo.deviceId
                                }
                            >
                                <Input
                                    name="device_id"
                                    value={selectedDevice.device_id}
                                    onChange={handleInputChange}
                                    readOnly={true}
                                    style={readOnlyStyle}
                                    className="w-full rounded-md"
                                />
                            </FormField>
                        </GridLayoutItem>
                    </GridLayout>
                </div>
            </Section>

            {/* 리더 장치 연결 섹션 */}
            <Section>
                <SectionTitle
                    title={messages.deviceSetting.readerSettings.title}
                />
                <div className="pl-2">
                    <GridLayout
                        gap={{ rows: 16, cols: 24 }}
                        cols={[{ width: "1fr" }, { width: "1fr" }]}
                    >
                        <GridLayoutItem row={1} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .readerInfo.connectedReader
                                }
                            >
                                <ComboBox
                                    data={options}
                                    textField="text"
                                    dataItemKey="value"
                                    value={options?.find(
                                        (option) =>
                                            option.value ===
                                            selectedDevice.linked_reader_key
                                    )}
                                    onChange={handleReaderSelect}
                                    disabled={isDeviceOffline || isPending}
                                />
                            </FormField>
                        </GridLayoutItem>
                    </GridLayout>
                </div>
            </Section>

            {/* 하드웨어 정보 섹션 */}
            <Section>
                <SectionTitle
                    title={
                        messages.deviceSetting.basicSettings.hardwareInfo.title
                    }
                />
                <div className="pl-2">
                    <GridLayout
                        gap={{ rows: 16, cols: 24 }}
                        cols={[{ width: "1fr" }, { width: "1fr" }]}
                    >
                        {/* Mac 주소(읽기 전용) */}
                        <GridLayoutItem row={1} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .hardwareInfo.macAddress
                                }
                            >
                                <Input
                                    name="mac_addr"
                                    value={deviceSettings.mac_addr}
                                    onChange={handleInputChange}
                                    readOnly={true}
                                    style={readOnlyStyle}
                                    className="w-full rounded-md"
                                />
                            </FormField>
                        </GridLayoutItem>

                        {/* 하드웨어 버전(읽기 전용) */}
                        <GridLayoutItem row={2} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .hardwareInfo.hardwareVersion
                                }
                            >
                                <Input
                                    name="hardware_version"
                                    value={hardwareVersion}
                                    onChange={handleInputChange}
                                    readOnly={true}
                                    style={readOnlyStyle}
                                    className="w-full rounded-md"
                                />
                            </FormField>
                        </GridLayoutItem>

                        {/* 커널 버전(읽기 전용) */}
                        <GridLayoutItem row={3} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .hardwareInfo.kernelVersion
                                }
                            >
                                <Input
                                    name="kernel_version"
                                    value={kernelVersion}
                                    onChange={handleInputChange}
                                    readOnly={true}
                                    style={readOnlyStyle}
                                    className="w-full rounded-md"
                                />
                            </FormField>
                        </GridLayoutItem>

                        {/* 바이오스타 코어 버전(읽기 전용) */}
                        <GridLayoutItem row={4} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .hardwareInfo.bioStarVersion
                                }
                            >
                                <Input
                                    name="bscore_version"
                                    value={bioStarCoreVersion}
                                    onChange={handleInputChange}
                                    readOnly={true}
                                    style={readOnlyStyle}
                                    className="w-full rounded-md"
                                />
                            </FormField>
                        </GridLayoutItem>

                        {/* 펌웨어 버전(읽기 전용)과 업그레이드 버튼 */}
                        <GridLayoutItem row={5} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .hardwareInfo.firmwareVersion
                                }
                            >
                                <div className="flex gap-3">
                                    <Input
                                        name="firmware_version"
                                        value={firmwareVersion}
                                        onChange={handleInputChange}
                                        readOnly={true}
                                        style={readOnlyStyle}
                                        className="flex-1 rounded-md"
                                    />
                                    <Button
                                        look="flat"
                                        themeColor="primary"
                                        className="whitespace-nowrap"
                                        onClick={() =>
                                            setIsFirmwareUpdateOpen(true)
                                        }
                                        disabled={isDeviceOffline || isPending}
                                    >
                                        {
                                            messages.deviceSetting.basicSettings
                                                .hardwareInfo.firmwareUpdate
                                        }
                                    </Button>
                                </div>
                            </FormField>
                        </GridLayoutItem>
                    </GridLayout>
                </div>
            </Section>

            {/* 시스템 설정 섹션 */}
            <Section>
                <SectionTitle
                    title={
                        messages.deviceSetting.basicSettings.systemInfo.title
                    }
                    actions={
                        <>
                            <Button
                                look="outline"
                                size="small"
                                themeColor="primary"
                                onClick={handleGetDeviceTime}
                                disabled={
                                    isDeviceOffline || isFetching || isPending
                                }
                            >
                                {isFetching ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2
                                            className="animate-spin"
                                            size={16}
                                        />
                                        <span>
                                            {
                                                messages.deviceSetting
                                                    .basicSettings.systemInfo
                                                    .gettingDeviceTime
                                            }
                                        </span>
                                    </div>
                                ) : (
                                    messages.deviceSetting.basicSettings
                                        .systemInfo.getDeviceTime
                                )}
                            </Button>
                            <Button
                                look="outline"
                                size="small"
                                themeColor="primary"
                                onClick={handleApplyServerTime}
                                disabled={
                                    isDeviceOffline ||
                                    isApplyingServerTime ||
                                    isPending
                                }
                            >
                                {isApplyingServerTime ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2
                                            className="animate-spin"
                                            size={16}
                                        />
                                        <span>
                                            {
                                                messages.deviceSetting
                                                    .basicSettings.systemInfo
                                                    .applyingServerTime
                                            }
                                        </span>
                                    </div>
                                ) : (
                                    messages.deviceSetting.basicSettings
                                        .systemInfo.applyServerTime
                                )}
                            </Button>
                        </>
                    }
                />
                <div className="pl-2">
                    <GridLayout
                        gap={{ rows: 16, cols: 24 }}
                        cols={[{ width: "1fr" }, { width: "1fr" }]}
                    >
                        {/* 날짜/시간 설정 - 현재 날짜/시간과 서버 동기화 옵션 */}
                        <GridLayoutItem row={1} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .systemInfo.currentDateTime
                                }
                            >
                                <LocalizationProvider language="ko">
                                    <DatePicker
                                        format="yyyy-MM-dd HH:mm:ss"
                                        value={deviceTime}
                                        onChange={handleDateChange}
                                        disabled={true}
                                        className="w-full rounded-md border-gray-300"
                                    />
                                </LocalizationProvider>
                            </FormField>
                        </GridLayoutItem>
                        <GridLayoutItem row={1} col={2}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .systemInfo.syncServer
                                }
                            >
                                <div className="flex items-center">
                                    <Checkbox
                                        checked={
                                            deviceSettings.sync_time || false
                                        }
                                        onChange={handleCheckboxChange(
                                            "sync_time"
                                        )}
                                        disabled={isDeviceOffline || isPending}
                                    />
                                    <span className="ml-2">
                                        {deviceSettings.sync_time
                                            ? "ON"
                                            : "OFF"}
                                    </span>
                                </div>
                            </FormField>
                        </GridLayoutItem>
                    </GridLayout>
                </div>
            </Section>

            {/* 네트워크 설정 섹션 */}
            <Section>
                <SectionTitle
                    title={
                        messages.deviceSetting.basicSettings.networkSettings
                            .title
                    }
                />
                <div className="pl-2">
                    <GridLayout
                        gap={{ rows: 16, cols: 24 }}
                        cols={[{ width: "1fr" }, { width: "1fr" }]}
                    >
                        {/* 1행: 연결 모드, DHCP 사용 */}
                        <GridLayoutItem row={1} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .networkSettings.connectionMode
                                }
                            >
                                <DropDownList
                                    data={ipConnectionModeOptions}
                                    textField="text"
                                    dataItemKey="value"
                                    value={ipConnectionModeOptions.find(
                                        (option) =>
                                            option.value ===
                                            deviceSettings.connection_mode
                                    )}
                                    onChange={handleDropdownChange(
                                        "connection_mode"
                                    )}
                                    disabled={true}
                                    style={readOnlyStyle}
                                />
                            </FormField>
                        </GridLayoutItem>
                        <GridLayoutItem row={1} col={2}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .networkSettings.dhcpUsage
                                }
                            >
                                <div className="flex items-center">
                                    <Checkbox
                                        checked={
                                            deviceSettings.use_dhcp || false
                                        }
                                        onChange={handleCheckboxChange(
                                            "use_dhcp"
                                        )}
                                        disabled={true}
                                    />
                                    <span className="ml-2">
                                        {deviceSettings.use_dhcp ? "ON" : "OFF"}
                                    </span>
                                </div>
                            </FormField>
                        </GridLayoutItem>

                        {/* 2행: DNS 사용, 없음 */}
                        <GridLayoutItem row={2} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .networkSettings.dnsUsage
                                }
                            >
                                <div className="flex items-center">
                                    <Checkbox
                                        checked={
                                            deviceSettings.use_dns || false
                                        }
                                        onChange={handleCheckboxChange(
                                            "use_dns"
                                        )}
                                        disabled={true}
                                    />
                                    <span className="ml-2">
                                        {deviceSettings.use_dns ? "ON" : "OFF"}
                                    </span>
                                </div>
                            </FormField>
                        </GridLayoutItem>

                        {/* 3행: MTU 크기, Baseband 크기 */}
                        <GridLayoutItem row={3} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .networkSettings.mtuSize
                                }
                            >
                                <Input
                                    name="mtu_size"
                                    value={deviceSettings.mtu_size}
                                    onChange={handleInputChange}
                                    readOnly={true}
                                    style={readOnlyStyle}
                                    className="w-full rounded-md"
                                />
                            </FormField>
                        </GridLayoutItem>
                        <GridLayoutItem row={3} col={2}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .networkSettings.basebandSize
                                }
                            >
                                <Input
                                    name="baseband_size"
                                    value={deviceSettings.baseband_size}
                                    onChange={handleInputChange}
                                    readOnly={true}
                                    style={readOnlyStyle}
                                    className="w-full rounded-md"
                                />
                            </FormField>
                        </GridLayoutItem>

                        {/* 4행: IP 주소, 없음 */}
                        <GridLayoutItem row={4} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .networkSettings.ipAddress
                                }
                            >
                                <Input
                                    name="ip_address"
                                    value={deviceSettings.ip_address || ""}
                                    onChange={handleInputChange}
                                    readOnly={true}
                                    style={readOnlyStyle}
                                    className="w-full rounded-md"
                                />
                            </FormField>
                        </GridLayoutItem>

                        {/* 5행: 포트, 없음 */}
                        <GridLayoutItem row={5} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .networkSettings.port
                                }
                            >
                                <Input
                                    name="port"
                                    value={deviceSettings.port}
                                    onChange={handleInputChange}
                                    readOnly={true}
                                    style={readOnlyStyle}
                                    className="w-full rounded-md"
                                />
                            </FormField>
                        </GridLayoutItem>

                        {/* 6행: 게이트웨이 */}
                        <GridLayoutItem row={6} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .networkSettings.gateway
                                }
                            >
                                <Input
                                    name="gateway"
                                    value={deviceSettings.gateway}
                                    onChange={handleInputChange}
                                    readOnly={true}
                                    style={readOnlyStyle}
                                    className="w-full rounded-md"
                                />
                            </FormField>
                        </GridLayoutItem>

                        {/* 7행: 서브넷 마스크 */}
                        <GridLayoutItem row={7} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .networkSettings.subnetMask
                                }
                            >
                                <Input
                                    name="subnet_mask"
                                    value={deviceSettings.subnet_mask}
                                    onChange={handleInputChange}
                                    readOnly={true}
                                    style={readOnlyStyle}
                                    className="w-full rounded-md"
                                />
                            </FormField>
                        </GridLayoutItem>

                        {/* 서버 연결 정보 서브섹션 */}
                        <GridLayoutItem row={8} col={1} colSpan={2}>
                            <Divider />
                        </GridLayoutItem>

                        {/* 9행: 서버 IP 주소, 서버 포트 - 장치 관리 서버 연결 정보 */}
                        <GridLayoutItem row={9} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .networkSettings.serverIp
                                }
                            >
                                <Input
                                    name="server_addr"
                                    value={deviceSettings.server_addr || ""}
                                    onChange={handleInputChange}
                                    readOnly={true}
                                    style={readOnlyStyle}
                                    className="w-full rounded-md"
                                />
                            </FormField>
                        </GridLayoutItem>
                        <GridLayoutItem row={9} col={2}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .networkSettings.serverPort
                                }
                            >
                                <Input
                                    name="server_port"
                                    value={deviceSettings.server_port || ""}
                                    onChange={handleInputChange}
                                    readOnly={true}
                                    style={readOnlyStyle}
                                    className="w-full rounded-md"
                                />
                            </FormField>
                        </GridLayoutItem>

                        {/* 10행: 서버 SSL Port - 보안 연결용 */}
                        <GridLayoutItem row={10} col={2}>
                            <FormField
                                label={
                                    messages.deviceSetting.basicSettings
                                        .networkSettings.serverSslPort
                                }
                            >
                                <Input
                                    name="ssl_server_port"
                                    value={deviceSettings.ssl_server_port || ""}
                                    onChange={handleInputChange}
                                    readOnly={true}
                                    style={readOnlyStyle}
                                    className="w-full rounded-md"
                                />
                            </FormField>
                        </GridLayoutItem>
                    </GridLayout>
                </div>
            </Section>

            {isDeviceRestartOpen && (
                <DeviceRestartDialog
                    isOpen={isDeviceRestartOpen}
                    onClose={() => setIsDeviceRestartOpen(false)}
                />
            )}

            {isDataSyncOpen && (
                <DataSyncDialog
                    isOpen={isDataSyncOpen}
                    onClose={() => setIsDataSyncOpen(false)}
                />
            )}

            {isDeviceLockOpen && (
                <DeviceLockDialog
                    isOpen={isDeviceLockOpen}
                    onClose={() => setIsDeviceLockOpen(false)}
                />
            )}

            {isDeviceResetOpen && (
                <DeviceResetDialog
                    isOpen={isDeviceResetOpen}
                    onClose={() => setIsDeviceResetOpen(false)}
                />
            )}
        </div>
    );
};

export default BasicSettingsTab;
