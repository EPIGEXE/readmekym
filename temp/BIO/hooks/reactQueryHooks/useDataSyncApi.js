import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL, handleApiResponse } from "./setting";
import { apiGet } from "v2/libs";
import useBioDeviceStore from "../../store/bioDeviceStore";

export const useDataProgress = (deviceId) => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useQuery({
        queryKey: ["dataProgress", "bioDevice"],
        queryFn: async () => {
            const apiUrl = `${BACKEND_URL}/bio/device/status/${productCode}/${deviceId}`;

            const responseData = await apiGet(apiUrl);
            return handleApiResponse(apiUrl, responseData);
        },
        enabled: !!deviceId,
    })
};

export const useDataProgressList = (deviceIds = []) => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useQuery({
        queryKey: ["dataProgressList", "bioDevice", deviceIds],
        queryFn: async () => {
            // 빈 배열이면 빈 객체 반환
            if (!deviceIds.length) return {};

            // 모든 장치의 상태를 병렬로 조회
            const promises = deviceIds.map(async (deviceId) => {
                try {
                    const apiUrl = `${BACKEND_URL}/bio/device/status/${productCode}/${deviceId}`;
                    const responseData = await apiGet(apiUrl);
                    return {
                        deviceId,
                        data: handleApiResponse(apiUrl, responseData)
                    };
                } catch (error) {
                    return {
                        deviceId,
                        data: null,
                        error: error.message
                    };
                }
            });

            const results = await Promise.all(promises);

            return results.reduce((acc, result) => {
                acc[result.deviceId] = result.data;
                return acc;
            }, {});

        },
        enabled: deviceIds.length > 0,
        refetchInterval: deviceIds.length > 0 ? 3000 : false, // syncDeviceList가 있을 때만 refetch
    })
}