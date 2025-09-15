export interface SkillTag {
    name: string
    category: 'frontend' | 'backend' | 'other'
}

export interface TimelineEvent {
    type: 'experience' | 'project' | 'education' | 'skill'
    title: string
    subtitle?: string
    description?: string
    startMonth: number // 1-12 for month
    endMonth?: number // 1-12 for month, undefined = ongoing
    tags?: string[]
    relatedSkills?: SkillTag[] // 프로젝트와 연관된 스킬들
}

export interface YearData {
    year: number
    events: {
        experience: TimelineEvent[]
        projects: TimelineEvent[]
        skills: TimelineEvent[]
    }
}

export interface StackedSkills {
    frontend: SkillTag[]
    backend: SkillTag[]
    other: SkillTag[]
}