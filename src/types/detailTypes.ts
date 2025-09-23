import type { SkillTag } from './index'

export interface DetailedSkill extends SkillTag {
    usage: string // 어떻게 사용했는지
    experience: 'beginner' | 'intermediate' | 'advanced' // 숙련도
}

export interface ImplementationDetail {
    id: string
    title: string
    description: string
    code?: string // 코드 예시 (선택사항)
    challenges?: string // 구현 중 어려웠던 점
    solution?: string // 해결 방법
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

export interface DetailedExperience {
    id: string
    title: string
    subtitle: string
    shortDescription: string // 기존 description
    fullDescription: string // 상세 설명
    startYear: number
    endYear: number
    startMonth: number
    endMonth: number

    // 새로운 상세 정보
    company: {
        name: string
        industry: string
        size: string // '대기업', '중소기업', '스타트업' 등
        website?: string
    }
    position: {
        title: string
        level: string // '신입', '경력 1년차' 등
        department: string
    }
    responsibilities: string[] // 주요 업무
    achievements: string[] // 성과
    skills: DetailedSkill[] // 사용한 기술들
    projects: string[] // 관련 프로젝트 ID들

    retrospective: {
        whatWentWell: string[]
        whatCouldBeImproved: string[]
        lessonsLearned: string[]
        careerGrowth: string[] // 커리어 성장 측면
    }

    type: 'experience'
    itemType: 'experience'
}

// 상세 페이지에서 사용할 union type - 완전히 분리된 구조
export type DetailedItem = DetailedProject | DetailedExperience

// 각각 독립적인 데이터 구조
export interface DetailedDeveloperData {
    experiences: DetailedExperience[]
    projects: DetailedProject[]
}

// 상세 페이지 컴포넌트에서 사용할 타입 가드
export function isDetailedProject(item: DetailedItem): item is DetailedProject {
    return item.itemType === 'project'
}

export function isDetailedExperience(item: DetailedItem): item is DetailedExperience {
    return item.itemType === 'experience'
}