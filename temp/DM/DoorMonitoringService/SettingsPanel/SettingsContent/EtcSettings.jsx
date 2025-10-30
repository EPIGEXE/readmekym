import { Button } from "@progress/kendo-react-buttons";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Switch } from "@progress/kendo-react-inputs";
import { plusIcon } from "@progress/kendo-svg-icons";
import { useState, useEffect } from "react";
import {
    useAreaCreate,
    useAreaDelete,
    useAreaList,
    useAreaUpdate,
    useEventTypeCreate,
    useEventTypeDelete,
    useEventTypeList,
    useEventTypeUpdate,
} from "../../../hooks/reactQueryHooks/useSetupApi";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

/**
 * 기타 설정 컴포넌트
 *
 * 1. 지역 관리
 * 2. 그래픽 아이템 타입 관리
 */
const EtcSettings = ({ messages }) => {
    // ============================= 쿼리 훅 =============================
    // Get
    const { data: areaList = [] } = useAreaList(); // 지역 목록
    const { data: eventTypeList = [] } = useEventTypeList(); // 그래픽 아이템 타입 목록

    // Post
    const { mutate: createArea } = useAreaCreate(); // 지역 추가
    const { mutate: updateArea } = useAreaUpdate(); // 지역 수정
    const { mutate: deleteArea } = useAreaDelete(); // 지역 삭제
    const { mutate: createEventType } = useEventTypeCreate(); // 그래픽 아이템 타입 추가
    const { mutate: updateEventType } = useEventTypeUpdate(); // 그래픽 아이템 타입 수정
    const { mutate: deleteEventType } = useEventTypeDelete(); // 그래픽 아이템 타입 삭제

    // ============================= 상태 관리 =============================
    const [areas, setAreas] = useState([]); // 지역 목록
    const [editArea, setEditArea] = useState({}); // 지역 편집 상태

    const [eventTypes, setEventTypes] = useState([]); // 그래픽 아이템 타입 목록
    const [editEventType, setEditEventType] = useState({}); // 그래픽 아이템 타입 편집 상태

    // 삭제 다이얼로그 상태
    const [deleteDialog, setDeleteDialog] = useState({
        isOpen: false,
        itemName: "",
        itemType: "",
        onConfirm: null,
    });

    // ============================= useEffect =============================
    // 지역 목록 초기화
    useEffect(() => {
        setAreas(areaList || []);
    }, [areaList]);

    // 그래픽 아이템 타입 목록 초기화
    useEffect(() => {
        setEventTypes(eventTypeList || []);
    }, [eventTypeList]);

    // ============================= 지역 관리 핸들러 =============================
    // 지역 추가
    const handleAreaAdd = () => {
        // 이미 추가 중인 행이 있는지 확안
        const hasNewItem = areas.some((area) => area.isNew);
        if (hasNewItem) {
            return;
        }

        const newArea = {
            id: Date.now(),
            code: "",
            name: "",
            isNew: true,
        };
        setAreas([newArea, ...areas]);
        setEditArea({ [newArea.id]: true });
    };

    // 지역 수정
    const handleAreaEdit = (area) => {
        const hasNewItem = areas.some((area) => area.isNew);
        if (hasNewItem) {
            setAreas(areas.filter((item) => !item.isNew));
        }

        setEditArea({ [area.id]: true });
    };

    // 지역 저장
    const handleAreaSave = (area) => {
        if (area.isNew) {
            createArea({ name: area.name });
        } else {
            updateArea({ areaCode: area.code, area: { name: area.name } });
        }
        setEditArea((prev) => ({ ...prev, [area.id]: false }));
    };

    // 지역 취소
    const handleAreaCancel = (area) => {
        if (area.isNew) {
            setAreas(areas.filter((item) => item.id !== area.id));
        } else {
            const originalArea = areaList.find((item) => item.id === area.id);
            setAreas(areas.map((item) => (item.id === area.id ? originalArea : item)));
        }
        setEditArea((prev) => ({ ...prev, [area.id]: false }));
    };

    // 지역 삭제
    const handleAreaDelete = (area) => {
        setDeleteDialog({
            isOpen: true,
            itemName: area.name,
            itemType: messages.settingsPanel.etc.area || "지역",
            onConfirm: () => deleteArea(area.code),
        });
    };

    // 지역 변경
    const handleAreaItemChange = (event) => {
        const { dataItem, field, value } = event;
        const updatedAreas = areas.map((item) => (item.id === dataItem.id ? { ...item, [field]: value } : item));
        setAreas(updatedAreas);
    };

    // ============================= 그래픽 아이템 타입 관리 핸들러 =============================
    // 그래픽 아이템 타입 추가
    const handleEventTypeAdd = () => {
        const newEventType = {
            id: Date.now(),
            code: "",
            name: "",
            childable: 0,
            isNew: true,
        };
        setEventTypes([newEventType, ...eventTypes]);
        setEditEventType({ [newEventType.id]: true });
    };

    // 그래픽 아이템 타입 수정
    const handleEventTypeEdit = (eventType) => {
        const hasNewItem = eventTypes.some((eventType) => eventType.isNew);
        if (hasNewItem) {
            setEventTypes(eventTypes.filter((item) => !item.isNew));
        }

        setEditEventType({ [eventType.id]: true });
    };

    // 그래픽 아이템 타입 저장
    const handleEventTypeSave = (eventType) => {
        if (eventType.isNew) {
            createEventType({ name: eventType.name, childable: eventType.childable });
        } else {
            updateEventType({ eventTypeCode: eventType.code, eventType: { name: eventType.name, childable: eventType.childable } });
        }
        setEditEventType((prev) => ({ ...prev, [eventType.id]: false }));
    };

    // 그래픽 아이템 타입 취소
    const handleEventTypeCancel = (eventType) => {
        if (eventType.isNew) {
            setEventTypes(eventTypes.filter((item) => item.id !== eventType.id));
        } else {
            const originalEventType = eventTypeList.find((item) => item.id === eventType.id);
            setEventTypes(eventTypes.map((item) => (item.id === eventType.id ? originalEventType : item)));
        }
        setEditEventType((prev) => ({ ...prev, [eventType.id]: false }));
    };

    // 그래픽 아이템 타입 삭제
    const handleEventTypeDelete = (eventType) => {
        setDeleteDialog({
            isOpen: true,
            itemName: eventType.name,
            itemType: messages.settingsPanel.etc.graphicItemType || "그래픽 아이템 타입",
            onConfirm: () => deleteEventType(eventType.code),
        });
    };

    // 그래픽 아이템 타입 변경
    const handleEventTypeItemChange = (event) => {
        const { dataItem, field, value } = event;
        const updatedEventTypes = eventTypes.map((item) =>
            item.id === dataItem.id ? { ...item, [field]: value } : item
        );
        setEventTypes(updatedEventTypes);
    };

    // ============================= 렌더러 =============================
    // 지역 액션 셀
    const AreaActionCell = (props, messages) => {
        const isEditing = editArea[props.dataItem.id];

        return (
            <td className="text-center">
                <div className="flex gap-2 justify-start">
                    {isEditing ? (
                        <>
                            <Button
                                size="small"
                                look="primary"
                                themeColor="primary"
                                onClick={() => handleAreaSave(props.dataItem)}
                            >
                                {messages.settingsPanel.etc.save}
                            </Button>
                            <Button size="small" look="outline" onClick={() => handleAreaCancel(props.dataItem)}>
                                {messages.settingsPanel.etc.cancel}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button size="small" look="flat" onClick={() => handleAreaEdit(props.dataItem)}>
                                {messages.settingsPanel.etc.edit}
                            </Button>
                            <Button
                                size="small"
                                look="flat"
                                themeColor="error"
                                onClick={() => handleAreaDelete(props.dataItem)}
                            >
                                {messages.settingsPanel.etc.delete}
                            </Button>
                        </>
                    )}
                </div>
            </td>
        );
    };

    // 그래픽 아이템 타입 액션 셀
    const EventTypeActionCell = (props, messages) => {
        const isEditing = editEventType[props.dataItem.id];

        return (
            <td className="text-center">
                <div className="flex gap-2 justify-start">
                    {isEditing ? (
                        <>
                            <Button
                                size="small"
                                look="primary"
                                themeColor="primary"
                                onClick={() => handleEventTypeSave(props.dataItem)}
                            >
                                {messages.settingsPanel.etc.save}
                            </Button>
                            <Button size="small" look="outline" onClick={() => handleEventTypeCancel(props.dataItem)}>
                                {messages.settingsPanel.etc.cancel}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button size="small" look="flat" onClick={() => handleEventTypeEdit(props.dataItem)}>
                                {messages.settingsPanel.etc.edit}
                            </Button>
                            <Button
                                size="small"
                                look="flat"
                                themeColor="error"
                                onClick={() => handleEventTypeDelete(props.dataItem)}
                            >
                                {messages.settingsPanel.etc.delete}
                            </Button>
                        </>
                    )}
                </div>
            </td>
        );
    };

    // 그래픽 아이템 타입 자식 요소 셀
    const ChildableCell = (props, messages) => {
        const isEditing = editEventType[props.dataItem.id];

        if (isEditing) {
            return (
                <td className="text-center flex justify-center">
                    <Switch
                        checked={props.dataItem.childable === 1}
                        onChange={(e) => {
                            const event = {
                                dataItem: props.dataItem,
                                field: "childable",
                                value: e.value ? 1 : 0,
                            };
                            handleEventTypeItemChange(event);
                        }}
                    />
                </td>
            );
        }

        return (
            <td className="text-start">
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                        props.dataItem.childable === 1 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                >
                    {props.dataItem.childable === 1 ? messages.settingsPanel.etc.possible : messages.settingsPanel.etc.impossible}
                </span>
            </td>
        );
    };

    return (
        <div className="h-full flex flex-col setting-wrapper pt-4">
            {/* 좌우 배치 컨테이너 */}
            <div className="flex-1 flex gap-4 min-h-0 p-4">
                {/* 왼쪽: 지역 관리 섹션 */}
                <div className="flex-1 flex flex-col">
                    {/* 헤더 */}
                    <div className="bg-[var(--kendo-color-surface)] border border-[var(--kendo-color-border)] rounded-t px-4 py-3 flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[var(--kendo-color-primary)]"></div>
                            <h3 className="text-base font-semibold">{messages.settingsPanel.etc.areaManagement}</h3>
                        </div>
                        <Button size="small" look="primary" svgIcon={plusIcon} onClick={handleAreaAdd}>
                            {messages.settingsPanel.etc.add}
                        </Button>
                    </div>

                    {/* 그리드 컨테이너 */}
                    <div className="border-l border-r border-b border-[var(--kendo-color-border)] rounded-b flex-1 min-h-0">
                        <Grid
                            data={areas}
                            dataItemKey="id"
                            edit={editArea}
                            editable={true}
                            scrollable="scrollable"
                            onItemChange={handleAreaItemChange}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <GridColumn 
                                title={messages.settingsPanel.etc.areaCode} 
                                width="80px" 
                                editable={false}
                                cells={{
                                    data: ({ dataItem }) => {
                                        const index = areas.findIndex(area => area.id === dataItem.id);
                                        return (
                                            <td className="text-start">{index + 1}</td>
                                        );
                                    }
                                }}
                            />
                            <GridColumn field="name" title={messages.settingsPanel.etc.areaName} editable={true} />
                            <GridColumn width="150px" cells={{ data: (props) => AreaActionCell(props, messages) }} />
                        </Grid>
                    </div>
                </div>

                {/* 오른쪽: 그래픽 아이템 타입 관리 섹션 */}
                <div className="flex-1 flex flex-col">
                    {/* 헤더 */}
                    <div className="bg-[var(--kendo-color-surface)] border border-[var(--kendo-color-border)] rounded-t px-4 py-3 flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[var(--kendo-color-primary)]"></div>
                            <h3 className="text-base font-semibold">{messages.settingsPanel.etc.tabTitle.eventType}</h3>
                        </div>
                        <Button size="small" look="primary" svgIcon={plusIcon} onClick={handleEventTypeAdd}>
                            {messages.settingsPanel.etc.add}
                        </Button>
                    </div>

                    {/* 그리드 컨테이너 */}
                    <div className="border-l border-r border-b border-[var(--kendo-color-border)] rounded-b flex-1 min-h-0">
                        <Grid
                            data={eventTypes}
                            dataItemKey="id"
                            edit={editEventType}
                            editable={true}
                            onItemChange={handleEventTypeItemChange}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <GridColumn 
                                title={messages.settingsPanel.etc.typeCode} 
                                width="80px" 
                                editable={false}
                                cells={{
                                    data: ({ dataItem }) => {
                                        const index = eventTypes.findIndex(eventType => eventType.id === dataItem.id);
                                        return (
                                            <td className="text-start">{index + 1}</td>
                                        );
                                    }
                                }}
                            />
                            <GridColumn field="name" title={messages.settingsPanel.etc.typeName} editable={true} />
                            <GridColumn
                                field="childable"
                                title={messages.settingsPanel.etc.childable}
                                width="120px"
                                cells={{ data: (props) => ChildableCell(props, messages) }}
                            />
                            <GridColumn width="150px" cells={{ data: (props) => EventTypeActionCell(props, messages) }} />
                        </Grid>
                    </div>
                </div>
            </div>
            
            {/* 삭제 확인 다이얼로그 */}
            <DeleteConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
                onConfirm={deleteDialog.onConfirm}
                itemName={deleteDialog.itemName}
                messages={messages}
            />
        </div>
    );
};

export default EtcSettings;
