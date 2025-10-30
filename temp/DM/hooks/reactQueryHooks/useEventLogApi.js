import { apiGet, apiPost } from "v2/libs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BACKEND_URL, handleApiResponse } from "./setting";

// 이벤트 지역 조회 조건 트리 목록 가져오기
export const useEvetLogAreaTreeList = () => {
    return useQuery({
        queryKey: ["eventLogAreaTreeList"],
        queryFn: async () => {
            const response = await apiGet(`${BACKEND_URL}/dm/event-log/area/tree`);
            return handleApiResponse(response);
        },
        enabled: true,
    });
};

// 이벤트 로그 조회
export const useEventLogList = () => {
    return useMutation({
        mutationFn: async ({ requestBody }) => {
            const response = await apiPost({
                url: `${BACKEND_URL}/dm/event-log/list`,
                body: requestBody,
            });
            return handleApiResponse(response);
        },
    });
};
