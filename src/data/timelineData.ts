import type { YearData } from '../types'

// Timeline data with specific months for accurate visualization - 역순으로 정렬 (과거부터 현재까지)
export const timelineYears: YearData[] = [
    {
        year: 2020,
        events: {
            experience: [
                {
                    type: 'education',
                    title: 'Computer Science',
                    subtitle: 'University of Seoul',
                    startMonth: 1,
                    endMonth: 12,
                    description: '컴퓨터과학 기초 학습',
                    relatedSkills: [
                        { name: 'C++', category: 'backend' },
                        { name: 'Java', category: 'backend' },
                        { name: 'Python', category: 'backend' },
                        { name: 'Git', category: 'other' }
                    ]
                }
            ],
            projects: [
                {
                    type: 'project',
                    title: 'University Management System',
                    description: '학사관리 시스템 개발',
                    startMonth: 9,
                    endMonth: 12,
                    relatedSkills: [
                        { name: 'Java', category: 'backend' },
                        { name: 'MySQL', category: 'backend' },
                        { name: 'Git', category: 'other' }
                    ]
                }
            ],
            skills: []
        }
    },
    {
        year: 2021,
        events: {
            experience: [
                {
                    type: 'experience',
                    title: 'Junior Developer',
                    subtitle: 'StartupLab',
                    startMonth: 3,
                    endMonth: 12,
                    description: '풀스택 개발 담당',
                    relatedSkills: [
                        { name: 'React', category: 'frontend' },
                        { name: 'Node.js', category: 'backend' },
                        { name: 'MongoDB', category: 'backend' },
                        { name: 'AWS', category: 'other' }
                    ]
                }
            ],
            projects: [
                {
                    type: 'project',
                    title: 'Startup MVP Platform',
                    description: 'React 기반 스타트업 플랫폼',
                    startMonth: 4,
                    endMonth: 11,
                    relatedSkills: [
                        { name: 'React', category: 'frontend' },
                        { name: 'Express.js', category: 'backend' },
                        { name: 'MongoDB', category: 'backend' },
                        { name: 'AWS', category: 'other' }
                    ]
                }
            ],
            skills: []
        }
    },
    {
        year: 2022,
        events: {
            experience: [
                {
                    type: 'experience',
                    title: 'Frontend Developer',
                    subtitle: 'TechCorp Inc.',
                    startMonth: 1,
                    endMonth: 12,
                    description: 'React 전문 프론트엔드 개발',
                    relatedSkills: [
                        { name: 'React', category: 'frontend' },
                        { name: 'TypeScript', category: 'frontend' },
                        { name: 'Styled Components', category: 'frontend' },
                        { name: 'Redux', category: 'frontend' }
                    ]
                }
            ],
            projects: [
                {
                    type: 'project',
                    title: 'Corporate Dashboard',
                    description: '기업용 대시보드 시스템',
                    startMonth: 2,
                    endMonth: 8,
                    relatedSkills: [
                        { name: 'React', category: 'frontend' },
                        { name: 'TypeScript', category: 'frontend' },
                        { name: 'Redux', category: 'frontend' },
                        { name: 'Chart.js', category: 'frontend' }
                    ]
                },
                {
                    type: 'project',
                    title: 'E-Learning Platform',
                    description: '온라인 학습 플랫폼',
                    startMonth: 9,
                    endMonth: 12,
                    relatedSkills: [
                        { name: 'React', category: 'frontend' },
                        { name: 'TypeScript', category: 'frontend' },
                        { name: 'Styled Components', category: 'frontend' },
                        { name: 'WebRTC', category: 'other' }
                    ]
                }
            ],
            skills: []
        }
    },
    {
        year: 2023,
        events: {
            experience: [
                {
                    type: 'experience',
                    title: 'Senior Frontend Developer',
                    subtitle: 'TechCorp Inc.',
                    startMonth: 1,
                    endMonth: 12,
                    description: '팀 리딩 및 아키텍처 설계',
                    relatedSkills: [
                        { name: 'React', category: 'frontend' },
                        { name: 'Next.js', category: 'frontend' },
                        { name: 'React Query', category: 'frontend' },
                        { name: 'Zustand', category: 'frontend' },
                        { name: 'Docker', category: 'other' }
                    ]
                }
            ],
            projects: [
                {
                    type: 'project',
                    title: 'Task Management App',
                    description: 'React Query 기반 협업 툴',
                    startMonth: 2,
                    endMonth: 7,
                    relatedSkills: [
                        { name: 'React', category: 'frontend' },
                        { name: 'React Query', category: 'frontend' },
                        { name: 'Zustand', category: 'frontend' },
                        { name: 'Node.js', category: 'backend' },
                        { name: 'Docker', category: 'other' }
                    ]
                },
                {
                    type: 'project',
                    title: 'Design System',
                    description: '회사 공통 디자인 시스템',
                    startMonth: 8,
                    endMonth: 12,
                    relatedSkills: [
                        { name: 'React', category: 'frontend' },
                        { name: 'TypeScript', category: 'frontend' },
                        { name: 'Storybook', category: 'frontend' },
                        { name: 'Figma', category: 'other' }
                    ]
                }
            ],
            skills: []
        }
    },
    {
        year: 2024,
        events: {
            experience: [
                {
                    type: 'experience',
                    title: 'Tech Lead',
                    subtitle: 'TechCorp Inc.',
                    startMonth: 1,
                    endMonth: 8,
                    description: '기술 전략 수립 및 팀 관리',
                    relatedSkills: [
                        { name: 'Next.js', category: 'frontend' },
                        { name: 'TypeScript', category: 'frontend' },
                        { name: 'Tailwind CSS', category: 'frontend' },
                        { name: 'PostgreSQL', category: 'backend' },
                        { name: 'AWS', category: 'other' },
                        { name: 'Kubernetes', category: 'other' }
                    ]
                }
            ],
            projects: [
                {
                    type: 'project',
                    title: 'E-Commerce Platform',
                    description: 'Next.js 기반 이커머스',
                    startMonth: 3,
                    endMonth: 8,
                    relatedSkills: [
                        { name: 'Next.js', category: 'frontend' },
                        { name: 'TypeScript', category: 'frontend' },
                        { name: 'Tailwind CSS', category: 'frontend' },
                        { name: 'PostgreSQL', category: 'backend' },
                        { name: 'AWS', category: 'other' }
                    ]
                },
                {
                    type: 'project',
                    title: 'Portfolio Website',
                    description: '개인 포트폴리오 사이트',
                    startMonth: 9,
                    endMonth: 12,
                    relatedSkills: [
                        { name: 'React', category: 'frontend' },
                        { name: 'TypeScript', category: 'frontend' },
                        { name: 'Framer Motion', category: 'frontend' },
                        { name: 'Tailwind CSS', category: 'frontend' },
                        { name: 'Vite', category: 'other' }
                    ]
                }
            ],
            skills: []
        }
    }
]