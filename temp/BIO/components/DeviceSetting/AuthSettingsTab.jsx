/**
 * AuthSettingsTab 컴포넌트
 *
 * 장치 설정 다이얼로그의 인증 탭을 구성하는 컴포넌트입니다.
 * 장치의 인증 관련 설정, 지문 설정, 얼굴 인식 설정, 카드 설정을 관리합니다.
 *
 * 구성 섹션:
 * 1. 인증 모드 섹션 - 인증 방식, 개별 인증 모드, 응답 시간 설정 등
 * 2. 지문 설정 섹션 - 보안 레벨, 인증 속도, 센서 모드 등
 * 3. 얼굴 설정 섹션 - 얼굴 인식 관련 설정
 * 4. 카드 설정 섹션 - 카드 데이터 저장 방식, 카드 데이터 유형 등
 */
import React from "react";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { GridLayout, GridLayoutItem } from "@progress/kendo-react-layout";

import {
    FormField,
    readOnlyStyle,
    Section,
    SectionTitle,
} from "./DeviceSettingCommon";
import { saveIcon } from "@progress/kendo-svg-icons";
import { Input, Switch } from "@progress/kendo-react-inputs";

import { Check, Loader2, X } from "lucide-react";
import {
    deviceAuthModeOptionsBasic,
    deviceAuthModeOptionsExt,
    faceDetectionLevelOptions,
    fingerprintAuthSpeedOptions,
    fingerprintSensorModeOptions,
    securityLevelOptions,
} from "../../utils/deviceSettingsOptions";
import {
    ByteOrder,
    CardDataType,
    convertToDropdownData,
    DetectSensitivity,
    EnrollThreshold,
    lfdLevel,
    LightCondition,
    MaxRotation,
    OperationMode,
    SecurityLevel,
    Sensitivity,
    TemplateFormat,
} from "../../utils/bioLinkDatabaseUtlilty";
import useBioDeviceStore from "../../store/bioDeviceStore";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";
import { useWiegandFormatList } from "../../hooks/reactQueryHooks/useWiegandFormatApi";

/**
 * AuthSettingsTab 컴포넌트
 *
 * @param {Object} deviceSettings - 장치 설정 상태 객체
 * @param {Function} handleNumberInputChange - 텍스트 입력 변경 처리 함수
 * @param {Function} handleCheckboxChange - 체크박스 변경 처리 함수
 * @param {Function} handleDropdownChange - 드롭다운 선택 변경 처리 함수
 * @param {Function} handleSaveButtonClick - 저장 버튼 클릭 처리 함수
 * @param {Function} setDeviceSettings - 장치 설정 상태 업데이트 함수
 * @param {Function} getCurrentTabName - 현재 선택된 탭 이름 반환 함수
 * @param {Function} setIsDirty - 변경 여부 상태 업데이트 함수
 */
const AuthSettingsTab = ({
    isPending,
    isDeviceOffline,
    deviceSettings,
    handleDropdownChange,
    handleSaveButtonClick,
    handleNumericChange,
    setDeviceSettings,
    getCurrentTabName,
    setIsDirty,
}) => {
    const { globalConfig } = useGlobalConfigStore();
    const messages = getMessages(globalConfig?.languageId);

    const selectedSettingDevice = useBioDeviceStore(
        (state) => state.selectedSettingDevice
    );

    const { data: wiegandFormatList } = useWiegandFormatList();

    const wiegandFormatData = wiegandFormatList?.map((item) => ({
        text: item.description,
        value: item.id,
    }));

    // 인증 정보를 읽어서 지원하는 인증 정보만 보이도록 처리
    const authInfo =
        selectedSettingDevice?.auth_config_ex === 1
            ? "auth-config-ext"
            : "auth-config";
    const cardSupported =
        selectedSettingDevice?.card_supported === 1 ? true : false;
    const faceSupported =
        selectedSettingDevice?.face_supported === 1 ||
        selectedSettingDevice?.face_ex_supported === 1;
    const fingerprintSupported =
        selectedSettingDevice?.finger_supported === 1 ? true : false;

    const isDisabled = isDeviceOffline || isPending;

    /**
     * 토글 스위치 핸들러 함수
     * @param {string} fieldName - 토글할 설정 항목의 이름
     */
    const handleToggle = (fieldName) => (e) => {
        setDeviceSettings((prev) => ({
            ...prev,
            [fieldName]: e.value ? 1 : 0,
        }));
        setIsDirty((prev) => ({
            ...prev,
            [getCurrentTabName()]: true,
        }));
    };

    // 비트 문자열을 기반으로 선택된 옵션들을 확인하는 함수
    const isOptionSelected = (value) => {
        if (!validateBitPosition(value)) return false;

        const scheduleKey =
            authInfo === "auth-config-ext"
                ? "ext_auth_schedule"
                : "auth_schedule";
        const bitString = deviceSettings[scheduleKey] || "0".repeat(128); // 기본값으로 128비트 0 문자열

        // 비트 문자열에서 해당 위치의 값 확인 (왼쪽에서 오른쪽으로 읽음)
        return bitString[value] === "1";
    };

    // 비트 위치 유효성 검사
    const validateBitPosition = (position) => {
        const maxPosition = authInfo === "auth-config-ext" ? 49 : 10;
        if (position < 0 || position > maxPosition) {
            console.warn(
                `Invalid bit position: ${position}. Must be between 0 and ${maxPosition}.`
            );
            return false;
        }
        return true;
    };

    // 옵션 선택/해제 처리 함수
    const handleAuthModeChange = (value) => (e) => {
        if (!validateBitPosition(value)) return;

        const scheduleKey =
            authInfo === "auth-config-ext"
                ? "ext_auth_schedule"
                : "auth_schedule";
        const currentBitString = deviceSettings[scheduleKey] || "0".repeat(128);

        // 비트 문자열을 배열로 변환
        const bitArray = currentBitString.split("");

        // 해당 위치의 비트 값을 변경 (왼쪽에서 오른쪽으로 읽음)
        bitArray[value] = e.value ? "1" : "0";

        // 배열을 다시 문자열로 변환
        const newBitString = bitArray.join("");

        setDeviceSettings((prev) => ({
            ...prev,
            [scheduleKey]: newBitString,
        }));
        setIsDirty((prev) => ({
            ...prev,
            [getCurrentTabName()]: true,
        }));
    };

    // 현재 authInfo에 따라 표시할 옵션들 결정
    const currentAuthOptions =
        authInfo === "auth-config-ext"
            ? deviceAuthModeOptionsExt
            : deviceAuthModeOptionsBasic;

    return (
        <div className="mx-[60px]">
            {/* 상단 버튼 영역 - 설정 일괄 적용 및 저장 버튼 */}
            <div className="flex justify-end items-center mb-4">
                <div className="flex gap-2">
                    <Button
                        look="flat"
                        svgIcon={saveIcon}
                        themeColor="primary"
                        disabled={isDisabled}
                        className="px-4"
                        onClick={handleSaveButtonClick}
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

            <Section>
                <SectionTitle
                    title={messages.deviceSetting.authSettings.basicInfo.title}
                />
                <div className="pl-2">
                    <GridLayout
                        gap={{ rows: 10, cols: 100 }}
                        cols={[{ width: "1fr" }, { width: "1fr" }]}
                    >
                        {/* 1행: 인증 모드, 개별 인증 모드 */}
                        <GridLayoutItem row={1} col={1} colSpan={2}>
                            <div className=" rounded-lg border border-gray-200 p-4 mb-6">
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .basicInfo.authMode
                                    }
                                >
                                    <div className="space-y-4">
                                        {/* 선택된 인증 모드 표시 */}
                                        <div className="bg-[var(--kendo-color-surface)] border rounded-lg p-4">
                                            <div className=" flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-[var(--kendo-color-primary)]">
                                                        {
                                                            messages
                                                                .deviceSetting
                                                                .authSettings
                                                                .basicInfo
                                                                .selectedAuthMode
                                                        }
                                                    </span>
                                                    <span className="text-xs">
                                                        (
                                                        {
                                                            currentAuthOptions.filter(
                                                                (option) =>
                                                                    isOptionSelected(
                                                                        option.value
                                                                    )
                                                            ).length
                                                        }
                                                        {
                                                            messages
                                                                .deviceSetting
                                                                .authSettings
                                                                .basicInfo
                                                                .selectedAuthModeCount
                                                        }
                                                        )
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="bg-[var(--kendo-color-app-surface)] flex flex-wrap gap-2 p-3 rounded-lg border border-gray-200 min-h-[40px]">
                                                {currentAuthOptions
                                                    .filter((option) =>
                                                        isOptionSelected(
                                                            option.value
                                                        )
                                                    )
                                                    .map((option) => (
                                                        <div
                                                            key={option.value}
                                                            className={`group flex items-center gap-1.5 bg-[var(--kendo-color-primary-subtle)] text-[var(--kendo-color-primary)] px-3 py-1.5 rounded-md text-sm border border-[var(--kendo-color-primary)]
                                                            ${
                                                                isDisabled
                                                                    ? "opacity-50 cursor-not-allowed"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <span className="font-medium">
                                                                {option.text}
                                                            </span>
                                                            <div
                                                                onClick={() => {
                                                                    if (
                                                                        !isDisabled
                                                                    ) {
                                                                        handleAuthModeChange(
                                                                            option.value
                                                                        )({
                                                                            value: false,
                                                                        });
                                                                    }
                                                                }}
                                                                className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-[var(--kendo-color-error)] cursor-pointer"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                {currentAuthOptions.filter(
                                                    (option) =>
                                                        isOptionSelected(
                                                            option.value
                                                        )
                                                ).length === 0 && (
                                                    <span className="text-sm">
                                                        {
                                                            messages
                                                                .deviceSetting
                                                                .authSettings
                                                                .basicInfo
                                                                .noSelectedAuthMode
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* 옵션 목록 */}
                                        <div className="border rounded-lg max-h-60 overflow-y-auto">
                                            {currentAuthOptions.map(
                                                (option) => (
                                                    <div
                                                        key={option.value}
                                                        onClick={() => {
                                                            if (!isDisabled) {
                                                                handleAuthModeChange(
                                                                    option.value
                                                                )({
                                                                    value: !isOptionSelected(
                                                                        option.value
                                                                    ),
                                                                });
                                                            }
                                                        }}
                                                        className={`
                                                            px-3 py-2 cursor-pointer
                                                            ${
                                                                isOptionSelected(
                                                                    option.value
                                                                )
                                                                    ? "bg-[var(--kendo-color-primary-subtle)] border-l-4 border-l-[var(--kendo-color-primary-subtle)] text-[var(--kendo-color-primary)]"
                                                                    : "hover:bg-[var(--kendo-color-primary-subtle)]"
                                                            }
                                                            ${
                                                                isDisabled
                                                                    ? "opacity-50 cursor-not-allowed"
                                                                    : ""
                                                            }
                                                        `}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm">
                                                                {option.text}
                                                            </span>
                                                            {isOptionSelected(
                                                                option.value
                                                            ) && (
                                                                <Check className="w-4 h-4 text-[var(--kendo-color-primary)]" />
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </FormField>
                            </div>
                        </GridLayoutItem>
                        <GridLayoutItem row={2} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.authSettings
                                        .basicInfo.individualAuthMode
                                }
                            >
                                <Switch
                                    checked={deviceSettings.use_private_auth}
                                    onChange={handleToggle("use_private_auth")}
                                    disabled={isDisabled}
                                />
                            </FormField>
                        </GridLayoutItem>

                        {/* 2행: 얼굴 검출 Level, 생체 인식 응답 시간 */}
                        <GridLayoutItem row={3} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.authSettings
                                        .basicInfo.faceDetectionLevel
                                }
                            >
                                <DropDownList
                                    data={faceDetectionLevelOptions}
                                    textField="text"
                                    dataItemKey="value"
                                    value={faceDetectionLevelOptions.find(
                                        (item) =>
                                            item.value ===
                                            deviceSettings.face_detection_level
                                    )}
                                    onChange={handleDropdownChange(
                                        "face_detection_level"
                                    )}
                                    disabled={isDisabled}
                                />
                            </FormField>
                        </GridLayoutItem>
                        <GridLayoutItem row={3} col={2}>
                            <FormField
                                label={
                                    messages.deviceSetting.authSettings
                                        .basicInfo.biometricResponseTime
                                }
                            >
                                <Input
                                    type="number"
                                    value={deviceSettings.match_timeout}
                                    onChange={handleNumericChange(
                                        "match_timeout"
                                    )}
                                    disabled={isDisabled}
                                />
                            </FormField>
                        </GridLayoutItem>

                        {/* 3행: 운영자 계정 수, 사용자 인증 응답 시간 */}
                        <GridLayoutItem row={4} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.authSettings
                                        .basicInfo.numOperators
                                }
                            >
                                <Input
                                    type="number"
                                    value={deviceSettings.num_operators}
                                    onChange={handleNumericChange(
                                        "num_operators"
                                    )}
                                    style={readOnlyStyle}
                                    disabled={true}
                                />
                            </FormField>
                        </GridLayoutItem>
                        <GridLayoutItem row={4} col={2}>
                            <FormField
                                label={
                                    messages.deviceSetting.authSettings
                                        .basicInfo.userAuthResponseTime
                                }
                            >
                                <Input
                                    type="number"
                                    value={deviceSettings.auth_timeout}
                                    onChange={handleNumericChange(
                                        "auth_timeout"
                                    )}
                                    disabled={isDisabled}
                                />
                            </FormField>
                        </GridLayoutItem>
                    </GridLayout>
                </div>
            </Section>

            {fingerprintSupported && (
                <Section>
                    <SectionTitle
                        title={
                            messages.deviceSetting.authSettings
                                .fingerprintSettings.title
                        }
                    />
                    <div className="pl-2">
                        <GridLayout
                            gap={{ rows: 10, cols: 100 }}
                            cols={[{ width: "1fr" }, { width: "1fr" }]}
                        >
                            {/* 첫 번째 행 - 보안 레벨, 인증 속도 */}
                            <GridLayoutItem row={1} col={1}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .fingerprintSettings.securityLevel
                                    }
                                >
                                    <DropDownList
                                        data={securityLevelOptions}
                                        textField="text"
                                        dataItemKey="value"
                                        value={securityLevelOptions.find(
                                            (item) =>
                                                item.value ===
                                                deviceSettings.security_level
                                        )}
                                        onChange={handleDropdownChange(
                                            "security_level"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>
                            <GridLayoutItem row={1} col={2}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .fingerprintSettings
                                            .authenticationSpeed
                                    }
                                >
                                    <DropDownList
                                        data={fingerprintAuthSpeedOptions}
                                        textField="text"
                                        dataItemKey="value"
                                        value={fingerprintAuthSpeedOptions.find(
                                            (item) =>
                                                item.value ===
                                                deviceSettings.fast_mode
                                        )}
                                        onChange={handleDropdownChange(
                                            "fast_mode"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>

                            {/* 두 번째 행 - 지문 센서 모드, 센서 감도 */}
                            <GridLayoutItem row={2} col={1}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .fingerprintSettings.sensorMode
                                    }
                                >
                                    <DropDownList
                                        data={fingerprintSensorModeOptions}
                                        textField="text"
                                        dataItemKey="value"
                                        value={fingerprintSensorModeOptions.find(
                                            (item) =>
                                                item.value ===
                                                deviceSettings.sensor_mode
                                        )}
                                        onChange={handleDropdownChange(
                                            "sensor_mode"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>
                            <GridLayoutItem row={2} col={2}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .fingerprintSettings
                                            .sensorSensitivity
                                    }
                                >
                                    <DropDownList
                                        data={convertToDropdownData(
                                            Sensitivity
                                        )}
                                        textField="text"
                                        dataItemKey="value"
                                        value={convertToDropdownData(
                                            Sensitivity
                                        ).find(
                                            (item) =>
                                                item.value ===
                                                deviceSettings.sensitivity
                                        )}
                                        onChange={handleDropdownChange(
                                            "sensitivity"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>

                            {/* 세 번째 행 - 지문 템플릿, 위조 판단 민감도 */}
                            <GridLayoutItem row={3} col={1}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .fingerprintSettings
                                            .fingerprintTemplate
                                    }
                                >
                                    <DropDownList
                                        data={convertToDropdownData(
                                            TemplateFormat
                                        )}
                                        textField="text"
                                        dataItemKey="value"
                                        value={convertToDropdownData(
                                            TemplateFormat
                                        ).find(
                                            (item) =>
                                                item.value ===
                                                deviceSettings.template_format
                                        )}
                                        onChange={handleDropdownChange(
                                            "template_format"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>
                            <GridLayoutItem row={3} col={2}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .fingerprintSettings
                                            .fakeDetectionSensitivity
                                    }
                                >
                                    <DropDownList
                                        data={convertToDropdownData(lfdLevel)}
                                        textField="text"
                                        dataItemKey="value"
                                        value={convertToDropdownData(
                                            lfdLevel
                                        ).find(
                                            (item) =>
                                                item.value ===
                                                deviceSettings.lfd_level
                                        )}
                                        onChange={handleDropdownChange(
                                            "lfd_level"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>

                            {/* 네 번째 행 - 지문 품질 체크, 지문 스캔 제한 시간 */}
                            <GridLayoutItem row={4} col={1}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .fingerprintSettings
                                            .imageQualityCheck
                                    }
                                >
                                    <Switch
                                        checked={
                                            deviceSettings.advanced_enrollment
                                        }
                                        onChange={handleToggle(
                                            "advanced_enrollment"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>
                            <GridLayoutItem row={4} col={2}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .fingerprintSettings.scanTimeout
                                    }
                                >
                                    <Input
                                        type="number"
                                        value={deviceSettings.scan_timeout}
                                        onChange={handleNumericChange(
                                            "scan_timeout"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>

                            {/* 다섯 번째 행 - 지문 중복 검사 */}
                            <GridLayoutItem row={5} col={1}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .fingerprintSettings.duplicateCheck
                                    }
                                >
                                    <Switch
                                        checked={deviceSettings.check_duplicate}
                                        onChange={handleToggle(
                                            "check_duplicate"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>
                        </GridLayout>
                    </div>
                </Section>
            )}

            {faceSupported && (
                <Section>
                    <SectionTitle
                        title={
                            messages.deviceSetting.authSettings.faceSettings
                                .title
                        }
                    />
                    <div className="pl-2">
                        <GridLayout
                            gap={{ rows: 10, cols: 100 }}
                            cols={[{ width: "1fr" }, { width: "1fr" }]}
                        >
                            {/* 첫 번째 행 - 동작 모드, 등록 보정도 */}
                            <GridLayoutItem row={1} col={1}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .faceSettings.operationMode
                                    }
                                >
                                    <DropDownList
                                        data={convertToDropdownData(
                                            OperationMode
                                        )}
                                        textField="text"
                                        dataItemKey="value"
                                        value={convertToDropdownData(
                                            OperationMode
                                        ).find(
                                            (item) =>
                                                item.value ===
                                                deviceSettings.operation_mode
                                        )}
                                        onChange={handleDropdownChange(
                                            "operation_mode"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>
                            <GridLayoutItem row={1} col={2}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .faceSettings.registrationCorrection
                                    }
                                >
                                    <DropDownList
                                        data={convertToDropdownData(
                                            EnrollThreshold
                                        )}
                                        textField="text"
                                        dataItemKey="value"
                                        value={convertToDropdownData(
                                            EnrollThreshold
                                        ).find(
                                            (item) =>
                                                item.value ===
                                                deviceSettings.enroll_threshold
                                        )}
                                        onChange={handleDropdownChange(
                                            "enroll_threshold"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>

                            {/* 두 번째 행 - 보안 레벨, 센서 민감도 */}
                            <GridLayoutItem row={2} col={1}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .faceSettings.securityLevel
                                    }
                                >
                                    <DropDownList
                                        data={convertToDropdownData(
                                            SecurityLevel
                                        )}
                                        textField="text"
                                        dataItemKey="value"
                                        value={convertToDropdownData(
                                            SecurityLevel
                                        ).find(
                                            (item) =>
                                                item.value ===
                                                deviceSettings.security_level
                                        )}
                                        onChange={handleDropdownChange(
                                            "security_level"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>
                            <GridLayoutItem row={2} col={2}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .faceSettings.sensorSensitivity
                                    }
                                >
                                    <DropDownList
                                        data={convertToDropdownData(
                                            DetectSensitivity
                                        )}
                                        textField="text"
                                        dataItemKey="value"
                                        value={convertToDropdownData(
                                            DetectSensitivity
                                        ).find(
                                            (item) =>
                                                item.value ===
                                                deviceSettings.detect_sensitivity
                                        )}
                                        onChange={handleDropdownChange(
                                            "detect_sensitivity"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>

                            {/* 세 번째 행 - 빛 조건, 위조 판단 민감도 */}
                            <GridLayoutItem row={3} col={1}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .faceSettings.lightCondition
                                    }
                                >
                                    <DropDownList
                                        data={convertToDropdownData(
                                            LightCondition
                                        )}
                                        textField="text"
                                        dataItemKey="value"
                                        value={convertToDropdownData(
                                            LightCondition
                                        ).find(
                                            (item) =>
                                                item.value ===
                                                deviceSettings.light_condition
                                        )}
                                        onChange={handleDropdownChange(
                                            "light_condition"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>
                            <GridLayoutItem row={3} col={2}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .faceSettings
                                            .fakeDetectionSensitivity
                                    }
                                >
                                    <DropDownList
                                        data={convertToDropdownData(lfdLevel)}
                                        textField="text"
                                        dataItemKey="value"
                                        value={convertToDropdownData(
                                            lfdLevel
                                        ).find(
                                            (item) =>
                                                item.value ===
                                                deviceSettings.lfd_level
                                        )}
                                        onChange={handleDropdownChange(
                                            "lfd_level"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>

                            {/* 네 번째 행 - 빠른 등록, 검출 방향 */}
                            <GridLayoutItem row={4} col={1}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .faceSettings.quickEnrollment
                                    }
                                >
                                    <Switch
                                        checked={
                                            deviceSettings.quick_enrollment
                                        }
                                        onChange={handleToggle(
                                            "quick_enrollment"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>
                            <GridLayoutItem row={4} col={2}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .faceSettings.detectionDirection
                                    }
                                >
                                    <DropDownList
                                        data={convertToDropdownData(
                                            MaxRotation
                                        )}
                                        textField="text"
                                        dataItemKey="value"
                                        value={convertToDropdownData(
                                            MaxRotation
                                        ).find(
                                            (item) =>
                                                item.value ===
                                                deviceSettings.max_rotation
                                        )}
                                        onChange={handleDropdownChange(
                                            "max_rotation"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>

                            {/* 다섯 번째 행 - 중복 판단, 스캔 대기 시간 */}
                            <GridLayoutItem row={5} col={1}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .faceSettings.duplicateCheck
                                    }
                                >
                                    <Switch
                                        checked={deviceSettings.check_duplicate}
                                        onChange={handleToggle(
                                            "check_duplicate"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>
                            <GridLayoutItem row={5} col={2}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .faceSettings.scanTimeout
                                    }
                                >
                                    <Input
                                        type="number"
                                        value={deviceSettings.enroll_timeout}
                                        onChange={handleNumericChange(
                                            "enroll_timeout"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>
                        </GridLayout>
                    </div>
                </Section>
            )}

            {cardSupported && (
                <Section>
                    <SectionTitle
                        title={
                            messages.deviceSetting.authSettings.cardSettings
                                .title
                        }
                    />
                    <div className="pl-2">
                        <GridLayout
                            gap={{ rows: 10, cols: 100 }}
                            cols={[{ width: "1fr" }, { width: "1fr" }]}
                        >
                            {/* 첫 번째 행 - 카드 데이터 저장 */}
                            <GridLayoutItem row={1} col={1}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .cardSettings.cardDataSave
                                    }
                                >
                                    <DropDownList
                                        data={convertToDropdownData(ByteOrder)}
                                        textField="text"
                                        dataItemKey="value"
                                        value={convertToDropdownData(
                                            ByteOrder
                                        ).find(
                                            (item) =>
                                                item.value ===
                                                deviceSettings.byte_order
                                        )}
                                        onChange={handleDropdownChange(
                                            "byte_order"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>

                            {/* 두 번째 행 - 카드 데이터 유형 */}
                            <GridLayoutItem row={2} col={1}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .cardSettings.cardDataType
                                    }
                                >
                                    <DropDownList
                                        data={convertToDropdownData(
                                            CardDataType
                                        )}
                                        textField="text"
                                        dataItemKey="value"
                                        value={convertToDropdownData(
                                            CardDataType
                                        ).find(
                                            (item) =>
                                                item.value ===
                                                deviceSettings.data_type
                                        )}
                                        onChange={handleDropdownChange(
                                            "data_type"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>

                            {/* 세 번째 행 - Wiegand 카드 사용 */}
                            <GridLayoutItem row={3} col={1}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .cardSettings.wiegandCardUsage
                                    }
                                >
                                    <Switch
                                        checked={
                                            deviceSettings.use_wiegand_format
                                        }
                                        onChange={handleToggle(
                                            "use_wiegand_format"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>

                            {deviceSettings.use_wiegand_format === 1 && (
                                <GridLayoutItem row={3} col={2}>
                                    <FormField
                                        label={
                                            messages.deviceSetting.authSettings
                                                .cardSettings
                                                .wiegandFormatSetting
                                        }
                                    >
                                        <DropDownList
                                            data={wiegandFormatData}
                                            textField="text"
                                            dataItemKey="value"
                                            value={wiegandFormatData?.find(
                                                (item) =>
                                                    item.value ===
                                                    deviceSettings.format_id
                                            )}
                                            onChange={handleDropdownChange(
                                                "format_id"
                                            )}
                                            disabled={isDisabled}
                                        />
                                    </FormField>
                                </GridLayoutItem>
                            )}

                            {/* 네 번째 행 - 키패드 활성화 (토글로 변경) */}
                            <GridLayoutItem row={4} col={1}>
                                <FormField
                                    label={
                                        messages.deviceSetting.authSettings
                                            .cardSettings.keyPadActivation
                                    }
                                >
                                    <Switch
                                        checked={deviceSettings.cipher}
                                        onChange={handleToggle("cipher")}
                                        disabled={isDisabled}
                                    />
                                </FormField>
                            </GridLayoutItem>
                        </GridLayout>
                    </div>
                </Section>
            )}
        </div>
    );
};

export default AuthSettingsTab;
