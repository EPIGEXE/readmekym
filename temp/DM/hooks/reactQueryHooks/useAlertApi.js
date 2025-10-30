import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BACKEND_URL, handleApiResponse } from "./setting";
import { apiGet, apiPost, apiPut } from "v2/libs";

// 출입통제 전체 경보 이벤트 목록 조회
export const useAcsAlertList = () => {
    return useQuery({
        queryKey: ["acsAlertList"],
        queryFn: async () => {
            const response = await apiGet(`${BACKEND_URL}/dm-setup/acs-system-event`);
            return handleApiResponse(response);
        },
        structuralSharing: false, // 항상 새 참조 반환
        enabled: true,
    })
}

// DMS 문 경보 이벤트 생성
export const useCreateAlertList = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ newAlertList }) => {
            const response = await apiPost({
                url: `${BACKEND_URL}/dm-setup/acs-event`,
                body: newAlertList,
            });
            return handleApiResponse(response);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["alertList"] });
            queryClient.invalidateQueries({ queryKey: ["acsAlertList"] });
        }
    })
}

// DMS 문 경보 이벤트 수정
export const useUpdateAlertList = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ updatedAlertList}) => {
            const response = await apiPut({
                url: `${BACKEND_URL}/dm-setup/acs-event`,
                body: updatedAlertList,
            });
            return handleApiResponse(response);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["alertList"] });
            queryClient.invalidateQueries({ queryKey: ["acsAlertList"] });
        }
    })
}

// DMS 문 경보 이벤트 삭제
export const useDeleteAlertList = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ deletedAlertList}) => {
            const response = await apiPost({
                url: `${BACKEND_URL}/dm-setup/acs-event/delete`,
                body: deletedAlertList,
            });
            return handleApiResponse(response);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["alertList"] });
            queryClient.invalidateQueries({ queryKey: ["acsAlertList"] });
        }
    })
}

// DMS 문 경보 이벤트 표시 목록 조회
export const useAlertList = () => {
    return useQuery({
        queryKey: ["alertList"],
        queryFn: async () => {
            const response = await apiGet(`${BACKEND_URL}/dm-setup/acs-event/list`);
            return handleApiResponse(response);
        },
        structuralSharing: false, // 항상 새 참조 반환
        retry: (failureCount, error) => {
            // productCode가 null이고 3회 미만 재시도한 경우에만 재시도
            if (failureCount < 3) {
                return true;
            }
            return false;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000), // 지수 백오프 (1초, 2초, 4초)
        enabled: true
    });
};