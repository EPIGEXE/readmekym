import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BACKEND_URL, handleApiResponse } from './setting';
import { apiGet, apiPut } from 'v2/libs';
import useBioDeviceStore from '../../store/bioDeviceStore';



// 특정 테이블 데이터 가져오기 훅
export const useTableData = (tableName) => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useQuery({
        queryKey: ['biolink', tableName, 'bioDevice'],
        queryFn: async () => {
            const apiUrl = `${BACKEND_URL}/bio/${tableName}-list/${productCode}`;

            const responseData = await apiGet(apiUrl);
            return handleApiResponse(apiUrl, responseData);
        },
        enabled: !!tableName,
    });
};

// 테이블 데이터 업데이트 훅
export const useUpdateTableData = () => {
    const queryClient = useQueryClient();
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useMutation({
        mutationFn: async ({ tableName, updates }) => {
            // 모든 업데이트를 병렬로 처리
            const updatePromises = Object.entries(updates).map(async ([deviceId, data]) => {
                const apiUrl = `${BACKEND_URL}/bio/${tableName}/${productCode}/${deviceId}`;

                const response = await apiPut({ url: apiUrl, body: data });
                return handleApiResponse(apiUrl, response);
            });

            // 모든 업데이트가 완료될 때까지 대기
            const results = await Promise.all(updatePromises);
            return results;
        },
        onSuccess: (_, variables) => {
            const { tableName } = variables;
            // 모든 업데이트가 완료된 후 한 번만 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: ['biolink', tableName, 'bioDevice'] });
        },
    });
};

// 테이블별 훅
export const useAuthConfig = () => useTableData('BS2AuthConfig');
export const useAuthConfigExt = () => useTableData('BS2AuthConfigExt');
export const useBlackList = () => useTableData('BS2BlackList');
export const useCardConfig = () => useTableData('BS2CardConfig');
export const useFaceConfig = () => useTableData('BS2FaceConfig');
export const useFaceConfigExt = () => useTableData('BS2FaceConfigExt');
export const useFactoryConfig = () => useTableData('BS2FactoryConfig');
export const useFingerprintConfig = () => useTableData('BS2FingerprintConfig');
export const useIpConfig = () => useTableData('BS2IpConfig');
export const useOperators = () => useTableData('BS2Operators');
export const useSystemConfig = () => useTableData('BS2SystemConfig');
export const useWiegandConfig = () => useTableData('BS2WiegandConfig');
export const useBioDevice = () => useTableData('BioDevice');