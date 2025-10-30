import { Button } from "@progress/kendo-react-buttons";
import { Input } from "@progress/kendo-react-inputs";
import { Filter } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import useDebounce from "../../../../hooks/useDebounce";

/**
 * 검색 Input 컴포넌트 (디바운스 처리된 검색 입력과 필터 버튼)
 * @param {Object} props - 검색 Input 컴포넌트 속성
 * @param {Function} onDebouncedSearchChange - 디바운스된 검색값 변경 핸들러
 * @param {Function} onFilterDialogOpen - 필터 다이얼로그 열기 핸들러
 * @param {Array} filterColumns - 필터 컬럼 목록
 * @param {number} filteredCount - 필터링된 결과 개수
 * @param {Object} messages - 메시지 객체
 */
const SearchInput = ({ onDebouncedSearchChange, onFilterDialogOpen, filterColumns, filteredCount, messages }) => {
    const [searchValue, setSearchValue] = useState("");
    const debouncedSearchValue = useDebounce(searchValue, 300);

    // 디바운스된 값이 변경될 때 부모에게 알림
    useEffect(() => {
        onDebouncedSearchChange(debouncedSearchValue);
    }, [debouncedSearchValue, onDebouncedSearchChange]);

    const handleSearchChange = useCallback((e) => {
        setSearchValue(e.target.value);
    }, []);

    return (
        <div className="flex items-center gap-2">
            <Input
                size="small"
                placeholder={messages.settingsPanel.doorProperty.searchPlaceholder}
                value={searchValue}
                onChange={handleSearchChange}
                style={{ width: "300px" }}
            />
            <Button size="small" look="flat" onClick={onFilterDialogOpen} title="검색 필터 설정">
                <Filter size={16} />
                {filterColumns.length > 0 && (
                    <span className="ml-1 text-xs bg-[var(--kendo-color-primary)] text-white rounded-full px-1">
                        {filterColumns.length}
                    </span>
                )}
            </Button>
            <span className="text-xs">
                {filteredCount} {messages.settingsPanel.doorProperty.resultCount}
            </span>
        </div>
    );
};

export default SearchInput;