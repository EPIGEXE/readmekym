import { apiGet, apiPost, apiPut } from "v2/libs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BACKEND_URL, handleApiResponse } from "./setting";
import useDoorMonitoringStore from "../../store/doorMonitoringStoreIndex";
import { parseCoordinate } from "../../store/doorMonitoringSlice/doorSlice";

// 문 트리 목록 가져오기
export const useDoorTreeList = (areaList) => {
    return useQuery({
        queryKey: ["doorTreeList", areaList],
        queryFn: async () => {
            let url;

            if (areaList && areaList.length > 0) {
                // areaList가 있는 경우: /tree/area?areaCode=AREA1&areaCode=AREA2&areaCode=AREA3
                const areaParams = areaList.map((area) => `areaCode=${encodeURIComponent(area)}`).join("&");
                url = `${BACKEND_URL}/dm/graphic-item/tree/area?${areaParams}`;
            } else {
                // areaList가 없는 경우: 기본 tree 엔드포인트
                url = `${BACKEND_URL}/dm/graphic-item/tree`;
            }

            const response = await apiGet(url);
            return handleApiResponse(response);
        },
        enabled: true,
    });
};

// 문 목록 가져오기(Flat)
export const useDoorList = (areaList) => {
    return useQuery({
        queryKey: ["doorList", areaList],
        queryFn: async () => {
            let url;

            if (areaList && areaList.length > 0) {
                const areaParams = areaList.map((area) => `areaCode=${encodeURIComponent(area)}`).join("&");
                url = `${BACKEND_URL}/dm/graphic-item/list/area?${areaParams}`;
            } else {
                url = `${BACKEND_URL}/dm/graphic-item/list`;
            }
            const response = await apiGet(url);
            const data = handleApiResponse(response);
            const parsedData = data.map((item) => ({
                ...item,
                coordinate: parseCoordinate(item.coordinate),
            }));
            return parsedData;
        },
        enabled: !!areaList,
    });
};

// 부모 문 아래에 새 문 추가
// 문 추가는 호출 후 서버로부터 code를 받아와야하기 때문에 useBatchUpdateDoor에서 처리하지 않음
// !important useAddDoor는 연속 호출하면 백엔드에서 오류가 발생할 수 있기때문에 연속 호출 시 한 번에 1개씩 호출해야 함
export const useAddDoor = () => {
    const { updateDoorIdMapping } = useDoorMonitoringStore((state) => state.actions);

    return useMutation({
        mutationFn: async ({ newDoor }) => {
            const { code, ...rest } = newDoor;
            const response = await apiPost({
                url: `${BACKEND_URL}/dm/graphic-item`,
                body: rest,
            });
            return handleApiResponse(response);
        },
        onSuccess: (response, { newDoor }) => {
            // 매핑 테이블 업데이트
            updateDoorIdMapping(newDoor.code, response.code);
        },
    });
};

// 문 항목 개별 조회
export const useDoorItem = (code, options) => {
    return useQuery({
        queryKey: ["doorItem", code],
        queryFn: async () => {
            const response = await apiGet(`${BACKEND_URL}/dm/graphic-item/${code}`);
            return handleApiResponse(response);
        },
        ...options,
    });
};

// 문 정보 일괄 업데이트
export const useBatchUpdateDoor = () => {
    return useMutation({
        mutationFn: async (requestBody) => {
            const response = await apiPut({
                url: `${BACKEND_URL}/dm/graphic-item/batch`,
                body: requestBody,
            });
            return handleApiResponse(response);
        },
    });
};

// 백엔드에서 문 구조 업데이트
export const useUpdateDoorStructureBackend = () => {
    return useMutation({
        mutationFn: async () => {
            const response = await apiPost({
                url: `${BACKEND_URL}/dm/graphic-item/updated`,
            });
            return handleApiResponse(response);
        },
    });
};

// 문 경보 인지 처리
export const useUpdateDoorAlarm = () => {
    return useMutation({
        mutationFn: async ({ code, ack_note }) => {
            const response = await apiPut({
                url: `${BACKEND_URL}/dm/graphic-item/ack/${code}`,
                body: { ack_note: ack_note },
            });

            return handleApiResponse(response);
        },
    });
};
