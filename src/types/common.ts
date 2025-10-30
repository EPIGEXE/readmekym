// 사이드 바 데이터 타입
export interface SidebarData {
    id: string;
    number: string;
    title: string;
    description: string;
    color: string;
    role?: string;
    teamSize?: number;
    skills?: Array<{ id: string; name: string; category: string }>;
    achievements?: string[];
    fullDescription?: string;
}

// Philosophy 데이터 타입
export interface PhilosophyData {
    id: string;
    number: string;
    title: string;
    description: string;
    color: string;
}

export interface SkillTag {
    id: string;
    name: string;
    category: "frontend" | "backend" | "other";
}