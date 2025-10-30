import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BACKEND_URL, handleApiResponse } from "./setting";
import { apiGet, apiPost, apiPut } from "v2/libs";
import useBioDeviceStore from "../../store/bioDeviceStore";

// -----------------------------
// 탭별 설정 데이터 요청 훅
// -----------------------------

/**
 * 장치 기본 설정 탭 데이터 가져오기 훅
 *
 * 이 훅은 장치의 기본 설정 정보를 서버에서 가져옵니다.
 * 기본 설정에는 장치명, 모델명, MAC 주소, IP 주소, 하드웨어/펌웨어 버전 등이 포함됩니다.
 *
 * @param {string} deviceId - 장치 ID
 * @returns {UseQueryResult} React Query 결과 객체 (data, isLoading, error, refetch 등 포함)
 */
export const useBasicSettings = (deviceId) => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useQuery({
        queryKey: ["deviceSettings", deviceId, "basic", "bioDevice"],
        queryFn: async () => {
            // API 요청으로 데이터 가져오기

            const factoryConfigUrl = `${BACKEND_URL}/bio/factory-config/${productCode}/${deviceId}`;
            const ipConfigUrl = `${BACKEND_URL}/bio/ip-config/${productCode}/${deviceId}`;
            const systemConfigUrl = `${BACKEND_URL}/bio/system-config/${productCode}/${deviceId}`;

            try {
                // 모든 API 요청을 병렬로 처리
                const [
                    factoryConfigResponse,
                    ipConfigResponse,
                    systemConfigResponse,
                ] = await Promise.all([
                    apiGet(factoryConfigUrl),
                    apiGet(ipConfigUrl),
                    apiGet(systemConfigUrl),
                ]);

                // 각 응답에 대해 handleApiResponse 처리
                const factoryConfig = handleApiResponse(
                    factoryConfigUrl,
                    factoryConfigResponse
                );
                const ipConfig = handleApiResponse(
                    ipConfigUrl,
                    ipConfigResponse
                );
                const systemConfig = handleApiResponse(
                    systemConfigUrl,
                    systemConfigResponse
                );

                return {
                    ...factoryConfig,
                    ...ipConfig,
                    ...systemConfig,
                };
            } catch (error) {
                console.error("설정 데이터 가져오기 실패:", error);
                throw error;
            }
        },
        enabled: !!deviceId, // deviceId가 있을 때만 쿼리 실행
    });
};

/**
 * 인증 탭 데이터 가져오기 훅
 *
 * 이 훅은 장치의 인증 설정 정보를 서버에서 가져옵니다.
 * 인증 설정에는 지문/얼굴/카드 인증 사용 여부, 다중 인증 방식 등이 포함됩니다.
 *
 * 주요 데이터 필드:
 * - useFingerprint: 지문 인증 사용 여부
 * - useFace: 얼굴 인증 사용 여부
 * - useCard: 카드 인증 사용 여부
 * - multiFactorAuth: 다중 인증 요소 사용 여부 (지문+카드, 얼굴+카드 등)
 *
 * @param {string} deviceId - 장치 ID
 * @returns {UseQueryResult} React Query 결과 객체 (data, isLoading, error, refetch 등 포함)
 */
export const useAuthSettings = (
    deviceId,
    auth,
    cardSupported,
    faceSupported,
    fingerprintSupported
) => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);
    
    return useQuery({
        queryKey: ["deviceSettings", deviceId, "auth", "bioDevice"],
        queryFn: async () => {
            const endpoints = [];

            // 기본 인증 설정은 항상 가져옴
            endpoints.push(
                `${BACKEND_URL}/bio/${auth}/${productCode}/${deviceId}`
            );

            // 지원되는 인증 방식에 따라 엔드포인트 추가
            if (cardSupported) {
                endpoints.push(
                    `${BACKEND_URL}/bio/card-config/${productCode}/${deviceId}`
                );
            }
            if (fingerprintSupported) {
                endpoints.push(
                    `${BACKEND_URL}/bio/fingerprint-config/${productCode}/${deviceId}`
                );
            }
            if (faceSupported) {
                endpoints.push(
                    `${BACKEND_URL}/bio/face-config/${productCode}/${deviceId}`
                );
            }

            // if (faceExSupported) {
            //     endpoints.push(
            //         `${BACKEND_URL}/bio/face-config-ext/${PRODUCT_CODE}/${deviceId}`
            //     );
            // }

            try {
                // 필요한 엔드포인트만 병렬로 호출
                const responses = await Promise.all(
                    endpoints.map((endpoint) => apiGet(endpoint))
                );

                // 각 응답에 대해 handleApiResponse 처리
                const processedResponses = responses.map((response, index) =>
                    handleApiResponse(endpoints[index], response)
                );

                // 응답 데이터 병합
                return processedResponses.reduce(
                    (acc, response) => ({
                        ...acc,
                        ...response,
                    }),
                    {}
                );
            } catch (error) {
                console.error("설정 데이터 가져오기 실패:", error);
                throw error;
            }
        },
        enabled: !!deviceId,
    });
};

/**
 * 고급 설정 탭 데이터 가져오기 훅
 *
 * 이 훅은 장치의 고급 설정 정보를 서버에서 가져옵니다.
 * 고급 설정에는 암호화 수준, 데이터 백업 여부, 동기화 주기 등이 포함됩니다.
 *
 * 주요 데이터 필드:
 * - encryptionLevel: 데이터 암호화 수준 (낮음, 보통, 높음)
 * - dataBackup: 자동 데이터 백업 사용 여부
 * - syncInterval: 서버 동기화 주기 (분 단위)
 *
 * @param {string} deviceId - 장치 ID
 * @returns {UseQueryResult} React Query 결과 객체 (data, isLoading, error, refetch 등 포함)
 */
export const useAdvancedSettings = (deviceId) => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useQuery({
        queryKey: ["deviceSettings", deviceId, "advanced", "bioDevice"],
        queryFn: async () => {
            const wiegandConfigUrl = `${BACKEND_URL}/bio/wiegand-config/${productCode}/${deviceId}`;

            try {
                const [wiegandConfigResponse] = await Promise.all([
                    apiGet(wiegandConfigUrl),
                ]);

                const wiegandConfig = handleApiResponse(
                    wiegandConfigUrl,
                    wiegandConfigResponse
                );

                return {
                    ...wiegandConfig,
                };
            } catch (error) {
                console.error("설정 데이터 가져오기 실패:", error);
                throw error;
            }
        },
        enabled: !!deviceId,
    });
};

// -----------------------------
// 설정 업데이트 훅
// -----------------------------
/**
 * 기본 설정 탭 업데이트 훅
 * 장치의 기본 설정 정보를 업데이트합니다.
 * @returns {UseMutationResult} React Query Mutation 결과 객체
 */
export const useUpdateBasicSettings = () => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useMutation({
        mutationFn: async ({ deviceId, settings }) => {
            const apiUrl = `${BACKEND_URL}/bio/device/name/update/${productCode}/${deviceId}`;

            const name = { name: settings.device_name };

            const responseData = await apiPut({ url: apiUrl, body: name });

            return handleApiResponse(apiUrl, responseData);
        },
    });
};

/**
 * 인증 탭 업데이트 훅
 * 장치의 인증 설정 정보를 업데이트합니다.
 * @returns {UseMutationResult} React Query Mutation 결과 객체
 */
export const useUpdateAuthSettings = () => {
    const queryClient = useQueryClient();
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);
    return useMutation({
        mutationFn: async ({
            deviceId,
            settings,
            auth,
            cardSupported,
            faceSupported,
            fingerprintSupported,
        }) => {
            // 데이터 객체를 조건문 밖으로 이동
            const authData = {
                auth_timeout: settings.auth_timeout,
                device_id: deviceId,
                ...(auth === "auth-config-ext"
                    ? { ext_auth_schedule: settings.ext_auth_schedule }
                    : { auth_schedule: settings.auth_schedule }),
                face_detection_level: settings.face_detection_level,
                global_apbfail_action: settings.global_apbfail_action,
                match_timeout: settings.match_timeout,
                num_operators: settings.num_operators,
                use_full_access: settings.use_full_access,
                use_global_apb: settings.use_global_apb,
                use_group_matching: settings.use_group_matching,
                use_private_auth: settings.use_private_auth,
                use_server_matching: settings.use_server_matching,
            };

            const cardData = {
                byte_order: settings.byte_order,
                cipher: settings.cipher,
                data_type: settings.data_type,
                desfire_app_id: settings.desfire_app_id,
                desfire_encryption_type: settings.desfire_encryption_type,
                desfire_file_id: settings.desfire_file_id,
                desfire_operation_mode: settings.desfire_operation_mode,
                desfire_primary_key: settings.desfire_primary_key,
                desfire_secondary_key: settings.desfire_secondary_key,
                device_id: deviceId,
                format_id: settings.format_id,
                iclass_primary_key: settings.iclass_primary_key,
                iclass_secondary_key: settings.iclass_secondary_key,
                iclass_start_block_index: settings.iclass_start_block_index,
                mifare_primary_key: settings.mifare_primary_key,
                mifare_secondary_key: settings.mifare_secondary_key,
                mifare_start_block_index: settings.mifare_start_block_index,
                use_secondary_key: settings.use_secondary_key,
                use_wiegand_format: settings.use_wiegand_format,
            };

            const faceData = {
                check_duplicate: settings.check_duplicate,
                detect_distance_max: settings.detect_distance_max,
                detect_distance_min: settings.detect_distance_min,
                detect_sensitivity: settings.detect_sensitivity,
                device_id: deviceId,
                enroll_threshold: settings.enroll_threshold,
                enroll_timeout: settings.enroll_timeout,
                face_width_max: settings.face_width_max,
                face_width_min: settings.face_width_min,
                lfd_level: settings.lfd_level,
                light_condition: settings.light_condition,
                max_rotation: settings.max_rotation,
                operation_mode: settings.operation_mode,
                preview_option: settings.preview_option,
                quick_enrollment: settings.quick_enrollment,
                search_range_width: settings.search_range_width,
                search_range_x: settings.search_range_x,
                security_level: settings.security_level,
                wide_search: settings.wide_search,
            };

            const fingerprintData = {
                advanced_enrollment: settings.advanced_enrollment,
                check_duplicate: settings.check_duplicate,
                device_id: deviceId,
                fast_mode: settings.fast_mode,
                lfd_level: settings.lfd_level,
                scan_timeout: settings.scan_timeout,
                security_level: settings.security_level,
                sensitivity: settings.sensitivity,
                sensor_mode: settings.sensor_mode,
                show_image: settings.show_image,
                successive_scan: settings.successive_scan,
                template_format: settings.template_format,
            };

            const endpoints = [];

            endpoints.push(
                `${BACKEND_URL}/bio/${auth}/${productCode}/${deviceId}`
            );
            if (cardSupported)
                endpoints.push(
                    `${BACKEND_URL}/bio/card-config/${productCode}/${deviceId}`
                );
            if (faceSupported)
                endpoints.push(
                    `${BACKEND_URL}/bio/face-config/${productCode}/${deviceId}`
                );
            if (fingerprintSupported)
                endpoints.push(
                    `${BACKEND_URL}/bio/fingerprint-config/${productCode}/${deviceId}`
                );

            try {
                const responses = await Promise.all(
                    endpoints.map((endpoint) => {
                        let data;
                        if (endpoint.includes("/auth")) {
                            data = authData;
                        } else if (endpoint.includes("/card-config")) {
                            data = cardData;
                        } else if (endpoint.includes("/face-config")) {
                            data = faceData;
                        } else if (endpoint.includes("/fingerprint-config")) {
                            data = fingerprintData;
                        }
                        return apiPut({ url: endpoint, body: data });
                    })
                );

                const processedResponses = responses.map((response, index) =>
                    handleApiResponse(endpoints[index], response)
                );

                return processedResponses.reduce(
                    (acc, response) => ({
                        ...acc,
                        ...response,
                    }),
                    {}
                );
            } catch (error) {
                console.error("설정 데이터 업데이트 실패:", error);
                throw error;
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["deviceSettings", variables.deviceId, "auth", "bioDevice"]
            });
        },
    });
};

/**
 * 고급 설정 탭 업데이트 훅
 * 장치의 고급 설정 정보를 업데이트합니다.
 * @returns {UseMutationResult} React Query Mutation 결과 객체
 */
export const useUpdateAdvancedSettings = () => {
    const queryClient = useQueryClient();
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useMutation({
        mutationFn: async ({ deviceId, settings }) => {
            const apiUrl = `${BACKEND_URL}/bio/wiegand-config/${productCode}/${deviceId}`;

            const responseData = await apiPut({ url: apiUrl, body: settings });

            return handleApiResponse(apiUrl, responseData);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["deviceSettings", variables.deviceId, "advanced", "bioDevice"]
            });
        },
    });
};

export const useRestartDevice = () => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useMutation({
        mutationFn: async (deviceId) => {
            const apiUrl = `${BACKEND_URL}/bio/device/reboot/${productCode}/${deviceId}`;

            const responseData = await apiPost({ url: apiUrl });

            return handleApiResponse(apiUrl, responseData);
        },
    });
};

export const useLockDevice = () => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useMutation({
        mutationFn: async (deviceId) => {
            const apiUrl = `${BACKEND_URL}/bio/device/lock/${productCode}/${deviceId}`;

            const responseData = await apiPost({ url: apiUrl });

            return handleApiResponse(apiUrl, responseData);
        },
    });
};
export const useUnlockDevice = () => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useMutation({
        mutationFn: async (deviceId) => {
            const apiUrl = `${BACKEND_URL}/bio/device/unlock/${productCode}/${deviceId}`;

            const responseData = await apiPost({ url: apiUrl });

            return handleApiResponse(apiUrl, responseData);
        },
    });
};

export const useResetDevice = () => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useMutation({
        mutationFn: async (deviceId) => {
            const apiUrl = `${BACKEND_URL}/bio/device/factoryreset/${productCode}/${deviceId}`;

            const responseData = await apiPost({ url: apiUrl });

            return handleApiResponse(apiUrl, responseData);
        },
    });
};

export const useDataSync = () => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useMutation({
        mutationFn: async (deviceId) => {
            const apiUrl = `${BACKEND_URL}/bio/device/user/info/sync/${productCode}/${deviceId}`;

            const responseData = await apiPost({ url: apiUrl });

            return handleApiResponse(apiUrl, responseData);
        },
    });
};

export const useDeivceTime = (deviceId) => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useQuery({
        queryKey: ["deviceTime", deviceId, "bioDevice"],
        queryFn: async () => {
            const apiUrl = `${BACKEND_URL}/bio/device/time/${productCode}/${deviceId}`;

            const responseData = await apiGet(apiUrl);

            return handleApiResponse(apiUrl, responseData);
        },
    });
};

export const useApplyServerTime = () => {
    const productCode = useBioDeviceStore((state) => state.bioConfig.productCode);

    return useMutation({
        mutationFn: async ({ deviceId }) => {
            const apiUrl = `${BACKEND_URL}/bio/device/timesync/${productCode}/${deviceId}`;

            const responseData = await apiPost({ url: apiUrl });

            return handleApiResponse(apiUrl, responseData);
        },
    });
};
