import type { DetailedExperience, DetailedSkill, ImplementationDetail } from "./detailTypes";

// 사이드 바 데이터 타입
export interface SidebarData {
    id: string;
    number: string;
    title: string;
    description: string;
    color: string;
    role?: string;
    teamSize?: number;
    skills?: Array<{ id: string; name: string; category: string; }>;
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

export interface DetailedProject {
    id: string
    title: string
    subtitle?: string
    shortDescription: string // 기존 description
    fullDescription: string // 상세 설명
    startYear: number
    endYear: number
    startMonth: number
    endMonth: number

    // 새로운 상세 정보
    skills: DetailedSkill[]
    implementation: ImplementationDetail[]
    challenges: string[] // 전체 프로젝트 도전 과제들
    achievements: string[] // 성과/결과
    retrospective: {
        whatWentWell: string[] // 잘된 점
        whatCouldBeImproved: string[] // 개선할 점
        lessonsLearned: string[] // 배운 점
        nextSteps?: string[] // 다음 단계 (선택사항)
    }

    // 추가 메타데이터
    teamSize?: number // 팀 규모
    role?: string // 담당 역할
    repository?: string // GitHub 링크
    SeeMore?: string // 더 보기 링크
    live?: string // 라이브 링크
    documentation?: string // 문서 링크

    // 경력 연관
    experienceId?: string
    type: 'project'
    itemType: 'experience' | 'project'
}

export interface DetailedDeveloperData {
    experiences: DetailedExperience[]
    projects: DetailedProject[]
}

export interface SkillTag {
    id: string
    name: string
    category: 'frontend' | 'backend' | 'other'
}