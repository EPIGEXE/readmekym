import { Group, Path, Rect, Circle, RegularPolygon, Text, Transformer } from "react-konva";
import { memo, useEffect, useRef, useCallback } from "react";
import Konva from "konva";
import { SELECTION_PADDING, SHAPE_DIMENSIONS } from "./mapViewConst";

/**
 * 문 컴포넌트
 * @param {Object} door - 문 정보
 * @param {boolean} isEditable - 수정 가능 여부
 * @param {boolean} isSelected - 선택 여부
 * @param {boolean} draggable - 드래그 가능 여부
 * @param {function} onDragStart - 드래그 시작 함수
 * @param {function} onDragMove - 드래그 중 함수
 * @param {function} onDragEnd - 드래그 종료 함수
 * @param {function} onClick - 클릭 함수
 * @param {function} onTransformEnd - 변형 종료 함수
 * @param {Object} globalGrapicItemColor - 그래픽 아이템 색상
 * @param {Object} childAlertStatus - 하위 문 경고 상태
 *
 * 맵 뷰에서 문을 표시하는 컴포넌트
 * Konva를 사용하여 문을 표시하는 컴포넌트
 */
export const DoorComponent = memo(
    ({
        door,
        isEditable,
        isSelected,
        draggable,
        onDragStart,
        onDragMove,
        onDragEnd,
        onClick,
        onTransformEnd,
        globalGrapicItemColor,
        childAlertStatus,
    }) => {
        // ======================= useRef =============================
        // Konva에서 객체를 컨트롤할 때 리액트의 리렌더링을 최소화하기 위해 ref 사용
        const shapeRef = useRef(null); // 메인 도형 참조
        const transformRef = useRef(null); // 트랜스포머 참조(변형 컨트롤)
        const selectionRectRef = useRef(null); // 선택 테두리 참조
        const alertIconGroupRef = useRef(null); // 경고 아이콘 그룹 참조
        const subDoorIconGroupRef = useRef(null); // 하위 문 아이콘 그룹 참조
        const labelGroupRef = useRef(null); // 라벨 그룹 참조
        const alertEffectRectRef = useRef(null); // 경고 효과 참조
        const animationRef = useRef(null); // 애니메이션 참조

        // ======================= 기본 변수 =============================
        const fill = door.coordinate?.fill || globalGrapicItemColor.default || "#94a3b8"; // 기본 색상
        const alertFill = door.coordinate?.alertFill || globalGrapicItemColor.alert || "#cc0000"; // 경고 색상
        const checkedFill = door.coordinate?.checkedFill || globalGrapicItemColor.checked || "#34d399"; // 인지 색상
        const autoCheckedFill = door.coordinate?.autoCheckedFill || globalGrapicItemColor.autoChecked || "#60a5fa"; // 자동 인지 색상

        const shapeType = door.coordinate?.shape || "rect"; // 도형 유형
        const width = door.coordinate?.width || SHAPE_DIMENSIONS[shapeType]?.width || 40; // 너비
        const height = door.coordinate?.height || SHAPE_DIMENSIONS[shapeType]?.height || 10; // 높이
        const radius = door.coordinate?.radius || SHAPE_DIMENSIONS[shapeType]?.radius || 15; // 반지름
        const x = door.coordinate?.x || 0; // x 좌표
        const y = door.coordinate?.y || 0; // y 좌표

        // 적용 색상 정의 - 자신의 경보 또는 하위 경보가 있을 때 경보 색상 적용
        const fillColor =
            door.event_status === 1 || childAlertStatus?.hasActive
                ? alertFill
                : door.event_status === 2
                ? checkedFill
                : door.event_status === 3
                ? autoCheckedFill
                : fill;

        const strokeColor = (door.event_status === 1 || childAlertStatus?.hasActive) ? "#cc0000" : "#475569"; // 테두리 색상

        // 라벨 설정
        const doorName = door.name || "문"; // 문 이름
        const doorSubName = door.sub_name || ""; // 문 부 이름
        const labelBackgroundToggle =
            door.coordinate?.labelBackgroundToggle !== undefined ? door.coordinate.labelBackgroundToggle : true; // 라벨 배경 토글
        const labelPosition = door.coordinate?.labelPosition || "bottom"; // 라벨 위치
        const labelFontSize = door.coordinate?.labelFontSize || 12; // 라벨 폰트 크기
        const labelBackgroundColor = door.coordinate?.labelBackgroundColor; // 라벨 배경색
        const labelTextColor = door.coordinate?.labelTextColor; // 라벨 텍스트 색상

        // 텍스트 너비를 더 정확하게 계산하는 함수 (폰트 크기 고려)
        const calculateTextWidth = (text, fontSize = 12) => {
            let baseWidth = 0;
            for (let char of text) {
                if (/[0-9a-zA-Z]/.test(char)) {
                    baseWidth += 8; // 숫자, 영문
                } else if (/[\u3131-\u314e\u314f-\u3163\uac00-\ud7a3]/.test(char)) {
                    baseWidth += 12; // 한글
                } else if (char === " ") {
                    baseWidth += 4; // 공백
                } else {
                    baseWidth += 10; // 기타 문자
                }
            }
            // 폰트 크기에 따른 비율 적용 (12px 기준)
            const fontRatio = fontSize / 12;
            return baseWidth * fontRatio;
        };

        // 라벨 크기 계산 (부 이름 고려)
        const hasSubName = doorSubName && doorSubName.trim() !== "";
        const mainTextWidth = calculateTextWidth(doorName, labelFontSize);
        const subTextWidth = hasSubName ? calculateTextWidth(doorSubName, labelFontSize) : 0;
        const maxTextWidth = Math.max(mainTextWidth, subTextWidth);
        const textWidth = Math.max(50, maxTextWidth);

        const labelBgWidth = textWidth + 8; // 라벨 배경 너비 (패딩 증가)
        const labelBgHeight = hasSubName ? labelFontSize * 2 + 12 : labelFontSize + 8; // 부 이름 있으면 2줄 높이

        // ============================== useEffect 호출 함수 ==============================

        // 시각 요소 업데이트 함수
        // 선택 테두리, 경고 아이콘, 라벨 위치를 업데이트
        // 업데이트 시 ref를 사용해서 객체 직접 업데이트
        const updateVisualElementsDirect = useCallback(() => {
            if (!shapeRef.current) return;

            const shape = shapeRef.current;
            const stage = shape.getStage();
            if (!stage) return;

            // 실제 도형의 화면상 위치와 크기
            const box = shape.getClientRect();

            // 스테이지 좌표계로 변환
            const adjustedPoint = {
                x: (box.x - stage.x()) / stage.scaleX(),
                y: (box.y - stage.y()) / stage.scaleY(),
            };

            // 선택 테두리 업데이트
            if (isSelected && selectionRectRef.current) {
                selectionRectRef.current.x(adjustedPoint.x - SELECTION_PADDING);
                selectionRectRef.current.y(adjustedPoint.y - SELECTION_PADDING);
                selectionRectRef.current.width(box.width / stage.scaleX() + SELECTION_PADDING * 2);
                selectionRectRef.current.height(box.height / stage.scaleY() + SELECTION_PADDING * 2);
                selectionRectRef.current.visible(true);
            } else if (selectionRectRef.current) {
                selectionRectRef.current.visible(false);
            }

            // 경고 효과 업데이트 - 자신의 경보 또는 하위 경보가 있을 때 표시
            if (alertEffectRectRef.current && (door.event_status === 1 || childAlertStatus?.hasActive)) {
                alertEffectRectRef.current.x(adjustedPoint.x - SELECTION_PADDING);
                alertEffectRectRef.current.y(adjustedPoint.y - SELECTION_PADDING);
                alertEffectRectRef.current.width(box.width / stage.scaleX() + SELECTION_PADDING * 2);
                alertEffectRectRef.current.height(box.height / stage.scaleY() + SELECTION_PADDING * 2);
                alertEffectRectRef.current.visible(true);
            } else if (alertEffectRectRef.current) {
                alertEffectRectRef.current.visible(false);
            }

            // 하위 문 아이콘 업데이트
            if (door.childable === 1 && subDoorIconGroupRef.current) {
                const iconX = adjustedPoint.x + box.width / stage.scaleX() / 2 + 10;
                const iconY = adjustedPoint.y - SELECTION_PADDING;

                subDoorIconGroupRef.current.x(iconX);
                subDoorIconGroupRef.current.y(iconY);
                subDoorIconGroupRef.current.visible(true);

                // 하위 문 아이콘은 기본 색상 유지
                const backgroundRect = subDoorIconGroupRef.current.findOne("Rect");
                if (backgroundRect) {
                    backgroundRect.fill(isSelected ? "rgba(37, 99, 235, 0.1)" : "rgba(100, 116, 139, 0.1)");
                }

                const arrowPath = subDoorIconGroupRef.current.findOne("Path");
                if (arrowPath) {
                    arrowPath.stroke(isSelected ? "#2563eb" : "#64748b");
                    arrowPath.strokeWidth(1.5);
                }
            } else if (subDoorIconGroupRef.current) {
                subDoorIconGroupRef.current.visible(false);
            }

            // 경고 아이콘 업데이트 - 자신의 경보 또는 하위 경보가 있을 때 표시
            if (door.event_status === 1 || childAlertStatus?.hasActive) {
                const iconX = adjustedPoint.x + box.width / stage.scaleX() / 2;
                const iconY = adjustedPoint.y - SELECTION_PADDING;

                if (alertIconGroupRef.current) {
                    alertIconGroupRef.current.x(iconX);
                    alertIconGroupRef.current.y(iconY);
                    alertIconGroupRef.current.visible(true);
                }
            } else {
                if (alertIconGroupRef.current) alertIconGroupRef.current.visible(false);
            }

            // 라벨 위치 업데이트
            if (labelGroupRef.current) {
                // box를 사용하여 실제 도형의 위치와 크기 계산
                const boxWidth = box.width / stage.scaleX();
                const boxHeight = box.height / stage.scaleY();
                let labelX, labelY;

                // labelPosition에 따라 위치 계산
                switch (labelPosition) {
                    case "top":
                        labelX = adjustedPoint.x + boxWidth / 2;
                        labelY = adjustedPoint.y - labelBgHeight - 8;
                        break;
                    case "bottom":
                        labelX = adjustedPoint.x + boxWidth / 2;
                        labelY = adjustedPoint.y + boxHeight + 8;
                        break;
                    case "left":
                        labelX = adjustedPoint.x - labelBgWidth / 2 - 8;
                        labelY = adjustedPoint.y + boxHeight / 2 - labelBgHeight / 2;
                        break;
                    case "right":
                        labelX = adjustedPoint.x + boxWidth + labelBgWidth / 2 + 8;
                        labelY = adjustedPoint.y + boxHeight / 2 - labelBgHeight / 2;
                        break;
                    case "center":
                        labelX = adjustedPoint.x + boxWidth / 2;
                        labelY = adjustedPoint.y + boxHeight / 2;
                        break;
                    default:
                        labelX = adjustedPoint.x + boxWidth / 2;
                        labelY = adjustedPoint.y + boxHeight + 8;
                        break;
                }

                // 업데이트된 실제 위치 적용
                labelGroupRef.current.x(labelX);
                labelGroupRef.current.y(labelY);
            }

            // 레이어 즉시 업데이트
            const layer = shape.getLayer();
            if (layer) {
                layer.batchDraw();
            }
        }, [
            isSelected,
            door.event_status,
            shapeType,
            width,
            height,
            radius,
            x,
            y,
            labelPosition,
            labelBgWidth,
            labelBgHeight,
            labelBackgroundToggle,
            childAlertStatus,
            door.childable,
        ]);

        // ============================== useEffect ==============================
        // 포지션 변경 이벤트 리스너 등록
        useEffect(() => {
            if (!shapeRef.current) return;

            // 포지션 변경 이벤트 리스너 등록
            const shape = shapeRef.current;
            shape.on("positionChanged", updateVisualElementsDirect);

            return () => {
                // 컴포넌트 언마운트 시 이벤트 리스너 제거
                if (shape) {
                    shape.off("positionChanged");
                }
            };
        }, [updateVisualElementsDirect]);

        // 트랜스포머와 도형 연결
        useEffect(() => {
            if (isSelected && transformRef.current && shapeRef.current) {
                transformRef.current.nodes([shapeRef.current]);
                transformRef.current.getLayer().batchDraw();
            }
            updateVisualElementsDirect();
        }, [isSelected, isEditable, updateVisualElementsDirect]);

        // 객체 선택 시 선택 테두리 애니메이션 설정
        useEffect(() => {
            // 이전 애니메이션 정리
            if (animationRef.current) {
                animationRef.current.stop();
                animationRef.current = null;
            }

            // 애니메이션이 필요한지 체크
            if (!isSelected || !shapeRef.current) return;

            const layer = shapeRef.current.getLayer();
            if (!layer) return;

            // 연속적인 애니메이션을 위한 로컬 변수
            let dashOffsetValue = 0;

            // 대시 패턴 설정 - 더 긴 패턴으로 변경
            if (selectionRectRef.current) {
                selectionRectRef.current.dash([4, 3]);
            }

            // 애니메이션 정의
            animationRef.current = new Konva.Animation((frame) => {
                let needsUpdate = false;

                // 프레임 제한 (60fps 이하로 제한)
                if (frame.timeDiff < 15) {
                    // 약 60fps (1000ms/60 ≈ 16.7ms)
                    return false;
                }

                if (isSelected && selectionRectRef.current) {
                    // 속도를 약간 높임 (0.005에서 0.008로)
                    dashOffsetValue += frame.timeDiff * 0.015;

                    // 값 제한
                    if (dashOffsetValue > 1000) dashOffsetValue = 0;

                    // 대시 오프셋 적용 (패턴 길이에 맞게 모듈로 연산 조정)
                    selectionRectRef.current.dashOffset(dashOffsetValue % 7); // 4+3=7
                    needsUpdate = true;
                }

                // 실제 변화가 있을 때만 true 반환
                return needsUpdate;
            }, layer);

            // 애니메이션 시작
            animationRef.current.start();

            // 정리 함수
            return () => {
                if (animationRef.current) {
                    animationRef.current.stop();
                }
                if (shapeRef.current) {
                    shapeRef.current.clearCache();
                }
            };
        }, [isSelected]);

        // 속성 변경 감지 및 업데이트
        useEffect(() => {
            updateVisualElementsDirect();
        }, [door, shapeType, width, height, radius, x, y, updateVisualElementsDirect]);

        // ============================== 변경(크기) 이벤트 핸들러 ==============================
        // 변형 이벤트 핸들러
        const handleTransform = () => {
            // 변형 중에 실시간으로 업데이트
            updateVisualElementsDirect();
        };

        // 변형 종료 이벤트 핸들러
        const handleTransformEnd = (e) => {
            if (!shapeRef.current) return;

            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            // 스케일 리셋
            node.scaleX(1);
            node.scaleY(1);

            // 새 크기와 위치 계산
            let newProps = {};

            if (shapeType === "rect") {
                const oldWidth = node.width();
                const oldHeight = node.height();

                const newWidth = Math.max(10, oldWidth * scaleX);
                const newHeight = Math.max(5, oldHeight * scaleY);

                newProps = {
                    width: newWidth,
                    height: newHeight,
                };
            } else if (shapeType === "circle" || shapeType === "triangle") {
                const oldRadius = node.radius();
                const avgScale = (scaleX + scaleY) / 2;
                const newRadius = oldRadius * avgScale;

                newProps = { radius: newRadius };
            }

            // 상위 컴포넌트에 통보
            if (onTransformEnd) {
                onTransformEnd(door.code, {
                    ...newProps,
                    x: node.x(),
                    y: node.y(),
                });
            }

            // UI 업데이트
            updateVisualElementsDirect();
        };

        // ============================== 드래그 이벤트 핸들러 ==============================
        // 드래그 이벤트 핸들러
        const handleDragMove = (e) => {
            // 드래그 중에 실시간으로 업데이트
            updateVisualElementsDirect();
            if (onDragMove) onDragMove(e);
        };

        // 드래그 종료 이벤트 핸들러
        const handleDragEnd = (e) => {
            updateVisualElementsDirect();
            if (onDragEnd) onDragEnd(e);
        };

        // ============================== 마우스 이벤트 핸들러 ==============================
        // 마우스 Hover 이벤트 핸들러
        const handleMouseEnter = (e) => {
            const container = e.target.getStage().container();
            // doorId가 'new-'로 시작하는 경우 pointer 커서 제외
            container.style.cursor = (door.childable === 1 && !door.code.startsWith('new-')) ? "pointer" : "default";
        };

        // 마우스 Leave 이벤트 핸들러
        const handleMouseLeave = (e) => {
            const container = e.target.getStage().container();
            container.style.cursor = "default";
        };

        // ============================== 렌더링 ==============================
        // 메인 도형 렌더링
        const renderMainShape = () => {
            // 메인 도형 공통 속성
            const mainShapeProps = {
                id: `door-${door.code}`,
                ref: shapeRef,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: 1.5,
                strokeScaleEnabled: false,
                draggable,
                onDragStart,
                onMouseEnter: handleMouseEnter,
                onMouseLeave: handleMouseLeave,
                onDragMove: handleDragMove,
                onDragEnd: handleDragEnd,
                onClick,
                onTransform: handleTransform,
                onTransformEnd: handleTransformEnd,
            };

            switch (shapeType) {
                case "circle":
                    return <Circle x={x} y={y} radius={radius || SHAPE_DIMENSIONS.circle.radius} {...mainShapeProps} />;
                case "triangle":
                    return (
                        <RegularPolygon
                            x={x}
                            y={y}
                            sides={3}
                            radius={radius || SHAPE_DIMENSIONS.triangle.radius}
                            {...mainShapeProps}
                        />
                    );
                case "rect":
                default:
                    return (
                        <Rect
                            x={x}
                            y={y}
                            width={width || SHAPE_DIMENSIONS.rect.width}
                            height={height || SHAPE_DIMENSIONS.rect.height}
                            offsetX={(width || SHAPE_DIMENSIONS.rect.width) / 2}
                            offsetY={(height || SHAPE_DIMENSIONS.rect.height) / 2}
                            cornerRadius={2}
                            {...mainShapeProps}
                        />
                    );
            }
        };

        // ============================== 유틸 함수 ==============================
        // 라벨 위치 계산 함수
        const getLabelPosition = () => {
            let labelX = x;
            let labelY = y;

            const shapeWidth = shapeType === "rect" ? width || 40 : (radius || 15) * 2;
            const shapeHeight = shapeType === "rect" ? height || 10 : (radius || 15) * 2;

            switch (labelPosition) {
                case "top":
                    labelY = y - shapeHeight / 2 - labelBgHeight - 8;
                    break;
                case "bottom":
                    labelY = y + shapeHeight / 2 + 8;
                    break;
                case "left":
                    labelX = x - shapeWidth / 2 - labelBgWidth / 2 - 8;
                    labelY = y;
                    break;
                case "right":
                    labelX = x + shapeWidth / 2 + labelBgWidth / 2 + 8;
                    labelY = y;
                    break;
                case "center":
                    // 중앙에 배치
                    break;
                default:
                    labelY = y + shapeHeight / 2 + 8;
                    break;
            }

            return { x: labelX, y: labelY };
        };

        return (
            <>
                <Rect
                    ref={alertEffectRectRef}
                    fill="transparent"
                    stroke="#ff0000"
                    strokeWidth={1.5}
                    opacity={0.5}
                    x={0}
                    y={0}
                    width={0}
                    height={0}
                    cornerRadius={3}
                    visible={false}
                />

                {/* 선택 테두리를 항상 렌더링하고 visible 속성으로 표시/숨김 */}
                <Rect
                    ref={selectionRectRef}
                    x={0}
                    y={0}
                    width={0}
                    height={0}
                    stroke="#2563eb"
                    strokeWidth={2}
                    dash={[4, 3]}
                    dashOffset={0}
                    opacity={1}
                    listening={false}
                    fill="rgba(37, 99, 235, 0.1)"
                    cornerRadius={3}
                    visible={false}
                />

                {/* 메인 도형 */}
                {renderMainShape()}

                {/* 하위 문 아이콘 항상 렌더링하고 visible 속성으로 표시/숨김 */}
                <Group ref={subDoorIconGroupRef} listening={false} visible={false}>
                    <Rect
                        width={10}
                        height={10}
                        cornerRadius={5}
                        offsetX={5}
                        offsetY={5}
                        fill={isSelected ? "rgba(37, 99, 235, 0.1)" : "rgba(100, 116, 139, 0.1)"}
                    />
                    <Path
                        data="M-3 0 L0 3 L3 0"
                        stroke={isSelected ? "#2563eb" : "#64748b"}
                        offsetX={0}
                        offsetY={0}
                        strokeWidth={1.5}
                        lineCap="round"
                        lineJoin="round"
                    />
                </Group>

                {/* 경고 아이콘 항상 렌더링하고 visible 속성으로 표시/숨김 */}
                <Group ref={alertIconGroupRef} listening={false} visible={false}>
                    <Rect
                        width={10}
                        height={10}
                        offsetX={5}
                        offsetY={5}
                        fill="#ff0000"
                        cornerRadius={5}
                        opacity={0.7}
                    />
                    <Text
                        text="!"
                        width={10}
                        height={10}
                        fontSize={8}
                        fontStyle="bold"
                        fill="white"
                        offsetX={5}
                        offsetY={5}
                        align="center"
                        verticalAlign="middle"
                    />
                </Group>

                {/* 트랜스포머 */}
                {isSelected && isEditable && (
                    <Transformer
                        ref={transformRef}
                        anchorSize={8}
                        anchorCornerRadius={3}
                        anchorStrokeWidth={1.5}
                        borderStrokeWidth={1.5}
                        borderDash={[4, 3]}
                        borderStroke="#2563eb"
                        anchorStroke="#2563eb"
                        anchorFill="#fff"
                        rotateEnabled={false}
                        centeredScaling={false}
                        enabledAnchors={
                            shapeType === "rect"
                                ? [
                                      "top-left",
                                      "top-right",
                                      "bottom-left",
                                      "bottom-right",
                                      "middle-left",
                                      "middle-right",
                                      "top-center",
                                      "bottom-center",
                                  ]
                                : ["top-left", "top-right", "bottom-left", "bottom-right"]
                        }
                        boundBoxFunc={(oldBox, newBox) => {
                            if (newBox.width < 10 || newBox.height < 5) {
                                return oldBox;
                            }
                            return newBox;
                        }}
                    />
                )}

                {/* 라벨 */}
                <Group ref={labelGroupRef} x={getLabelPosition().x} y={getLabelPosition().y} listening={false}>
                    <Rect
                        width={labelBgWidth}
                        height={labelBgHeight}
                        offsetX={labelBgWidth / 2}
                        offsetY={labelPosition === "center" ? labelBgHeight / 2 : 0}
                        fill={labelBackgroundColor || (door.event_status === 1 || childAlertStatus?.hasActive ? "#FFF5F5" : "#FFFFFF")}
                        cornerRadius={3}
                        visible={labelBackgroundToggle}
                    />
                    {hasSubName ? (
                        <>
                            {/* 메인 이름 */}
                            <Text
                                text={doorName}
                                x={0}
                                y={labelPosition === "center" ? -labelBgHeight / 2 + 6 : 4}
                                width={labelBgWidth}
                                offsetX={labelBgWidth / 2}
                                align="center"
                                fontSize={labelFontSize}
                                fontFamily="'Pretendard', 'Noto Sans KR', sans-serif"
                                fill={
                                    labelTextColor ||
                                    (door.event_status === 1 || childAlertStatus?.hasActive ? "#cc0000" : isSelected ? "#2563eb" : "#333")
                                }
                                ellipsis={true}
                            />
                            {/* 부 이름 */}
                            <Text
                                text={doorSubName}
                                x={0}
                                y={
                                    labelPosition === "center"
                                        ? -labelBgHeight / 2 + labelFontSize + 10
                                        : labelFontSize + 8
                                }
                                width={labelBgWidth}
                                offsetX={labelBgWidth / 2}
                                align="center"
                                fontSize={labelFontSize}
                                fontFamily="'Pretendard', 'Noto Sans KR', sans-serif"
                                fill={
                                    labelTextColor ||
                                    (door.event_status === 1 || childAlertStatus?.hasActive ? "#cc0000" : isSelected ? "#2563eb" : "#666")
                                }
                                ellipsis={true}
                            />
                        </>
                    ) : (
                        /* 메인 이름만 */
                        <Text
                            text={doorName}
                            width={labelBgWidth}
                            height={labelBgHeight}
                            offsetX={labelBgWidth / 2}
                            offsetY={labelPosition === "center" ? labelBgHeight / 2 : 0}
                            align="center"
                            verticalAlign="middle"
                            fontSize={labelFontSize}
                            fontFamily="'Pretendard', 'Noto Sans KR', sans-serif"
                            fill={
                                labelTextColor ||
                                (door.event_status === 1 || childAlertStatus?.hasActive ? "#cc0000" : isSelected ? "#2563eb" : "#333")
                            }
                            padding={4}
                            ellipsis={true}
                        />
                    )}
                </Group>
            </>
        );
    }
);
