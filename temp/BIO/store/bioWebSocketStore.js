import { devtools } from "zustand/middleware";
import { create } from "zustand";
import { StompClient } from '../../../libs/utils/stomp';

const useBioWebSocketStore = create(
    devtools((set, get) => ({
        // 상태
        client: null,
        subscribers: new Set(),
        isConnected: false,

        // 액션들
        actions: {
            connect: (backendUrl, productCode) => {
                if (get().client) return; // 이미 연결되어 있다면 중복 연결 방지

                const client = StompClient(
                    `${backendUrl}`,
                    `/exchange/topic.acs.biodevice.event/${productCode}.#`,
                    (message) => {
                        // 등록된 모든 subscriber에게 메시지 전달
                        get().subscribers.forEach(callback => {
                            try {
                                callback(message);
                            } catch (error) {
                                console.error("Subscriber 처리 중 오류:", error);
                            }
                        });
                    }
                );

                set({ client, isConnected: true });
            },

            disconnect: () => {
                const { client } = get();
                if (client) {
                    client.deactivate();
                    set({ 
                        client: null, 
                        isConnected: false,
                        subscribers: new Set()
                    });
                }
            },

            // 메시지를 받을 subscriber 등록
            subscribe: (callback) => {
                get().subscribers.add(callback);
                return () => get().subscribers.delete(callback);
            }
        }
    }), 
    {
        name: "bioWebSocketStore",
    }
));

export default useBioWebSocketStore;