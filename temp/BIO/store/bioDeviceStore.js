import { devtools } from "zustand/middleware";
import { create } from "zustand";

// 로컬 스토리지 키
const SYNC_DEVICE_LIST_KEY = 'AXISTATION_BIODIVICE_SYNC_DEVICE_LIST';

// 로컬 스토리지에서 syncDeviceList 불러오기
const loadSyncDeviceListFromStorage = () => {
    try {
        const stored = localStorage.getItem(SYNC_DEVICE_LIST_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('로컬 스토리지에서 syncDeviceList 불러오기 실패:', error);
        return [];
    }
};

// 로컬 스토리지에 syncDeviceList 저장
const saveSyncDeviceListToStorage = (syncDeviceList) => {
    try {
        localStorage.setItem(SYNC_DEVICE_LIST_KEY, JSON.stringify(syncDeviceList));
    } catch (error) {
        console.error('로컬 스토리지에 syncDeviceList 저장 실패:', error);
    }
};

const useBioDeviceStore = create(
    devtools((set, get) => ({

        bioConfig: {
            productCode: null,
            acsCode: null,
        },
        selectedSettingDevice: null,
        syncDeviceList: loadSyncDeviceListFromStorage(),

        // 데이터 업데이트
        actions: {
            setProductCode: (productCode) => set((state) => ({
                bioConfig: {
                    ...state.bioConfig,
                    productCode
                }
            })),
            setAcsCode: (acsCode) => set((state) => ({
                bioConfig: {
                    ...state.bioConfig,
                    acsCode
                }
            })),
            setSelectedSettingDevice: (device) => set({ selectedSettingDevice: device }),
            addSyncDevice: (deviceIdList) => {
                const { syncDeviceList } = get();
                // 중복 제거하여 새로운 장치만 추가
                const uniqueDeviceIds = deviceIdList.filter(id => !syncDeviceList.includes(id));
                const newSyncDeviceList = [...syncDeviceList, ...uniqueDeviceIds];
                
                set({ syncDeviceList: newSyncDeviceList });
                saveSyncDeviceListToStorage(newSyncDeviceList);
            },
            removeSyncDevice: (deviceIdList) => {
                const { syncDeviceList } = get();
                const newSyncDeviceList = syncDeviceList.filter(id => !deviceIdList.includes(id));
                
                set({ syncDeviceList: newSyncDeviceList });
                saveSyncDeviceListToStorage(newSyncDeviceList);
            }
        }
    }),
    {
        name: "bioDeviceStore",
    }
)
);

export default useBioDeviceStore;