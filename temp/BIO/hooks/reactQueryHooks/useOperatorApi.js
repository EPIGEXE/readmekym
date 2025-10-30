import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BACKEND_URL, handleApiResponse } from './setting';
import { apiGet, apiPost, apiPut } from 'v2/libs';
import useBioDeviceStore from '../../store/bioDeviceStore';

// 출입 통제 시스템 사용자 목록 검색
export const useSearchAcsEmployeeListApi = () => {
    const acsCode = useBioDeviceStore((state) => state.bioConfig.acsCode);

    return useMutation({
        mutationFn: async (searchValue) => {
            const apiUrl = `${BACKEND_URL}/acs/search/name/${acsCode}`;
            const responseData = await apiPost({ url: apiUrl, body: searchValue });

            return handleApiResponse(apiUrl, responseData);
        }
    })
}

// 장치 운영자 목록 조회
export const useBioDeviceOperatorListApi = () => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useQuery({
        queryKey: ['bioDeviceOperatorList', 'bioDevice'],
        queryFn: async () => {
            const apiUrl = `${BACKEND_URL}/bio/device-operator-list/${productCode}`;
            const responseData = await apiGet(apiUrl);

            return handleApiResponse(apiUrl, responseData);
        }
    })
}

// 장치 운영자 목록 업데이트
export const useUpdateBioDeviceOperatorListApi = () => {
    const queryClient = useQueryClient();
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useMutation({
        mutationFn: async ({ operatorList }) => {
            const apiUrl = `${BACKEND_URL}/bio/device-operator-list/${productCode}`;
            const responseData = await apiPut({ url: apiUrl, body: operatorList });

            return handleApiResponse(apiUrl, responseData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bioDeviceOperatorList', 'bioDevice'] });
        }
    })
}

export const useAllDeviceOperatorListApi = ({ deviceId }) => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useQuery({
        queryKey: ['allDeviceOperatorList', deviceId, 'bioDevice'],
        queryFn: async () => {
            const apiUrl = `${BACKEND_URL}/bio/device/user/list/${productCode}/${deviceId}`;
            const responseData = await apiGet(apiUrl);

            return handleApiResponse(apiUrl, responseData);
        },
        enabled: !!deviceId,
    });
};

export const useSelectedDeviceOperatorListApi = ({ deviceId }) => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useQuery({
        queryKey: ['selectedDeviceOperatorList', deviceId, 'bioDevice'],
        queryFn: async () => {
            const apiUrl = `${BACKEND_URL}/bio/device/operator/list/${productCode}/${deviceId}`;
            const responseData = await apiGet(apiUrl);

            return handleApiResponse(apiUrl, responseData);
        },
        enabled: !!deviceId,
    });
};

// 장치 운영자는 Post와 Delete가 없어서 전체 리스트를 Put으로 다시 보내서 업데이트 해줘야 함
export const useUpdateDeviceOperatorListApi = () => {
    const queryClient = useQueryClient();
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useMutation({
        mutationFn: async ({ deviceId, operatorList }) => {
            const apiUrl = `${BACKEND_URL}/bio/device/operator/update/${productCode}/${deviceId}`;
            const responseData = await apiPut({ url: apiUrl, body: operatorList });

            return handleApiResponse(apiUrl, responseData);
        },
        onSuccess: (_, { deviceId }) => {
            queryClient.invalidateQueries({ queryKey: ['selectedDeviceOperatorList', deviceId, 'bioDevice'] });
        },
    });
};
