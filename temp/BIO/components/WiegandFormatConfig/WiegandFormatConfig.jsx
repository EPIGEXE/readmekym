import { useCallback, useEffect, useState } from 'react';
import { orderBy } from '@progress/kendo-data-query';
import WiegandFormatDialog from './WiegandFormatDialog/WiegandFormatDialog';
import WiegandFormatDeleteDialog from './WiegandFormatDeleteDialog';
import WiegandFormatGrid from './WiegandFormatGrid';
import { useRemoveWiegandFormat, useWiegandFormatList } from '../../hooks/reactQueryHooks/useWiegandFormatApi';
import { useGlobalConfigStore } from 'v2/libs';
import { getMessages } from '../../transMessages';
import BioDeviceSettingHeader from '../common/BioDeviceSettingHeader';

const WiegandFormatConfig = ({ onBack }) => {

    // ===========================================
    // Wiegand 포맷 훅
    // ===========================================
    const { data: wiegandFormatConfigData = [], isLoading } = useWiegandFormatList();

    const { mutateAsync: removeWiegandFormat, isPending: isRemoveWiegandFormatPending } = useRemoveWiegandFormat();

    // Wiegand 포맷 정렬 상태
    const [sort, setSort] = useState([]);
    const [sortedWiegandFormatConfigData, setSortedWiegandFormatConfigData] = useState([]);

    // Wiegand 포맷 설정 모달 상태
    const [dialogMode, setDialogMode] = useState('create');
    const [isWiegandFormatSettingOpen, setIsWiegandFormatSettingOpen] = useState(false);
    const [selectedWiegandFormat, setSelectedWiegandFormat] = useState(null);

    // Wiegand 포맷 제거 모달 상태
    const [isWiegandFormatDeleteOpen, setIsWiegandFormatDeleteOpen] = useState(false);
    const [selectedDeleteWiegandFormat, setSelectedDeleteWiegandFormat] = useState([]);

    const { globalConfig } = useGlobalConfigStore();
    const messages = getMessages(globalConfig?.languageId);


    
    // ===========================================
    // useEffect
    // ===========================================

    // 데이터가 로드되면 정렬
    useEffect(() => {
        if (wiegandFormatConfigData?.length > 0) {
            setSortedWiegandFormatConfigData([...wiegandFormatConfigData]);
        }
    }, [wiegandFormatConfigData]);


    // ===========================================
    // Grid 관련
    // ===========================================

    // 그리드 정렬 핸들러
    const handleGridSort = useCallback((event) => {
        setSort(event.sort);

        if (!event.sort.length) {
            const defaultSortedData = orderBy(wiegandFormatConfigData, [{ field: 'id', dir: 'asc' },]);
            setSortedWiegandFormatConfigData(defaultSortedData);
            return;
        }

        const sortedData = orderBy(wiegandFormatConfigData, event.sort);
        setSortedWiegandFormatConfigData(sortedData);
    }, [wiegandFormatConfigData]);

    // ===========================================
    // Wiegand 포맷 추가 모달 관련
    // ===========================================

    // Wiegand 포맷 추가 모달 열기
    const handleAddWiegandFormatOpen = useCallback(() => {
        setDialogMode('create');
        
        // sortedWiegandFormatConfigData에서 가장 높은 format_id 찾기
        const maxFormatId = sortedWiegandFormatConfigData.length > 0 
            ? Math.max(...sortedWiegandFormatConfigData.map(item => item.format_id || 0))
            : 0;
        
        // 새로운 format_id 생성 (가장 높은 값 + 1)
        const newFormatId = maxFormatId + 1;
        
        setSelectedWiegandFormat(
            {
                format_id: newFormatId,
                name: '',
                description: '',
                totalBits: 26,
                IdentityCodeField: false,
                Idfields: [],
                parityField: [],
            }
        );
        setIsWiegandFormatSettingOpen(true);
    }, [sortedWiegandFormatConfigData]);

    // ===========================================
    // 포맷 수정 모달 관련
    // ===========================================

    // 포맷 수정 모달 열기
    const handleEditWiegandFormatOpen = useCallback((formatData) => {
        setDialogMode('edit');
        setSelectedWiegandFormat(formatData);
        setIsWiegandFormatSettingOpen(true);
    }, []);

    // ===========================================
    // 포맷 제거 모달 관련
    // ===========================================

    // 포맷 제거 모달 열기
    const handleRemoveWiegandFormatOpen = useCallback(() => {
        setIsWiegandFormatDeleteOpen(true);
    }, []);

    // 포맷 제거 모달 닫기
    const handleWiegandFormatDeleteClose = () => {
        setIsWiegandFormatDeleteOpen(false);
        setSelectedDeleteWiegandFormat([]);
    };

    // 포맷 제거 모달 선택
    const handleWiegandFormatSelect = (event) => {
        const selectedIds = Object.keys(event.select).filter((key) => event.select[key]);
        const selectedItems = event.dataItems.filter((item) =>
            selectedIds.includes(String(item.id))
        );
        setSelectedDeleteWiegandFormat(selectedItems);
    };

    // 포맷 제거 모달 제거
    const handleWiegandFormatRemove = async () => {
        const removeIds = selectedDeleteWiegandFormat.map((item) => item.format_id);
        await removeWiegandFormat(removeIds);
        handleWiegandFormatDeleteClose();
    };

    return (
        <div className="p-5 flex flex-col gap-4 h-full">
            <BioDeviceSettingHeader onBack={onBack} title={messages.wiegandFormatConfig.title} />

            <WiegandFormatGrid
                isLoading={isLoading}
                sortedWiegandFormatConfigData={sortedWiegandFormatConfigData}
                sort={sort}
                handleGridSort={handleGridSort}
                handleAddWiegandFormatOpen={handleAddWiegandFormatOpen}
                handleRemoveWiegandFormatOpen={handleRemoveWiegandFormatOpen}
                handleEditWiegandFormatOpen={handleEditWiegandFormatOpen}
            />

            <WiegandFormatDialog
                isOpen={isWiegandFormatSettingOpen}
                mode={dialogMode}
                initialData={selectedWiegandFormat}
                onClose={() => {
                    setIsWiegandFormatSettingOpen(false);
                    setSelectedWiegandFormat(null);
                }}
            />

            <WiegandFormatDeleteDialog
                isOpen={isWiegandFormatDeleteOpen}
                onClose={handleWiegandFormatDeleteClose}
                wiegandFormatData={wiegandFormatConfigData}
                onWiegandFormatSelect={handleWiegandFormatSelect}
                onWiegandFormatRemove={handleWiegandFormatRemove}
                selectedWiegandFormat={selectedDeleteWiegandFormat}
                isPending={isRemoveWiegandFormatPending}
            />
        </div>
    );
};

export default WiegandFormatConfig;
