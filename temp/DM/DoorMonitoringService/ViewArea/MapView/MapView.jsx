import { Layer, Rect, Stage, Image as KonvaImage } from "react-konva";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { DoorComponent } from "./DoorComponent";
import { useDrop } from "react-dnd";
import useDoorMonitoringStore from "../../../store/doorMonitoringStoreIndex";
import { ItemTypes } from "../../../constants/dndTypes";
import { BackgroundImageProperties } from "./BackgroungImageProperties";
import { useResizeObserver } from "../../../hooks/useResizeObserver";
import { useMapBackground } from "../../../hooks/reactQueryHooks/useMapBackgroundImageApi";
import { useKonvaObjectSelection } from "../../../hooks/useKonvaObjectSelection";
import { useKonvaObjectDrag } from "../../../hooks/useKonvaObjectDrag";
import { MAX_CANVAS_HEIGHT, MAX_CANVAS_WIDTH } from "../../../constants/dmConstants";
import { useDoorTypeList } from "../../../hooks/reactQueryHooks/useDoorTypeApi";
import useDoorMonitoringGlobalStore from "../../../store/doorMonitoringGlobalStore";
import { calculateChildAlertStatus } from "../../../utils/alertUtils";
import { Loader } from "@progress/kendo-react-indicators";

// 캔버스 관련 상수
const SCALE_MIN = 2; // 최소 줌 배율(원본이 2배 크기가 됨)
const SCALE_MAX = 0.5; // 최대 줌 배율(원본이 0.5배 크기가 됨)

/**
 * 맵 뷰 영역 컴포넌트
 *
 * Konva를 이용한 맵뷰 영역 컴포넌트
 */
const MapView = () => {
    // ======================= 전역 상태 =============================
    // 문 모니터링 상태
    const editState = useDoorMonitoringStore((state) => state.editState); // 수정 관련 상태
    const backgroundImage = useDoorMonitoringStore((state) => state.backgroundImage); // 배경 이미지 상태
    const canvasScale = useDoorMonitoringStore((state) => state.canvasScale); // 캔버스 줌 상태
    const selectedDoorCodeList = useDoorMonitoringStore((state) => state.selectedDoorCodeList); // 선택한 문 ID 목록
    const selectedDoorMapCode = useDoorMonitoringStore((state) => state.selectedDoorMapCode); // 현재 표시되는 문(맵) ID
    const mapDisplayDoorList = useDoorMonitoringStore((state) => state.mapDisplayDoorList); // 맵뷰에서 표시되는 문 목록
    const position = useDoorMonitoringStore((state) => state.position); // 화면 위치 상태
    const stageSize = useDoorMonitoringStore((state) => state.stageSize); // 스테이지 크기 상태
    const isMapViewLoading = useDoorMonitoringStore((state) => state.isMapViewLoading); // 맵뷰 로딩 상태

    // 문 모니터링 액션
    const setBackgroundImage = useDoorMonitoringStore((state) => state.actions.setBackgroundImage); // 배경 이미지 설정
    const setBackgroundImageWithoutChange = useDoorMonitoringStore(
        (state) => state.actions.setBackgroundImageWithoutChange
    ); // 배경 이미지 설정
    const setPositionAndScale = useDoorMonitoringStore((state) => state.actions.setPositionAndScale); // 위치와 스케일 일괄 설정
    const setPosition = useDoorMonitoringStore((state) => state.actions.setPosition); // 화면 위치 설정
    const clearBackgroundImage = useDoorMonitoringStore((state) => state.actions.clearBackgroundImage); // 배경 이미지 제거
    const getBoundedPosition = useDoorMonitoringStore((state) => state.actions.getBoundedPosition); // 배경 이미지 위치 제한
    const setStageSize = useDoorMonitoringStore((state) => state.actions.setStageSize); // 스테이지 크기 설정
    const focusBackgroundImage = useDoorMonitoringStore((state) => state.actions.focusBackgroundImage); // 배경 이미지 포커스
    const setCanvasScale = useDoorMonitoringStore((state) => state.actions.setCanvasScale); // 캔버스 줌 상태 설정
    const addConnectedDoorToAlert = useDoorMonitoringStore((state) => state.actions.addConnectedDoorToAlert); // 경보에 연결된 문 추가
    const applySelectedDoorWithAlertsById = useDoorMonitoringStore(
        (state) => state.actions.applySelectedDoorWithAlertsById
    ); // 선택된 문에 경보 적용
    const applyMapDisplayDoorList = useDoorMonitoringStore((state) => state.actions.applyMapDisplayDoorList); // 맵뷰에서 표시되는 문 목록 설정
    const clearSelectionWithAlerts = useDoorMonitoringStore((state) => state.actions.clearSelectionWithAlerts); // 선택 영역 초기화
    const addMapDisplayDoor = useDoorMonitoringStore((state) => state.actions.addMapDisplayDoor); // 맵뷰에 문 추가
    const toggleSelection = useDoorMonitoringStore((state) => state.actions.toggleSelection); // 선택 영역 토글
    const applyMapViewById = useDoorMonitoringStore((state) => state.actions.applyMapViewById); // 맵뷰에서 문 선택
    const deleteDoorsAndUpdateAlerts = useDoorMonitoringStore((state) => state.actions.deleteDoorsAndUpdateAlerts); // 선택된 문 삭제
    const setMapViewLoading = useDoorMonitoringStore((state) => state.actions.setMapViewLoading); // 맵뷰 로딩 상태 설정
    const setDoorTypeList = useDoorMonitoringStore((state) => state.actions.setDoorTypeList); // 문 타입 목록 설정

    // 전역 속성 상태
    const { globalGrapicItemColor } = useDoorMonitoringGlobalStore((state) => state.doorMonitoringGlobal); // 전역 그래픽 색상
    const dmConfig = useDoorMonitoringGlobalStore((state) => state.dmConfig);

    // ============================== useRef ==============================
    // 캔버스 참조, Konva 네이티브 기능을 사용하기 위해 많이 사용됨 (리액트의 렌더링과 겹치면 안되는 기능들)
    const stageRef = useRef(null);
    const containerRef = useRef(null); // MapView 크기를 맞추기 위한 컨테이너 참조

    // ============================== 콜백 함수 ==============================
    // 영역 선택 종료 후 호출되는 함수 useKonvaObjectSelection의 콜백 함수
    const handleAreaSelectionEnd = (e, selectionBox) => {
        const { x, y, width: absWidth, height: absHeight } = selectionBox;

        // 선택 영역 내 문 찾기
        const doorsInSelection = mapDisplayDoorList.filter((door) => {
            const doorBox = {
                x: door.coordinate.x,
                y: door.coordinate.y,
                width: 40,
                height: 10,
            };

            // 충돌 검사
            return !(
                doorBox.x > x + absWidth ||
                doorBox.x + doorBox.width < x ||
                doorBox.y > y + absHeight ||
                doorBox.y + doorBox.height < y
            );
        });

        // 선택된 문 업데이트
        if (doorsInSelection.length > 0) {
            if (!e.evt.shiftKey) {
                applySelectedDoorWithAlertsById(doorsInSelection.map((door) => door.code));
            } else {
                const currentSelected = selectedDoorCodeList;
                const newIds = doorsInSelection
                    .map((door) => door.code)
                    .filter((code) => !currentSelected.includes(code));

                applySelectedDoorWithAlertsById([...currentSelected, ...newIds]);
            }
        }
    };

    // 드래그가 완료된 후에 상태 업데이트 함수 useKonvaObjectDrag의 콜백 함수
    const handleDragComplete = (updatedDoors) => {
        // 드래그가 완료된 후에만 상태 업데이트
        const updatedDoorList = mapDisplayDoorList.map((door) => {
            const updatedDoor = updatedDoors.find((d) => d.code === door.code);
            if (updatedDoor) {
                return {
                    ...door,
                    coordinate: {
                        ...door.coordinate,
                        x: updatedDoor.coordinate.x,
                        y: updatedDoor.coordinate.y,
                    },
                };
            }
            return door;
        });

        applyMapDisplayDoorList(updatedDoorList);
    };

    // 경보 카드 드롭 시 문 생성 useDrop의 drop 콜백 함수
    const handleCreateDoorFromAlert = (alertData, dropClientOffset, selectedDoorMapCode) => {
        if (!stageRef.current) return;
        const stage = stageRef.current;

        // 가상 이벤트 객체 생성
        // IMPORTANT: Konva의 Stage가 문을 생성할 좌표를 얻어야하는데
        // react-dnd 드래그앤드롭 이벤트에서 전달하는 이벤트로는 Konva의 stage가 마우스 포인터 위치를 알 수 없음
        // 따라서 가상 이벤트 위치 객체를 생성하여 포인터 위치를 stage에 알려줌
        const fakeEvent = {
            clientX: dropClientOffset.x,
            clientY: dropClientOffset.y,
            preventDefault: () => {},
        };

        // 마우스 위치를 stage에 알려줌
        stage.setPointersPositions(fakeEvent);

        // 이제 Konva는 마우스 위치를 알게 되었으므로 getRelativePointerPosition 사용 가능
        const { x, y } = stage.getRelativePointerPosition();

        let areaCodeList = [];

        if (dmConfig.areaList.length > 0) {
            areaCodeList = dmConfig.areaList.map((area) => area.value);
        }

        const initialProps = {
            code: `new-${crypto.randomUUID().toString()}`,
            name: alertData.name + " 문",
            parent_code: selectedDoorMapCode,
            event_code: alertData.code,
            area_code_list: areaCodeList || [],
        };

        addMapDisplayDoor(x, y, initialProps);

        addConnectedDoorToAlert(alertData.code, initialProps);

        applySelectedDoorWithAlertsById([initialProps.code]);
    };

    // ============================== Hooks ==============================
    // Konva 객체 선택 훅
    const { handleSelectionStart, handleSelectionMove, handleSelectionEnd } = useKonvaObjectSelection(
        stageRef,
        handleAreaSelectionEnd
    );

    // Konva 객체 드래그 훅
    const { handleDragStart, handleDragMove, handleDragEnd } = useKonvaObjectDrag(handleDragComplete, stageRef);

    // Reat D&D의 드롭 훅
    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: ItemTypes.ALERT_CARD,
            drop: (item, monitor) => {
                const dropClientOffset = monitor.getClientOffset();
                if (dropClientOffset) {
                    handleCreateDoorFromAlert(item.alertData, dropClientOffset, selectedDoorMapCode);
                }
                return { dropped: true };
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
        }),
        [selectedDoorMapCode]
    );

    // 컨테이너 크기에 따라 캔버스 크기 조절, 배경 이미지 크기 조절 등에 사용
    const { width, height } = useResizeObserver(containerRef);

    // 자동 저장 훅
    // 변경 사항을 감지하는 전역 상태를 참조하여 MapView의 문 생성, 수정 삭제를 자동 저장
    // useDoorSave();

    // =========================== 쿼리 훅 ===========================
    // Get
    const { data: mapBackgroundData } = useMapBackground(selectedDoorMapCode, {
        enabled: !!selectedDoorMapCode,
    }); // 맵 배경 데이터 조회
    const { data: doorTypeList } = useDoorTypeList(); // 문 타입 목록 조회

    // ============================= 상태 관리 =============================

    // 컨텍스트 메뉴 관련 상태
    // 현재 컨텍스트 메뉴는 추가하지 않지만 나중을 위해 남겨 놓음
    const [contextMenuType, setContextMenuType] = useState("stage");
    const [contextMenuProps, setContextMenuProps] = useState({ x: 0, y: 0 });

    // 더블 클릭 체크 타이머
    // 객체 더블 클릭을 판단하는 상태임
    const [lastClickTime, setLastClickTime] = useState(0);
    const [lastClickDoorId, setLastClickDoorId] = useState(null);

    // 복사 붙여넣기 상태
    const [copiedDoors, setCopiedDoors] = useState([]);
    const [copyOriginPosition, setCopyOriginPosition] = useState({ x: 0, y: 0 });


    // =============================== useEffect ===============================
    
    // MapView 컴포넌트 로딩 제어: selectedDoorMapCode 변경 시 로딩 시작
    useEffect(() => {
        console.log(`[MapLoading] MapView - selectedDoorMapCode 변경: ${selectedDoorMapCode}`);
        
        if (selectedDoorMapCode) {
            console.log(`[MapLoading] 로딩 시작 - doorId: ${selectedDoorMapCode}`);
            setMapViewLoading(true);
        }
        
        // cleanup 함수: 컴포넌트 언마운트 또는 의존성 변경 시 로딩 종료
        return () => {
            console.log(`[MapLoading] MapView cleanup - 로딩 상태 초기화`);
            setMapViewLoading(false);
        };
    }, [selectedDoorMapCode]);
    
    // 컨테이너 크기 변경 시에 맞춰 캔버스 크기 조절
    useEffect(() => {
        if (width === 0 || height === 0) return;

        setStageSize({ width, height });

        if (backgroundImage.image) {
            focusBackgroundImage({ width, height });
        } else {
            // 배경 이미지가 없는 경우에만 position 보정
            const boundedPos = getBoundedPosition(position, canvasScale, { width, height });
            if (boundedPos.x !== position.x || boundedPos.y !== position.y) {
                setPosition(boundedPos);
            }
        }
    }, [width, height]);

    // 배경 이미지 로드
    useEffect(() => {
        // 데이터가 없으면 대기
        if (mapBackgroundData === undefined) {
            return;
        }
        
        const loadingStartTime = Date.now();
        const MIN_LOADING_TIME = 500;
        
        if (!mapBackgroundData?.backgroundImage?.dataUrl) {
            clearBackgroundImage();

            // 배경 이미지가 없고 문들이 있는 경우 중앙에 맞추기
            if (mapDisplayDoorList && mapDisplayDoorList.length > 0 && width > 0 && height > 0) {
                const boundingBox = calculateDoorsBoundingBox(mapDisplayDoorList);
                if (boundingBox) {
                    const { scale, position: newPos } = calculateFitToScreen(boundingBox, { width, height });
                    
                    // 계산된 위치를 경계 내로 보정
                    const boundedPos = getBoundedPosition(newPos, scale, { width, height });
                    setPositionAndScale(boundedPos, scale);
                }
            } else {
                // 문이 없는 경우 현재 위치만 보정
                const boundedPos = getBoundedPosition(position, canvasScale, { width, height });
                if (boundedPos.x !== position.x || boundedPos.y !== position.y) {
                    setPosition(boundedPos);
                }
            }
            
            // 배경 이미지가 없는 경우 최소 로딩 시간 후 로딩 완료
            console.log(`[MapLoading] 배경 이미지 없음 - 로딩 완료`);
            const processingTime = Date.now() - loadingStartTime;
            const remainingTime = Math.max(0, MIN_LOADING_TIME - processingTime);
            setTimeout(() => {
                setMapViewLoading(false);
            }, remainingTime);
            return;
        }

        const imgElement = new window.Image();
        imgElement.src = mapBackgroundData.backgroundImage.dataUrl;

        imgElement.onload = () => {
            // 이미지 로드 완료 시 한번에 처리
            const initialImage = {
                image: imgElement,
                x: mapBackgroundData.x || 0,
                y: mapBackgroundData.y || 0,
                width: mapBackgroundData.backgroundImage.width || imgElement.width,
                height: mapBackgroundData.backgroundImage.height || imgElement.height,
                scale: mapBackgroundData.backgroundImage.scale || 0.5,
                contain: mapBackgroundData.backgroundImage.contain || false,
            };

            // 먼저 배경 이미지 설정 (위치 계산을 위해)
            setBackgroundImageWithoutChange(
                imgElement,
                initialImage.x,
                initialImage.y,
                initialImage.width,
                initialImage.height,
                initialImage.scale,
                initialImage.contain
            );
            
            // 배경 이미지 포커스 계산 (로딩 중에 처리)
            if (width > 0 && height > 0) {
                focusBackgroundImage({ width, height });
            }
            
            // 모든 계산이 완료된 후 최소 로딩 시간 체크 후 로딩 종료
            console.log(`[MapLoading] 배경 이미지 로드 및 위치 계산 완료 - 로딩 종료`);
            const processingTime = Date.now() - loadingStartTime;
            const remainingTime = Math.max(0, MIN_LOADING_TIME - processingTime);
            setTimeout(() => {
                setMapViewLoading(false);
            }, remainingTime);
        };

        imgElement.onerror = () => {
            // 이미지 로드 실패 시 에러 처리 및 최소 로딩 시간 후 로딩 종료
            console.error(`[MapLoading] 배경 이미지 로드 실패 - 로딩 종료`);
            const processingTime = Date.now() - loadingStartTime;
            const remainingTime = Math.max(0, MIN_LOADING_TIME - processingTime);
            setTimeout(() => {
                setMapViewLoading(false);
            }, remainingTime);
        };
    }, [mapBackgroundData]);

    // 모드 전환시 로직
    useEffect(() => {
        // 배경 이미지 모드 전환시 선택 객체 초기화
        if (editState.currentMode === "BACKGROUND_IMAGE") {
            clearSelectionWithAlerts();
        }
    }, [editState.currentMode]);

    // ============================== 복사 붙여넣기 함수 ==============================
    // 복사 기능 (Ctrl+C)
    const handleCopyDoors = useCallback(() => {
        if (selectedDoorCodeList.length === 0) return;

        const doorsToCopy = mapDisplayDoorList.filter((door) => selectedDoorCodeList.includes(door.code));

        if (doorsToCopy.length === 0) return;

        // 선택된 문들의 최소 x, y 좌표 찾기 (왼쪽 위 모서리)
        const minX = Math.min(...doorsToCopy.map((door) => door.coordinate?.x || 0));
        const minY = Math.min(...doorsToCopy.map((door) => door.coordinate?.y || 0));

        setCopiedDoors(doorsToCopy);
        setCopyOriginPosition({ x: minX, y: minY });
    }, [selectedDoorCodeList, mapDisplayDoorList]);

    // 붙여넣기 기능 (Ctrl+V)
    const handlePasteDoors = useCallback(() => {
        if (copiedDoors.length === 0 || !stageRef.current) return;

        const stage = stageRef.current;
        const pointerPosition = stage.getPointerPosition();

        if (!pointerPosition) return;

        // 상대 좌표 계산
        const relativePosition = stage.getRelativePointerPosition();
        const pasteX = relativePosition.x;
        const pasteY = relativePosition.y;

        // 왼쪽 위 모서리를 기준으로 새로운 위치에 배치
        const offsetX = pasteX - copyOriginPosition.x;
        const offsetY = pasteY - copyOriginPosition.y;

        const newDoors = [];
        const newDoorCodes = [];

        copiedDoors.forEach((door) => {
            const newDoorCode = `new-${crypto.randomUUID()}`;
            const newX = (door.coordinate?.x || 0) + offsetX;
            const newY = (door.coordinate?.y || 0) + offsetY;

            let areaCodeList = [];
            if (dmConfig.areaList.length > 0) {
                areaCodeList = dmConfig.areaList.map((area) => area.value);
            }

            const { childs, ...doorWithoutChilds } = door;
            const newDoorProps = {
                ...doorWithoutChilds,
                code: newDoorCode,
                name: door.name,
                sub_name: door.sub_name,
                parent_code: selectedDoorMapCode,
                area_code_list: door.area_code_list || areaCodeList,
                coordinate: {
                    ...door.coordinate,
                    x: newX,
                    y: newY,
                },
            };

            newDoors.push(newDoorProps);
            newDoorCodes.push(newDoorCode);

            // 새로운 문을 맵에 추가
            addMapDisplayDoor(newX, newY, newDoorProps);

            // 경보와 연결된 문이면 경보에도 추가
            if (door.event_code) {
                addConnectedDoorToAlert(door.event_code, newDoorProps);
            }
        });

        // 붙여넣기한 문들을 선택 상태로 변경
        applySelectedDoorWithAlertsById(newDoorCodes);
    }, [
        copiedDoors,
        copyOriginPosition,
        selectedDoorMapCode,
        dmConfig.areaList,
        addMapDisplayDoor,
        addConnectedDoorToAlert,
        applySelectedDoorWithAlertsById,
    ]);

    // 키보드 이벤트 핸들러 추가
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!editState.isEditable) return; // 수정 모드가 아니면 무시

            // Delete 키: 선택된 문 삭제
            if (e.key === "Delete" && selectedDoorCodeList.length > 0) {
                deleteDoorsAndUpdateAlerts();
            }
            // Ctrl+C: 복사
            else if (e.ctrlKey && e.key === "c" && selectedDoorCodeList.length > 0) {
                e.preventDefault();
                handleCopyDoors();
            }
            // Ctrl+V: 붙여넣기
            else if (e.ctrlKey && e.key === "v" && copiedDoors.length > 0) {
                e.preventDefault();
                handlePasteDoors();
            }
        };

        // 이벤트 리스너 등록
        window.addEventListener("keydown", handleKeyDown);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [
        editState.isEditable,
        selectedDoorCodeList,
        copiedDoors,
        deleteDoorsAndUpdateAlerts,
        handleCopyDoors,
        handlePasteDoors,
    ]);

    // 문 타입 목록 설정
    useEffect(() => {
        if (doorTypeList) {
            setDoorTypeList(doorTypeList);
        }
    }, [doorTypeList]);

    // ============================== 개별 변수 ==============================
    // 하위 경보 상태 계산
    const childAlertStatusMap = useMemo(() => {
        console.log("childAlertStatusMap 재계산 - mapDisplayDoorList:", mapDisplayDoorList.length);
        return calculateChildAlertStatus(mapDisplayDoorList);
    }, [mapDisplayDoorList]);

    // ============================== 스테이지 이벤트 핸들러 ==============================
    // 문 설정 시작
    const handleDoorSetStart = (e) => {
        const stage = e.target.getStage();
        const { x, y } = stage?.getRelativePointerPosition() ?? { x: 0, y: 0 };

        let areaCodeList = [];

        if (dmConfig.areaList.length > 0) {
            areaCodeList = dmConfig.areaList.map((area) => area.value);
        }

        const initialProps = {
            code: `new-${crypto.randomUUID().toString()}`,
            name: "문",
            parent_code: selectedDoorMapCode,
            event_code: null,
            area_code_list: areaCodeList || [],
        };

        addMapDisplayDoor(x, y, initialProps);

        applySelectedDoorWithAlertsById([initialProps.code]);
    };

    // dragBoundFunc 정의, 드래그가 정해진 영역을 벗어나지 못하게 함
    const stageBoundFunc = (pos) => {
        const stage = stageRef.current;
        if (!stage) return pos;

        // 현재 viewport 크기
        const stageWidth = stage.width();
        const stageHeight = stage.height();

        // 현재 scale을 고려한 제한 계산
        const minX = Math.min(0, stageWidth - MAX_CANVAS_WIDTH * canvasScale);
        const minY = Math.min(0, stageHeight - MAX_CANVAS_HEIGHT * canvasScale);

        return {
            x: Math.max(minX, Math.min(pos.x, 0)),
            y: Math.max(minY, Math.min(pos.y, 0)),
        };
    };

    // 휠 이벤트 핸들러
    const handleWheel = (e) => {
        e.evt.preventDefault();
        const stage = stageRef.current;
        if (!stage) return;

        const scaleBy = 1.05;
        const oldScale = canvasScale;
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - position.x) / oldScale,
            y: (pointer.y - position.y) / oldScale,
        };

        const direction = e.evt.deltaY > 0 ? -1 : 1;
        let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        // 스케일 제한
        const minScaleX = stage.width() / MAX_CANVAS_WIDTH;
        const minScaleY = stage.height() / MAX_CANVAS_HEIGHT;
        const minScale = Math.max(minScaleX, minScaleY);
        newScale = Math.max(Math.min(newScale, SCALE_MIN), Math.max(minScale, SCALE_MAX));

        // 새 position 계산
        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        // 반드시 constrainPosition으로 보정!
        const boundedPos = getBoundedPosition(newPos, newScale);

        setPosition(boundedPos);
        setCanvasScale(newScale);
    };

    // 스테이지 드래그 종료
    const handleStageDragEnd = (e) => {
        const newPos = {
            x: e.target.x(),
            y: e.target.y(),
        };

        setPosition(newPos);
    };

    // 스테이지 우클릭
    const handleStageRightClick = (e) => {
        const pointer = e.target.getStage()?.getRelativePointerPosition();
        setContextMenuProps({ x: pointer?.x ?? 0, y: pointer?.y ?? 0 });

        handleStageContextMenu(e);
    };

    const baseStageHandler = {
        onWheel: handleWheel,
        onMouseDown: (e) => {
            if (e.evt.button === 2) {
                handleStageRightClick(e);
            }
        },
    };

    // 각 모드 고유 핸들러
    const stageModeHandler = {
        INEDITABLE: {
            ...baseStageHandler,
            onMouseDown: (e) => {
                const stage = e.target.getStage();
                if (!stage) return;

                if (e.target === stage && e.evt.button === 1) {
                    stage.container().style.cursor = "grab";
                    stage.draggable(true);
                }
            },
            onMouseUp: (e) => {
                const stage = e.target.getStage();
                if (!stage) return;

                stage.container().style.cursor = "default";
                stage.draggable(false);
            },
            onDragEnd: handleStageDragEnd,
        },
        SELECT: {
            ...baseStageHandler,
            onMouseDown: (e) => {
                const stage = e.target.getStage();
                if (!stage) return;

                baseStageHandler.onMouseDown?.(e);

                // Stage를 클릭할 때만 선택 시작
                if (e.target === stage) {
                    if (e.evt.button === 1) {
                        // 화면 이동을 위한 임시 모드 설정
                        stage.container().style.cursor = "grab";
                        stage.draggable(true);
                    } else if (e.evt.button === 0) {
                        handleSelectionStart(e);
                        clearSelectionWithAlerts(); // 선택 초기화
                    }
                }
            },
            onMouseUp: (e) => {
                const stage = e.target.getStage();
                if (!stage) return;

                // 화면 이동 모드 해제
                stage.container().style.cursor = "default";
                stage.draggable(false);

                handleSelectionEnd(e);
            },
            onMouseMove: handleSelectionMove,
            onDragEnd: (e) => {
                const stage = e.target.getStage();
                if (!stage) return;

                if (e.target === stage && e.evt.button === 1) {
                    handleStageDragEnd(e);
                }
            },
        },
        MOVE: {
            ...baseStageHandler,
            onDragEnd: handleStageDragEnd,
        },
        DOOR: {
            ...baseStageHandler,
            onMouseDown: (e) => {
                const stage = e.target.getStage();

                baseStageHandler.onMouseDown?.(e);
                if (e.evt.button === 0) {
                    handleDoorSetStart(e);
                } else if (e.evt.button === 1 && e.target === stage) {
                    stage.container().style.cursor = "grab";
                    stage.draggable(true);
                }
            },
            onMouseUp: (e) => {
                const stage = e.target.getStage();
                if (!stage) return;

                // 화면 이동 모드 해제
                stage.container().style.cursor = "default";
                stage.draggable(false);
            },

            onDragEnd: (e) => {
                const stage = e.target.getStage();
                if (!stage) return;

                if (e.target === stage && e.evt.button === 1) {
                    handleStageDragEnd(e);
                }
            },
        },
        BACKGROUND_IMAGE: {
            ...baseStageHandler,
            onMouseDown: (e) => {
                const stage = e.target.getStage();
                if (!stage) return;

                if (e.target === stage && e.evt.button === 1) {
                    stage.container().style.cursor = "grab";
                    stage.draggable(true);
                }
            },
            onMouseUp: (e) => {
                const stage = e.target.getStage();
                if (!stage) return;

                stage.container().style.cursor = "default";
                stage.draggable(false);
            },
            onDragEnd: (e) => {
                const stage = e.target.getStage();
                if (!stage) return;

                if (e.target === stage && e.evt.button === 1) {
                    handleStageDragEnd(e);
                }
            },
        },
    };

    // 스테이지 이벤트 핸들러 등록
    const handleStageEvent = (eventType, e) => {
        const mode = editState.isEditable ? editState.currentMode : "INEDITABLE";
        const handler = stageModeHandler[mode][eventType];

        if (handler) {
            handler(e);
        }
    };

    // ============================== 문 이벤트 핸들러 ==============================
    // 문 드래그 시작
    const handleDoorDragStart = (e, doorId) => {
        // 선택되지 않은 문을 드래그 시작할 경우, 해당 문만 선택
        if (!selectedDoorCodeList.includes(doorId)) {
            if (!e.evt.shiftKey) {
                applySelectedDoorWithAlertsById([doorId]);
                handleDragStart(e, doorId, mapDisplayDoorList, [doorId]);
            } else {
                const newSelection = [...selectedDoorCodeList, doorId];
                applySelectedDoorWithAlertsById(newSelection);
                handleDragStart(e, doorId, mapDisplayDoorList, newSelection);
            }
        } else {
            // 이미 선택된 문 드래그 시
            handleDragStart(e, doorId, mapDisplayDoorList, selectedDoorCodeList);
        }
    };

    // 문 드래그 중
    const handleDoorDragMove = (e, doorId) => {
        handleDragMove(e, doorId);
    };

    // 문 드래그 종료
    const handleDoorDragEnd = (e, doorId) => {
        handleDragEnd(e, doorId);
    };

    // 문 클릭
    const handleDoorClick = (e, doorId) => {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastClickTime;

        // 더블클릭 감지 (300ms 이내의 연속 클릭)
        // doorId가 'new-'로 시작하는 경우 더블클릭 처리 제외
        if (timeDiff < 300 && lastClickDoorId === doorId && !doorId.startsWith('new-')) {
            // 더블클릭 처리
            const clickedDoor = mapDisplayDoorList.find((door) => door.code === doorId);
            if (clickedDoor?.childable === 1) {
                // 하위 문이 있는 경우 해당 문으로 이동
                applyMapViewById(doorId);
                clearSelectionWithAlerts(); // 선택 초기화
            }
        } else {
            // 단일 클릭 처리
            toggleSelection(doorId, e.evt.shiftKey);
        }
        // 클릭 정보 업데이트
        setLastClickTime(currentTime);
        setLastClickDoorId(doorId);
    };

    // 문 우클릭
    const handleDoorRightClick = (e, doorId) => {
        // 선택되지 않은 문을 오른쪽 클릭 시 해당 문만 선택
        if (!selectedDoorCodeList.includes(doorId)) {
            applySelectedDoorWithAlertsById([doorId]);
        }

        // 오른쪽 클릭 시 컨텍스트 메뉴 표시
        handleObjectContextMenu();
    };

    // 각 모드 별 문 이벤트 핸들러
    const doorModeHandler = {
        SELECT: {
            onClick: (e, doorId) => {
                if (e.evt.button === 0) {
                    handleDoorClick(e, doorId);
                } else if (e.evt.button === 2) {
                    handleDoorRightClick(e, doorId);
                }
            },
            onDragStart: (e, doorId) => {
                if (e.evt.button === 0 || e.evt.button === 1) {
                    handleDoorDragStart(e, doorId);
                }
            },
            onDragMove: (e, doorId) => {
                if (e.evt.button === 0 || e.evt.button === 1) {
                    handleDoorDragMove(e, doorId);
                }
            },
            onDragEnd: (e, doorId) => {
                if (e.evt.button === 0 || e.evt.button === 1) {
                    handleDoorDragEnd(e, doorId);
                }
            },
        },
        MOVE: {},
        DOOR: {},
        BACKGROUND_IMAGE: {},
    };

    // 문 이벤트 핸들러 등록
    const handleDoorEvent = (eventType, e, doorId) => {
        // 편집 모드가 아닐 때도 onClick 이벤트는 처리
        if (!editState.isEditable) {
            if (eventType === "onClick" && e.evt.button === 0) {
                handleDoorClick(e, doorId);
            }
            return;
        }

        // 편집 모드일 때는 모든 이벤트 처리
        const currentHandlers = doorModeHandler[editState.currentMode];
        const handler = currentHandlers?.[eventType];

        if (handler) {
            handler(e, doorId);
        }
    };

    // ============================== 컨텍스트 메뉴 핸들러 ==============================
    // 스테이지 컨텍스트 메뉴
    const handleStageContextMenu = (e) => {
        if (e.target === e.target.getStage()) {
            setContextMenuType("stage");
        }
    };

    // 객체 컨텍스트 메뉴
    const handleObjectContextMenu = () => {
        setContextMenuType("object");
    };

    // ============================== 배경 이미지 업로드 ==============================
    const fileUploadHandler = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result;

            img.onload = () => {
                // 초기 이미지 정보 설정
                const initialImage = {
                    image: img,
                    x: 0,
                    y: 0,
                    width: img.width,
                    height: img.height,
                    scale: 0.5,
                    contain: false,
                };

                // 스테이지 크기에 맞게 조정된 이미지 정보 계산
                const { width, height, x, y, scale } = calculateImageScaleToFit(initialImage, 850);

                // 한번에 최종 상태 설정
                setBackgroundImage(img, x, y, width, height, scale, true);
            };
        };

        reader.readAsDataURL(file);

        e.target.value = "";
    };

    // 배경 이미지 삭제
    const handleDeleteBackgroundImage = () => {
        setBackgroundImage(null, 0, 0, 0, 0, 0, false);
    };

    // 배경 이미지 크기 조절 (가로/세로 개별)
    const handleImageResize = (dimension, value) => {
        if (!backgroundImage.image) return;

        const currentWidth = backgroundImage.width;
        const currentHeight = backgroundImage.height;

        let newWidth = currentWidth;
        let newHeight = currentHeight;

        if (dimension === "width") {
            newWidth = value;
        } else if (dimension === "height") {
            newHeight = value;
        }

        // 이미지 중앙 정렬 위치 계산
        const x = (MAX_CANVAS_WIDTH - newWidth) / 2;
        const y = (MAX_CANVAS_HEIGHT - newHeight) / 2;

        // 배경 이미지 상태 업데이트
        setBackgroundImage(
            backgroundImage.image,
            x,
            y,
            newWidth,
            newHeight,
            backgroundImage.scale, // 기존 scale 유지
            backgroundImage.contain
        );
    };

    // ============================== 기타 핸들러 ==============================
    // 스테이지 크기가 0이되면 Konva에서 렌더링 오류가 발생하므로 최소 크기를 1로 설정
    const safeStageSize = {
        width: Math.max(1, stageSize.width),
        height: Math.max(1, stageSize.height),
    };

    // 문 크기 변경 종료
    const handleDoorTransformEnd = (doorId, newProps) => {
        // 문의 새로운 크기와 위치로 상태 업데이트
        const updatedDoorList = mapDisplayDoorList.map((door) => {
            if (door.code === doorId) {
                return {
                    ...door,
                    coordinate: {
                        ...door.coordinate,
                        ...newProps,
                    },
                };
            }
            return door;
        });

        applyMapDisplayDoorList(updatedDoorList);
    };

    // =============================== 유틸 함수 ===============================
    // 문들의 바운딩 박스 계산
    const calculateDoorsBoundingBox = (doorList) => {
        if (!doorList || doorList.length === 0) return null;

        let minX = Infinity,
            minY = Infinity;
        let maxX = -Infinity,
            maxY = -Infinity;

        doorList.forEach((door) => {
            if (door.coordinate) {
                const centerX = door.coordinate.x || 0;  // X는 중심점
                const y = door.coordinate.y || 0;        // Y는 왼쪽 위 모서리
                const width = door.coordinate.width || 40; // 기본 문 너비
                const height = door.coordinate.height || 10; // 기본 문 높이

                // X축: 중심점 기준으로 좌우 끝 계산
                const left = centerX - width / 2;
                const right = centerX + width / 2;
                
                // Y축: 기존대로 위 모서리 기준
                const top = y;
                const bottom = y + height;

                minX = Math.min(minX, left);
                minY = Math.min(minY, top);
                maxX = Math.max(maxX, right);
                maxY = Math.max(maxY, bottom);
            }
        });

        // 유효한 바운딩 박스인지 확인
        if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
            return null;
        }

        // 여백 추가 (10%)
        const padding = 0.1;
        const boxWidth = maxX - minX;
        const boxHeight = maxY - minY;

        return {
            x: minX - boxWidth * padding,
            y: minY - boxHeight * padding,
            width: boxWidth * (1 + padding * 2),
            height: boxHeight * (1 + padding * 2),
            centerX: (minX + maxX) / 2,
            centerY: (minY + maxY) / 2,
        };
    };

    // 바운딩 박스를 화면에 맞추기 위한 scale과 position 계산
    const calculateFitToScreen = (boundingBox, stageSize) => {
        if (!boundingBox) {
            // 문이 없으면 기본 중앙 정렬
            return {
                scale: 1,
                position: {
                    x: (stageSize.width - MAX_CANVAS_WIDTH) / 2,
                    y: (stageSize.height - MAX_CANVAS_HEIGHT) / 2,
                },
            };
        }

        // 화면에 맞는 scale 계산
        const scaleX = stageSize.width / boundingBox.width;
        const scaleY = stageSize.height / boundingBox.height;
        let newScale = Math.min(scaleX, scaleY) * 0.9; // 90%로 여백 확보

        // scale 제한
        newScale = Math.max(SCALE_MAX, Math.min(SCALE_MIN, newScale));

        // 바운딩 박스 중심이 화면 중앙에 오도록 position 계산
        const position = {
            x: stageSize.width / 2 - boundingBox.centerX * newScale,
            y: stageSize.height / 2 - boundingBox.centerY * newScale,
        };

        return { scale: newScale, position };
    };

    // 이미지를 화면에 맞춤
    const calculateImageFit = (image) => {
        // 2. 이미지 크기 계산
        const width = image.width * image.scale;
        const height = image.height * image.scale;

        // 3. 중앙 정렬 위치 계산
        const x = (MAX_CANVAS_WIDTH - width) / 2;
        const y = (MAX_CANVAS_HEIGHT - height) / 2;

        return { width, height, x, y };
    };

    // 이미지의 scale와 위치 좌표를 계산
    const calculateImageScaleToFit = (image, maxSize) => {
        // 현재 이미지의 가로/세로 비율
        const aspectRatio = image.width / image.height;

        let scale;

        // 가로가 더 긴 경우
        if (aspectRatio > 1) {
            scale = maxSize / image.width;
        }
        // 세로가 더 긴 경우
        else {
            scale = maxSize / image.height;
        }

        // scale을 SCALE_MIN과 SCALE_MAX 범위로 제한
        scale = Math.max(SCALE_MAX, Math.min(SCALE_MIN, scale));

        // 제한된 scale로 최종 크기와 위치 계산
        return {
            width: image.width * scale,
            height: image.height * scale,
            scale: scale,
            x: (MAX_CANVAS_WIDTH - image.width * scale) / 2,
            y: (MAX_CANVAS_HEIGHT - image.height * scale) / 2,
        };
    };

    return (
        <div
            ref={(node) => {
                containerRef.current = node;
                drop(node); // 컨테이너를 드롭 타겟으로 등록
            }}
            className="h-full w-full"
            style={{
                border: "2px solid",
                borderColor: isOver ? "var(--kendo-color-primary)" : "transparent",
            }}
        >
            {/* 배경 이미지 설정 창 */}
            {editState.currentMode === "BACKGROUND_IMAGE" && (
                <div className="absolute right-4 top-4 z-10">
                    <BackgroundImageProperties
                        backgroundImage={backgroundImage}
                        onImageUpload={fileUploadHandler}
                        onDeleteImage={handleDeleteBackgroundImage}
                        onImageResize={handleImageResize}
                    />
                </div>
            )}

            {/* Canvas 컨테이너 - 항상 렌더링하되 로딩 중에는 숨김 */}
            <div style={{ 
                opacity: isMapViewLoading ? 0 : 1, 
                transition: 'opacity 0.2s ease-in-out',
                height: '100%',
                width: '100%'
            }}>
                <Stage
                    ref={stageRef}
                    width={safeStageSize.width}
                    height={safeStageSize.height}
                    listening={!isMapViewLoading}
                    onMouseDown={(e) => handleStageEvent("onMouseDown", e)}
                    onMouseMove={(e) => handleStageEvent("onMouseMove", e)}
                    onMouseUp={(e) => handleStageEvent("onMouseUp", e)}
                    onDragMove={(e) => handleStageEvent("onDragMove", e)}
                    onDragEnd={(e) => handleStageEvent("onDragEnd", e)}
                    onWheel={(e) => handleStageEvent("onWheel", e)}
                    scaleX={canvasScale}
                    scaleY={canvasScale}
                    x={position.x}
                    y={position.y}
                    draggable={editState.isEditable && editState.currentMode === "MOVE"}
                    dragBoundFunc={stageBoundFunc}
                >
                <Layer>
                    {/* 경계선 표시 */}
                    <Rect
                        x={0}
                        y={0}
                        width={MAX_CANVAS_WIDTH}
                        height={MAX_CANVAS_HEIGHT}
                        stroke="#ddd"
                        strokeWidth={5}
                        listening={false}
                    />
                    {/* 기존 컴포넌트들 */}
                </Layer>
                <Layer id="main-layer">
                    {/* 도면 이미지 등록 */}
                    {backgroundImage.image && (
                        <KonvaImage
                            image={backgroundImage.image}
                            x={backgroundImage.x}
                            y={backgroundImage.y}
                            width={backgroundImage.width}
                            height={backgroundImage.height}
                            listening={false}
                        />
                    )}
                    {/* 등록한 문들 */}
                    {mapDisplayDoorList?.map((door) => (
                        <DoorComponent
                            key={door.code}
                            door={door}
                            isEditable={editState.isEditable}
                            isSelected={selectedDoorCodeList.includes(door.code)}
                            globalGrapicItemColor={globalGrapicItemColor}
                            draggable={editState.isEditable && editState.currentMode === "SELECT"}
                            onDragStart={(e) => handleDoorEvent("onDragStart", e, door.code)}
                            onDragMove={(e) => handleDoorEvent("onDragMove", e, door.code)}
                            onDragEnd={(e) => handleDoorEvent("onDragEnd", e, door.code)}
                            onClick={(e) => handleDoorEvent("onClick", e, door.code)}
                            onTransformEnd={(doorId, newProps) => handleDoorTransformEnd(doorId, newProps)}
                            childAlertStatus={childAlertStatusMap[door.code]}
                        />
                    ))}
                </Layer>
            </Stage>
            </div>

            {/* 로딩 오버레이 */}
            {isMapViewLoading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
                    <div className="flex flex-col items-center gap-3">
                        <Loader size="large" themeColor="primary" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapView;
