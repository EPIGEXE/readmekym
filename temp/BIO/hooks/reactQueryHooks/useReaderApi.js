import { useMutation, useQuery } from "@tanstack/react-query";
import { BACKEND_URL, handleApiResponse } from "./setting";
import { apiGet, apiPut } from "v2/libs";
import useBioDeviceStore from "../../store/bioDeviceStore";

export const useReaderList = () => {
    const acsCode = useBioDeviceStore((state) => state.bioConfig.acsCode);

    return useQuery({
        queryKey: ["readerList", "bioDevice"],
        queryFn: async () => {
            const apiUrl = `${BACKEND_URL}/acs/reader/list/${acsCode}`;
            const responseData = await apiGet(apiUrl);

            return handleApiResponse(apiUrl, responseData);
        },
        enabled: !!acsCode,
    });
};

export const useSetReaderToDevice = () => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useMutation({
        mutationFn: async ({ deviceId, readerId }) => {
            const apiUrl = `${BACKEND_URL}/bio/device/reader/register/${productCode}/${deviceId}`;
            const requestBody = {
                reader_key: readerId,
            };
            const responseData = await apiPut({
                url: apiUrl,
                body: requestBody,
            });

            return handleApiResponse(apiUrl, responseData);
        },
    });
};
