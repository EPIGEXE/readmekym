import { Button } from "@progress/kendo-react-buttons";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Input } from "@progress/kendo-react-inputs";
import { Checkbox } from "@progress/kendo-react-inputs";
import { Dialog } from "@progress/kendo-react-dialogs";
import { useState, useCallback, useMemo, useRef, useEffect, memo } from "react";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeft, ChevronsRight, Edit2, Filter, TriangleAlert } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
    useAcsAlertList,
    useAlertList,
    useCreateAlertList,
    useDeleteAlertList,
    useUpdateAlertList,
} from "../../../hooks/reactQueryHooks/useAlertApi";
import { useUpdateDoorStructureBackend } from "../../../hooks/reactQueryHooks/useDoorListApi";

/**
 * 출입통제 이벤트 설정 컴포넌트
 *
 * 1. 출입통제 이벤트를 불러와서 DMS에서 사용할 이벤트 목록을 선택할 수 있도록 함
 * 2. DMS에서 사용할 이벤트에 지역정보를 넣을 수 있도록 함
 */
const EventSetting = ({ messages }) => {
    // 쿼리 클라이언트 - Door Monitoring 경보 생성, 삭제 시 리스트 acsAlertList, alertList를 재호출 하기 위함
    const queryClient = useQueryClient();

    // ============================= 유틸함수 =============================
    // 고유 키 생성 함수
    const createEventKey = useCallback((event) => {
        const product = event.product_code || "null";
        const panel = event.panel_id || "null";
        const dev = event.dev_id || "null";
        const secondDev = event.second_dev_id || "null";
        return `${product}_${panel}_${dev}_${secondDev}`;
    }, []);

    // ============================== 쿼리 훅 ==============================
    // Get
    const { data: acsAlertList = [] } = useAcsAlertList(); // 출입통제 전체 경보 이벤트 목록
    const { data: alertList = [] } = useAlertList(); // DMS 문 경보 이벤트 목록

    // Post
    const { mutateAsync: createAlertList } = useCreateAlertList(); // 출입통제 경보 이벤트 생성
    const { mutateAsync: deleteAlertList } = useDeleteAlertList(); // 출입통제 경보 이벤트 삭제
    const { mutateAsync: updateAlertList } = useUpdateAlertList(); // 출입통제 경보 이벤트 수정
    const { mutateAsync: updateDoorStructureBackend } = useUpdateDoorStructureBackend(); // 백엔드 문 구조 업데이트

    // ============================= 상태 관리 =============================
    const [searchValue, setSearchValue] = useState(""); // 출입통제 경보 검색 값
    const [selectedSearchValue, setSelectedSearchValue] = useState(""); // Door Monitoring 경보 검색 값
    const [selectedAvailable, setSelectedAvailable] = useState(new Set()); // 사용 가능한 이벤트 선택
    const [selectedEvents, setSelectedEvents] = useState([]); // 선택된 이벤트
    const [selectedInList, setSelectedInList] = useState(new Set()); // 선택된 이벤트 목록
    const initialAlertListRef = useRef([]); // 초기 alertList 저장용
    
    // 검색 필터 상태
    const [acsFilterColumns, setAcsFilterColumns] = useState([]); // ACS 테이블 필터 컬럼
    const [dmFilterColumns, setDmFilterColumns] = useState([]); // DM 테이블 필터 컬럼
    const [showAcsFilterDialog, setShowAcsFilterDialog] = useState(false); // ACS 필터 다이얼로그
    const [showDmFilterDialog, setShowDmFilterDialog] = useState(false); // DM 필터 다이얼로그
    
    // 정렬 상태
    const [acsSort, setAcsSort] = useState([]); // ACS 테이블 정렬
    const [dmSort, setDmSort] = useState([]); // DM 테이블 정렬

    // 다중 편집 다이얼로그 상태
    const [editDialogOpen, setEditDialogOpen] = useState(false); // 다중 편집 다이얼로그 열기/닫기
    const [editingItems, setEditingItems] = useState([]); // 편집 중인 이벤트 목록
    const [editForm, setEditForm] = useState({
        name: "",
        area1: "",
        area2: "",
        area3: "",
    });

    // ============================= useEffect =============================
    // alertList를 초기 선택된 이벤트로 설정
    useEffect(() => {
        if (alertList) {
            setSelectedEvents(alertList);
            initialAlertListRef.current = alertList; // 초기값 저장
        }
    }, [alertList]);

    // ============================= 개별 변수 =============================
    // ACS 테이블 컬럼 정의
    const acsColumns = [
        { field: "product_name", title: messages.settingsPanel.eventSetting.productName },
        { field: "panel_desc", title: messages.settingsPanel.eventSetting.panelDesc },
        { field: "dev_desc", title: messages.settingsPanel.eventSetting.devDesc },
        { field: "second_dev_desc", title: messages.settingsPanel.eventSetting.secondDevDesc },
    ];
    
    // DM 테이블 컬럼 정의
    const dmColumns = [
        { field: "code", title: messages.settingsPanel.eventSetting.code },
        { field: "product_name", title: messages.settingsPanel.eventSetting.productName },
        { field: "name", title: messages.settingsPanel.eventSetting.name },
        { field: "panel_desc", title: messages.settingsPanel.eventSetting.panelDesc },
        { field: "dev_desc", title: messages.settingsPanel.eventSetting.devDesc },
        { field: "area1", title: messages.settingsPanel.eventSetting.area1 },
        { field: "area2", title: messages.settingsPanel.eventSetting.area2 },
        { field: "area3", title: messages.settingsPanel.eventSetting.area3 },
    ];
    
    // 필터링된 사용 가능한 이벤트 (이미 선택된 항목 제외)
    const filteredAvailableEvents = useMemo(() => {
        // 선택된 이벤트의 고유 키 Set 생성
        const selectedKeys = new Set(selectedEvents.map((event) => createEventKey(event)));

        return acsAlertList?.filter((event) => {
            const eventKey = createEventKey(event);
            const notSelected = !selectedKeys.has(eventKey);

            // 검색 필터 적용
            let matchesSearch = false;
            const searchLower = searchValue.toLowerCase();
            
            if (!searchValue) {
                matchesSearch = true;
            } else if (acsFilterColumns.length > 0) {
                // 선택된 컬럼에서만 검색
                matchesSearch = acsFilterColumns.some(column => {
                    const value = event[column];
                    return value && value.toString().toLowerCase().includes(searchLower);
                });
            } else {
                // 모든 컬럼에서 검색 (기본값)
                matchesSearch = 
                    event.product_name?.toLowerCase().includes(searchLower) ||
                    event.panel_desc?.toLowerCase().includes(searchLower) ||
                    event.dev_desc?.toLowerCase().includes(searchLower) ||
                    event.second_dev_desc?.toLowerCase().includes(searchLower);
            }

            return matchesSearch && notSelected;
        });
    }, [searchValue, selectedEvents, acsAlertList, createEventKey, acsFilterColumns]);
    
    // 정렬된 ACS 이벤트
    const sortedAvailableEvents = useMemo(() => {
        if (!acsSort.length) return filteredAvailableEvents;
        
        return [...filteredAvailableEvents].sort((a, b) => {
            for (const sortItem of acsSort) {
                const { field, dir } = sortItem;
                const aValue = a[field] || "";
                const bValue = b[field] || "";
                
                const comparison = aValue.toString().localeCompare(bValue.toString());
                if (comparison !== 0) {
                    return dir === "asc" ? comparison : -comparison;
                }
            }
            return 0;
        });
    }, [filteredAvailableEvents, acsSort]);

    // 필터링된 Door Monitoring 경보
    const filteredSelectedEvents = useMemo(() => {
        if (!selectedSearchValue) {
            return selectedEvents;
        }

        const searchLower = selectedSearchValue.toLowerCase();
        return selectedEvents.filter((event) => {
            if (dmFilterColumns.length > 0) {
                // 선택된 컬럼에서만 검색
                return dmFilterColumns.some(column => {
                    const value = event[column];
                    return value && value.toString().toLowerCase().includes(searchLower);
                });
            } else {
                // 모든 컬럼에서 검색 (기본값)
                return (
                    event.name?.toLowerCase().includes(searchLower) ||
                    event.code?.toLowerCase().includes(searchLower) ||
                    event.product_name?.toLowerCase().includes(searchLower) ||
                    event.panel_desc?.toLowerCase().includes(searchLower) ||
                    event.dev_desc?.toLowerCase().includes(searchLower) ||
                    event.area1?.toLowerCase().includes(searchLower) ||
                    event.area2?.toLowerCase().includes(searchLower) ||
                    event.area3?.toLowerCase().includes(searchLower)
                );
            }
        });
    }, [selectedSearchValue, selectedEvents, dmFilterColumns]);
    
    // 정렬된 DM 이벤트
    const sortedSelectedEvents = useMemo(() => {
        if (!dmSort.length) return filteredSelectedEvents;
        
        return [...filteredSelectedEvents].sort((a, b) => {
            for (const sortItem of dmSort) {
                const { field, dir } = sortItem;
                const aValue = a[field] || "";
                const bValue = b[field] || "";
                
                const comparison = aValue.toString().localeCompare(bValue.toString());
                if (comparison !== 0) {
                    return dir === "asc" ? comparison : -comparison;
                }
            }
            return 0;
        });
    }, [filteredSelectedEvents, dmSort]);

    // ============================= 핸들러 =============================
    // 이동 핸들러
    const handleAddSelected = useCallback(() => {
        const eventsToAdd = acsAlertList.filter((event) => {
            const eventKey = createEventKey(event);
            return selectedAvailable.has(eventKey);
        });
        setSelectedEvents((prev) => {
            const maxId = Math.max(...prev.map((e) => e.id || 0), 0);
            return [
                ...prev,
                ...eventsToAdd.map((event, index) => {
                    // 기존 alertList에서 동일한 항목 찾기
                    const existingItem = initialAlertListRef.current.find(
                        (item) => createEventKey(item) === createEventKey(event)
                    );

                    if (existingItem) {
                        // 기존 항목이면 그대로 사용
                        return existingItem;
                    } else {
                        // 새 항목이면 새로 생성
                        return {
                            ...event,
                            id: maxId + index + 1,
                            code: `새 이벤트`,
                            name: `${event.panel_desc} - ${event.dev_desc}`,
                            area1: "",
                            area2: "",
                            area3: "",
                            product_code: event.product_code,
                            isNew: true, // 새로 추가된 항목 표시
                        };
                    }
                }),
            ];
        });
        setSelectedAvailable(new Set());
    }, [selectedAvailable, acsAlertList, createEventKey]);

    // 모두 추가 핸들러
    const handleAddAll = useCallback(() => {
        setSelectedEvents((prev) => {
            const maxId = Math.max(...prev.map((e) => e.id || 0), 0);
            let newIdCounter = 0;

            const eventsToAdd = filteredAvailableEvents.map((event) => {
                // 기존 alertList에서 동일한 항목 찾기
                const existingItem = initialAlertListRef.current.find(
                    (item) => createEventKey(item) === createEventKey(event)
                );

                if (existingItem) {
                    // 기존 항목이면 그대로 사용
                    return existingItem;
                } else {
                    // 새 항목이면 새로 생성
                    newIdCounter++;
                    return {
                        ...event,
                        id: maxId + newIdCounter,
                        code: `새 이벤트`,
                        name: `${event.panel_desc} ${event.dev_desc}`,
                        area1: "",
                        area2: "",
                        area3: "",
                        product_code: event.product_code,
                        isNew: true, // 새로 추가된 항목 표시
                    };
                }
            });
            return [...prev, ...eventsToAdd];
        });
        setSelectedAvailable(new Set());
    }, [filteredAvailableEvents, createEventKey]);

    // 선택 삭제 핸들러
    const handleRemoveSelected = useCallback(() => {
        setSelectedEvents((prev) =>
            prev.filter((event) => {
                const eventKey = createEventKey(event);
                return !selectedInList.has(eventKey);
            })
        );
        setSelectedInList(new Set());
    }, [selectedInList, createEventKey]);

    // 전체 삭제 핸들러
    const handleRemoveAll = useCallback(() => {
        setSelectedEvents([]);
        setSelectedInList(new Set());
    }, []);

    // 저장 핸들러
    const handleSave = useCallback(async () => {
        const initialKeys = new Set(initialAlertListRef.current.map((event) => createEventKey(event)));
        const currentKeys = new Set(selectedEvents.map((event) => createEventKey(event)));

        // 삭제할 항목 찾기 (초기에는 있었지만 현재는 없는 항목)
        const itemsToDelete = initialAlertListRef.current.filter((event) => {
            const key = createEventKey(event);
            return !currentKeys.has(key);
        });

        // 추가할 항목 찾기 (현재는 있지만 초기에는 없었던 항목)
        const itemsToAdd = selectedEvents.filter((event) => {
            const key = createEventKey(event);
            return !initialKeys.has(key);
        });

        const promises = [];

        // 삭제 처리
        if (itemsToDelete.length > 0) {
            const deleteData = itemsToDelete.map((item) => ({
                code: item.code,
                product_code: item.product_code,
            }));

            promises.push(deleteAlertList({ deletedAlertList: deleteData }));
        }

        // 추가 처리
        if (itemsToAdd.length > 0) {
            const createData = itemsToAdd.map((item) => ({
                dev_desc: item.dev_desc,
                dev_id: item.dev_id,
                name: item.name,
                panel_desc: item.panel_desc,
                panel_id: item.panel_id,
                product_code: item.product_code,
                second_dev_desc: item.second_dev_desc || null,
                second_dev_id: item.second_dev_id || null,
            }));

            promises.push(createAlertList({ newAlertList: createData }));
        }

        // 모든 작업 완료 후 캐시 무효화
        if (promises.length > 0) {
            try {
                await Promise.all(promises);

                // 캐시 무효화 후 새로운 alertList 가져오기
                await queryClient.invalidateQueries({ queryKey: ["alertList"] });
                await queryClient.invalidateQueries({ queryKey: ["acsAlertList"] });

                // 삭제 실패 확인: 삭제 요청한 항목이 여전히 존재하는지 확인
                if (itemsToDelete.length > 0) {
                    // 캐시가 무효화되어 새로 fetch된 데이터 가져오기
                    const updatedAlertList = queryClient.getQueryData(["alertList"]) || [];

                    // 새로 받아온 리스트에서 삭제 실패한 항목 찾기
                    const failedDeleteItems = itemsToDelete.filter((deletedItem) => {
                        const deletedKey = createEventKey(deletedItem);
                        return updatedAlertList.some((alert) => createEventKey(alert) === deletedKey);
                    });

                    // 삭제 실패한 항목이 있으면 경고창 표시
                    if (failedDeleteItems.length > 0) {
                        const failedNames = failedDeleteItems
                            .map((item) => item.name || item.code)
                            .join(", ");
                        alert(`연결된 문이 있어 삭제할 수 없습니다:\n${failedNames}`);
                    }
                }

                // 백엔드 문 구조 업데이트
                await updateDoorStructureBackend();
            } catch (error) {
                console.error("Error saving alert list:", error);
            }
        }
    }, [selectedEvents, createAlertList, deleteAlertList, createEventKey, queryClient, updateDoorStructureBackend]);

    // ============================= 편집 다이올로그 핸들러 =============================
    // 편집 다이얼로그 열기 핸들러
    const handleOpenEditDialog = useCallback(() => {
        if (selectedInList.size === 0) return;

        const selectedItems = selectedEvents.filter((event) => selectedInList.has(createEventKey(event)));

        setEditingItems(selectedItems);

        // 첫 번째 선택된 항목의 값으로 초기화
        const firstItem = selectedItems[0];
        setEditForm({
            name: firstItem?.name || "",
            area1: firstItem?.area1 || "",
            area2: firstItem?.area2 || "",
            area3: firstItem?.area3 || "",
        });

        setEditDialogOpen(true);
    }, [selectedInList, selectedEvents, createEventKey]);

    // 이름 직접 편집 핸들러
    const handleNameEdit = useCallback(
        (eventKey, newName) => {
            setSelectedEvents((prev) =>
                prev.map((event) => {
                    if (createEventKey(event) === eventKey) {
                        return { ...event, name: newName };
                    }
                    return event;
                })
            );
        },
        [createEventKey]
    );

    // 다중 편집 다이얼로그 닫기 핸들러
    const handleCloseEditDialog = useCallback(() => {
        setEditDialogOpen(false);
        setEditingItems([]);
        setEditForm({
            name: "",
            area1: "",
            area2: "",
            area3: "",
        });
    }, []);

    // 편집 저장 핸들러
    const handleSaveEdit = useCallback(async () => {
        if (editingItems.length === 0) return;

        const isSingleEdit = editingItems.length === 1;

        // 로컬 상태 업데이트
        setSelectedEvents((prev) =>
            prev.map((event) => {
                const isEditing = editingItems.some((item) => createEventKey(item) === createEventKey(event));
                if (isEditing) {
                    const updatedEvent = { ...event };

                    // 단일 편집시에만 이름 수정
                    if (isSingleEdit && editForm.name.trim()) {
                        updatedEvent.name = editForm.name.trim();
                    }

                    // 지역 정보는 항상 수정 (값이 있는 경우에만)
                    if (editForm.area1.trim()) updatedEvent.area1 = editForm.area1.trim();
                    if (editForm.area2.trim()) updatedEvent.area2 = editForm.area2.trim();
                    if (editForm.area3.trim()) updatedEvent.area3 = editForm.area3.trim();

                    return updatedEvent;
                }
                return event;
            })
        );

        // 기존 항목들에 대해 서버 업데이트
        const existingItems = editingItems.filter((item) => !item.isNew && item.code);
        if (existingItems.length > 0) {
            try {
                const updatedData = existingItems.map((item) => ({
                    area: item.area,
                    area1: editForm.area1.trim() || item.area1,
                    area2: editForm.area2.trim() || item.area2,
                    area3: editForm.area3.trim() || item.area3,
                    code: item.code,
                    name: isSingleEdit && editForm.name.trim() ? editForm.name.trim() : item.name,
                    product_code: item.product_code,
                }));

                await updateAlertList({ updatedAlertList: updatedData });
            } catch (error) {
                console.error("Error updating alert items:", error);
            }
        }

        handleCloseEditDialog();
        setSelectedInList(new Set()); // 선택 해제
    }, [editingItems, editForm, createEventKey, handleCloseEditDialog]);

    // 체크박스 헤더 컴포넌트
    const HeaderCheckbox = ({ selected, data, onSelectionChange }) => {
        const dataKeys = data.map((item) => createEventKey(item));
        const isAllSelected = data.length > 0 && dataKeys.every((key) => selected.has(key));
        const isPartiallySelected = dataKeys.some((key) => selected.has(key)) && !isAllSelected;

        return (
            <td className="text-center">
                <Checkbox
                    checked={isAllSelected}
                    indeterminate={isPartiallySelected}
                    onChange={() => {
                        if (isAllSelected || isPartiallySelected) {
                            onSelectionChange(new Set());
                        } else {
                            onSelectionChange(new Set(dataKeys));
                        }
                    }}
                />
            </td>
        );
    };

    const TextCell = memo((props) => {
        return <td style={{ fontSize: "12px" }}>{props.dataItem[props.field]}</td>;
    });

    // useCallback을 사용하여 셀 컴포넌트 안정화 (포커스 유지를 위함)
    const NameEditCell = useCallback(({ dataItem }) => {
        return (
            <td style={{ fontSize: "12px" }}>
                {dataItem.isNew ? (
                    <div className="flex items-center gap-1">
                        <Input
                            size="small"
                            value={dataItem.name || ""}
                            onChange={(e) => handleNameEdit(createEventKey(dataItem), e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            style={{ flex: 1 }}
                            placeholder={messages.settingsPanel.eventSetting.nameClounmPlaceholder}
                        />
                    </div>
                ) : (
                    <div className="px-2 py-1">{dataItem.name || "-"}</div>
                )}
            </td>
        );
    }, [handleNameEdit, createEventKey, messages.settingsPanel.eventSetting.nameClounmPlaceholder]);

    return (
        <div className="h-full bg-[var(--kendo-color-app-surface)] flex flex-col">
            {/* 헤더 */}
            <div className="flex items-center justify-end pt-4 px-4">
                {/* 경고 메시지 */}
                <div className="flex items-center gap-2 text-xs text-[var(--kendo-color-warning)] mr-2">
                    <TriangleAlert size={14} />
                    <span>{messages.settingsPanel.eventSetting.connectedDoorsWarning}</span>
                </div>
                
                <Button size="small" look="solid" themeColor="primary" onClick={handleSave}>
                    {messages.settingsPanel.eventSetting.save}
                </Button>
            </div>

            {/* 메인 컨텐츠 */}
            <div className="flex-1 p-4" style={{ display: "grid", gridTemplateColumns: "2fr auto 3fr", gap: "16px", minHeight: 0 }}>
                {/* 왼쪽: 출입통제 경보 */}
                <div className="flex flex-col gap-3 min-w-0">
                    {/* 제목과 검색창 */}
                    <div className="flex items-center justify-between">
                        <div className="font-medium text-[var(--kendo-color-on-surface)]">
                            {messages.settingsPanel.eventSetting.alert}
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                size="small"
                                placeholder={messages.settingsPanel.eventSetting.searchPlaceholder}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                style={{ width: "200px" }}
                            />
                            <Button
                                size="small"
                                look="flat"
                                onClick={() => setShowAcsFilterDialog(true)}
                                title="검색 필터 설정"
                            >
                                <Filter size={16} />
                                {acsFilterColumns.length > 0 && (
                                    <span className="ml-1 text-xs bg-[var(--kendo-color-primary)] text-white rounded-full px-1">
                                        {acsFilterColumns.length}
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* 사용 가능한 이벤트 그리드 */}
                    <div className="flex-1 border border-[var(--kendo-color-border)] rounded overflow-hidden">
                        <Grid
                            data={sortedAvailableEvents}
                            scrollable='scrollable'
                            style={{ height: "100%" }}
                            sortable={true}
                            sort={acsSort}
                            onSortChange={(e) => setAcsSort(e.sort)}
                            onRowClick={(e) => {
                                setSelectedAvailable((prev) => {
                                    const newSet = new Set(prev);
                                    const eventKey = createEventKey(e.dataItem);
                                    if (newSet.has(eventKey)) {
                                        newSet.delete(eventKey);
                                    } else {
                                        newSet.add(eventKey);
                                    }
                                    return newSet;
                                });
                            }}
                        >
                            <GridColumn
                                width="50px"
                                cells={{
                                    headerCell: (props) => (
                                        <HeaderCheckbox
                                            selected={selectedAvailable}
                                            data={filteredAvailableEvents}
                                            onSelectionChange={setSelectedAvailable}
                                        />
                                    ),
                                    data: ({ dataItem }) => (
                                        <td className="text-center">
                                            <Checkbox
                                                checked={selectedAvailable.has(createEventKey(dataItem))}
                                                onChange={() => {
                                                    setSelectedAvailable((prev) => {
                                                        const newSet = new Set(prev);
                                                        const eventKey = createEventKey(dataItem);
                                                        if (newSet.has(eventKey)) {
                                                            newSet.delete(eventKey);
                                                        } else {
                                                            newSet.add(eventKey);
                                                        }
                                                        return newSet;
                                                    });
                                                }}
                                            />
                                        </td>
                                    ),
                                }}
                            />
                            <GridColumn
                                field="product_name"
                                title={messages.settingsPanel.eventSetting.productName}
                                cells={{ data: TextCell }}
                            />
                            <GridColumn
                                field="panel_desc"
                                title={messages.settingsPanel.eventSetting.panelDesc}
                                cells={{ data: TextCell }}
                            />
                            <GridColumn
                                field="dev_desc"
                                title={messages.settingsPanel.eventSetting.devDesc}
                                cells={{ data: TextCell }}
                            />
                            <GridColumn
                                field="second_dev_desc"
                                title={messages.settingsPanel.eventSetting.secondDevDesc}
                                cells={{ data: TextCell }}
                            />
                        </Grid>
                    </div>
                </div>

                {/* 중앙: 이동 버튼 */}
                <div className="flex flex-col justify-center gap-2 flex-shrink-0">
                    <Button
                        size="small"
                        look="outline"
                        onClick={handleAddSelected}
                        disabled={selectedAvailable.size === 0}
                        title="선택 항목 추가"
                    >
                        <ChevronRightIcon />
                    </Button>
                    <Button
                        size="small"
                        look="outline"
                        onClick={handleAddAll}
                        disabled={filteredAvailableEvents?.length === 0}
                        title="전체 추가"
                    >
                        <ChevronsRight />
                    </Button>
                    <Button
                        size="small"
                        look="outline"
                        onClick={handleRemoveSelected}
                        disabled={selectedInList.size === 0}
                        title="선택 항목 제거"
                    >
                        <ChevronLeftIcon />
                    </Button>
                    <Button
                        size="small"
                        look="outline"
                        onClick={handleRemoveAll}
                        disabled={selectedEvents.length === 0}
                        title="전체 제거"
                    >
                        <ChevronsLeft />
                    </Button>
                </div>

                {/* 오른쪽: Door Monitoring 경보 */}
                <div className="flex flex-col gap-3 min-w-0" style={{ contain: "layout style", minWidth: 0 }}>
                    {/* 제목과 도구 */}
                    <div className="flex items-center justify-between">
                        <div className="font-medium text-[var(--kendo-color-on-surface)]">
                            {messages.settingsPanel.eventSetting.doorMonitoringAlert}
                            {selectedSearchValue && (
                                <span className="text-sm text-[var(--kendo-color-subtle)] ml-2">
                                    ({filteredSelectedEvents.length} {messages.settingsPanel.eventSetting.selectedCount}
                                    )
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {selectedInList.size > 0 && (
                                <span className="text-xs text-[var(--kendo-color-primary)] bg-[var(--kendo-color-primary-subtle)] px-2 py-1 rounded">
                                    {selectedInList.size} {messages.settingsPanel.eventSetting.selectedCount}
                                </span>
                            )}
                            <Button
                                size="small"
                                look="solid"
                                onClick={handleOpenEditDialog}
                                disabled={selectedInList.size === 0}
                            >
                                {messages.settingsPanel.eventSetting.edit}
                            </Button>
                            <Input
                                size="small"
                                placeholder={messages.settingsPanel.eventSetting.nameCodeSearch}
                                value={selectedSearchValue}
                                onChange={(e) => setSelectedSearchValue(e.target.value)}
                                style={{ width: "200px" }}
                            />
                            <Button
                                size="small"
                                look="flat"
                                onClick={() => setShowDmFilterDialog(true)}
                                title="검색 필터 설정"
                            >
                                <Filter size={16} />
                                {dmFilterColumns.length > 0 && (
                                    <span className="ml-1 text-xs bg-[var(--kendo-color-primary)] text-white rounded-full px-1">
                                        {dmFilterColumns.length}
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 border border-[var(--kendo-color-border)] rounded overflow-hidden">
                        <Grid
                            data={sortedSelectedEvents}
                            scrollable='scrollable'
                            style={{ 
                                height: "100%",
                                maxWidth: "100%"
                            }}
                            sortable={true}
                            sort={dmSort}
                            resizable={true}
                            onSortChange={(e) => setDmSort(e.sort)}
                            onRowClick={(e) => {
                                setSelectedInList((prev) => {
                                    const newSet = new Set(prev);
                                    const eventKey = createEventKey(e.dataItem);
                                    if (newSet.has(eventKey)) {
                                        newSet.delete(eventKey);
                                    } else {
                                        newSet.add(eventKey);
                                    }
                                    return newSet;
                                });
                            }}
                            onRowDoubleClick={(e) => {
                                // 더블클릭 시 해당 항목만 선택하고 편집 다이얼로그 열기
                                const eventKey = createEventKey(e.dataItem);
                                setSelectedInList(new Set([eventKey]));
                                setTimeout(() => {
                                    handleOpenEditDialog();
                                }, 10);
                            }}
                        >
                            <GridColumn
                                width="50px"
                                cells={{
                                    headerCell: (props) => (
                                        <HeaderCheckbox
                                            selected={selectedInList}
                                            data={filteredSelectedEvents}
                                            onSelectionChange={setSelectedInList}
                                        />
                                    ),
                                    data: ({ dataItem }) => (
                                        <td className="text-center">
                                            <Checkbox
                                                checked={selectedInList.has(createEventKey(dataItem))}
                                                onChange={() => {
                                                    setSelectedInList((prev) => {
                                                        const newSet = new Set(prev);
                                                        const eventKey = createEventKey(dataItem);
                                                        if (newSet.has(eventKey)) {
                                                            newSet.delete(eventKey);
                                                        } else {
                                                            newSet.add(eventKey);
                                                        }
                                                        return newSet;
                                                    });
                                                }}
                                            />
                                        </td>
                                    ),
                                }}
                            />
                            <GridColumn
                                field="code"
                                title={messages.settingsPanel.eventSetting.code}
                                cells={{ data: TextCell }}
                            />
                            <GridColumn
                                field="product_name"
                                title={messages.settingsPanel.eventSetting.productName}
                                cells={{ data: TextCell }}
                            />
                            <GridColumn
                                field="name"
                                title={messages.settingsPanel.eventSetting.name}
                                width="200px"
                                cells={{
                                    data: NameEditCell,
                                }}
                            />
                            <GridColumn
                                field="panel_desc"
                                title={messages.settingsPanel.eventSetting.panelDesc}
                                cells={{ data: TextCell }}
                            />
                            <GridColumn
                                field="dev_desc"
                                title={messages.settingsPanel.eventSetting.devDesc}
                                cells={{ data: TextCell }}
                            />
                            <GridColumn
                                field="area1"
                                title={messages.settingsPanel.eventSetting.area1}
                                cells={{ data: TextCell }}
                            />
                            <GridColumn
                                field="area2"
                                title={messages.settingsPanel.eventSetting.area2}
                                cells={{ data: TextCell }}
                            />
                            <GridColumn
                                field="area3"
                                title={messages.settingsPanel.eventSetting.area3}
                                cells={{ data: TextCell }}
                            />
                        </Grid>
                    </div>
                </div>
            </div>

            {/* 편집 다이얼로그 */}
            {editDialogOpen && (
                <Dialog
                    title={
                        <div className="flex items-center gap-2 py-1">
                            <span className="font-semibold">
                                {editingItems.length === 1
                                    ? messages.settingsPanel.eventSetting.editAlertEvent
                                    : `${messages.settingsPanel.eventSetting.editAreaInfo} (${editingItems.length} ${messages.settingsPanel.eventSetting.editCountInfo})`}
                            </span>
                        </div>
                    }
                    onClose={handleCloseEditDialog}
                    width={700}
                    height={550}
                >
                    <div className="flex flex-col h-full">
                        {/* 스크롤 가능한 콘텐츠 영역 */}
                        <div className="flex-1 overflow-y-auto p-5">
                            {/* 선택된 항목 정보 */}
                            <div className="mb-10">
                                <span className="block text-sm font-medium mb-3">
                                    {editingItems.length === 1
                                        ? messages.settingsPanel.eventSetting.editTarget
                                        : `${messages.settingsPanel.eventSetting.selectedItems} (${editingItems.length} ${messages.settingsPanel.eventSetting.editCountInfo})`}
                                </span>

                                {editingItems.length === 1 ? (
                                    <div className="px-4 py-3 border border-[var(--kendo-color-border)] rounded-lg bg-[var(--kendo-color-surface)]">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm text-[var(--kendo-color-primary)]">
                                                    {editingItems[0].code || "새 이벤트"}
                                                </span>
                                                <span className="font-semibold text-sm">
                                                    {editingItems[0].name || "-"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs">
                                            {editingItems[0].product_name && (
                                                <span>{editingItems[0].product_name}</span>
                                            )}
                                            <span className="mx-1 text-[var(--kendo-color-base)]">›</span>
                                            {editingItems[0].panel_desc && <span>{editingItems[0].panel_desc}</span>}
                                            {editingItems[0].dev_desc && (
                                                <>
                                                    <span className="mx-1 text-[var(--kendo-color-base)]">›</span>
                                                    <span className="text-[var(--kendo-color-primary)]">
                                                        {editingItems[0].dev_desc}
                                                        {editingItems[0].second_dev_desc &&
                                                            ` (${editingItems[0].second_dev_desc})`}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {editingItems.slice(0, 5).map((item, index) => (
                                            <div
                                                key={createEventKey(item)}
                                                className="px-3 py-2 border border-[var(--kendo-color-border)] rounded-lg bg-[var(--kendo-color-surface)]"
                                            >
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="font-medium text-[var(--kendo-color-primary)]">
                                                        {item.code || "새 이벤트"}
                                                    </span>
                                                    <span>{item.name || "-"}</span>
                                                    <div className="flex items-center gap-1 text-xs ml-auto">
                                                        <span>{item.product_name}</span>
                                                        <span className="mx-1 text-[var(--kendo-color-base)]">›</span>
                                                        <span>{item.panel_desc}</span>
                                                        <span className="mx-1 text-[var(--kendo-color-base)]">›</span>
                                                        <span className="text-[var(--kendo-color-primary)]">
                                                            {item.dev_desc}
                                                            {item.second_dev_desc && ` (${item.second_dev_desc})`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {editingItems.length > 5 && (
                                            <div className="text-center text-xs text-[var(--kendo-color-subtle)] py-1">
                                                +{editingItems.length - 5} {messages.settingsPanel.eventSetting.more}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* 편집 폼 */}
                            <div className="space-y-4">
                                {/* 단일 편집시에만 이름 필드 표시 */}
                                {editingItems.length === 1 && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2 text-[var(--kendo-color-on-surface)]">
                                            {messages.settingsPanel.eventSetting.name}
                                        </label>
                                        <Input
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            placeholder={messages.settingsPanel.eventSetting.namePlaceholder}
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                )}

                                {/* 지역 정보 */}
                                <div>
                                    <label className="block text-sm font-medium mb-3">
                                        {messages.settingsPanel.eventSetting.areaInfo}
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs mb-1.5">
                                                {messages.settingsPanel.eventSetting.area1}
                                            </label>
                                            <Input
                                                value={editForm.area1}
                                                onChange={(e) => setEditForm({ ...editForm, area1: e.target.value })}
                                                placeholder={messages.settingsPanel.eventSetting.area1}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs mb-1.5">
                                                {messages.settingsPanel.eventSetting.area2}
                                            </label>
                                            <Input
                                                value={editForm.area2}
                                                onChange={(e) => setEditForm({ ...editForm, area2: e.target.value })}
                                                placeholder={messages.settingsPanel.eventSetting.area2}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs mb-1.5">
                                                {messages.settingsPanel.eventSetting.area3}
                                            </label>
                                            <Input
                                                value={editForm.area3}
                                                onChange={(e) => setEditForm({ ...editForm, area3: e.target.value })}
                                                placeholder={messages.settingsPanel.eventSetting.area3}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 고정된 버튼 영역 */}
                        <div className="flex justify-end gap-3 p-5 border-t border-[var(--kendo-color-border)]">
                            <Button look="outline" onClick={handleCloseEditDialog}>
                                {messages.settingsPanel.eventSetting.cancel}
                            </Button>
                            <Button look="primary" themeColor="primary" onClick={handleSaveEdit}>
                                {messages.settingsPanel.eventSetting.save}
                            </Button>
                        </div>
                    </div>
                </Dialog>
            )}
            
            {/* ACS 필터 다이얼로그 */}
            {showAcsFilterDialog && (
                <Dialog
                    title="검색 필터 설정"
                    onClose={() => setShowAcsFilterDialog(false)}
                    width={400}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex-1 p-4">
                            <div className="mb-3 text-sm">
                                검색할 열을 선택하세요. 선택하지 않으면 모든 열에서 검색합니다.
                            </div>
                            <div className="space-y-2">
                                {acsColumns.map((column) => (
                                    <label key={column.field} className="flex items-center gap-2">
                                        <Checkbox
                                            checked={acsFilterColumns.includes(column.field)}
                                            onChange={(e) => {
                                                if (e.value) {
                                                    setAcsFilterColumns([...acsFilterColumns, column.field]);
                                                } else {
                                                    setAcsFilterColumns(acsFilterColumns.filter(f => f !== column.field));
                                                }
                                            }}
                                        />
                                        <span className="text-sm">{column.title}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 p-4 border-t">
                            <Button
                                look="outline"
                                onClick={() => {
                                    setAcsFilterColumns([]);
                                    setShowAcsFilterDialog(false);
                                }}
                            >
                                초기화
                            </Button>
                            <Button
                                themeColor="primary"
                                onClick={() => setShowAcsFilterDialog(false)}
                            >
                                확인
                            </Button>
                        </div>
                    </div>
                </Dialog>
            )}
            
            {/* DM 필터 다이얼로그 */}
            {showDmFilterDialog && (
                <Dialog
                    title="검색 필터 설정"
                    onClose={() => setShowDmFilterDialog(false)}
                    width={400}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex-1 p-4">
                            <div className="mb-3 text-sm">
                                검색할 열을 선택하세요. 선택하지 않으면 모든 열에서 검색합니다.
                            </div>
                            <div className="space-y-2">
                                {dmColumns.map((column) => (
                                    <label key={column.field} className="flex items-center gap-2">
                                        <Checkbox
                                            checked={dmFilterColumns.includes(column.field)}
                                            onChange={(e) => {
                                                if (e.value) {
                                                    setDmFilterColumns([...dmFilterColumns, column.field]);
                                                } else {
                                                    setDmFilterColumns(dmFilterColumns.filter(f => f !== column.field));
                                                }
                                            }}
                                        />
                                        <span className="text-sm">{column.title}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 p-4 border-t">
                            <Button
                                look="outline"
                                onClick={() => {
                                    setDmFilterColumns([]);
                                    setShowDmFilterDialog(false);
                                }}
                            >
                                초기화
                            </Button>
                            <Button
                                themeColor="primary"
                                onClick={() => setShowDmFilterDialog(false)}
                            >
                                확인
                            </Button>
                        </div>
                    </div>
                </Dialog>
            )}
        </div>
    );
};

export default EventSetting;
