import { useQuery } from "@tanstack/react-query";
import useBioDeviceStore from "../../store/bioDeviceStore"
import { BACKEND_URL, handleApiResponse } from "./setting";
import { apiGet } from "v2/libs";

export const useAllBioLogApi = () => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useQuery({
        queryKey: ['bioLog', 'bioDevice', 'all'],
        queryFn: async () => {
            const apiUrl = `${BACKEND_URL}/bio/device/event/log/100/${productCode}`;

            const responseData = await apiGet(apiUrl);
            return handleApiResponse(apiUrl, responseData);
        },
    })
}

export const useBioLogApi = ({ deviceId }) => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useQuery({
        queryKey: ['bioLog', 'bioDevice', deviceId],
        queryFn: async () => {
            const apiUrl = `${BACKEND_URL}/bio/device/event/log/30/${productCode}/${deviceId}`;

            const responseData = await apiGet(apiUrl);
            return handleApiResponse(apiUrl, responseData);
        },
        enabled: !!deviceId,
    })
}