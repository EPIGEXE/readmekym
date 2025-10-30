import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL, handleApiResponse } from "./setting";
import { apiGet } from "v2/libs";
import useBioDeviceStore from "../../store/bioDeviceStore";


export const useFirmwareList = () => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useQuery({
        queryKey: ['firmwareList', 'bioDevice'],
        queryFn: async () => {
            const apiUrl = `${BACKEND_URL}/bio/device/firmware/list/${productCode}`;

            const responseData = await apiGet(apiUrl);
            return handleApiResponse(apiUrl, responseData);
        }
    });
};

export const useFirmwareVersion = (deviceId) => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useQuery({
        queryKey: ['firmwareVersion', deviceId, 'bioDevice'],
        queryFn: async () => {
            const apiUrl = `${BACKEND_URL}/bio/factory-config/${productCode}/${deviceId}`;

            const responseData = await apiGet(apiUrl);
            const data = handleApiResponse(apiUrl, responseData);

            const versionNumbers = [
                data.firmware_ver_major,
                data.firmware_ver_minor,
                data.firmware_ver_ext
            ].filter(v => v !== undefined && v !== null).join('.');

            const firmwareVersion = data.firmware_rev !== undefined && data.firmware_rev !== null
                ? `${versionNumbers} (${data.firmware_rev})`
                : versionNumbers;

            return firmwareVersion;
        },
        enabled: !!deviceId
    })
}