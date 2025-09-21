export interface SkillTag {
    id: string
    name: string
    category: 'frontend' | 'backend' | 'other'
}

export interface Project {
    id: string // 고유 식별자
    type: 'project'
    title: string
    description?: string
    startYear: number
    endYear: number
    startMonth: number // 1-12 for month
    endMonth: number // 1-12 for month
    skills: SkillTag[]
    experienceId?: string // 연관된 경력 ID (독립 프로젝트면 undefined)
}

export interface Experience {
    id: string // 고유 식별자
    type: 'experience'
    title: string
    subtitle?: string
    description?: string
    startYear: number
    endYear: number
    startMonth: number // 1-12 for month
    endMonth: number // 1-12 for month
}

export interface DeveloperData {
    experiences: Experience[] // 모든 경력
    projects: Project[] // 모든 프로젝트
    yearRange: { start: number; end: number } // 표시할 연도 범위
}

export interface StackedSkills {
    frontend: SkillTag[]
    backend: SkillTag[]
    other: SkillTag[]
}

// Re-export detailed types
export * from './detailTypes'