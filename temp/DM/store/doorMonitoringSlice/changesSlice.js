// src/v2/widgets/DM/store/slice/changesSlice.js
import { produce } from "immer";

export const CHANGE_TYPE = {
    CREATE: "CREATE",
    UPDATE: "UPDATE",
    DELETE: "DELETE",
    BACKGROUND_IMAGE: "BACKGROUND_IMAGE",
};

export const createChangesSlice = (set, get) => ({
    // 2. 저장 대기 중인 변경사항
    pendingChanges: {}, // code를 키로 사용하는 일반 객체
    isAutoSaving: false,

    // 액션
    actions: {
        // 변경사항 추가 (그룹 단위로)
        addChange: (code, type, data) => {
            set(
                produce((state) => {

                    // ===================== 2. 저장용 변경사항 처리 =====================
                    console.log(code);
                    const isTempId = code.startsWith("new-");
                    const existingChange = state.pendingChanges[code];
                    const realCode = get().actions.getRealDoorCode(code); // doorSlice의 매핑 테이블에서 실제 코드 조회
                    const isMappedToRealCode = realCode !== code; // 실제 코드로 매핑되었는지 확인

                    if (isTempId && !isMappedToRealCode) {
                        // ---------- 임시 ID (새로 생성된 문) 처리 ----------
                        switch (type) {
                            case CHANGE_TYPE.CREATE:
                                // CREATE: 새로운 생성 요청
                                state.pendingChanges[code] = {
                                    type: CHANGE_TYPE.CREATE,
                                    data,
                                };
                                break;

                            case CHANGE_TYPE.UPDATE:
                                // UPDATE: CREATE 요청의 데이터에 병합
                                if (existingChange?.type === CHANGE_TYPE.CREATE) {
                                    state.pendingChanges[code] = {
                                        type: CHANGE_TYPE.CREATE,
                                        data: { ...existingChange.data, ...data },
                                    };
                                }
                                break;

                            case CHANGE_TYPE.DELETE:
                                // DELETE: CREATE 요청 삭제
                                if (existingChange?.type === CHANGE_TYPE.CREATE) {
                                    delete state.pendingChanges[code];
                                }
                                break;

                            case CHANGE_TYPE.BACKGROUND_IMAGE:
                                // BACKGROUND_IMAGE: 배경 이미지 변경
                                console.error("ERR: 임시 ID가 배경을 가질 수 없음");
                                break;

                            default:
                                console.error(`잘못된 변경 타입: ${type} (임시 ID: ${code})`);
                                break;
                        }
                    } else {
                        // ---------- 실제 ID (기존 문) 처리 ----------
                        switch (type) {
                            case CHANGE_TYPE.UPDATE:
                                // UPDATE: 기존 데이터가 있으면 병합, 없으면 새로 생성
                                state.pendingChanges[realCode] = {
                                    type,
                                    data:
                                        existingChange?.type === CHANGE_TYPE.UPDATE
                                            ? { ...existingChange.data, ...data }
                                            : data,
                                };
                                break;

                            case CHANGE_TYPE.DELETE:
                                // DELETE: 삭제 요청 저장
                                state.pendingChanges[realCode] = { type, data };
                                break;

                            case CHANGE_TYPE.BACKGROUND_IMAGE:
                                // BACKGROUND_IMAGE: 배경 이미지 변경
                                state.pendingChanges[realCode] = {
                                    type,
                                    data:
                                        existingChange?.type === CHANGE_TYPE.BACKGROUND_IMAGE
                                            ? { ...existingChange.data, ...data }
                                            : data,
                                };
                                break;

                            default:
                                console.error(`잘못된 변경 타입: ${type} (실제 ID: ${code})`);
                                break;
                        }
                    }
                }),
                false,
                "doorMonitoring/addChange"
            );
        },

        // 변경 그룹에 변경사항 추가
        // addToCurrentGroup 수정
        addToCurrentGroup: (code, type, data) =>
            set(
                produce((state) => {
                    const isTempId = code.startsWith("new-");

                    // pendingChanges 업데이트
                    if (isTempId) {
                        // 임시 ID인 경우
                        const existingChange = state.pendingChanges[code];
                        if (existingChange?.type === CHANGE_TYPE.CREATE) {
                            state.pendingChanges[code] = {
                                type: CHANGE_TYPE.CREATE,
                                data: {
                                    ...existingChange.data,
                                    ...data,
                                },
                            };
                        } else {
                            state.pendingChanges[code] = {
                                type: CHANGE_TYPE.CREATE,
                                data,
                            };
                        }
                    } else {
                        // 실제 ID인 경우
                        if (type === CHANGE_TYPE.UPDATE) {
                            const existingChange = state.pendingChanges[code];
                            if (existingChange?.type === CHANGE_TYPE.UPDATE) {
                                state.pendingChanges[code] = {
                                    type,
                                    data: {
                                        ...existingChange.data,
                                        ...data,
                                    },
                                };
                            } else {
                                state.pendingChanges[code] = { type, data };
                            }
                        } else {
                            state.pendingChanges[code] = { type, data };
                        }
                    }
                }),
                false,
                "doorMonitoring/addToCurrentGroup"
            ),

        // 자동저장 완료 (스냅샷 기반 - 저장된 변경사항만 제거)
        completeAutoSaveWithSnapshot: (savedCodes) =>
            set(
                produce((state) => {
                    state.isAutoSaving = false;
                    // 저장된 변경사항만 제거
                    savedCodes.forEach((code) => {
                        delete state.pendingChanges[code];
                    });
                }),
                false,
                "changes/completeAutoSaveWithSnapshot"
            ),

        // 자동저장 시작
        startAutoSave: () =>
            set(
                produce((state) => {
                    state.isAutoSaving = true;
                }),
                false,
                "changes/startAutoSave"
            ),

        // 자동저장 실패
        failAutoSave: () =>
            set(
                produce((state) => {
                    state.isAutoSaving = false;
                }),
                false,
                "changes/failAutoSave"
            ),

        // 저장되지 않은 변경사항 모두 폐기
        clearPendingChanges: () =>
            set(
                produce((state) => {
                    state.pendingChanges = {};
                    state.isAutoSaving = false;
                }),
                false,
                "changes/clearPendingChanges"
            ),
    },
});
