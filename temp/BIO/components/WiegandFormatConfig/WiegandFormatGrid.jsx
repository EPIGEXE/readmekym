import { useGlobalConfigStore } from 'v2/libs';
import { Button } from '@progress/kendo-react-buttons';
import { Grid, GridColumn, GridToolbar } from '@progress/kendo-react-grid';
import { gearIcon, plusCircleIcon, trashIcon } from '@progress/kendo-svg-icons';
import { memo } from 'react';
import { getMessages } from '../../transMessages';

const WiegandFormatGrid = memo(({
    isLoading,
    sortedWiegandFormatConfigData,
    sort,
    handleGridSort,
    handleAddWiegandFormatOpen,
    handleRemoveWiegandFormatOpen,
    handleEditWiegandFormatOpen,
}) => {

    const { globalConfig } = useGlobalConfigStore();
    const messages = getMessages(globalConfig?.languageId);

    // 설정 버튼 셀 렌더링
    const ActionButtons = (props) => {
        return (
            <td>
                <div className="flex gap-2">
                    <Button
                        look="flat"
                        size="small"
                        svgIcon={gearIcon}
                        title="설정"
                        onClick={() => handleEditWiegandFormatOpen(props.dataItem)}
                    >
                        {messages.wiegandFormatConfig.cellActionButtons.settings}
                    </Button>
                </div>
            </td>
        );
    };
    
    return (
        <Grid
            data={sortedWiegandFormatConfigData}
            style={{ height: '100%' }}
            sortable={true}
            sort={sort}
            onSortChange={handleGridSort}
            scrollable="scrollable"
            className="rounded-lg overflow-hidden"
            showLoader={isLoading}
        >
            <GridToolbar>
                <div className="flex justify-end w-full gap-2 p-2">
                    <Button
                        look="flat"
                        onClick={handleAddWiegandFormatOpen}
                        svgIcon={plusCircleIcon}
                        themeColor={'primary'}
                        size="medium"
                    >
                        {messages.wiegandFormatConfig.gridActionButtons.wiegandFormatAdd}
                    </Button>
                    <Button
                        look="flat"
                        onClick={handleRemoveWiegandFormatOpen}
                        svgIcon={trashIcon}
                        themeColor={'error'}
                        size="medium"
                    >
                        {messages.wiegandFormatConfig.gridActionButtons.wiegandFormatRemove}
                    </Button>
                </div>
            </GridToolbar>

            <GridColumn field="format_id" title={messages.wiegandFormatConfig.gridColumns.id} width="120px" />
            <GridColumn field="description" title={messages.wiegandFormatConfig.gridColumns.description} />
            <GridColumn field="format_length" title={messages.wiegandFormatConfig.gridColumns.formatLength} width="150px" />
            <GridColumn title={messages.wiegandFormatConfig.gridColumns.management} width="400px" cells={{data: (props) => ActionButtons(props)}} />
        </Grid>
    );
});

export default WiegandFormatGrid;
