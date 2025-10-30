import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BACKEND_URL, handleApiResponse } from "./setting";
import { apiDelete, apiGet, apiPost } from "v2/libs";
import useBioDeviceStore from "../../store/bioDeviceStore";

export const useAllDevices = () => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useQuery({
        queryKey: ['devices', 'all', 'bioDevice'],
        queryFn: async () => {
            const apiUrl = `${BACKEND_URL}/bio/device/all/list/${productCode}`;
            const responseData = await apiGet(apiUrl);

            return handleApiResponse(apiUrl, responseData);
        },
    });
};

// 장치 데이터 가져오기 훅
export const useDevices = () => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useQuery({
        queryKey: ['devices', 'bioDevice'],
        queryFn: async () => {

            const apiUrl = `${BACKEND_URL}/bio/device/list/${productCode}`;
            const responseData = await apiGet(apiUrl);

            return handleApiResponse(apiUrl, responseData);
        },
    });
};

// 등록되지 않은 장치 가져오기 훅
export const useUnregisteredDevices = () => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useQuery({
        queryKey: ['devices', 'unregistered', 'bioDevice'],
        queryFn: async () => {
            const apiUrl = `${BACKEND_URL}/bio/device/unregistered/list/${productCode}`;
            const responseData = await apiGet(apiUrl);

            return handleApiResponse(apiUrl, responseData);
        },
    });
};

// 장치 추가 훅
export const useAddDevices = () => {
    const queryClient = useQueryClient();
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useMutation({
        mutationFn: async (newDevices) => {
            const promises = newDevices.map(async (device) => {
                const apiUrl = `${BACKEND_URL}/bio/device/register/${productCode}`;

                const responseData = await apiPost({ url: apiUrl, body: device });

                return handleApiResponse(apiUrl, responseData);
            });

            return Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['devices', 'bioDevice'] });
        },
    });
};

// 장치 제거 훅
export const useRemoveDevices = () => {
    const queryClient = useQueryClient();
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useMutation({
        mutationFn: async (deviceIds) => {
            const promises = deviceIds.map(async (id) => {
                const apiUrl = `${BACKEND_URL}/bio/device/delete/${productCode}/${id}`;

                const responseData = await apiDelete(apiUrl);

                return handleApiResponse(apiUrl, responseData);
            });
            return Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['devices', 'bioDevice'] });
            queryClient.invalidateQueries({ queryKey: ['devices', 'unregistered', 'bioDevice'] });
            queryClient.invalidateQueries({ queryKey: ['devices', 'all', 'bioDevice'] });
        },
    });
};

// 장치 액션 훅 (설정, 동기화, 펌웨어 업데이트)
export const useDeviceActions = () => {
    const queryClient = useQueryClient();
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    // 장치 동기화 뮤테이션
    const syncMutation = useMutation({
        mutationFn: async (deviceId) => {
            const apiUrl = `${BACKEND_URL}/bio/device/user/info/sync/${productCode}/${deviceId}`;
            const responseData = await apiPost({ url: apiUrl });

            return handleApiResponse(apiUrl, responseData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['devices', 'bioDevice'] });
        },
    });

    // 펌웨어 업데이트 뮤테이션
    const firmwareMutation = useMutation({
        mutationFn: async ({deviceId, filename}) => {
            const apiUrl = `${BACKEND_URL}/bio/device/firmware/upgrade/${productCode}/${deviceId}`;
            const responseData = await apiPost({ url: apiUrl, body: { filename: filename } });

            return handleApiResponse(apiUrl, responseData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['devices', 'bioDevice'] });
        },
    });

    return {
        syncDevice: syncMutation.mutate,
        isSyncLoading: syncMutation.isPending,

        updateFirmware: firmwareMutation.mutate,
        isFirmwareLoading: firmwareMutation.isPending,
    };
};
