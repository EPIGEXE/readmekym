import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BACKEND_URL, getProductCode, handleApiResponse } from "./setting";
import { apiDelete, apiGet } from "v2/libs";
import useBioDeviceStore from "../../store/bioDeviceStore";

export const useBlackListApi = ({ deviceId }) => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useQuery({
        queryKey: ['blackList', 'bioDevice'],
        queryFn: async () => {
            const apiUrl = `${BACKEND_URL}/bio/device/blacklist/list/${productCode}/${deviceId}`;
            const responseData = await apiGet(apiUrl);

            return handleApiResponse(apiUrl, responseData);
        },
    });
};

export const useDeleteBlackListApi = () => {
    const queryClient = useQueryClient();
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useMutation({
        mutationFn: async ({ deviceId }) => {
            const apiUrl = `${BACKEND_URL}/bio/device/blacklist/all/${productCode}/${deviceId}`;
            const responseData = await apiDelete(apiUrl);

            return handleApiResponse(apiUrl, responseData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blackList', 'bioDevice'] });
        },
    });
};

