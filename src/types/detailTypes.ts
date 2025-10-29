import type { DetailedProject } from './common'
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

// 각각 독립적인 데이터 구조
