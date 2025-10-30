import { Plus, Search, UserPlus, Users, X, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
    useBioDeviceOperatorListApi,
    useSearchAcsEmployeeListApi,
} from "../../hooks/reactQueryHooks/useOperatorApi";
import useBioDeviceStore from "../../store/bioDeviceStore";

const OperatorsSetting = ({
    selectedAcsEmployeeList,
    setSelectedAcsEmployeeList,
}) => {
    const [searchQuery, setSearchQuery] = useState("");

    const { data: bioDeviceOperatorList } = useBioDeviceOperatorListApi();

    const [acsEmployeeList, setAcsEmployeeList] = useState([]);

    const acsCode = useBioDeviceStore((state) => state.bioConfig.acsCode);

    const { mutate: searchAcsEmployeeList, isPending: isSearching } =
        useSearchAcsEmployeeListApi();

    useEffect(() => {
        setSelectedAcsEmployeeList(bioDeviceOperatorList || []);
    }, [bioDeviceOperatorList]);

    // 검색 핸들러
    const handleSearch = (e) => {
        if (e.key === "Enter") {
            // acsCode가 없으면 API 호출하지 않음
            if (!acsCode) {
                return;
            }

            searchAcsEmployeeList(
                { name: searchQuery },
                {
                    onSuccess: (data) => {
                        setAcsEmployeeList(data);
                    },
                }
            );
        }
    };

    const handleAddOperator = (user) => {
        setSelectedAcsEmployeeList([...selectedAcsEmployeeList, user]);
    };

    const handleRemoveOperator = (user) => {
        setSelectedAcsEmployeeList(
            selectedAcsEmployeeList.filter((op) => op.emp_id !== user.emp_id)
        );
    };

    return (
        <div className="mt-4">
            <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="grid md:grid-cols-4">
                    {/* 왼쪽 패널: 출입 통제 시스템 사용자 목록*/}
                    <div className="col-span-2 border-r border-gray-200">
                        <div className="p-4 bg-[var(--kendo-color-base-subtle)] border-b border-gray-200">
                            <div className="font-semibold flex items-center text-[var(--kendo-color-primary)]">
                                출입 통제 시스템 사용자 목록
                            </div>
                        </div>

                        {/* 검색창 */}
                        <div className="p-3 border-b border-gray-200">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--kendo-color-primary)]" />
                                <input
                                    type="text"
                                    className="
                                            w-full pl-9 pr-3 py-2 
                                            bg-[var(--kendo-color-surface)]
                                            text-sm outline-none
                                            border border-[var(--kendo-color-base-subtle)]
                                            text-[var(--kendo-color-text-secondary)]
                                            rounded-lg
                                            focus:border-[var(--kendo-color-primary)]
                                            transition-colors
                                        "
                                    placeholder="사용자 ID 검색 후 Enter"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    onKeyPress={handleSearch}
                                    disabled={!acsCode}
                                />
                            </div>
                        </div>

                        <div className="h-[1px] bg-[var(--kendo-color-base-subtle)]" />

                        <div className="divide-y divide-gray-100 h-[420px] overflow-y-auto">
                            <div className="grid grid-cols-1 gap-2 p-3 min-w-[500px]">
                                {!acsCode ? (
                                    // acsCode가 없을 때 메시지 표시
                                    <div className="flex flex-col items-center justify-center py-16 px-4">
                                        <div className="bg-orange-100 rounded-full p-4 mb-4">
                                            <AlertCircle className="h-12 w-12 text-orange-500" />
                                        </div>
                                        <p className="text-center font-medium text-gray-700">
                                            출입통제 시스템과 연결되지
                                            않았습니다
                                        </p>
                                        <p className="text-sm mt-2 text-center text-gray-500">
                                            출입통제 시스템을 연결한 후 사용자를
                                            검색할 수 있습니다.
                                        </p>
                                    </div>
                                ) : acsEmployeeList?.length > 0 ? (
                                    acsEmployeeList
                                        .filter(
                                            (user) =>
                                                !selectedAcsEmployeeList.some(
                                                    (op) =>
                                                        op.emp_id ===
                                                        user.emp_id
                                                )
                                        )
                                        .map((user, index) => (
                                            <div
                                                key={user.emp_id}
                                                onClick={() =>
                                                    handleAddOperator(user)
                                                }
                                                className={`flex h-[48px] items-center p-2 bg-[var(--kendo-color-surface)] rounded-lg hover:bg-[var(--kendo-color-base-subtle-hover)] transition-colors`}
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
                                            사용자가 없습니다.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 오른쪽 패널: 운영자 목록 */}
                    <div className="col-span-2">
                        <div className="p-4 bg-[var(--kendo-color-base-subtle)] border-b border-gray-200">
                            <div className="font-semibold flex items-center text-[var(--kendo-color-primary)]">
                                관리자 목록
                            </div>
                        </div>

                        {/* 검색창과 동일한 높이의 여백 추가 */}
                        <div className="p-3 border-b border-gray-200">
                            <div className="h-[38px] flex items-center text-sm text-[var(--kendo-color-text-secondary)]">
                                {acsCode && (
                                    <div>
                                        선택된 관리자{" "}
                                        {selectedAcsEmployeeList.length}명
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="h-[1px] bg-[var(--kendo-color-base-subtle)]" />

                        <div className="h-[420px] overflow-y-auto">
                            {!acsCode ? null : selectedAcsEmployeeList?.length >
                              0 ? (
                                <div className="divide-y divide-gray-100">
                                    <div className="grid grid-cols-1 gap-2 p-3 min-w-[500px]">
                                        {selectedAcsEmployeeList.map(
                                            (operator, index) => (
                                                <div
                                                    key={operator.emp_id}
                                                    className={`flex items-center p-2 bg-[var(--kendo-color-surface)] rounded-lg hover:bg-[var(--kendo-color-base-subtle-hover)] transition-colors gap-2`}
                                                >
                                                    <div className="flex items-center flex-1">
                                                        <div className="w-7 h-7 rounded-full bg-[var(--kendo-color-primary)] text-white flex items-center justify-center mr-3">
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-sm flex items-center">
                                                                {operator.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        onClick={() =>
                                                            handleRemoveOperator(
                                                                operator
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
                                        사용자를 선택해주세요.
                                    </p>
                                    <p className="text-sm mt-2 text-center">
                                        사용자를 선택하면 관리자 목록에
                                        추가됩니다.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperatorsSetting;
