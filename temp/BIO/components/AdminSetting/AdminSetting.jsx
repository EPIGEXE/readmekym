import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { useTableData, useUpdateTableData } from "../../hooks/reactQueryHooks/useBioLinkDataApi";
import BioDeviceSettingHeader from "../common/BioDeviceSettingHeader";
import AdminSettingActionButtonGroup from "./AdminSettingActionButtonGroup";
import { bioLinkDatabaseColumns } from "../../utils/bioLinkDatabaseUtlilty";
import "../../style/AdminSetting.css";
import OperatorsSetting from "./OperatorsSetting";
import { useUpdateBioDeviceOperatorListApi } from "../../hooks/reactQueryHooks/useOperatorApi";
import { orderBy } from "@progress/kendo-data-query";

const AdminSetting = ({ onBack }) => {
    const [selected, setSelected] = useState(0);
    const [showTitle, setShowTitle] = useState(true);
    const [showManualSetting, setShowManualSetting] = useState(true);
    const [localData, setLocalData] = useState({});
    const [dirtyItems, setDirtyItems] = useState({});
    const [sort, setSort] = useState([]);
    const [edit, setEdit] = useState({});

    // 출입 통제 시스템 사용자 목록 OperatorsSetting에서 사용
    const [selectedAcsEmployeeList, setSelectedAcsEmployeeList] = useState([]);

    const { mutate: updateBioDeviceOperatorList } = useUpdateBioDeviceOperatorListApi();

    // 테이블 목록
    const tables = [
        "BS2AuthConfig",
        "BS2AuthConfigExt",
        "BS2CardConfig",
        "BS2FaceConfig",
        "BS2FaceConfigExt",
        "BS2FactoryConfig",
        "BS2FingerprintConfig",
        "BS2IpConfig",
        "BS2SystemConfig",
        "BS2WiegandConfig",
        "BS2Operators",
        "BioDevice",
    ];

    const apiKeys = {
        BS2AuthConfig: "auth-config",
        BS2AuthConfigExt: "auth-config-ext",
        BS2BlackList: "black-list",
        BS2CardConfig: "card-config",
        BS2FaceConfig: "face-config",
        BS2FaceConfigExt: "face-config-ext",
        BS2FactoryConfig: "factory-config",
        BS2FingerprintConfig: "fingerprint-config",
        BS2IpConfig: "ip-config",
        BS2SystemConfig: "system-config",
        BS2WiegandConfig: "wiegand-config",
        BioDevice: "bio-device",
    };

    const currentTableName = tables[selected];

    // ===========================================
    // 바이오링크테이블 React Query 훅
    // ===========================================
    const { data: tableData, isLoading } = useTableData(apiKeys[currentTableName]);

    const { mutateAsync: updateTableData, isPending: isUpdateTableDataPending } = useUpdateTableData();

    // 모든 아이템에 inEdit: true를 추가하여 편집 모드 활성화
    useEffect(() => {
        if (tableData) {
            const sortedData = orderBy(tableData, [{ field: "device_id", dir: "asc" }]);
            setLocalData((prevData) => ({
                ...prevData,
                [currentTableName]: sortedData.map((item) => ({
                    ...item,
                    inEdit: true,
                })),
            }));

            // 모든 행을 편집 모드로 설정
            const editState = {};
            sortedData.forEach((item) => {
                editState[item.device_id] = true;
            });
            setEdit(editState);
        }
    }, [tableData, currentTableName]);

    // 변경사항 저장 함수
    const handleSave = async (tableName) => {
        if (tableName === "BS2Operators") {
            const formattedOperatorList = selectedAcsEmployeeList.map((operator) => ({
                emp_id: operator.emp_id,
                level: 1, // level 1로 고정
            }));

            updateBioDeviceOperatorList({
                operatorList: formattedOperatorList,
            });

            return;
        }

        const dirtyTableItems = dirtyItems[tableName] || {};

        try {
            // inEdit 속성을 제거한 업데이트 데이터 준비
            const updatesWithoutInEdit = {};
            Object.keys(dirtyTableItems).forEach((key) => {
                const { inEdit, ...itemWithoutInEdit } = dirtyTableItems[key];
                updatesWithoutInEdit[key] = itemWithoutInEdit;
            });

            // 모든 업데이트를 한 번에 전송 (inEdit 속성 제외)
            await updateTableData({
                tableName: apiKeys[tableName],
                updates: updatesWithoutInEdit,
            });

            // 성공적으로 저장된 후 dirty 상태 초기화
            setDirtyItems((prev) => ({
                ...prev,
                [tableName]: {},
            }));
        } catch (error) {
            console.error(`${tableName} 업데이트 실패:`, error);
            // 에러 처리 로직 추가
        }
    };

    // 변경사항 취소 함수
    const handleCancel = (tableName) => {
        if (tableData) {
            setLocalData((prevData) => ({
                ...prevData,
                [tableName]: tableData.map((item) => ({
                    ...item,
                    inEdit: true,
                })),
            }));
        }
        setDirtyItems((prev) => ({
            ...prev,
            [tableName]: {},
        }));
    };

    // 탭 선택 핸들러 - useCallback으로 최적화
    const handleTabSelect = useCallback((e) => {
        setSelected(e.selected);
    }, []);

    // 그리드 관련 핸들러들
    const currentData = localData[currentTableName] || [];

    // 그리드 정렬 핸들러
    const handleGridSort = (event) => {
        setSort(event.sort);
    };

    // 디바운싱을 위한 ref
    const timeoutRef = useRef(null);

    // 아이템 변경 핸들러 - 디바운싱으로 포커스 유지
    const handleItemChange = useCallback(
        (event) => {
            const { value, field } = event;
            if (!field) return;

            // 이전 타이머 취소
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // dirty 상태는 즉시 업데이트 (화면 반영용)
            setDirtyItems((prev) => ({
                ...prev,
                [currentTableName]: {
                    ...(prev[currentTableName] || {}),
                    [event.dataItem.device_id]: { ...event.dataItem, [field]: value, inEdit: true },
                },
            }));

            // 실제 데이터 업데이트는 500ms 후에 (포커스 유지를 위해)
            timeoutRef.current = setTimeout(() => {
                setLocalData((prev) => {
                    const currentTableData = prev[currentTableName] || [];
                    const newData = currentTableData.map((item) =>
                        item.device_id === event.dataItem.device_id ? { ...item, [field]: value } : item
                    );
                    return {
                        ...prev,
                        [currentTableName]: newData,
                    };
                });
            }, 500);
        },
        [currentTableName]
    );

    // 정렬된 데이터 계산 - dirty 데이터 병합으로 타이핑한 값 즉시 표시
    const sortedData = useMemo(() => {
        const mergedData = currentData.map((item) => {
            const dirtyItem = dirtyItems[currentTableName]?.[item.device_id];
            return dirtyItem ? { ...item, ...dirtyItem } : item;
        });
        return sort.length ? orderBy(mergedData, sort) : mergedData;
    }, [currentData, sort, dirtyItems, currentTableName]);

    return (
        // 탭스트립 컨테이너 스타일 적용을 위해 admin-setting-wrapper 클래스 추가
        <div className="setting-wrapper p-5 flex flex-col gap-2 h-full">
            <BioDeviceSettingHeader onBack={onBack} title="관리자 설정" />

            {/* 고정 툴바 - 탭스트립 위에 배치 */}
            <div className="flex items-center h-14 px-3 border-b border-gray-200 mb-3">
                <AdminSettingActionButtonGroup
                    isLoading={isLoading}
                    isPending={isUpdateTableDataPending}
                    handleSave={() => handleSave(currentTableName)}
                    handleCancel={() => handleCancel(currentTableName)}
                    showTitle={showTitle}
                    setShowTitle={setShowTitle}
                    showManualSetting={showManualSetting}
                    setShowManualSetting={setShowManualSetting}
                    currentTableName={currentTableName}
                />
            </div>

            <TabStrip
                selected={selected}
                onSelect={handleTabSelect}
                className="flex-grow"
                style={{
                    "--tab-font-size": "0.8rem",
                    "--tab-padding": "0.25rem 0.5rem",
                }}
            >
                {tables.map((tableName, index) => (
                    <TabStripTab
                        key={tableName}
                        title={tableName}
                        disabled={isUpdateTableDataPending && index !== selected}
                        style={{
                            fontSize: "var(--tab-font-size)",
                            padding: "var(--tab-padding)",
                        }}
                    >
                        {index === selected &&
                            (tableName === "BS2Operators" ? (
                                <OperatorsSetting
                                    selectedAcsEmployeeList={selectedAcsEmployeeList}
                                    setSelectedAcsEmployeeList={setSelectedAcsEmployeeList}
                                />
                            ) : (
                                <div className="mt-4">
                                    <Grid
                                        key={currentTableName}
                                        data={sortedData}
                                        dataItemKey="device_id"
                                        edit={edit}
                                        editable={true}
                                        style={{ height: "100%", width: "100%" }}
                                        className="rounded-lg overflow-hidden"
                                        resizable={true}
                                        onItemChange={handleItemChange}
                                        rowHeight={36}
                                        showLoader={isLoading || isUpdateTableDataPending}
                                        scrollable="scrollable"
                                        sortable={true}
                                        sort={sort}
                                        onSortChange={handleGridSort}
                                    >
                                        {/* 변경사항 상태 표시 열 - 첫 번째 열 */}
                                        <GridColumn
                                            field="__dirty_status"
                                            title="변경사항"
                                            width="80px"
                                            sortable={false}
                                            editable={false}
                                            cells={{
                                                data: (props) => {
                                                    const isDirty =
                                                        dirtyItems[currentTableName]?.[props.dataItem.device_id];
                                                    return (
                                                        <td className="text-center">
                                                            {isDirty ? (
                                                                <div className="flex items-center justify-center">
                                                                    <div className="w-3 h-3 bg-[var(--kendo-color-primary)] rounded-full"></div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center justify-center">
                                                                    <div className="w-3 h-3 bg-[var(--kendo-color-base-subtle)] rounded-full"></div>
                                                                </div>
                                                            )}
                                                        </td>
                                                    );
                                                },
                                            }}
                                        />

                                        {Object.entries(bioLinkDatabaseColumns[tableName]).map(([field, config]) => (
                                            <GridColumn
                                                key={field}
                                                field={field}
                                                title={showTitle ? config.title || field : ""}
                                                width={config.width || "150px"}
                                                editable={config.editable ?? true}
                                                editor={!showManualSetting && config.cell ? "numeric" : config.editor}
                                                cells={
                                                    showManualSetting && config.cell ? { data: config.cell } : undefined
                                                }
                                            />
                                        ))}
                                    </Grid>
                                </div>
                            ))}
                    </TabStripTab>
                ))}
            </TabStrip>
        </div>
    );
};

export default AdminSetting;
