import { apiGet } from "v2/libs";
import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL, handleApiResponse } from "./setting";

// 문 타입 목록 조회
export const useDoorTypeList = () => {
    return useQuery({
        queryKey: ["doorTypeList"],
        queryFn: async () => {
            const response = await apiGet(`${BACKEND_URL}/dm-setup/event-type/list`);
            return handleApiResponse(response);
        },
    });
};
