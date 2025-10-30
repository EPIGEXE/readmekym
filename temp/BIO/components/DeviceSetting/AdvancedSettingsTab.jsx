/**
 * AdvancedSettingsTab 컴포넌트
 *
 * 장치 설정 다이얼로그의 고급 설정 탭을 구성하는 컴포넌트입니다.
 * 장치의 Wiegand 설정, 블랙리스트 카드 관리, 장치 운영자 관리 등
 * 고급 설정 옵션들을 제공합니다.
 *
 * 구성 섹션:
 * 1. Wiegand 설정 - Wiegand 프로토콜 관련 다양한 설정 옵션
 * 2. 블랙리스트 카드 설정 - 사용 제한 카드 관리
 * 3. 장치 운영자 설정 - 관리자 권한 설정
 */
import React, { useEffect, useState } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { Input, Switch } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { GridLayout, GridLayoutItem } from "@progress/kendo-react-layout";

import { saveIcon } from "@progress/kendo-svg-icons";
import { FormField, Section, SectionTitle } from "./DeviceSettingCommon";

import { Plus, UserPlus, Users, X } from "lucide-react";

import {
    useBioDeviceOperatorListApi,
    useSelectedDeviceOperatorListApi,
    useUpdateDeviceOperatorListApi,
} from "../../hooks/reactQueryHooks/useOperatorApi";
import {
    convertToDropdownData,
    Mode,
    UseWiegandUserId,
    WiegandBypassCode,
} from "../../utils/bioLinkDatabaseUtlilty";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";
import { useWiegandFormatList } from "../../hooks/reactQueryHooks/useWiegandFormatApi";
import {
    useBlackListApi,
    useDeleteBlackListApi,
} from "../../hooks/reactQueryHooks/useBlackListApi";

/**
 * AdvancedSettingsTab 컴포넌트
 * @param {Object} deviceSettings - 장치 설정 상태 객체
 * @param {Function} handleInputChange - 텍스트 입력 변경 처리 함수
 * @param {Function} handleDropdownChange - 드롭다운 선택 변경 처리 함수
 * @param {Function} handleSaveButtonClick - 저장 버튼 클릭 처리 함수
 * @param {Function} setDeviceSettings - 장치 설정 상태 업데이트 함수
 * @param {Function} getCurrentTabName - 현재 선택된 탭 이름 반환 함수
 * @param {Function} setIsDirty - 변경 여부 상태 업데이트 함수
 */

const defaultFormatSettings = {
    format_id: 0,
    format_length: 42,
    id_fields0:
        "000000000000000000000000000000000000000000000000000001FFFFFFFFFE",
    id_fields1:
        "0000000000000000000000000000000000000000000000000000000000000000",
    id_fields2:
        "0000000000000000000000000000000000000000000000000000000000000000",
    id_fields3:
        "0000000000000000000000000000000000000000000000000000000000000000",
    parity_fields0:
        "000000000000000000000000000000000000000000000000000001FFFFE00000",
    parity_fields1:
        "00000000000000000000000000000000000000000000000000000000001FFFFE",
    parity_fields2:
        "0000000000000000000000000000000000000000000000000000000000000000",
    parity_fields3:
        "0000000000000000000000000000000000000000000000000000000000000000",
    parity_type0: 2,
    parity_type1: 1,
    parity_type2: 0,
    parity_type3: 0,
    parity_pos0: 0,
    parity_pos1: 41,
    parity_pos2: 0,
    parity_pos3: 0,
};

const AdvancedSettingsTab = ({
    isPending,
    isDeviceOffline,
    deviceSettings,
    handleNumericChange,
    handleDropdownChange,
    handleSaveButtonClick,
    setDeviceSettings,
    getCurrentTabName,
    setIsDirty,
}) => {
    const { globalConfig } = useGlobalConfigStore();
    const messages = getMessages(globalConfig?.languageId);

    const [operatorList, setOperatorList] = useState([]);

    const { data: wiegandFormatList } = useWiegandFormatList();

    const wiegandFormatData = [
        { text: "기본값", value: 0 },
        ...(wiegandFormatList || []).map((item) => ({
            text: item.description,
            value: item.format_id,
        })),
    ];

    // 블랙리스트 데이터 훅
    const { data: blackListData, isLoading: isBlackListLoading } =
        useBlackListApi({
            deviceId: deviceSettings.device_id,
        });
    const { mutate: deleteBlackList, isPending: isDeleteBlackListPending } =
        useDeleteBlackListApi();

    // 장치 운영자 데이터 훅
    const {
        data: allDeviceOperatorList,
        isLoading: isAllDeviceOperatorListLoading,
    } = useBioDeviceOperatorListApi({
        deviceId: deviceSettings.device_id,
    });

    const {
        data: selectedDeviceOperatorList,
        isLoading: isSelectedDeviceOperatorListLoading,
    } = useSelectedDeviceOperatorListApi({
        deviceId: deviceSettings.device_id,
    });
    const {
        mutate: updateDeviceOperatorList,
        isPending: isUpdateDeviceOperatorListPending,
    } = useUpdateDeviceOperatorListApi();

    const isDisabled = isDeviceOffline || isPending;

    useEffect(() => {
        setOperatorList(selectedDeviceOperatorList || []);
    }, [selectedDeviceOperatorList, deviceSettings.device_id]);

    const handleSwitchChange = (fieldName) => (e) => {
        setDeviceSettings((prev) => ({
            ...prev,
            [fieldName]: e.target.value ? 1 : 0,
        }));
        setIsDirty((prev) => ({
            ...prev,
            [getCurrentTabName()]: true,
        }));
    };

    const handleWiegandFormatChange = (e) => {
        const selectedValue = e.value.value; // 0 또는 wiegandFormatList의 id
        
        let formatSettings;
        
        if (selectedValue === 0) {
            formatSettings = defaultFormatSettings;
        } else {
            // format_id로 찾기 (id가 아니라!)
            const selectedFormat = wiegandFormatList?.find(
                item => item.format_id === selectedValue
            );
            
            if (selectedFormat) {
                const { id, description, ...settings } = selectedFormat;
                formatSettings = settings;
            }
        }
        
        if (formatSettings) {
            setDeviceSettings(prev => ({
                ...prev,
                ...formatSettings,
                wiegand_csnindex: selectedValue,
            }));
            
            setIsDirty(prev => ({
                ...prev,
                [getCurrentTabName()]: true,
            }));
        }
    };

    const handleDeleteAllBlackList = () => {
        deleteBlackList({ deviceId: deviceSettings.device_id });
    };

    // 사용자 추가
    const handleAddOperator = (userId, name) => {
        setOperatorList((prev) => [
            ...prev,
            { emp_id: userId, name, level: 1 },
        ]);
    };

    // 권한 변경
    const handleChangeLevel = (userId, level) => {
        setOperatorList((prev) =>
            prev.map((op) => (op.emp_id === userId ? { ...op, level } : op))
        );
    };

    // 운영자 제거
    const handleRemoveOperator = (userId) => {
        setOperatorList((prev) => prev.filter((op) => op.emp_id !== userId));
    };

    // 저장
    const handleSave = () => {
        const formattedOperatorList = operatorList.map(
            ({ name, ...rest }) => rest
        );

        updateDeviceOperatorList({
            deviceId: deviceSettings.device_id,
            operatorList: formattedOperatorList,
        });
    };

    return (
        <div className="mx-[60px]">
            {/* 상단 버튼 영역 - 저장 버튼 */}
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
                        {messages.common.save}
                    </Button>
                </div>
            </div>

            <Section>
                <SectionTitle
                    title={
                        messages.deviceSetting.advancedSettings.wiegandSettings
                            .title
                    }
                />
                <div className="pl-2">
                    <GridLayout
                        gap={{ rows: 10, cols: 100 }}
                        cols={[{ width: "1fr" }, { width: "1fr" }]}
                    >
                        {/* 첫 번째 행 - 데이터 저장, Wiegand 출력 선택 */}
                        <GridLayoutItem row={1} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.advancedSettings
                                        .wiegandSettings.dataSave
                                }
                            >
                                <DropDownList
                                    data={convertToDropdownData(Mode)}
                                    textField="text"
                                    dataItemKey="value"
                                    value={convertToDropdownData(Mode).find(
                                        (item) =>
                                            item.value === deviceSettings.mode
                                    )}
                                    onChange={handleDropdownChange("mode")}
                                    disabled={isDisabled}
                                />
                            </FormField>
                        </GridLayoutItem>
                        <GridLayoutItem row={1} col={2}>
                            <FormField
                                label={
                                    messages.deviceSetting.advancedSettings
                                        .wiegandSettings.wiegandOutputSelection
                                }
                            >
                                <DropDownList
                                    data={convertToDropdownData(
                                        WiegandBypassCode
                                    )}
                                    textField="text"
                                    dataItemKey="value"
                                    value={convertToDropdownData(
                                        WiegandBypassCode
                                    ).find(
                                        (item) =>
                                            item.value ===
                                            deviceSettings.use_wiegand_bypass
                                    )}
                                    onChange={handleDropdownChange(
                                        "use_wiegand_bypass"
                                    )}
                                    disabled={isDisabled}
                                />
                            </FormField>
                        </GridLayoutItem>

                        <GridLayoutItem row={2} col={2}>
                            <FormField
                                label={
                                    messages.deviceSetting.advancedSettings
                                        .wiegandSettings.wiegandOutProcessing
                                }
                            >
                                <DropDownList
                                    data={convertToDropdownData(
                                        UseWiegandUserId
                                    )}
                                    textField="text"
                                    dataItemKey="value"
                                    value={convertToDropdownData(
                                        UseWiegandUserId
                                    ).find(
                                        (item) =>
                                            item.value ===
                                            deviceSettings.use_wiegand_user_id
                                    )}
                                    onChange={handleDropdownChange(
                                        "use_wiegand_user_id"
                                    )}
                                    disabled={isDisabled}
                                />
                            </FormField>
                        </GridLayoutItem>

                        <GridLayoutItem row={2} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.advancedSettings
                                        .wiegandSettings.wiegandFormatSetting
                                }
                            >
                                <DropDownList
                                    data={wiegandFormatData}
                                    textField="text"
                                    dataItemKey="value"
                                    value={
                                        wiegandFormatData.find(
                                            (item) =>
                                                item.value ===
                                                deviceSettings?.wiegand_csnindex
                                        ) || null
                                    }
                                    onChange={handleWiegandFormatChange}
                                    disabled={isDisabled}
                                />
                            </FormField>
                        </GridLayoutItem>

                        {/* 세 번째 행 - 실패 코드 사용 및 유형 설정 */}
                        <GridLayoutItem row={3} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.advancedSettings
                                        .wiegandSettings.failCodeUsage
                                }
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Switch
                                        checked={deviceSettings.use_fail_code}
                                        onChange={handleSwitchChange(
                                            "use_fail_code"
                                        )}
                                        disabled={isDisabled}
                                    />
                                </div>
                            </FormField>
                        </GridLayoutItem>

                        <GridLayoutItem row={4} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.advancedSettings
                                        .wiegandSettings.pulseWidth
                                }
                            >
                                <Input
                                    type="number"
                                    value={deviceSettings.out_pulse_width}
                                    onChange={handleNumericChange(
                                        "out_pulse_width"
                                    )}
                                    disabled={isDisabled}
                                />
                            </FormField>
                        </GridLayoutItem>

                        <GridLayoutItem row={5} col={1}>
                            <FormField
                                label={
                                    messages.deviceSetting.advancedSettings
                                        .wiegandSettings.pulseInterval
                                }
                            >
                                <Input
                                    type="number"
                                    value={deviceSettings.out_pulse_interval}
                                    onChange={handleNumericChange(
                                        "out_pulse_interval"
                                    )}
                                    disabled={isDisabled}
                                />
                            </FormField>
                        </GridLayoutItem>
                    </GridLayout>
                </div>
            </Section>

            <Section>
                <SectionTitle
                    title={
                        messages.deviceSetting.advancedSettings
                            .blackListCardSettings.title
                    }
                />
                <div className="pl-2 mt-4">
                    <div className="flex items-start mb-4">
                        <div className="w-full">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center">
                                    <span className="font-medium">
                                        {
                                            messages.deviceSetting
                                                .advancedSettings
                                                .blackListCardSettings
                                                .blackListCardList
                                        }
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        look="flat"
                                        themeColor="error"
                                        onClick={handleDeleteAllBlackList}
                                        className="text-sm"
                                        disabled={
                                            isDisabled ||
                                            isDeleteBlackListPending
                                        }
                                    >
                                        {
                                            messages.deviceSetting
                                                .advancedSettings
                                                .blackListCardSettings.deleteAll
                                        }
                                    </Button>
                                </div>
                            </div>

                            {/* 블랙리스트 카드 목록 컨테이너 */}
                            <div
                                className={`border border-gray-200 rounded-md overflow-hidden`}
                            >
                                {blackListData && blackListData.length > 0 ? (
                                    <div className="h-[300px] overflow-y-auto">
                                        <div className="grid grid-cols-1 gap-2 p-3">
                                            {blackListData.map(
                                                (card, index) => (
                                                    <div
                                                        key={card.card_id}
                                                        className={`flex items-center p-2 bg-[var(--kendo-color-surface)] rounded-lg transition-colors
                                                ${
                                                    isDeleteBlackListPending
                                                        ? "opacity-50"
                                                        : ""
                                                }`}
                                                    >
                                                        <div className="flex items-center flex-1">
                                                            <div className="w-7 h-7 rounded-full bg-[var(--kendo-color-error)] text-white flex items-center justify-center mr-3">
                                                                {index + 1}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="text-sm">
                                                                    {
                                                                        card.card_id
                                                                    }
                                                                </div>
                                                                <div className="text-xs text-[var(--kendo-color-error)]">
                                                                    {
                                                                        messages
                                                                            .deviceSetting
                                                                            .advancedSettings
                                                                            .blackListCardSettings
                                                                            .issueCount
                                                                    }
                                                                    :{" "}
                                                                    {
                                                                        card.issue_count
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-40 p-6 text-center">
                                        <div className="mb-2 w-12 h-12 rounded-full bg-[var(--kendo-color-base-subtle)] flex items-center justify-center">
                                            <span className="text-xl">!</span>
                                        </div>
                                        <p>
                                            {
                                                messages.deviceSetting
                                                    .advancedSettings
                                                    .blackListCardSettings
                                                    .noBlackListCard
                                            }
                                        </p>
                                        {isDisabled && (
                                            <p className="mt-1 text-xs text-[var(--kendo-color-error)]">
                                                {
                                                    messages.deviceSetting
                                                        .advancedSettings
                                                        .blackListCardSettings
                                                        .deviceOffline
                                                }
                                            </p>
                                        )}
                                        {isBlackListLoading && (
                                            <p className="mt-1 text-xs ">
                                                {
                                                    messages.deviceSetting
                                                        .advancedSettings
                                                        .blackListCardSettings
                                                        .loadingBlackList
                                                }
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            <Section>
                <SectionTitle
                    title={
                        messages.deviceSetting.advancedSettings
                            .deviceOperatorSettings.title
                    }
                />
                <div className="pl-2 mt-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                            <span className="font-medium">
                                {
                                    messages.deviceSetting.advancedSettings
                                        .deviceOperatorSettings
                                        .deviceOperatorSettings
                                }
                            </span>
                        </div>
                        <Button
                            look="outline"
                            svgIcon={saveIcon}
                            themeColor="primary"
                            disabled={
                                isDisabled || isUpdateDeviceOperatorListPending
                            }
                            onClick={handleSave}
                            className="shadow-sm transition-all hover:shadow"
                        >
                            {messages.common.save}
                        </Button>
                    </div>

                    <div className="border border-gray-200 rounded-md overflow-hidden">
                        <div className="grid md:grid-cols-5">
                            {/* 왼쪽 패널: 사용자 목록 (2/5) */}
                            <div className="col-span-2 border-r border-gray-200">
                                <div className="p-4 bg-[var(--kendo-color-base-subtle)] border-b border-gray-200">
                                    <div className="font-semibold flex items-center text-[var(--kendo-color-primary)]">
                                        {
                                            messages.deviceSetting
                                                .advancedSettings
                                                .deviceOperatorSettings.userList
                                        }
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100 h-[420px] overflow-y-auto">
                                    <div className="grid grid-cols-1 gap-2 p-3">
                                        {allDeviceOperatorList?.length > 0 ? (
                                            allDeviceOperatorList
                                                .filter(
                                                    (user) =>
                                                        !operatorList.some(
                                                            (op) =>
                                                                op.emp_id ===
                                                                user.emp_id
                                                        )
                                                )
                                                .map((user, index) => (
                                                    <div
                                                        key={user.emp_id}
                                                        onClick={() =>
                                                            isUpdateDeviceOperatorListPending ||
                                                            isDeviceOffline
                                                                ? null
                                                                : handleAddOperator(
                                                                      user.emp_id,
                                                                      user.name
                                                                  )
                                                        }
                                                        className={`flex h-[48px] items-center p-2 bg-[var(--kendo-color-surface)] rounded-lg hover:bg-[var(--kendo-color-base-subtle-hover)] transition-colors
                                                  ${
                                                      isUpdateDeviceOperatorListPending ||
                                                      isDeviceOffline
                                                          ? "opacity-50 cursor-not-allowed"
                                                          : "cursor-pointer"
                                                  }`}
                                                    >
                                                        <div className="flex items-center flex-1">
                                                            <div className="w-7 h-7 rounded-full bg-[var(--kendo-color-primary)] text-white flex items-center justify-center mr-3">
                                                                {index + 1}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="text-sm">
                                                                    {user.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Plus className="h-5 w-5 text-[var(--kendo-color-primary)]" />
                                                    </div>
                                                ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 px-4">
                                                <Users className="h-12 w-12 mb-4" />
                                                <p className="text-center">
                                                    {isAllDeviceOperatorListLoading
                                                        ? messages.deviceSetting
                                                              .advancedSettings
                                                              .deviceOperatorSettings
                                                              .loadingUser
                                                        : messages.deviceSetting
                                                              .advancedSettings
                                                              .deviceOperatorSettings
                                                              .noUser}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 오른쪽 패널: 운영자 목록 (3/5) */}
                            <div className="col-span-3">
                                <div className="p-4 bg-[var(--kendo-color-base-subtle)] border-b border-gray-200">
                                    <div className="font-semibold flex items-center text-[var(--kendo-color-primary)]">
                                        {
                                            messages.deviceSetting
                                                .advancedSettings
                                                .deviceOperatorSettings
                                                .deviceOperatorSettings
                                        }
                                    </div>
                                </div>

                                <div className="h-[420px] overflow-y-auto">
                                    {operatorList?.length > 0 ? (
                                        <div className="divide-y divide-gray-100">
                                            <div className="grid grid-cols-1 gap-2 p-3">
                                                {operatorList.map(
                                                    (operator, index) => (
                                                        <div
                                                            key={
                                                                operator.emp_id
                                                            }
                                                            className={`flex items-center p-2 bg-[var(--kendo-color-surface)] rounded-lg hover:bg-[var(--kendo-color-base-subtle-hover)] transition-colors gap-2
                                                            ${
                                                                isUpdateDeviceOperatorListPending ||
                                                                isDeviceOffline
                                                                    ? "opacity-50 cursor-not-allowed"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <div className="flex items-center flex-1">
                                                                <div className="w-7 h-7 rounded-full bg-[var(--kendo-color-primary)] text-white flex items-center justify-center mr-3">
                                                                    {index + 1}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-4 justify-between">
                                                                        <div className="text-sm min-w-[120px]">
                                                                            {
                                                                                operator.name
                                                                            }
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <button
                                                                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                                                                                    operator.level ===
                                                                                    1
                                                                                        ? "bg-orange-100 border border-orange-400 text-orange-800"
                                                                                        : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                                                                                }
                                                                                ${
                                                                                    isUpdateDeviceOperatorListPending ||
                                                                                    isDeviceOffline
                                                                                        ? "cursor-not-allowed"
                                                                                        : "cursor-pointer"
                                                                                }`}
                                                                                onClick={() =>
                                                                                    isUpdateDeviceOperatorListPending ||
                                                                                    isDeviceOffline
                                                                                        ? null
                                                                                        : handleChangeLevel(
                                                                                              operator.emp_id,
                                                                                              1
                                                                                          )
                                                                                }
                                                                            >
                                                                                {
                                                                                    messages
                                                                                        .deviceSetting
                                                                                        .advancedSettings
                                                                                        .deviceOperatorSettings
                                                                                        .admin
                                                                                }
                                                                            </button>
                                                                            <button
                                                                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                                                                                    operator.level ===
                                                                                    2
                                                                                        ? "bg-blue-100 text-blue-800 border border-blue-400"
                                                                                        : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                                                                                }
                                                                                ${
                                                                                    isUpdateDeviceOperatorListPending ||
                                                                                    isDeviceOffline
                                                                                        ? "cursor-not-allowed"
                                                                                        : "cursor-pointer"
                                                                                }`}
                                                                                onClick={() =>
                                                                                    isUpdateDeviceOperatorListPending ||
                                                                                    isDeviceOffline
                                                                                        ? null
                                                                                        : handleChangeLevel(
                                                                                              operator.emp_id,
                                                                                              2
                                                                                          )
                                                                                }
                                                                            >
                                                                                {
                                                                                    messages
                                                                                        .deviceSetting
                                                                                        .advancedSettings
                                                                                        .deviceOperatorSettings
                                                                                        .systemAdmin
                                                                                }
                                                                            </button>
                                                                            <button
                                                                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                                                                                    operator.level ===
                                                                                    3
                                                                                        ? "bg-lime-100 text-lime-800 border border-lime-400"
                                                                                        : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                                                                                }
                                                                            ${
                                                                                isUpdateDeviceOperatorListPending ||
                                                                                isDeviceOffline
                                                                                    ? "cursor-not-allowed"
                                                                                    : "cursor-pointer"
                                                                            }`}
                                                                                onClick={() =>
                                                                                    isUpdateDeviceOperatorListPending ||
                                                                                    isDeviceOffline
                                                                                        ? null
                                                                                        : handleChangeLevel(
                                                                                              operator.emp_id,
                                                                                              3
                                                                                          )
                                                                                }
                                                                            >
                                                                                {
                                                                                    messages
                                                                                        .deviceSetting
                                                                                        .advancedSettings
                                                                                        .deviceOperatorSettings
                                                                                        .userManagement
                                                                                }
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                onClick={() =>
                                                                    handleRemoveOperator(
                                                                        operator.emp_id
                                                                    )
                                                                }
                                                                className="hover:text-[var(--kendo-color-error)] transition-colors p-1 cursor-pointer"
                                                            >
                                                                <X className="h-5 w-5" />
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 px-4">
                                            <div className="bg-[var(--kendo-color-base-subtle)] rounded-full p-4 mb-4">
                                                <UserPlus className="h-12 w-12 text-[var(--kendo-color-primary)]" />
                                            </div>
                                            <p className="text-center font-medium">
                                                {
                                                    messages.deviceSetting
                                                        .advancedSettings
                                                        .deviceOperatorSettings
                                                        .selectUserMessage
                                                }
                                            </p>
                                            <p className="text-sm mt-2 text-center">
                                                {
                                                    messages.deviceSetting
                                                        .advancedSettings
                                                        .deviceOperatorSettings
                                                        .selectedUserMessage
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default AdvancedSettingsTab;
