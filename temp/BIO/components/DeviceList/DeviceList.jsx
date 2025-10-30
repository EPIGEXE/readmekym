import { useCallback, useEffect, useState } from "react";
import {
    useAddDevices,
    useDeviceActions,
    useDevices,
    useRemoveDevices,
} from "../../hooks/reactQueryHooks/useDeviceApi";
import { orderBy } from "@progress/kendo-data-query";
import DeviceGrid from "./DeviceGrid";
import AddDeviceDialog from "./AddDeviceDialog";
import RemoveDeviceDialog from "./RemoveDeviceDialog";
import EventWindow from "./EventWindow";
import FirmwareUpdateDialog from "./FirmwareUpdateDialog";
import ConnectedDeviceManagementDialog from "./ConnectedDeviceManagementDialog";
import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../transMessages";

const DeviceList = ({
    onWiegandClick,
    onAdminSettingClick,
    onRealTimeEventClick,
}) => {
    // ========================== Hooks =================================
    const { globalConfig } = useGlobalConfigStore();
    const messages = getMessages(globalConfig?.languageId);

    // ===================== React Query Hooks ==========================
    const { data: bioDeviceData = [], isLoading } = useDevices(); // 장치 목록 조회
    const { mutateAsync: addDevicesMutation, isPending: isAddDevicesPending } =
        useAddDevices(); // 장치 추가
    const {
        mutateAsync: removeDevicesMutation,
        isPending: isRemoveDevicesPending,
    } = useRemoveDevices(); // 장치 제거

    // ========================== 장치 기능 훅 ==========================
    const { updateFirmware } = useDeviceActions(); // 펌웨어 업데이트

    // ========================== State ================================
    // 장치 목록 정렬 상태
    const [sort, setSort] = useState([]);
    const [sortedDevices, setSortedDevices] = useState([]);

    // 장치 추가 관련 상태
    const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
    const [selectedDevices, setSelectedDevices] = useState([]);

    // 장치 제거 관련 상태
    const [isRemoveDeviceOpen, setIsRemoveDeviceOpen] = useState(false);
    const [selectedRemoveDevices, setSelectedRemoveDevices] = useState({
        registeredDevices: [],
    });

    // 이벤트 로그 관련 상태
    const [isEventOpen, setIsEventOpen] = useState(false);
    const [selectedEventDevice, setSelectedEventDevice] = useState(null);

    // 펌웨어 업데이트 관련 상태
    const [isFirmwareUpdateOpen, setIsFirmwareUpdateOpen] = useState(false);
    const [selectedFirmwareDevice, setSelectedFirmwareDevice] = useState(null);

    // 연결된 장치 관리 관련 상태
    const [
        isConnectedDeviceManagementOpen,
        setIsConnectedDeviceManagementOpen,
    ] = useState(false);

    // ========================== useEffect ==============================
    // 데이터가 로드되면 SortedDevices로 변환
    useEffect(() => {
        if (bioDeviceData?.length > 0) {
            setSortedDevices([...bioDeviceData]);
        }
    }, [bioDeviceData]);

    useEffect(() => {
        if (isFirmwareUpdateOpen) {
            setIsEventOpen(false);
        }
    }, [isFirmwareUpdateOpen]);

    // ========================== Grid 관련 ==============================
    // 정렬 핸들러
    const handleGridSort = useCallback(
        (event) => {
            setSort(event.sort);

            // sort가 비어있으면 (정렬 해제 시) deviceId 기준 오름차순으로 정렬
            if (!event.sort.length) {
                const defaultSortedData = orderBy(bioDeviceData, [
                    { field: "device_Id", dir: "asc" },
                ]);
                setSortedDevices(defaultSortedData);
                return;
            }

            // 다른 정렬 요청 시
            const sortedData = orderBy(bioDeviceData, event.sort);
            setSortedDevices(sortedData);
        },
        [bioDeviceData]
    );

    // ========================== 장치 추가 관련 핸들러 ==========================
    const handleAddDeviceOpen = useCallback(() => {
        setIsAddDeviceOpen(true);
    }, []);

    const handleAddDeviceClose = useCallback(() => {
        setIsAddDeviceOpen(false);
        setSelectedDevices([]);
    }, []);

    const handleDeviceSelect = (event) => {
        // event.select에는 선택된 항목의 id가 key로 들어있음
        const selectedIds = Object.keys(event.select).filter(
            (key) => event.select[key]
        );
        // event.dataItems에서 선택된 항목들만 필터링
        const selectedItems = event.dataItems.filter((item) =>
            selectedIds.includes(String(item.device_id))
        );
        setSelectedDevices(selectedItems);
    };

    const handleDeviceAdd = async () => {
        try {
            // selectedDevice에는 이미 선택된 전체 데이터가 들어있으므로 바로 사용
            const newDevices = selectedDevices.map((device) => ({
                device_id: device.device_id,
                name: "새 장치",
            }));

            await addDevicesMutation(newDevices);
            handleAddDeviceClose();
        } catch (error) {
            console.error("장치 추가 중 오류 발생:", error);
            // 에러 처리 로직 추가 가능
        }
    };

    // ========================== 장치 제거 관련 핸들러 ==========================
    const handleRemoveDeviceOpen = useCallback(() => {
        setIsRemoveDeviceOpen(true);
    }, []);

    const handleRemoveDeviceClose = () => {
        setIsRemoveDeviceOpen(false);
        setSelectedRemoveDevices({
            unregisteredDevices: [],
            registeredDevices: [],
        });
    };

    const handleRemoveDeviceSelect = (event, type = "registered") => {
        // event.select에는 선택된 항목의 id가 key로 들어있음
        const selectedIds = Object.keys(event.select).filter(
            (key) => event.select[key]
        );

        // event.dataItems에서 선택된 항목들만 필터링
        const selectedItems = event.dataItems.filter((item) =>
            selectedIds.includes(String(item.device_id))
        );

        // 기존 선택된 항목 유지하면서 새로운 항목 추가
        setSelectedRemoveDevices((prev) => {
            if (type === "unregistered") {
                return {
                    ...prev,
                    unregisteredDevices: selectedItems,
                };
            } else {
                return {
                    ...prev,
                    registeredDevices: selectedItems,
                };
            }
        });
    };

    const handleDeviceRemove = async () => {
        // 등록된 장치 제거
        try {
            const removeRegisteredIds =
                selectedRemoveDevices.registeredDevices.map(
                    (device) => device.device_id
                );
            await removeDevicesMutation(removeRegisteredIds);
            handleRemoveDeviceClose();
        } catch (error) {
            console.error("장치 제거 중 오류 발생:", error);
            // 에러 처리 로직 추가 가능
        }
    };

    const handleConnectedDeviceManagementOpen = useCallback(() => {
        setIsConnectedDeviceManagementOpen(true);
    }, []);

    const handleConnectedDeviceManagementClose = useCallback(() => {
        setIsConnectedDeviceManagementOpen(false);
    }, []);

    // ========================== 장치 설정 기능 관련 핸들러 ==========================

    // 펌웨어 업데이트 버튼 클릭 시 펌웨어 업데이트 다이얼로그 열기
    const handleUpdateFirmware = useCallback(
        (deviceId) => {
            // 펌웨어 업데이트 다이얼로그 열기
            const device = bioDeviceData.find((d) => d.device_id === deviceId);
            if (device) {
                setSelectedFirmwareDevice(device);
                setIsFirmwareUpdateOpen(true);
            }
        },
        [bioDeviceData]
    );

    // 펌웨어 업데이트
    const performFirmwareUpdate = useCallback(
        (deviceId, firmwareFile) => {
            updateFirmware({deviceId, filename: firmwareFile});
        },
        [updateFirmware]
    );

    // 이벤트 클릭 시 이벤트 윈도우 열기
    const handleEventClick = useCallback((e) => {
        const dataItem = e.dataItem;
        if (dataItem) {
            setSelectedEventDevice(dataItem);
            setIsEventOpen(true);
        }
    }, []);

    return (
        <div className="p-5 flex flex-col gap-4 h-full">
            <div className="text-2xl font-bold">
                {messages.deviceList.mainTitle}
            </div>

            <DeviceGrid
                isLoading={isLoading}
                sortedDevices={sortedDevices}
                setSortedDevices={setSortedDevices}
                sort={sort}
                handleGridSort={handleGridSort}
                handleAddDeviceOpen={handleAddDeviceOpen}
                handleRemoveDeviceOpen={handleRemoveDeviceOpen}
                onRealTimeEventClick={onRealTimeEventClick}
                onWiegandClick={onWiegandClick}
                onAdminSettingClick={onAdminSettingClick}
                handleEventClick={handleEventClick}
                handleUpdateFirmware={handleUpdateFirmware}
                handleConnectedDeviceManagementOpen={
                    handleConnectedDeviceManagementOpen
                }
            />

            {isAddDeviceOpen && (
                <AddDeviceDialog
                    onClose={handleAddDeviceClose}
                    onDeviceSelect={handleDeviceSelect}
                    onDeviceAdd={handleDeviceAdd}
                    selectedDevices={selectedDevices}
                    isAddDevicesPending={isAddDevicesPending}
                />
            )}

            {isRemoveDeviceOpen && (
                <RemoveDeviceDialog
                    bioDeviceData={bioDeviceData}
                    onClose={handleRemoveDeviceClose}
                    onDeviceSelect={handleRemoveDeviceSelect}
                    onDeviceRemove={handleDeviceRemove}
                    selectedDevices={selectedRemoveDevices}
                    isRemoveDevicesPending={isRemoveDevicesPending}
                />
            )}

            {isEventOpen && (
                <EventWindow
                    key={selectedEventDevice?.deviceId || "no-device"}
                    isOpen={isEventOpen}
                    deviceData={selectedEventDevice}
                    onClose={() => {
                        setIsEventOpen(false);
                        setSelectedEventDevice(null);
                    }}
                />
            )}

            {isFirmwareUpdateOpen && (
                <FirmwareUpdateDialog
                    isOpen={isFirmwareUpdateOpen}
                    onClose={() => {
                        setIsFirmwareUpdateOpen(false);
                        setSelectedFirmwareDevice(null);
                    }}
                    deviceData={selectedFirmwareDevice}
                    onFirmwareUpdate={performFirmwareUpdate}
                />
            )}

            {isConnectedDeviceManagementOpen && (
                <ConnectedDeviceManagementDialog
                    onClose={handleConnectedDeviceManagementClose}
                />
            )}



        </div>
    );
};

export default DeviceList;
