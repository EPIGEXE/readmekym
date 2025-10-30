import { apiDelete, apiGet } from "v2/libs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { BACKEND_BASE_API_URL, handleApiResponse } from "./setting";

// 문 경보 오디오 목록 조회
export const useAlertAudioList = () => {
    return useQuery({
        queryKey: ['alertAudioList'],
        queryFn: async () => {
            const response = await apiGet(`${BACKEND_BASE_API_URL}/resource/list/DM-Audio`);
            return handleApiResponse(response);
        },
    })
}

export const useDeleteAlertAudio = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (audioFileNames) => {
            const response = await fetch(`${BACKEND_BASE_API_URL}/resource/delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Cx-Upload-Path": "DM-Audio",
                    Authorization: `Bearer ${localStorage.getItem("AXISTATIONX_ACCESS_TOKEN")}`,
                },
                body: JSON.stringify(audioFileNames),
            });
            return handleApiResponse(response);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["alertAudioList"] });
        },
    });
}