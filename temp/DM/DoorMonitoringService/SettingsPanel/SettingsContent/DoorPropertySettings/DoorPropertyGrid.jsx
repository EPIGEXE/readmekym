import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Checkbox } from "@progress/kendo-react-inputs";
import { memo } from "react";

/**
 * 문 속성 그리드 컴포넌트
 * @param {Object} props - 그리드 컴포넌트 속성
 */
const DoorPropertyGrid = ({
    filteredDoorList,
    selectedFilteredDoors,
    selectedDoors,
    setSelectedDoors,
    handleSelectDoor,
    isDoorListLoading,
    messages,
    doorTypeList,
    areaApiList,
    alertList,
    skip,
    setSkip,
    take,
}) => {

    // 그리드 헤더 체크박스 컴포넌트
    const HeaderCheckbox = memo(({ props, filteredDoorList, selectedFilteredDoors, setSelectedDoors, selectedDoors }) => {
        const isAllSelected = filteredDoorList.length > 0 && selectedFilteredDoors.length === filteredDoorList.length;
        const isPartiallySelected = selectedFilteredDoors.length > 0 && selectedFilteredDoors.length < filteredDoorList.length;

        return (
            <td {...props.tdProps} style={props.style} className="text-center">
                <Checkbox
                    checked={isAllSelected}
                    indeterminate={isPartiallySelected ? true : undefined}
                    onChange={() => {
                        if (isAllSelected || isPartiallySelected) {
                            // 모든 선택 해제
                            setSelectedDoors(new Set());
                        } else {
                            // 모든 필터링된 항목 선택
                            const newSelectedDoors = new Set(selectedDoors);
                            filteredDoorList.forEach((door) => newSelectedDoors.add(door.code));
                            setSelectedDoors(newSelectedDoors);
                        }
                    }}
                />
            </td>
        );
    });

    // 체크 박스 셀
    const CheckboxCell = memo(({ dataItem }) => {
        return (
            <td className="text-center">
                <Checkbox
                    checked={selectedDoors.has(dataItem.code)}
                    onChange={() => handleSelectDoor(dataItem.code)}
                />
            </td>
        );
    });

    // 색상 셀
    const ColorCell = memo(({ dataItem, field, messages }) => {
        const currentValue = dataItem.coordinate?.[field];

        return (
            <td>
                <div className="flex items-center gap-2">
                    <div
                        className="w-6 h-6 rounded border border-[var(--kendo-color-border)]"
                        style={{ backgroundColor: currentValue || "#cccccc" }}
                    />
                    <span className="text-xs">{currentValue || messages.settingsPanel.doorProperty.global}</span>
                </div>
            </td>
        );
    });

    // 경보 이벤트 셀
    const AcsEventCell = memo(({ dataItem, messages }) => {
        const eventCodes = dataItem.event_code;
        if (!eventCodes) {
            return <td>{messages.settingsPanel.doorProperty.noEvent}</td>;
        }

        return (
            <td>
                <div className="flex flex-wrap gap-1">
                    {eventCodes && alertList?.find((alert) => alert.code === eventCodes) ? (
                        <span className="px-2 py-1 bg-[var(--kendo-color-primary-subtle)] text-[var(--kendo-color-primary)] text-xs rounded">
                            {eventCodes} ({alertList?.find((alert) => alert.code === eventCodes).name})
                        </span>
                    ) : (
                        <span className="text-gray-400">{messages.settingsPanel.doorProperty.noEvent}</span>
                    )}
                </div>
            </td>
        );
    });

    // 지역 셀
    const AreaCell = memo(({ dataItem, messages }) => {
        const areaCodes = dataItem.area_code_list;
        if (!areaCodes || areaCodes.length === 0) {
            return <td>{messages.settingsPanel.doorProperty.noEvent}</td>;
        }

        return (
            <td>
                <div className="flex flex-wrap gap-1">
                    {areaCodes.map((code, index) => {
                        const areaInfo = areaApiList?.find((area) => area.code === code);
                        return (
                            <span
                                key={index}
                                className="px-2 py-1 bg-[var(--kendo-color-primary-subtle)] text-[var(--kendo-color-primary)] text-xs rounded"
                            >
                                {areaInfo ? areaInfo.name : code}
                            </span>
                        );
                    })}
                </div>
            </td>
        );
    });

    // 경보 사운드 셀
    const AlarmSoundCell = memo(({ dataItem, messages }) => {
        const alarmSound = dataItem.coordinate?.alarmSound;
        return (
            <td>
                {alarmSound ? (
                    <span className="text-xs bg-[var(--kendo-color-warning-subtle)] px-2 py-1 rounded">
                        {alarmSound}
                    </span>
                ) : (
                    <span>{messages.settingsPanel.doorProperty.global}</span>
                )}
            </td>
        );
    });

    // 문 타입 셀
    const TypeCell = memo(({ dataItem, messages }) => {
        const doorType = doorTypeList?.find((type) => type.code === dataItem.type_code);
        return <td>{doorType ? doorType.name : dataItem.type_code || messages.settingsPanel.doorProperty.notSet}</td>;
    });


    return (
        <div className="border border-[var(--kendo-color-border)] rounded flex-1 overflow-hidden">
            <Grid
                data={filteredDoorList}
                dataItemKey="code"
                rowHeight={40}
                scrollable="virtual"
                skip={skip}
                take={take}
                total={filteredDoorList.length}
                onPageChange={(e) => setSkip(e.page.skip)}
                style={{ height: "100%" }}
                resizable={false}
                filterable={false}
                onRowClick={(e) => handleSelectDoor(e.dataItem.code)}
                showLoader={isDoorListLoading}
                className="cursor-pointer"
            >
                <GridColumn
                    width="50px"
                    cells={{
                        headerCell: (props) => (
                            <HeaderCheckbox
                                props={props}
                                filteredDoorList={filteredDoorList}
                                selectedFilteredDoors={selectedFilteredDoors}
                                setSelectedDoors={setSelectedDoors}
                                selectedDoors={selectedDoors}
                            />
                        ),
                        data: CheckboxCell,
                    }}
                    headerClassName="text-center"
                />
                <GridColumn field="name" title={messages.settingsPanel.doorProperty.doorName} />
                <GridColumn
                    field="type_code"
                    title={messages.settingsPanel.doorProperty.doorType}
                    width="140px"
                    cells={{ data: (props) => <TypeCell {...props} messages={messages} /> }}
                />
                <GridColumn
                    field="coordinate.fill"
                    title={messages.settingsPanel.doorProperty.defaultColor}
                    width="120px"
                    cells={{ data: (props) => <ColorCell {...props} field="fill" messages={messages} /> }}
                />
                <GridColumn
                    field="coordinate.alertFill"
                    title={messages.settingsPanel.doorProperty.alertColor}
                    width="120px"
                    cells={{ data: (props) => <ColorCell {...props} field="alertFill" messages={messages} /> }}
                />
                <GridColumn
                    field="coordinate.checkedFill"
                    title={messages.settingsPanel.doorProperty.checkedColor}
                    width="120px"
                    cells={{ data: (props) => <ColorCell {...props} field="checkedFill" messages={messages} /> }}
                />
                <GridColumn
                    field="coordinate.autoCheckedFill"
                    title={messages.settingsPanel.doorProperty.autoCheckedColor}
                    width="120px"
                    cells={{ data: (props) => <ColorCell {...props} field="autoCheckedFill" messages={messages} /> }}
                />
                <GridColumn
                    field="coordinate.alarmSound"
                    title={messages.settingsPanel.doorProperty.alarmSound}
                    width="120px"
                    cells={{ data: (props) => <AlarmSoundCell {...props} messages={messages} /> }}
                />
                <GridColumn
                    field="area_code_list"
                    title={messages.settingsPanel.doorProperty.area}
                    width="120px"
                    cells={{ data: (props) => <AreaCell {...props} messages={messages} /> }}
                />
                <GridColumn
                    field="event_code"
                    title={messages.settingsPanel.doorProperty.connectedAlarm}
                    width="150px"
                    cells={{ data: (props) => <AcsEventCell {...props} messages={messages} /> }}
                />
            </Grid>
        </div>
    );
};

export default DoorPropertyGrid;