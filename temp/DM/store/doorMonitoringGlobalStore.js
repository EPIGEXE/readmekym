const { create } = require("zustand");
const { devtools } = require("zustand/middleware");

const useDoorMonitoringGlobalStore = create(
    devtools(
        (set, get) => ({
            doorMonitoringGlobal: {
                globalAlarmSound: "",
                globalGrapicItemColor: {
                    default: "",
                    alert: "",
                    checked: "",
                    autoChecked: "",
                },
            },
            dmConfig: {
                areaList: [],
            },

            actions: {
                setGlobalAlarmSound: (globalAlarmSound) => 
                    set((state) => ({
                        doorMonitoringGlobal: {
                            ...state.doorMonitoringGlobal,
                            globalAlarmSound
                        }
                    })),
                setGlobalGrapicItemColor: (globalGrapicItemColor) => 
                    set((state) => ({
                        doorMonitoringGlobal: {
                            ...state.doorMonitoringGlobal,
                            globalGrapicItemColor
                        }
                    })),
                setAreaList: (areaList) => set((state) => ({
                    dmConfig: {
                        ...state.dmConfig,
                        areaList
                    }
                })),
            },
        }),
        { name: "doorMonitoringGlobalStore" }
    )
);

export default useDoorMonitoringGlobalStore;
