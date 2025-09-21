import type { DeveloperData } from '../types'

export const developerData: DeveloperData = {
    experiences: [
        {
            id: 'exp-1',
            type: 'experience',
            title: 'Siemens Solution Engineer',
            subtitle: 'SCOP',
            description: 'PLM 솔루션 엔지니어',
            startYear: 2021,
            endYear: 2023,
            startMonth: 9,
            endMonth: 12
        },
        {
            id: 'exp-2',
            type: 'experience',
            title: 'Web Developer',
            subtitle: 'CATIS',
            description: '웹 개발 및 솔루션 개발',
            startYear: 2024,
            endYear: 2025,
            startMonth: 1,
            endMonth: 9
        }
    ],
    projects: [
        // SCOP 경력 관련 프로젝트
        {
            id: 'proj-1',
            type: 'project',
            title: '제조 회사 A사 PLM 업그레이드',
            description: '치과의료 기기 제조 회사 A사 PLM 시스템 업그레이드 프로젝트',
            startYear: 2021,
            endYear: 2022,
            startMonth: 9,
            endMonth: 3,
            skills: [
                { id: 'proj-1-teamcenter', name: 'Siemens Teamcenter', category: 'other' },
                { id: 'proj-1-teamcenter 사양관리', name: 'Teamcenter 사양관리', category: 'other' },
            ],
            experienceId: 'exp-1'
        },
        {
            id: 'proj-2',
            type: 'project',
            title: '제약 회사 B사 BOM 프로젝트',
            description: '바이오 의약품 제조 회사 B사 BOM 시스템 구축 프로젝트',
            startYear: 2022,
            endYear: 2023,
            startMonth: 6,
            endMonth: 2,
            skills: [
                { id: 'proj-2-teamcenter', name: 'Siemens Teamcenter', category: 'other' },
                { id: 'proj-2-teamcenter BOM', name: 'Teamcenter BOM', category: 'other' },
            ],
            experienceId: 'exp-1'
        },
        // CATIS 경력 관련 프로젝트
        {
            id: 'proj-3',
            type: 'project',
            title: 'Axilog 개선',
            description: 'CATIS 출입통제 프로그램 Axilog 개선 및 유지보수',
            startYear: 2024,
            endYear: 2024,
            startMonth: 1,
            endMonth: 3,
            skills: [
                { id: 'proj-3-csharp', name: 'C#', category: 'backend' },
                { id: 'proj-3-dotnet', name: '.NET', category: 'backend' },
            ],
            experienceId: 'exp-2'
        },
        {
            id: 'proj-4',
            type: 'project',
            title: '화물검색 이력관리 프로그램 개선',
            description: '국가 시설 C 납품용 화물검색 이력관리 프로그램 개선',
            startYear: 2024,
            endYear: 2024,
            startMonth: 4,
            endMonth: 6,
            skills: [
                { id: 'proj-4-springboot', name: 'Spring Boot', category: 'backend' },
                { id: 'proj-4-thymeleaf', name: 'Thymeleaf', category: 'frontend' },
            ],
            experienceId: 'exp-2'
        },
        {
            id: 'proj-5',
            type: 'project',
            title: '국가 시설 C 출입통제 개선 프로젝트',
            description: '국가 시설 C 출입통제 프로그램 SNMP 인터페이스 서버 및 화면 개발',
            startYear: 2024,
            endYear: 2024,
            startMonth: 7,
            endMonth: 11,
            skills: [
                { id: 'proj-5-springboot', name: 'Spring Boot', category: 'backend' },
                { id: 'proj-5-react', name: 'React', category: 'frontend' },
                { id: 'proj-5-snmp', name: 'SNMP', category: 'other' },
            ],
            experienceId: 'exp-2'
        },
        {
            id: 'proj-6',
            type: 'project',
            title: '국가 시설 C 통합 출입통제 개발 프로그램',
            description: '국가 시설 C 통합 출입통제 시스템 화면 개발',
            startYear: 2025,
            endYear: 2025,
            startMonth: 1,
            endMonth: 9,
            skills: [
                { id: 'proj-6-react', name: 'React', category: 'frontend' },
                { id: 'proj-6-tailwind', name: 'Tailwind CSS', category: 'frontend' },
                { id: 'proj-6-zustand', name: 'Zustand', category: 'frontend' },
                { id: 'proj-6-react-query', name: 'React Query', category: 'frontend' },
            ],
            experienceId: 'exp-2'
        },
        // 개인 프로젝트
        {
            id: 'proj-7',
            type: 'project',
            title: '온실가스 차트 웹페이지',
            description: '웹 개발 연습용 차트 페이지',
            startYear: 2024,
            endYear: 2024,
            startMonth: 11,
            endMonth: 11,
            skills: [
                { id: 'proj-7-react', name: 'React', category: 'frontend' },
                { id: 'proj-7-tailwind', name: 'Tailwind CSS', category: 'frontend' }
            ]
        },
        {
            id: 'proj-8',
            type: 'project',
            title: '가계부 프로그램',
            description: '데스크탑 가계부 애플리케이션',
            startYear: 2024,
            endYear: 2025,
            startMonth: 12,
            endMonth: 1,
            skills: [
                { id: 'proj-8-electron', name: 'Electron', category: 'frontend' },
                { id: 'proj-8-react', name: 'React', category: 'frontend' },
                { id: 'proj-8-sqlite', name: 'SQLite', category: 'backend' },
            ]
        },
        {
            id: 'proj-9',
            type: 'project',
            title: '온라인 스캠 방지 사이트',
            description: '스캠 방지 교육 사이트',
            startYear: 2025,
            endYear: 2025,
            startMonth: 7,
            endMonth: 7,
            skills: [
                { id: 'proj-9-nextjs', name: 'Next.js', category: 'frontend' },
                { id: 'proj-9-typescript', name: 'TypeScript', category: 'frontend' },
                { id: 'proj-9-tailwind', name: 'Tailwind CSS', category: 'frontend' },
            ]
        },
        {
            id: 'proj-10',
            type: 'project',
            title: '다국어 멀티 블로그 포스팅 프로그램',
            description: '자동화된 멀티 블로그 관리 툴',
            startYear: 2025,
            endYear: 2025,
            startMonth: 8,
            endMonth: 9,
            skills: [
                { id: 'proj-10-electron', name: 'Electron', category: 'frontend' },
                { id: 'proj-10-react', name: 'React', category: 'frontend' },
                { id: 'proj-10-typescript', name: 'TypeScript', category: 'frontend' },
                { id: 'proj-10-tailwind', name: 'Tailwind CSS', category: 'frontend' },
                { id: 'proj-10-typeorm', name: 'TypeORM', category: 'backend' },
                { id: 'proj-10-sqlite', name: 'SQLite', category: 'backend' },
            ]
        }
    ],
    yearRange: {
        start: 2021,
        end: 2025
    }
}