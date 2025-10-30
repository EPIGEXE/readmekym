// 캔버스 관련 상수
export const MAX_CANVAS_WIDTH = 2500;
export const MAX_CANVAS_HEIGHT = 1500;
export const SCALE_MIN = 2; // 최소 줌 배율(원본이 2배 크기가 됨)
export const SCALE_MAX = 0.5; // 최대 줌 배율(원본이 0.5배 크기가 됨)

// 경보 상태 상수
export const ALERT_STATUS = {
    ACTIVE: 1, // 경보 중
    CLEARED: 0, // 종료됨
};

// 경보 상태별 스타일
export const ALERT_STATUS_CONFIG = {
    [ALERT_STATUS.ACTIVE]: {
        label: '경보',
        bgColor: 'bg-[var(--kendo-color-error-on-surface)]',
        textColor: 'text-white',
    },
    [ALERT_STATUS.CLEARED]: {
        label: '종료',
        bgColor: 'bg-gray-500',
        textColor: 'text-white',
    },
};