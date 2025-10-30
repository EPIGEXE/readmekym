import { create } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * 오디오 관련 상태 관리
 * DM에서 울려야하는 경보음을 관리하는 스토어
 */
const useAlarmAudioStore = create(
    devtools(
        (set, get) => ({
            // 상태
            audioQueue: [], // { audio, soundFile, doorCodes: [], volume } 객체들의 배열
            globalVolume: 0.7, // 전역 볼륨
            activeAlarms: [], // 현재 재생 중인 경보 문 코드들
            isGlobalMuted: false, // 전체 음소거 상태
            isAudioEnabled: false, // 오디오 활성화 상태
            pendingAlarms: [], // 오디오 활성화 대기중인 경보들
            audioPromises: new Map(), // soundFile별 진행중인 Promise 관리

            actions: {
                // 사용자 상호작용으로 오디오 활성화
                enableAudio: async () => {
                    try {
                        console.log("[AlarmAudio] 오디오 활성화 시도");

                        // 실제 오디오 파일로 테스트 (매우 짧은 무음)
                        const testAudio = new Audio();

                        // 0.1초 길이의 무음 WAV 파일 (Base64)
                        testAudio.src =
                            "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
                        testAudio.volume = 0.01; // 거의 들리지 않는 볼륨
                        testAudio.currentTime = 0;

                        // 재생 시도
                        const playPromise = testAudio.play();
                        if (playPromise !== undefined) {
                            await playPromise;
                        }

                        // 즉시 정지
                        testAudio.pause();
                        testAudio.currentTime = 0;
                        testAudio.remove();

                        set({ isAudioEnabled: true });
                        console.log("[AlarmAudio] 오디오 활성화 완료");

                        // 대기중인 경보들 재생
                        const state = get();
                        if (state.pendingAlarms.length > 0) {
                            console.log(`[AlarmAudio] 대기중인 경보 ${state.pendingAlarms.length}개 재생 시작`);
                            const alarms = [...state.pendingAlarms]; // 복사본 생성
                            set({ pendingAlarms: [] }); // 먼저 대기열 비우기

                            // 순차적으로 재생
                            for (const alarm of alarms) {
                                await get().actions.playDoorAlarm(
                                    alarm.doorCode,
                                    alarm.alarmSound,
                                    alarm.globalAlarmSound
                                );
                            }
                        }

                        return true;
                    } catch (error) {
                        console.error("[AlarmAudio] 오디오 활성화 실패:", error);

                        // 대체 방법: 간단한 클릭 이벤트만으로 활성화
                        try {
                            console.log("[AlarmAudio] 대체 방법으로 오디오 활성화 시도");
                            set({ isAudioEnabled: true });

                            // 대기중인 경보들 재생
                            const state = get();
                            if (state.pendingAlarms.length > 0) {
                                console.log(`[AlarmAudio] 대기중인 경보 ${state.pendingAlarms.length}개 재생 시작`);
                                const alarms = [...state.pendingAlarms];
                                set({ pendingAlarms: [] });

                                for (const alarm of alarms) {
                                    await get().actions.playDoorAlarm(
                                        alarm.doorCode,
                                        alarm.alarmSound,
                                        alarm.globalAlarmSound
                                    );
                                }
                            }

                            console.log("[AlarmAudio] 대체 방법으로 오디오 활성화 완료");
                            return true;
                        } catch (fallbackError) {
                            console.error("[AlarmAudio] 대체 방법도 실패:", fallbackError);
                            return false;
                        }
                    }
                },

                // 경보음 재생
                playDoorAlarm: async (doorCode, alarmSound, globalAlarmSound, options = {}) => {
                    if (doorCode.includes("G2153") || doorCode.includes("G0228")) {
                        console.log(`=== ${doorCode} [AlarmAudio] 경보음 재생: ${alarmSound} - ${globalAlarmSound}`);
                    }

                    const state = get();

                    if (!doorCode) return;

                    // 사용할 경보음 결정 (개별 > 글로벌)
                    const soundFile = alarmSound || globalAlarmSound;
                    if (!soundFile) {
                        if (doorCode.includes("G2153") || doorCode.includes("G0228")) {
                            console.log("=== ", doorCode, " [AlarmAudio] 경보음 파일이 없음");
                        }
                        return;
                    }

                    // 오디오가 활성화되지 않은 경우 대기열에 추가
                    if (!state.isAudioEnabled) {
                        if (doorCode.includes("G2153") || doorCode.includes("G0228")) {
                            console.log(`=== ${doorCode} [AlarmAudio] 오디오 미활성화 - 대기열에 추가`);
                        }
                        set((state) => ({
                            pendingAlarms: [
                                ...state.pendingAlarms.filter((alarm) => alarm.doorCode !== doorCode),
                                { doorCode, alarmSound, globalAlarmSound },
                            ],
                        }));
                        return;
                    }

                    // 이미 해당 문이 재생 중인 경우 스킵
                    if (state.activeAlarms.includes(doorCode)) {
                        if (doorCode.includes("G2153") || doorCode.includes("G0228")) {
                            console.log(`=== ${doorCode} [AlarmAudio] 이미 재생 중인 경보음`);
                        }
                        return;
                    }

                    // 동일한 soundFile에 대한 Promise가 있으면 대기
                    let existingPromise = state.audioPromises.get(soundFile);
                    if (existingPromise) {
                        if (doorCode.includes("G2153") || doorCode.includes("G0228")) {
                            console.log(`=== ${doorCode} [AlarmAudio] 같은 경보음 처리 대기: ${soundFile}`);
                        }
                        await existingPromise;

                        // 대기 후 다시 체크 - 이미 재생 중이면 doorCode만 추가
                        const currentState = get();
                        const existingAudioItem = currentState.audioQueue.find((item) => item.soundFile === soundFile);
                        if (existingAudioItem) {
                            if (doorCode.includes("G2153") || doorCode.includes("G0228")) {
                                console.log(`=== ${doorCode} [AlarmAudio] 대기 후 doorCode만 추가`);
                            }
                            set((state) => ({
                                audioQueue: state.audioQueue.map((item) =>
                                    item.soundFile === soundFile
                                        ? { ...item, doorCodes: [...item.doorCodes, doorCode] }
                                        : item
                                ),
                                activeAlarms: state.activeAlarms.includes(doorCode)
                                    ? state.activeAlarms
                                    : [...state.activeAlarms, doorCode],
                            }));
                            return;
                        }
                    }

                    // 동시 호출 방지: Promise 생성 전에 즉시 Map에 placeholder 저장
                    let audioPromise;

                    // 원자적 연산으로 중복 체크 및 Promise 생성
                    const shouldCreateNewPromise = !state.audioPromises.has(soundFile);

                    if (shouldCreateNewPromise) {
                        // Promise 생성 및 즉시 Map에 저장
                        audioPromise = (async () => {
                            try {
                                // 오디오 객체 생성
                                const audio = new Audio();
                                const encodedFileName = encodeURIComponent(soundFile);
                                audio.src = `${process.env.PUBLIC_URL}/front_resource/DM-Audio/${encodedFileName}`;
                                audio.volume = options.volume || state.globalVolume;
                                audio.loop = true;
                                audio.preload = "auto";

                                // 전체 음소거 상태면 음소거 적용
                                if (state.isGlobalMuted) {
                                    audio.muted = true;
                                }

                                // 재생 완료/에러 시 정리
                                const cleanup = () => {
                                    set((state) => ({
                                        audioQueue: state.audioQueue.filter((item) => item.soundFile !== soundFile),
                                        activeAlarms: state.activeAlarms.filter(
                                            (code) =>
                                                !state.audioQueue.find(
                                                    (item) =>
                                                        item.soundFile === soundFile && item.doorCodes.includes(code)
                                                )
                                        ),
                                    }));

                                    // Promise Map에서 제거
                                    get().audioPromises.delete(soundFile);
                                };

                                audio.onended = cleanup;
                                audio.onerror = (error) => {
                                    console.error(`=== ${doorCode} [AlarmAudio] 경보음 재생 실패:`, error);
                                    cleanup();
                                };

                                // 재생 시작
                                await audio.play();

                                // 상태 업데이트
                                set((state) => ({
                                    audioQueue: [
                                        ...state.audioQueue,
                                        {
                                            audio,
                                            soundFile,
                                            doorCodes: [doorCode],
                                            volume: audio.volume,
                                        },
                                    ],
                                    activeAlarms: state.activeAlarms.includes(doorCode)
                                        ? state.activeAlarms
                                        : [...state.activeAlarms, doorCode],
                                }));

                                if (doorCode.includes("G2153") || doorCode.includes("G0228")) {
                                    console.log(`=== ${doorCode} [AlarmAudio] 경보음 재생 시작: ${soundFile}`);
                                }
                            } catch (error) {
                                console.error(`[AlarmAudio] 경보음 재생 중 오류:`, error);
                                // 실패시 Promise Map에서 제거
                                get().audioPromises.delete(soundFile);
                                throw error;
                            }
                        })();

                        // 즉시 Map에 저장
                        state.audioPromises.set(soundFile, audioPromise);

                        // Promise 완료 대기
                        await audioPromise;
                    } else {
                        // 다른 스레드가 이미 생성중 - 대기 후 doorCode 추가
                        existingPromise = state.audioPromises.get(soundFile);
                        await existingPromise;

                        const currentState = get();
                        const existingAudioItem = currentState.audioQueue.find((item) => item.soundFile === soundFile);
                        if (existingAudioItem) {
                            if (doorCode.includes("G2153") || doorCode.includes("G0228")) {
                                console.log(`=== ${doorCode} [AlarmAudio] 동시 호출 후 doorCode 추가`);
                            }
                            set((state) => ({
                                audioQueue: state.audioQueue.map((item) =>
                                    item.soundFile === soundFile
                                        ? { ...item, doorCodes: [...item.doorCodes, doorCode] }
                                        : item
                                ),
                                activeAlarms: state.activeAlarms.includes(doorCode)
                                    ? state.activeAlarms
                                    : [...state.activeAlarms, doorCode],
                            }));
                        }
                    }
                },

                // 대기중인 경보 제거
                removePendingAlarm: (doorCode) => {
                    set((state) => ({
                        pendingAlarms: state.pendingAlarms.filter((alarm) => alarm.doorCode !== doorCode),
                    }));
                },

                stopDoorAlarm: (doorCode) => {
                    const state = get();

                    // 대기중인 경보에서도 제거
                    get().actions.removePendingAlarm(doorCode);

                    // 해당 문 제거
                    const newActiveAlarms = state.activeAlarms.filter((code) => code !== doorCode);

                    // 해당 문이 사용하는 오디오 아이템 찾기
                    const audioItemIndex = state.audioQueue.findIndex((item) => item.doorCodes.includes(doorCode));

                    if (audioItemIndex === -1) {
                        set({ activeAlarms: newActiveAlarms });
                        return;
                    }

                    const audioItem = state.audioQueue[audioItemIndex];
                    const updatedDoorCodes = audioItem.doorCodes.filter((code) => code !== doorCode);

                    // 같은 사운드를 사용하는 다른 문이 없으면 오디오 정지
                    if (updatedDoorCodes.length === 0) {
                        audioItem.audio.pause();
                        audioItem.audio.currentTime = 0;

                        // Promise Map에서도 제거 (다시 재생 가능하도록)
                        state.audioPromises.delete(audioItem.soundFile);

                        set({
                            audioQueue: state.audioQueue.filter((_, index) => index !== audioItemIndex),
                            activeAlarms: newActiveAlarms,
                        });

                        console.log(`[AlarmAudio] 경보음 정지: ${doorCode} - ${audioItem.soundFile}`);
                    } else {
                        // doorCodes만 업데이트
                        set({
                            audioQueue: state.audioQueue.map((item, index) =>
                                index === audioItemIndex ? { ...item, doorCodes: updatedDoorCodes } : item
                            ),
                            activeAlarms: newActiveAlarms,
                        });
                        // console.log(`[AlarmAudio] doorCodes만 제거 (다른 문이 같은 경보음 사용 중): ${doorCode}`);
                    }
                },

                // 모든 경보음 정지
                stopAllAlarms: () => {
                    const state = get();

                    state.audioQueue.forEach((item) => {
                        item.audio.pause();
                        item.audio.currentTime = 0;
                    });

                    // 모든 Promise Map 정리 (다시 재생 가능하도록)
                    state.audioPromises.clear();

                    set({
                        audioQueue: [],
                        activeAlarms: [],
                        pendingAlarms: [],
                    });

                    console.log("[AlarmAudio] 모든 경보음 정지");
                },

                // 전체 음소거 토글
                toggleGlobalMute: () => {
                    set((state) => {
                        const newMuted = !state.isGlobalMuted;

                        if (newMuted) {
                            // 음소거 활성화 시 모든 경보음 음소거 (재생은 계속하되 소리만 끔)
                            state.audioQueue.forEach((item) => {
                                item.audio.muted = true;
                            });

                            return {
                                isGlobalMuted: newMuted,
                            };
                        } else {
                            // 음소거 해제 시 모든 오디오의 muted 해제 및 재생
                            state.audioQueue.forEach((item) => {
                                item.audio.muted = false;
                                item.audio.play();
                            });
                        }

                        return { isGlobalMuted: newMuted };
                    });
                },

                // 전역 볼륨 설정
                setGlobalVolume: (volume) => {
                    const state = get();
                    state.audioQueue.forEach((item) => {
                        item.audio.volume = volume;
                        item.volume = volume;
                    });
                    set({ globalVolume: volume });
                },

                // 개별 오디오 볼륨 설정
                setAudioVolume: (soundFile, volume) => {
                    const state = get();
                    const audioItem = state.audioQueue.find((item) => item.soundFile === soundFile);
                    if (audioItem) {
                        audioItem.audio.volume = volume;
                        audioItem.volume = volume;
                        set({ audioQueue: [...state.audioQueue] });
                    }
                },

                // 리소스 정리
                dispose: () => {
                    const state = get();

                    state.audioQueue.forEach((item) => {
                        item.audio.pause();
                        item.audio.currentTime = 0;
                    });

                    // 모든 Promise Map 정리
                    state.audioPromises.clear();

                    set({
                        audioQueue: [],
                        activeAlarms: [],
                        pendingAlarms: [],
                        isAudioEnabled: false,
                    });
                },
            },
        }),
        { name: "alarmAudioStore" }
    )
);

export default useAlarmAudioStore;
