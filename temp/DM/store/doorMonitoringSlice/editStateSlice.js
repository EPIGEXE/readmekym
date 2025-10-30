export const createEditStateSlice = (set, get) => ({
    // 상태
    editState: {
        isEditable: false,
        contextMenuActive: false,
        currentMode: 'SELECT',
        remountKey: 0, // 컴포넌트 리마운트를 위한 키
    },

    // 액션
    actions: {
        setMode: (mode) =>
            set(
                (state) => ({
                    editState: {
                        ...state.editState,
                        currentMode: mode,
                    },
                }),
                false,
                'doorMonitoring/setMode'
            ),

        toggleEditable: () =>
            set(
                (state) => {
                    const newEditable = !state.editState.isEditable;

                    // 편집 모드 해제 시 (편집 → 뷰)
                    if (!newEditable) {
                        // store의 clearSelectionWithAlerts 액션 호출
                        get().actions.clearSelectionWithAlerts();
                        
                        // 저장되지 않은 변경사항 폐기
                        get().actions.clearPendingChanges();

                        // remountKey 증가시켜 컴포넌트 완전 리마운트
                        return {
                            editState: {
                                ...state.editState,
                                isEditable: newEditable,
                                currentMode: 'SELECT',
                                remountKey: state.editState.remountKey + 1,
                            },
                        };
                    }

                    // 편집 모드 진입 시 (뷰 → 편집)
                    return {
                        editState: {
                            ...state.editState,
                            isEditable: newEditable,
                        },
                    };
                },
                false,
                'doorMonitoring/toggleEditable'
            ),

        setContextMenuActive: (active) =>
            set(
                (state) => ({
                    editState: {
                        ...state.editState,
                        contextMenuActive: active,
                    },
                }),
                false,
                'doorMonitoring/setContextMenuActive'
            ),
    },
});
