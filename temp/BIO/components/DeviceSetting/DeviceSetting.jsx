/**
 * DeviceSettingDialog.jsx
 *
 * 바이오 장치 설정을 관리하는 다이얼로그 컴포넌트
 * 이 컴포넌트는 장치의 설정을 확인하고 변경할 수 있는 다이얼로그를 제공합니다.
 *
 * 주요 기능:
 * - 장치 기본 설정, 출입통제 리더 연결, 인증, 고급 설정 등 4개의 탭 제공
 * - 각 탭에서 해당 설정을 조회 및 수정 가능
 * - 설정 변경 시 변경 추적하여 저장 여부 확인
 * - 탭 간 이동 시 변경사항 저장 여부 확인
 * - 다이얼로그 닫기 시 변경사항 저장 여부 확인
 */

import React, { useState, useEffect, useCallback } from "react";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import BasicSettingsTab from "./BasicSettingsTab/BasicSettingsTab";
import AuthSettingsTab from "./AuthSettingsTab";
import AdvancedSettingsTab from "./AdvancedSettingsTab";

import SaveConfirmDialog from "./SaveConfirmDialog";
import { Loader } from "@progress/kendo-react-indicators";
import useBioDeviceStore from "../../store/bioDeviceStore";
import FirmwareUpdateDialog from "../DeviceList/FirmwareUpdateDialog";
import { Loader2, WifiOff } from "lucide-react";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";
import { useDeviceActions } from "../../hooks/reactQueryHooks/useDeviceApi";
import {
    useAdvancedSettings,
    useAuthSettings,
    useBasicSettings,
    useUpdateAdvancedSettings,
    useUpdateAuthSettings,
    useUpdateBasicSettings,
} from "../../hooks/reactQueryHooks/useDeviceSettingsDataApi";
import BioDeviceSettingHeader from "../common/BioDeviceSettingHeader";
import { useSetReaderToDevice } from "../../hooks/reactQueryHooks/useReaderApi";
import { useWiegandFormatList } from "../../hooks/reactQueryHooks/useWiegandFormatApi";

const DeviceSetting = ({ isOpen, deviceData, onBack }) => {
    const setSelectedSettingDevice = useBioDeviceStore(
        (state) => state.actions.setSelectedSettingDevice
    );

    // 동기화 중인 장치 리스트
    const syncDeviceList = useBioDeviceStore((state) => state.syncDeviceList);

    const { globalConfig } = useGlobalConfigStore();
    const messages = getMessages(globalConfig?.languageId);

    // Wiegand 포맷 리스트 로드
    const { data: wiegandFormatList } = useWiegandFormatList();

    // 장치 인증 설정 확인
    const auth =
        deviceData?.auth_config_ex === 1 ? "auth-config-ext" : "auth-config";
    const cardSupported = deviceData?.card_supported === 1 ? true : false;
    const faceSupported =
        deviceData?.face_supported === 1 ||
        deviceData?.face_ex_supported === 1;
    const fingerprintSupported =
        deviceData?.finger_supported === 1 ? true : false;

    //========================== 상태 정의 ==========================
    // 현재 선택된 탭 인덱스 (0: 기본 설정, 1: 인증, 2: 고급 설정)
    const [selectedTab, setSelectedTab] = useState(0);

    // 현재 편집 중인 장치 설정 데이터를 저장하는 상태
    // 이 상태는 각 탭별로 로드된 데이터를 관리
    const [deviceSettings, setDeviceSettings] = useState({});

    const { selectedSettingDevice } = useBioDeviceStore();

    // 상태 변경 후 최초 렌더링에서는 변경 감지 자체를 건너뛰기 위한 플래그
    const [isInitialRender, setIsInitialRender] = useState(true);

    // 저장 확인 다이올로그 상태
    const [isSaveConfirmDialogOpen, setIsSaveConfirmDialogOpen] =
        useState(false);
    const [nextTab, setNextTab] = useState(null);

    // 펌웨어 업데이트 다이얼로그 상태
    const [isFirmwareUpdateOpen, setIsFirmwareUpdateOpen] = useState(false);

    // 저장 확인 다이얼로그 콜백 설정
    const [confirmCallback, setConfirmCallback] = useState(null);
    const [cancelCallback, setCancelCallback] = useState(null);

    const [isSyncing, setIsSyncing] = useState(false);

    const isDeviceOffline = deviceData?.is_connected !== 1;

    const { updateFirmware } = useDeviceActions(); // 펌웨어 업데이트

    // 각 탭별 변경 여부 체크 상태
    const [isDirty, setIsDirty] = useState({
        basic: false,
        reader: false,
        auth: false,
        advanced: false,
    });

    /**
     * 현재 선택된 탭의 이름을 반환하는 함수
     *
     * 선택된 탭 인덱스에 따라 해당하는 탭 이름을 문자열로 반환합니다.
     * 이 이름은 데이터 조회 및 업데이트, 변경 상태 관리 등에 사용됩니다.
     *
     * @returns {string} 현재 선택된 탭의 이름 ('basic', 'reader', 'auth', 'advanced' 중 하나)
     */
    const getCurrentTabName = () => {
        switch (selectedTab) {
            case 0:
                return "basic";
            case 1:
                return "auth";
            case 2:
                return "advanced";
            default:
                return "basic";
        }
    };

    /**
     * React Query 훅을 사용한 데이터 관리
     *
     * 각 탭별로 데이터를 가져오는 훅을 사용하여 서버 데이터를 관리합니다.
     * 각 훅은 해당 탭의 데이터, 로딩 상태, 데이터 갱신 함수를 제공합니다.
     */

    // 기본 설정 탭 데이터 로드 (장치 기본 정보, 하드웨어 정보, 시스템/네트워크 설정 등)
    const {
        data: basicSettingsData, // 기본 설정 데이터
        isLoading: isBasicLoading, // 로딩 상태
        refetch: refetchBasic, // 데이터 갱신 함수
    } = useBasicSettings(deviceData?.device_id);

    // 인증 탭 데이터 로드 (지문/얼굴/카드 인증 설정, 보안 수준 등)
    const {
        data: authSettingsData, // 인증 설정 데이터
        isLoading: isAuthLoading, // 로딩 상태
        refetch: refetchAuth, // 데이터 갱신 함수
    } = useAuthSettings(
        deviceData?.device_id,
        auth,
        cardSupported,
        faceSupported,
        fingerprintSupported
    );

    // 고급 설정 탭 데이터 로드 (워치독, 네트워크 설정, 이벤트 설정 등)
    const {
        data: advancedSettingsData, // 고급 설정 데이터
        isLoading: isAdvancedLoading, // 로딩 상태
        refetch: refetchAdvanced, // 데이터 갱신 함수
    } = useAdvancedSettings(deviceData?.device_id);

    /**
     * 각 탭별 데이터 업데이트 훅
     *
     * 데이터 업데이트를 위한 React Query Mutation 훅들입니다.
     * 각 훅은 해당 탭의 설정을 서버에 업데이트하는 기능을 제공합니다.
     */
    const { mutateAsync: updateBasicSettings, isPending: isBasicUpdating } =
        useUpdateBasicSettings(); // 기본 설정만 업데이트
    const { mutateAsync: updateAuthSettings, isPending: isAuthUpdating } =
        useUpdateAuthSettings(); // 인증 설정만 업데이트
    const {
        mutateAsync: updateAdvancedSettings,
        isPending: isAdvancedUpdating,
    } = useUpdateAdvancedSettings(); // 고급 설정만 업데이트
    const {
        mutateAsync: setReaderToDevice,
        isPending: isSetReaderToDevicePending,
    } = useSetReaderToDevice(); // 리더 연결
    /**
     * 현재 선택된 탭의 데이터를 반환하는 함수
     *
     * 선택된 탭 인덱스에 따라 해당 탭의 데이터를 반환합니다.
     * 이 함수는 주로 현재 탭의 데이터를 확인하거나 설정 상태를 업데이트할 때 사용됩니다.
     *
     * @returns {Object|null} 현재 선택된 탭의 데이터 객체 또는 없을 경우 null
     */
    const getCurrentTabData = () => {
        switch (selectedTab) {
            case 0:
                return basicSettingsData;
            case 1:
                return authSettingsData;
            case 2:
                return advancedSettingsData;
            default:
                return null;
        }
    };

    //========================== useEffect ==========================

    /**
     * 데이터 로드 시 설정 업데이트 (개별 탭 데이터가 변경될 때)
     */
    const updateTabSettings = (tabData) => {
        if (!deviceData || !tabData) return;

        // 초기 렌더링 플래그 설정 (변경 감지 건너뛰기 위함)
        setIsInitialRender(true);

        // 현재 선택된 탭의 데이터만 업데이트
        if (
            (selectedTab === 0 && tabData === basicSettingsData) ||
            (selectedTab === 1 && tabData === authSettingsData) ||
            (selectedTab === 2 && tabData === advancedSettingsData)
        ) {
            // 설정 정보를 상태에 적용
            setDeviceSettings({
                ...tabData,
                device_name: deviceData.device_name,
            });

            // 현재 탭의 변경 상태 초기화
            setIsDirty((prev) => ({
                ...prev,
                [getCurrentTabName()]: false,
            }));
        }
    };

    useEffect(() => {
        if (syncDeviceList.includes(deviceData?.device_id)) {
            setIsSyncing(true);
        } else {
            setIsSyncing(false);
        }
    }, [syncDeviceList]);

    // 각 탭 데이터가 변경될 때 호출
    useEffect(() => {
        if (basicSettingsData) updateTabSettings(basicSettingsData);
    }, [basicSettingsData]);

    useEffect(() => {
        if (authSettingsData) updateTabSettings(authSettingsData);
    }, [authSettingsData]);

    useEffect(() => {
        if (advancedSettingsData) updateTabSettings(advancedSettingsData);
    }, [advancedSettingsData]);

    // 선택된 탭이 변경될 때 호출
    useEffect(() => {
        const currentTabData = getCurrentTabData();
        if (currentTabData) {
            // 초기 렌더링 플래그 설정 (변경 감지 건너뛰기 위함)
            setIsInitialRender(true);

            // 설정 정보를 상태에 적용
            setDeviceSettings({
                ...currentTabData,
                device_name: deviceData.device_name,
            });

            // 현재 탭의 변경 상태 초기화
            setIsDirty((prev) => ({
                ...prev,
                [getCurrentTabName()]: false,
            }));
        }
    }, [selectedTab]);

    // 초기 렌더링 플래그 초기화
    useEffect(() => {
        if (isInitialRender) {
            // 첫 렌더링 후 플래그를 false로 변경
            setIsInitialRender(false);
        }
    }, [isInitialRender, deviceSettings]);

    // 다이얼로그 진입 시 초기화
    useEffect(() => {
        if (isOpen && deviceData?.deviceId) {
            // 선택된 탭을 항상 기본 설정 탭(0번)으로 초기화
            setSelectedTab(0);

            // 기본 설정 탭 데이터만 로드
            refetchBasic();
        }
    }, [isOpen, deviceData?.deviceId]);

    // 선택된 탭 인덱스에 따라 해당 탭의 데이터를 반환하는 함수
    const getTabDataByIndex = (tabIndex) => {
        switch (tabIndex) {
            case 0:
                return basicSettingsData;
            case 1:
                return authSettingsData;
            case 2:
                return advancedSettingsData;
            default:
                return null;
        }
    };

    // 선택된 탭 인덱스에 따라 해당 탭의 데이터를 다시 로드하는 함수
    const refetchTabByIndex = (tabIndex) => {
        switch (tabIndex) {
            case 0:
                return refetchBasic();
            case 1:
                return refetchAuth();
            case 2:
                return refetchAdvanced();
            default:
                return Promise.resolve();
        }
    };

    // 탭 인덱스에 따른 탭 이름 반환
    const getTabNameByIndex = (tabIndex) => {
        switch (tabIndex) {
            case 0:
                return "basic";
            case 1:
                return "auth";
            case 2:
                return "advanced";
            default:
                return "basic";
        }
    };

    // 탭 변경 시 해당 탭의 데이터 로드
    const handleTabSelect = (e) => {
        const newTab = e.selected;
        const currentTabName = getCurrentTabName();

        // 현재 탭에 변경사항이 있는지 확인
        if (isDirty[currentTabName]) {
            setIsSaveConfirmDialogOpen(true);
            setNextTab(newTab);
        } else {
            // 변경사항 없이 탭 변경
            completeTabChange(newTab);
        }
    };

    // 탭 변경 완료 함수
    const completeTabChange = (newTab) => {
        // 탭 변경 로깅
        console.log(`=== ${getTabNameByIndex(newTab)} 탭으로 변경 ===`);

        // 데이터가 없을 때만 로드
        const tabData = getTabDataByIndex(newTab);
        if (!tabData) {
            refetchTabByIndex(newTab);
        } else {
            // 기존 데이터로 deviceSettings 업데이트
            setDeviceSettings({
                ...tabData,
                deviceId: deviceData?.deviceId,
            });
        }

        // 변경 상태 초기화
        setIsDirty((prev) => ({
            ...prev,
            [getTabNameByIndex(newTab)]: false,
        }));

        // 탭 상태 업데이트는 마지막에 실행
        setSelectedTab(newTab);
    };

    // 일반 입력 필드(Input) 값 변경 처리
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // 함수형 업데이트 사용
        setDeviceSettings((prev) => {
            const newSettings = {
                ...prev,
                [name]: value,
            };
            return newSettings;
        });

        // 항상 변경 상태 업데이트
        setIsDirty((prev) => {
            const newDirty = {
                ...prev,
                [getCurrentTabName()]: true,
            };
            return newDirty;
        });
    };

    // 체크박스 값 변경 처리
    const handleCheckboxChange = (name) => (e) => {
        // 함수형 업데이트 사용
        setDeviceSettings((prev) => {
            const newSettings = {
                ...prev,
                [name]: e.value,
            };
            return newSettings;
        });

        // 항상 변경 상태 업데이트
        setIsDirty((prev) => {
            const newDirty = {
                ...prev,
                [getCurrentTabName()]: true,
            };
            return newDirty;
        });
    };

    //드롭다운 선택 값 변경 처리
    const handleDropdownChange = (name) => (e) => {
        const value = e.value.value;

        // 함수형 업데이트 사용
        setDeviceSettings((prev) => {
            const newSettings = {
                ...prev,
                [name]: value,
            };
            return newSettings;
        });

        // 항상 변경 상태 업데이트
        setIsDirty((prev) => {
            const newDirty = {
                ...prev,
                [getCurrentTabName()]: true,
            };
            return newDirty;
        });
    };

    // 날짜 선택 값 변경 처리
    const handleDateChange = (e) => {
        setDeviceSettings((prev) => ({
            ...prev,
            date: e.value,
        }));

        // 초기 렌더링이 아닐 때만 변경 상태 업데이트
        if (!isInitialRender) {
            setIsDirty((prev) => ({
                ...prev,
                basic: true, // 날짜는 항상 기본 탭에 있음
            }));
        }
    };

    // 특정 탭의 설정 저장
    const saveTabSettings = async (tabName) => {
        try {
            // advanced 탭에서 wiegand_csnindex 검증
            if (tabName === "advanced") {
                const wiegandFormatData = [
                    { text: "기본값", value: 0 },
                    ...(wiegandFormatList || []).map((item) => ({
                        text: item.description,
                        value: item.format_id,
                    })),
                ];

                const hasValidWiegandFormat = wiegandFormatData.some(
                    (item) => item.value === deviceSettings?.wiegand_csnindex
                );

                if (!hasValidWiegandFormat) {
                    alert("Wiegand 포맷 설정을 선택해주세요.");
                    return false;
                }
            }

            // 탭에 맞는 업데이트 함수 선택
            let updateResult;

            switch (tabName) {
                case "basic":
                    updateResult = await updateBasicSettings({
                        deviceId: deviceSettings.device_id,
                        settings: deviceSettings,
                    });

                    // 리더 연결이 빈 객체나 null이면 ""로 변환해서 호출
                    const isEmptyObject = (obj) =>
                        obj &&
                        typeof obj === "object" &&
                        Object.keys(obj).length === 0;

                    const readerKey = selectedSettingDevice.linked_reader_key;
                    const processedReaderKey =
                        readerKey === null ||
                        readerKey === undefined ||
                        isEmptyObject(readerKey)
                            ? ""
                            : readerKey;

                    await setReaderToDevice({
                        deviceId: selectedSettingDevice.device_id,
                        readerId: processedReaderKey,
                    });
                    break;
                case "auth":
                    updateResult = await updateAuthSettings({
                        deviceId: deviceSettings.device_id,
                        settings: deviceSettings,
                        auth,
                        cardSupported,
                        faceSupported,
                        fingerprintSupported,
                    });
                    break;
                case "advanced":
                    const { device_name, ...settingsWithoutDeviceName } =
                        deviceSettings;
                    updateResult = await updateAdvancedSettings({
                        deviceId: deviceSettings.device_id,
                        settings: settingsWithoutDeviceName,
                    });
                    break;
                default:
                    throw new Error(`알 수 없는 탭 이름: ${tabName}`);
            }

            return true;
        } catch (error) {
            return false;
        }
    };

    // 현재 선택된 탭의 설정만 저장
    const handleSaveCurrentTab = async () => {
        const currentTabName = getCurrentTabName();

        // 현재 탭 설정 저장
        await saveTabSettings(currentTabName).then(() => {
            if (currentTabName === "basic") {
                const currentDevice =
                    useBioDeviceStore.getState().selectedSettingDevice;
                setSelectedSettingDevice({
                    ...currentDevice,
                    device_name: deviceSettings.device_name,
                });
            }

            // 모든 탭의 dirty 상태 초기화
            setIsDirty({
                basic: false,
                reader: false,
                auth: false,
                advanced: false,
            });
        });
    };

    // 저장 버튼 클릭 핸들러
    const handleSaveButtonClick = () => {
        handleSaveCurrentTab();
    };

    // 설정 페이지 닫기 핸들러
    const handleBack = () => {
        // 현재 탭의 변경사항 확인
        const currentTabName = getCurrentTabName();
        const hasDirtyTab = isDirty[currentTabName];

        if (hasDirtyTab) {
            // SaveConfirmDialog를 표시하고 적절한 콜백 설정
            setIsSaveConfirmDialogOpen(true);

            // 백 액션을 위한 콜백 설정 - 저장 확인 다이얼로그에서 사용할 콜백 함수들
            setConfirmCallback(() => async () => {
                // 저장 후 뒤로 가기
                await handleSaveCurrentTab();
                onBack();
            });

            setCancelCallback(() => () => {
                // 저장하지 않고 뒤로 가기
                if (deviceSettings) {
                    setDeviceSettings(
                        JSON.parse(JSON.stringify(deviceSettings))
                    );
                }

                setIsDirty((prev) => ({
                    ...prev,
                    [currentTabName]: false,
                }));

                onBack();
            });
        } else {
            // 변경사항이 없으면 바로 뒤로 가기
            onBack();
        }
    };

    /**
     * NumericTextBox 값 변경 처리
     * 숫자 입력 필드의 값으로 설정을 업데이트하고
     * 현재 탭의 변경 여부(isDirty)를 true로 설정
     */
    const handleNumericChange = (name) => (e) => {
        setDeviceSettings((prev) => ({
            ...prev,
            [name]: e.value,
        }));

        // 초기 렌더링이 아닐 때만 변경 상태 업데이트
        if (!isInitialRender) {
            setIsDirty((prev) => ({
                ...prev,
                [getCurrentTabName()]: true,
            }));
        }
    };

    //==================== 저장 확인 다이올로그 핸들러 =====================
    const performFirmwareUpdate = useCallback(
        (deviceId, firmwareFile) => {
            console.log(
                `${deviceId}에 펌웨어 업데이트 수행: ${firmwareFile}`
            );
            updateFirmware({deviceId, filename: firmwareFile});
        },
        [updateFirmware]
    );

    // 다이얼로그가 닫혀 있거나 장치 데이터가 없으면 아무것도 렌더링하지 않음
    if (!isOpen || !deviceData) {
        return null;
    }

    // 데이터 로드 완료 시 설정 다이얼로그 렌더링
    return (
        <div className="p-5 flex flex-col gap-2 h-[calc(100%-65px)]">
            <BioDeviceSettingHeader
                onBack={handleBack}
                title={
                    <>
                        {deviceData.device_name} {messages.deviceSetting.title}
                        {isDeviceOffline && (
                            <span className="ml-2 text-xs font-medium px-2 py-0.5 bg-[var(--kendo-color-error-subtle)] text-[var(--kendo-color-error)] rounded-full inline-flex items-center">
                                <WifiOff className="h-3 w-3 mr-1" />
                                {messages.common.offline}
                            </span>
                        )}
                        {isSyncing && (
                            <span className="ml-2 text-xs font-medium px-2 py-0.5 bg-[var(--kendo-color-warning-subtle)] text-[var(--kendo-color-warning)] rounded-full inline-flex items-center">
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                동기화 중...
                            </span>
                        )}
                    </>
                }
            />

            {/* 장치 상태 표시 영역 */}
            <div className="flex justify-end items-center mb-1">
                <div className="flex items-center gap-4 text-sm">
                    <div
                        className={`flex items-center ${
                            isDeviceOffline
                                ? "text-[var(--kendo-color-error)]"
                                : "text-[var(--kendo-color-success)]"
                        }`}
                    >
                        <div className="flex items-center gap-1.5">
                            <div className="relative">
                                <div
                                    className={`w-2 h-2 rounded-full ${
                                        isDeviceOffline
                                            ? "bg-[var(--kendo-color-error)]"
                                            : "bg-[var(--kendo-color-success)]"
                                    }`}
                                ></div>
                                {!isDeviceOffline && (
                                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-[var(--kendo-color-success)] opacity-30 animate-ping"></div>
                                )}
                            </div>
                            <span className="font-medium">
                                {deviceData.is_connected === 1
                                    ? messages.common.online
                                    : messages.common.offline}
                            </span>
                        </div>
                    </div>
                    <div className="h-4 border-l border-gray-300"></div>
                    <div>
                        <span>
                            {messages.deviceSetting.deviceId}:{" "}
                            <span className="font-medium text-[var(--kendo-color-primary)]">
                                {deviceData.device_id}
                            </span>
                        </span>
                    </div>
                    <div className="h-4 border-l border-gray-300"></div>
                    <div>
                        <span>
                            {messages.deviceSetting.deviceName}:{" "}
                            <span className="font-medium  text-[var(--kendo-color-primary)]">
                                {deviceData.device_name}
                            </span>
                        </span>
                    </div>
                    <div className="h-4 border-l border-gray-300"></div>
                    <div>
                        <span>
                            {messages.deviceSetting.deviceTypeName}:{" "}
                            <span className="font-medium text-[var(--kendo-color-primary)]">
                                {deviceData.type_name}
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            {/* 탭 스트립 컴포넌트 - 4개 탭으로 구성 */}
            <TabStrip
                selected={selectedTab}
                onSelect={handleTabSelect}
                animation={false}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                }}
            >
                {/* 기본 설정 탭 */}
                <TabStripTab title={messages.deviceSetting.tabTitle.basic}>
                    {isBasicLoading ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                minHeight: "400px",
                            }}
                        >
                            <Loader size="large" />
                        </div>
                    ) : (
                        <BasicSettingsTab
                            isPending={isBasicUpdating}
                            isDeviceOffline={isDeviceOffline}
                            deviceSettings={deviceSettings}
                            handleInputChange={handleInputChange}
                            handleDateChange={handleDateChange}
                            handleCheckboxChange={handleCheckboxChange}
                            handleDropdownChange={handleDropdownChange}
                            handleNumericChange={handleNumericChange}
                            handleSaveButtonClick={handleSaveButtonClick}
                            setIsFirmwareUpdateOpen={setIsFirmwareUpdateOpen}
                        />
                    )}
                </TabStripTab>

                {/* 인증 탭 */}
                <TabStripTab title={messages.deviceSetting.tabTitle.auth}>
                    {isAuthLoading ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                minHeight: "400px",
                            }}
                        >
                            <Loader size="large" />
                        </div>
                    ) : (
                        <AuthSettingsTab
                            isPending={isAuthUpdating}
                            isDeviceOffline={isDeviceOffline}
                            deviceSettings={deviceSettings}
                            handleCheckboxChange={handleCheckboxChange}
                            handleDropdownChange={handleDropdownChange}
                            handleNumericChange={handleNumericChange}
                            handleSaveButtonClick={handleSaveButtonClick}
                            setDeviceSettings={setDeviceSettings}
                            getCurrentTabName={getCurrentTabName}
                            setIsDirty={setIsDirty}
                        />
                    )}
                </TabStripTab>

                {/* 고급 설정 탭 */}
                <TabStripTab title={messages.deviceSetting.tabTitle.advanced}>
                    {isAdvancedLoading ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                minHeight: "400px",
                            }}
                        >
                            <Loader size="large" />
                        </div>
                    ) : (
                        <AdvancedSettingsTab
                            isPending={isAdvancedUpdating}
                            isDeviceOffline={isDeviceOffline}
                            deviceSettings={deviceSettings}
                            handleInputChange={handleInputChange}
                            handleNumericChange={handleNumericChange}
                            handleDropdownChange={handleDropdownChange}
                            handleSaveButtonClick={handleSaveButtonClick}
                            setDeviceSettings={setDeviceSettings}
                            getCurrentTabName={getCurrentTabName}
                            setIsDirty={setIsDirty}
                        />
                    )}
                </TabStripTab>
            </TabStrip>

            {isFirmwareUpdateOpen && (
                <FirmwareUpdateDialog
                    isOpen={isFirmwareUpdateOpen}
                    onClose={() => setIsFirmwareUpdateOpen(false)}
                    deviceData={deviceData}
                    onFirmwareUpdate={performFirmwareUpdate}
                />
            )}

            {isSaveConfirmDialogOpen && (
                <SaveConfirmDialog
                    handleConfirmSave={() => {
                        // 다이얼로그 닫기
                        setIsSaveConfirmDialogOpen(false);

                        // nextTab이 있으면 탭 변경 로직 실행, 없으면 뒤로 가기 로직 실행
                        if (nextTab !== null) {
                            // 탭 변경 로직
                            const currentTabName = getCurrentTabName();
                            saveTabSettings(currentTabName).then(() => {
                                completeTabChange(nextTab);
                                setNextTab(null);
                            });
                        } else {
                            // 뒤로 가기 로직 (confirmCallback 실행)
                            confirmCallback();
                        }
                    }}
                    handleCancelSave={() => {
                        // 다이얼로그 닫기
                        setIsSaveConfirmDialogOpen(false);

                        // nextTab이 있으면 탭 변경 로직 실행, 없으면 뒤로 가기 로직 실행
                        if (nextTab !== null) {
                            completeTabChange(nextTab);
                            setNextTab(null);
                        } else {
                            // 뒤로 가기 로직 (cancelCallback 실행)
                            cancelCallback();
                        }
                    }}
                />
            )}
        </div>
    );
};

export default DeviceSetting;
