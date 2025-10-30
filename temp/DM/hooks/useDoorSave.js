// src/v2/widgets/DM/hooks/useDoorAutoSave.js
import { useRef } from "react";
import useDoorMonitoringStore from "../store/doorMonitoringStoreIndex";
import { useAddDoor, useBatchUpdateDoor } from "./reactQueryHooks/useDoorListApi";

const SAVE_DELAY = 5000; // 마지막 변경 후 5초 후 저장

/**
 * 문 자동 저장 훅
 * 
 * 문 변경사항을 자동으로 저장하는 훅
 * 문 생성, 수정, 삭제, 배경 이미지 변경 등의 변경사항을 처리
 * 변경사항이 있을 때마다 5초 후 저장
 * 저장 중이면 다음 저장 대기
 * 저장 실패 시 다음 저장 시도 예약
 * 맵 변경이나 편집 모드 해제 시 즉시 저장
 */
export const useDoorSave = () => {
    // ============================= 전역 상태 =============================

    // 문 모니터링 상태
    const pendingChanges = useDoorMonitoringStore((state) => state.pendingChanges); // 변경사항
    const isAutoSaving = useDoorMonitoringStore((state) => state.isAutoSaving); // 자동 저장 상태

    // 문 모니터링 액션
    const getRealDoorCode = useDoorMonitoringStore((state) => state.actions.getRealDoorCode); // 실제 문 코드 조회(새로 생성된 문의 경우 매핑 테이블에서 서버의 문 코드를 가져옴)
    const startAutoSave = useDoorMonitoringStore((state) => state.actions.startAutoSave); // 자동 저장 시작
    const completeAutoSaveWithSnapshot = useDoorMonitoringStore((state) => state.actions.completeAutoSaveWithSnapshot); // 자동 저장 완료
    const failAutoSave = useDoorMonitoringStore((state) => state.actions.failAutoSave); // 자동 저장 실패

    // ============================= 쿼리 훅 =============================
    // Put
    const batchUpdateDoor = useBatchUpdateDoor(); // 문 일괄 업데이트

    // Post
    const addDoor = useAddDoor(); // 문 생성

    // ============================= useRef =============================
    const saveTimerRef = useRef(null); // 저장 타이머 참조
    const savingChangesRef = useRef({}); // 저장 중인 변경사항 스냅샷

    // ============================= useEffect 함수 =============================
    // 저장 실행 함수
    const executeSave = async () => {
        console.log("executeSave", pendingChanges);

        if (Object.keys(pendingChanges).length === 0) return;

        // 이미 저장 중이면 타이머만 클리어하고 다음 저장을 기다림
        if (isAutoSaving) {
            console.log("이미 저장 중... 다음 저장 대기");
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
            // 저장이 완료되면 새로운 변경사항이 자동으로 다음 저장 사이클에 포함됨
            return;
        }

        try {
            // 1. 저장할 변경사항 스냅샷 생성 (깊은 복사)
            savingChangesRef.current = JSON.parse(JSON.stringify(pendingChanges));
            const savedCodes = Object.keys(savingChangesRef.current);
            
            console.log("저장 시작 - 스냅샷 생성:", savingChangesRef.current);
            console.log("저장할 코드들:", savedCodes);

            // 2. 저장 상태 시작
            startAutoSave();

            // 3. CREATE 작업들을 순차적으로 처리 (스냅샷 기준)
            const createChanges = Object.entries(savingChangesRef.current)
                .filter(([code]) => code.startsWith("new-"))
                .filter(([code]) => getRealDoorCode(code) === code) // 매핑 테이블에 없는 경우만
                .filter(([_, change]) => change.type === "CREATE");

            console.log("CREATE 작업들:", createChanges);

            // CREATE 작업들을 하나씩 순차 처리
            for (const [code, change] of createChanges) {
                const { data } = change;
                const newDoor = {
                    code: data.code,
                    name: data.name,
                    sub_name: data.sub_name || "",
                    type_code: data.type_code || null,
                    parent_code: data.parent_code,
                    coordinate: JSON.stringify(data.coordinate),
                    config: JSON.stringify(data?.config || {}),
                    event_code: data.event_code || null,
                    area_code_list: data.area_code_list || [],
                    event_status_condition: data.event_status_condition || 0,
                    event_status_reverse: data.event_status_reverse || 0,
                };

                console.log("문 생성 중:", newDoor);
                await addDoor.mutateAsync({ newDoor });
                console.log("문 생성 완료:", code);
            }

            // 4. UPDATE와 DELETE 작업들을 배치로 처리 (스냅샷 기준)
            const batchRequests = [];

            Object.entries(savingChangesRef.current)
                .filter(([_, change]) => ["UPDATE", "DELETE", "BACKGROUND_IMAGE"].includes(change.type))
                .forEach(([code, change]) => {
                    const { type, data } = change;

                    if (type === "UPDATE") {
                        // 기존 문 업데이트 처리
                        const realCode = getRealDoorCode(code);
                        const updateParams = { code: realCode };

                        // 변경된 속성만 추가
                        if (data.name !== undefined) updateParams.name = data.name;
                        if (data.sub_name !== undefined) updateParams.sub_name = data.sub_name;
                        if (data.event_status_condition !== undefined)
                            updateParams.event_status_condition = data.event_status_condition;
                        if (data.event_status_reverse !== undefined)
                            updateParams.event_status_reverse = data.event_status_reverse;
                        if (data.event_code !== undefined)
                            updateParams.event_code = data.event_code;
                        if (data.area_code_list !== undefined) updateParams.area_code_list = data.area_code_list;
                        if (data.type_code !== undefined) updateParams.type_code = data.type_code;

                        // 좌표 업데이트가 있는 경우
                        if (data.coordinate !== undefined) {
                            updateParams.coordinate = JSON.stringify(data.coordinate);
                        }

                        // 설정 업데이트가 있는 경우
                        if (data.config !== undefined) {
                            updateParams.config = JSON.stringify(data.config);
                        }

                        batchRequests.push({
                            method: "U",
                            params: updateParams,
                        });
                    } else if (type === "DELETE") {
                        // 문 삭제 처리
                        const realCode = getRealDoorCode(code);
                        batchRequests.push({
                            method: "D",
                            params: {
                                code: realCode,
                            },
                        });
                    } else if (type === "BACKGROUND_IMAGE") {
                        // 배경 이미지 업데이트 처리 - 원본에서 image 데이터 가져오기
                        const realCode = getRealDoorCode(code);
                        const originalData = pendingChanges[code]?.data; // 원본에서 가져오기
                        
                        const backgroundConfig = {
                            backgroundImage: {
                                dataUrl: originalData?.image?.src, // 원본에서 src 추출
                                width: data.width,
                                height: data.height,
                                scale: data.scale,
                                contain: data.contain,
                            },
                            x: data.x,
                            y: data.y,
                        };

                        console.log("배경 이미지 업데이트를 배치 요청에 추가:", realCode, {
                            originalImageSrc: originalData?.image?.src,
                            backgroundConfig
                        });

                        batchRequests.push({
                            method: "U",
                            params: {
                                code: realCode,
                                config: JSON.stringify(backgroundConfig),
                            },
                        });
                    }
                });

            console.log("UPDATE/DELETE/BACKGROUND_IMAGE 배치 요청:", batchRequests);

            // UPDATE/DELETE 배치 요청 실행
            if (batchRequests.length > 0) {
                await batchUpdateDoor.mutateAsync(batchRequests);
                console.log("UPDATE/DELETE 완료");
            }

            // 6. 저장 성공 - 스냅샷에 있던 변경사항만 제거
            console.log("저장 완료 - 스냅샷 변경사항 제거:", savedCodes);
            completeAutoSaveWithSnapshot(savedCodes);
            
            // 7. 저장 중 추가된 새로운 변경사항이 있으면 다음 저장 예약
            const currentPendingChanges = useDoorMonitoringStore.getState().pendingChanges;
            if (Object.keys(currentPendingChanges).length > 0) {
                console.log("저장 중 새로운 변경사항 발견 - 다음 저장 예약:", currentPendingChanges);
                saveTimerRef.current = setTimeout(executeSave, SAVE_DELAY);
            }

        } catch (error) {
            failAutoSave();
            console.error("자동 저장 실패:", error);
            
            // 실패 시에도 다음 저장 시도 예약
            const currentPendingChanges = useDoorMonitoringStore.getState().pendingChanges;
            if (Object.keys(currentPendingChanges).length > 0) {
                console.log("저장 실패 - 재시도 예약");
                saveTimerRef.current = setTimeout(executeSave, SAVE_DELAY * 2); // 실패 시 더 긴 딜레이
            }
        } finally {
            // 스냅샷 클리어
            savingChangesRef.current = {};
        }
    };

    return executeSave;
};