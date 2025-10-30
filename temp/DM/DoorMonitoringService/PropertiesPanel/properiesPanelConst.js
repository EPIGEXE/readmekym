import { Circle, Square, Triangle } from "lucide-react";

// 속성 패널 문 색상 프리셋
export const DEFAULT_COLORS = [
    '#94a3b8', // slate
    '#f87171', // red
    '#fb923c', // orange
    '#fbbf24', // amber
    '#34d399', // emerald
    '#22d3ee', // cyan
];

export const ALERT_COLORS = [
    "#f87171",
    "#ef4444",
    "#dc2626",
    "#b91c1c",
    "#7f1d1d",
    "#450a0a",
]

export const CHECKED_COLORS = [
    "#34d399",
    "#22c55e",
    "#16a34a",
    "#15803d",
    "#166534",
    "#052e16",
]

export const AUTO_CHECKED_COLORS = [
    "#60a5fa",
    "#3b82f6",
    "#2563eb",
    "#1d4ed8",
    "#1e40af",
    "#172554",
]

// 라벨 배경색 프리셋 (밝고 읽기 쉬운 색상)
export const LABEL_BACKGROUND_COLORS = [
    '#ffffff', // 흰색
    '#f8fafc', // slate-50
    '#f1f5f9', // slate-100
    '#e2e8f0', // slate-200
    '#fef3c7', // amber-100
    '#dcfce7', // green-100
    '#dbeafe', // blue-100
    '#fce7f3', // pink-100
    '#f3e8ff', // purple-100
    '#ecfdf5', // emerald-50
    '#fef7f7', // red-50
    '#fffbeb', // amber-50
]

// 라벨 텍스트 색상 프리셋 (대비가 높은 어두운 색상)
export const LABEL_TEXT_COLORS = [
    '#000000', // 검정
    '#1e293b', // slate-800
    '#374151', // gray-700
    '#4b5563', // gray-600
    '#6b7280', // gray-500
    '#dc2626', // red-600
    '#ea580c', // orange-600
    '#ca8a04', // yellow-600
    '#16a34a', // green-600
    '#2563eb', // blue-600
    '#7c3aed', // violet-600
    '#be185d', // pink-600
]

// 속성 패널 도형 모양 옵션
export const getShapes = (messages) => [
    { text: messages.propertiesPanel.rect, value: 'rect', icon: Square },
    { text: messages.propertiesPanel.circle, value: 'circle', icon: Circle },
    { text: messages.propertiesPanel.triangle, value: 'triangle', icon: Triangle },
];