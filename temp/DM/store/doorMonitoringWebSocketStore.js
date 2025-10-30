import { StompClient } from "v2/libs/utils/stomp";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const TOPICS = {
    DM_EVENT: '/exchange/topic.acs.dm.event/#',
};

const useDoorMonitoringWebSocketStore = create(
    devtools((set, get) => ({
        // 상태
        connections: new Map(), // 토픽별 연결 관리
        subscribers: new Map(), // 토픽별 구독자 관리
        isConnected: false,
        backendUrl: null,

        // 액션
        actions: {
            // 서버 설정 및 전체 연결 초기화
            initialize: (backendUrl) => {
                // 이미 같은 서버로 초기화되어 있으면 스킵
                const currentBackendUrl = get().backendUrl;
                if (currentBackendUrl && currentBackendUrl === backendUrl) {
                    return;
                }

                // 다른 서버로 변경되는 경우에만 기존 연결 정리
                if (currentBackendUrl && currentBackendUrl !== backendUrl) {
                    get().actions.disconnectAll();
                }

                set({ backendUrl: backendUrl, isConnected: false });
            },

            // 특정 토픽 구독
            subscribeTopic: (topicKey, callback) => {
                const { backendUrl, connections, subscribers } = get();

                if (!backendUrl) {
                    console.error("서버 설정이 필요합니다. initialize()를 먼저 호출하세요.");
                    return () => {};
                }

                const topic = TOPICS[topicKey];
                if (!topic) {
                    console.error(`지원하지 않는 토픽: ${topicKey}`);
                    return () => {};
                }

                // 토픽별 구독자 관리 - 새로운 Map 객체 생성
                const newSubscribers = new Map(subscribers);
                if (!newSubscribers.has(topicKey)) {
                    newSubscribers.set(topicKey, new Set());
                }
                newSubscribers.get(topicKey).add(callback);

                // 해당 토픽의 첫 번째 구독자라면 연결 생성
                const newConnections = new Map(connections);
                if (!newConnections.has(topicKey)) {
                    console.log(`새 토픽 연결 생성: ${topicKey} -> ${topic}`);

                    const client = StompClient(backendUrl, topic, (message) => {
                        // 토픽별 구독자들에게 메시지 전달
                        const currentState = get();
                        const topicSubscribers = currentState.subscribers.get(topicKey);
                        if (topicSubscribers) {
                            topicSubscribers.forEach((cb) => {
                                try {
                                    cb(message, topicKey);
                                } catch (error) {
                                    console.error(`토픽 ${topicKey} 콜백 오류:`, error);
                                }
                            });
                        }
                    });

                    newConnections.set(topicKey, client);
                }

                // 상태 업데이트
                set({
                    connections: newConnections,
                    subscribers: newSubscribers,
                    isConnected: true,
                });

                // 구독 해제 함수 반환
                return () => {
                    const currentState = get();
                    const currentSubscribers = new Map(currentState.subscribers);
                    const currentConnections = new Map(currentState.connections);

                    const topicSubscribers = currentSubscribers.get(topicKey);
                    if (topicSubscribers) {
                        const newTopicSubscribers = new Set(topicSubscribers);
                        newTopicSubscribers.delete(callback);

                        // 마지막 구독자라면 연결 해제
                        if (newTopicSubscribers.size === 0) {
                            console.log(`토픽 연결 해제: ${topicKey}`);
                            const client = currentConnections.get(topicKey);
                            if (client) {
                                client.deactivate();
                                currentConnections.delete(topicKey);
                                currentSubscribers.delete(topicKey);
                            }
                        } else {
                            currentSubscribers.set(topicKey, newTopicSubscribers);
                        }

                        // 상태 업데이트
                        set({
                            connections: currentConnections,
                            subscribers: currentSubscribers,
                            isConnected: currentConnections.size > 0,
                        });
                    }
                };
            },

            // 모든 연결 해제
            disconnectAll: () => {
                const { connections } = get();

                console.log("모든 WebSocket 연결 해제");

                // 연결 해제는 side effect이므로 먼저 처리
                connections.forEach((client, topicKey) => {
                    console.log(`연결 해제: ${topicKey}`);
                    client.deactivate();
                });

                // 상태는 새로운 객체로 교체
                set({
                    connections: new Map(),
                    subscribers: new Map(),
                    isConnected: false,
                });
            },

            // 연결 상태 확인
            isTopicConnected: (topicKey) => {
                return get().connections.has(topicKey);
            },
        },
    }))
);

export default useDoorMonitoringWebSocketStore;