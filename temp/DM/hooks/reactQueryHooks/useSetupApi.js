import { apiDelete, apiGet, apiPost, apiPut } from "v2/libs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { BACKEND_URL, handleApiResponse } from "./setting";

// 영역 목록 조회
export const useAreaList = () => {
    return useQuery({
        queryKey: ["areaList"],
        queryFn: async () => {
            const response = await apiGet(`${BACKEND_URL}/dm-setup/area/list`);
            return handleApiResponse(response);
        },
    })
}

// 영역 생성
export const useAreaCreate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (area) => {
            const response = await apiPost({
                url: `${BACKEND_URL}/dm-setup/area`,
                body: area,
            });
            return handleApiResponse(response);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["areaList"] });
        },
    })
}

// 영역 수정
export const useAreaUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({areaCode, area}) => {
            const response = await apiPut({
                url: `${BACKEND_URL}/dm-setup/area/${areaCode}`,
                body: area,
            });
            return handleApiResponse(response);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["areaList"] });
        },
    })
}

// 영역 삭제
export const useAreaDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (areaCode) => {
            const response = await apiDelete(`${BACKEND_URL}/dm-setup/area/${areaCode}`);
            return handleApiResponse(response);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["areaList"] });
        },
    })
}

// 이벤트 유형 목록 조회
export const useEventTypeList = () => {
    return useQuery({
        queryKey: ["eventTypeList"],
        queryFn: async () => {
            const response = await apiGet(`${BACKEND_URL}/dm-setup/event-type/list`);
            return handleApiResponse(response);
        },
    })
}

// 이벤트 유형 생성
export const useEventTypeCreate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (eventType) => {
            const response = await apiPost({
                url: `${BACKEND_URL}/dm-setup/event-type`,
                body: eventType,
            });
            return handleApiResponse(response);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["eventTypeList"] });
        },
    })
}

// 이벤트 유형 수정
export const useEventTypeUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({eventTypeCode, eventType}) => {
            const response = await apiPut({
                url: `${BACKEND_URL}/dm-setup/event-type/${eventTypeCode}`,
                body: eventType,
            });
            return handleApiResponse(response);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["eventTypeList"] });
        },
    })
}

// 이벤트 유형 삭제
export const useEventTypeDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (eventTypeCode) => {
            const response = await apiDelete(`${BACKEND_URL}/dm-setup/event-type/${eventTypeCode}`);
            return handleApiResponse(response);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["eventTypeList"] });
        },
    })
}