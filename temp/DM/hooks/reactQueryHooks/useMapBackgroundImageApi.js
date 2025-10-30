import { apiGet } from "v2/libs";
import {  useQuery } from "@tanstack/react-query"
import { BACKEND_URL, handleApiResponse } from "./setting";

// 특정 맵 배경 이미지 조회
export const useMapBackground = (id) => {
    return useQuery({
        queryKey: ['mapBackground', id],
        queryFn: async () => {
            const response = await apiGet(`${BACKEND_URL}/dm/graphic-item/${id}`);
            const data = handleApiResponse(response);

            const configJson = data.config;

            const config = JSON.parse(configJson);

            return config;
        },
        enabled: !!id,
    });
};