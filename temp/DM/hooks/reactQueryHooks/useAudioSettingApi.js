import { apiDelete } from "@/v2/libs";
import { useMutation } from "@tanstack/react-query";
import { BACKEND_URL, handleApiResponse } from "./setting";

export const useDeleteAudio = () => {
    return useMutation({
        mutationFn: async (audioId) => {
            const response = await apiDelete(`${BACKEND_URL}/dm/audio/${audioId}`);
            return handleApiResponse(response);
        },
    });
};
