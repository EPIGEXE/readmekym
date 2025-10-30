import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { BACKEND_URL, handleApiResponse } from "./setting";
import { apiDelete, apiGet, apiPost, apiPut } from "v2/libs";
import useBioDeviceStore from "../../store/bioDeviceStore";

// Wiegand 포맷 데이터 가져오기
export const useWiegandFormatList = () => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useQuery({
        queryKey: ['WiegandFormat', 'bioDevice'],
        queryFn: async () => {
            const apiUrl = `${BACKEND_URL}/bio/wiegand-format-list/${productCode}`;

            const responseData = await apiGet(apiUrl);

            return handleApiResponse(apiUrl, responseData);
        },
    });
}

// Wiegand 포맷 추가
export const useAddWiegandFormat = () => {
    const queryClient = useQueryClient();
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useMutation({
        mutationFn: async (newFormat) => {
            const apiUrl = `${BACKEND_URL}/bio/wiegand-format/${productCode}`;
            const responseData = await apiPost({ url: apiUrl, body: newFormat });

            return handleApiResponse(apiUrl, responseData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['WiegandFormat', 'bioDevice'] });
        }
    })
}

// Wiegand 포맷 업데이트
export const useUpdateWiegandFormat = () => {
    const queryClient = useQueryClient();
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useMutation({
        mutationFn: async (updatedFormat) => {
            const apiUrl = `${BACKEND_URL}/bio/wiegand-format/${productCode}/${updatedFormat.format_id}`;
            const responseData = await apiPut({ url: apiUrl, body: updatedFormat });

            return handleApiResponse(apiUrl, responseData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['WiegandFormat', 'bioDevice'] });
        }
    })
}

// Wiegand 포맷 제거
export const useRemoveWiegandFormat = () => {
    const queryClient = useQueryClient();
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useMutation({
        mutationFn: async (formatId) => {
            const promises = formatId.map(async (formatId) => {
                const apiUrl = `${BACKEND_URL}/bio/wiegand-format/${productCode}/${formatId}`;
                const responseData = await apiDelete(apiUrl);

                return handleApiResponse(apiUrl, responseData);
            });
            return Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['WiegandFormat', 'bioDevice'] });
        }
    })
}

