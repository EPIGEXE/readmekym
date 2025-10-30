import { MAX_CANVAS_HEIGHT, MAX_CANVAS_WIDTH, SCALE_MAX, SCALE_MIN } from "../../constants/dmConstants";
import { CHANGE_TYPE } from "./changesSlice";

// src/store/slice/backgroundImageSlice.js
export const createBackgroundImageSlice = (set, get) => ({
    // 상태
    backgroundImage: {
        image: null,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        scale: 1,
        contain: true,
        loading: false,
        error: null,
    },
    canvasScale: 1,
    stageSize: { width: 0, height: 0 },
    position: { x: 0, y: 0 },

    // 액션
    actions: {
        setPosition: ({ x, y }) =>
            set(
                (state) => ({
                    ...state,
                    position: { x, y },
                }),
                false,
                "doorMonitoring/setPosition"
            ),

        setCanvasScale: (scale) =>
            set(
                (state) => ({
                    ...state,
                    canvasScale: scale,
                }),
                false,
                "doorMonitoring/setCanvasScale"
            ),

        setBackgroundImageScale: (scale) =>
            set(
                (state) => ({
                    backgroundImage: {
                        ...state.backgroundImage,
                        scale,
                    },
                }),
                false,
                "doorMonitoring/setBackgroundImageScale"
            ),

        setBackgroundImage: (image, x, y, width, height, scale = 1, contain = true) => {
            set(
                (state) => ({
                    backgroundImage: {
                        ...state.backgroundImage,
                        image,
                        x,
                        y,
                        width,
                        height,
                        scale,
                        contain,
                    },
                }),
                false,
                "doorMonitoring/setBackgroundImage"
            );

            get().actions.addChange(get().selectedDoorMapCode, CHANGE_TYPE.BACKGROUND_IMAGE, get().backgroundImage);
        },

        setBackgroundImageWithoutChange: (image, x, y, width, height, scale = 1, contain = true) => {
            set(
                (state) => ({
                    backgroundImage: {
                        ...state.backgroundImage,
                        image,
                        x,
                        y,
                        width,
                        height,
                        scale,
                        contain,
                    },
                }),
                false,
                "doorMonitoring/setBackgroundImageWithoutChange"
            );
        },

        setStageSize: (size) =>
            set(
                (state) => ({
                    ...state,
                    stageSize: size,
                }),
                false,
                "doorMonitoring/setStageSize"
            ),

        clearBackgroundImage: () =>
            set(
                () => ({
                    backgroundImage: {
                        image: null,
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0,
                        scale: 1,
                        contain: true,
                        loading: false,
                        error: null,
                    },
                }),
                false,
                "doorMonitoring/clearBackgroundImage"
            ),

        getBoundedPosition: (pos, scale, customStageSize) => {
            const stageSize = customStageSize || get().stageSize;
            const stageWidth = stageSize.width;
            const stageHeight = stageSize.height;

            // 스케일이 적용된 캔버스 크기
            const scaledCanvasWidth = MAX_CANVAS_WIDTH * scale;
            const scaledCanvasHeight = MAX_CANVAS_HEIGHT * scale;

            // x축 제한
            let minX, maxX;
            if (scaledCanvasWidth <= stageWidth) {
                // 캔버스가 스테이지보다 작으면 중앙 정렬
                minX = maxX = (stageWidth - scaledCanvasWidth) / 2;
            } else {
                // 스테이지 크기에 맞춰 제한
                minX = -scaledCanvasWidth + stageWidth;
                maxX = 0;
            }

            // y축 제한
            let minY, maxY;
            if (scaledCanvasHeight <= stageHeight) {
                // 캔버스가 스테이지보다 작으면 중앙 정렬
                minY = maxY = (stageHeight - scaledCanvasHeight) / 2;
            } else {
                // 스테이지 크기에 맞춰 제한
                minY = -scaledCanvasHeight + stageHeight;
                maxY = 0;
            }

            return {
                x: Math.max(minX, Math.min(pos.x, maxX)),
                y: Math.max(minY, Math.min(pos.y, maxY)),
            };
        },

        focusBackgroundImage: (stageSize) => {
            const { backgroundImage } = get();

            if (!backgroundImage.image) return;

            // 스테이지 크기에 맞는 적절한 scale 계산
            const padding = 0.9;
            const scaleX = (stageSize.width * padding) / backgroundImage.width;
            const scaleY = (stageSize.height * padding) / backgroundImage.height;
            const newScale = Math.min(scaleX, scaleY);

            // 현재 위치에서 허용 가능한 최대 scale 계산
            const minScaleX = stageSize.width / MAX_CANVAS_WIDTH;
            const minScaleY = stageSize.height / MAX_CANVAS_HEIGHT;
            const minScale = Math.max(minScaleX, minScaleY);

            // 스케일 범위 제한
            const limitedScale = Math.max(Math.min(newScale, SCALE_MIN), Math.max(minScale, SCALE_MAX));

            const imageCenterX = backgroundImage.x + backgroundImage.width / 2;
            const imageCenterY = backgroundImage.y + backgroundImage.height / 2;

            // 스테이지 중심점 계산
            const stageCenterX = stageSize.width / 2;
            const stageCenterY = stageSize.height / 2;

            const newPos = {
                x: stageCenterX - imageCenterX * limitedScale,
                y: stageCenterY - imageCenterY * limitedScale,
            };

            // 새로운 scale로 경계 보정된 position 계산
            const boundedPos = get().actions.getBoundedPosition(newPos, limitedScale, stageSize);

            // 상태 업데이트
            set(
                (state) => ({
                    ...state,
                    canvasScale: limitedScale,
                    position: boundedPos,
                }),
                false,
                "doorMonitoring/focusBackgroundImage"
            );
        },

        // 위치와 스케일을 한 번에 설정하는 배치 액션
        setPositionAndScale: (position, canvasScale) => {
            set(
                (state) => ({
                    ...state,
                    position: position || state.position,
                    canvasScale: canvasScale || state.canvasScale,
                }),
                false,
                "doorMonitoring/setPositionAndScale"
            );
        },
    },
});
