import React from 'react';
import { ComboBox } from '@progress/kendo-react-dropdowns';
import { useReaderList } from '../../hooks/reactQueryHooks/useReaderApi';

// 리더 키 셀 렌더러
const linkedReaderKeyRenderer = (field) => (props) => {
    const { data: readerKeys = [] } = useReaderList();

    // 드롭다운 옵션 생성
    const options = readerKeys?.map(reader => ({
        text: reader.name || reader.reader_id.toString(),
        value: reader.reader_id.toString()
    }));

    return (
        <td>
            <ComboBox
                data={options}
                textField="text"
                dataItemKey="value"
                value={options?.find((item) => item.value === props.dataItem[field])}
                onChange={(e) => {
                    props.onChange({
                        dataItem: props.dataItem,
                        field: field,
                        value: e.target.value?.value || null,
                    });
                }}
                filterable={true}  // 검색 기능 활성화
                placeholder="리더 검색..."  // 검색 placeholder 추가
                style={{ width: '100%' }}
            />
        </td>
    );
};

export default linkedReaderKeyRenderer;