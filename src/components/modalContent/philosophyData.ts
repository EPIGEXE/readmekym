interface Project {
    title: string;
    tech: string;
    year: string;
    description: string;
    images: string[];
}

interface GrowthChartData {
    date: string;
    frontend: number;
    backend: number;
    others: number;
}

interface GrowthEvidence {
    period: string;
    event: string;
    tech: string;
    category: string;
}

interface PhilosophyData {
    id: string;
    number: string;
    title: string;
    description: string;
    color: string;
}

interface NoteCategory {
    title: string;
    description: string;
    items: string[];
}

export const philosophyData: PhilosophyData[] = [
    {
        id: "01",
        number: "01",
        title: "만드는 개발자",
        description: "계속해서 새로운 아이디어를\n코드로 구현합니다.",
        color: "text-blue-500",
    },
    {
        id: "02",
        number: "02",
        title: "성장하는 개발자",
        description: "매일매일 항상 개발하며\n새로운 기술을 익히고 성장합니다.",
        color: "text-green-500",
    },
    {
        id: "03",
        number: "03",
        title: "정리하는 개발자",
        description: "솔루션 엔지니어부터 지금까지\n공부한 것을 정리하며 기록합니다.",
        color: "text-purple-500",
    },
];

export const projects: Project[] = [
    {
        title: "온실가스 차트 웹페이지",
        tech: "React · Chart.js · shadcn/ui",
        year: "2024.11",
        description: "한국 온실가스 배출량 데이터 시각화 웹페이지",
        images: [
            "/gallery/proj-7/greenGas1.png",
            "/gallery/proj-7/greenGas2.png",
            "/gallery/proj-7/greenGas3.png",
            "/gallery/proj-7/greenGas1.gif",
            "/gallery/proj-7/greenGas2.gif",
        ],
    },
    {
        title: "가계부 프로그램",
        tech: "Electron · React · SQLite",
        year: "2024.12-2025.01",
        description: "데스크탑 가계부 애플리케이션",
        images: [
            "/gallery/proj-8/saveWise1.png",
            "/gallery/proj-8/saveWise2.png",
            "/gallery/proj-8/saveWise3.png",
            "/gallery/proj-8/saveWise4.png",
            "/gallery/proj-8/saveWise5.png",
            "/gallery/proj-8/saveWise6.png",
            "/gallery/proj-8/saveWise1.gif",
            "/gallery/proj-8/saveWise2.gif",
            "/gallery/proj-8/saveWise3.gif",
        ],
    },
    {
        title: "시맨틱 검색 기반 마인드맵 서비스",
        tech: "React · React Flow · Dagre · AI Embedding API · Tailwind CSS",
        year: "2025.01-02",
        description: "AI 임베딩을 활용한 의미적 검색 마인드맵",
        images: ["/gallery/proj-12/MindMap1.png", "/gallery/proj-12/MindMap1.gif", "/gallery/proj-12/MindMap2.gif"],
    },
    {
        title: "WELKIT - 신입사원 온보딩 플랫폼",
        tech: "React · TypeScript · Next.js · Tanstack Query · Tailwind CSS",
        year: "2025.01-03",
        description: "신입사원을 위한 용어 사전 및 커뮤니티 서비스",
        images: [
            "/gallery/proj-11/welkit1.png",
            "/gallery/proj-11/welkit2.png",
            "/gallery/proj-11/welkit3.png",
            "/gallery/proj-11/welkit4.png",
        ],
    },
    {
        title: "온라인 스캠 방지 사이트",
        tech: "Next.js · TypeScript · Tailwind CSS",
        year: "2025.07",
        description: "증가하는 온라인 스캠 피해 예방을 위한 교육용 웹사이트",
        images: [
            "/gallery/proj-9/fonzi1.png",
            "/gallery/proj-9/fonzi2.png",
            "/gallery/proj-9/fonzi3.png",
            "/gallery/proj-9/fonzi4.png",
            "/gallery/proj-9/fonzi5.png",
            "/gallery/proj-9/fonzi6.png",
            "/gallery/proj-9/fonzi7.png",
            "/gallery/proj-9/fonzi8.png",
        ],
    },
    {
        title: "다국어 멀티 블로그 포스팅 프로그램",
        tech: "Electron · React · TypeScript · TypeORM · SQLite",
        year: "2025.08-09",
        description: "LLM API 자동 번역과 dev.to, Google Blogger, Qiita 3개 플랫폼 동시 포스팅 도구",
        images: [
            "/gallery/proj-10/loudSelf1.png",
            "/gallery/proj-10/loudSelf2.png",
            "/gallery/proj-10/loudSelf3.png",
            "/gallery/proj-10/loudSelf4.png",
            "/gallery/proj-10/loudSelf5.png",
            "/gallery/proj-10/loudSelf6.png",
            "/gallery/proj-10/loudSelf7.png",
            "/gallery/proj-10/loudSelf1.gif",
            "/gallery/proj-10/loudSelf2.gif",
        ],
    },
];

// 기술 성장 타임라인 차트 데이터
export const growthChartData: GrowthChartData[] = [
    { date: "2021.09", frontend: 0, backend: 0, others: 12 }, // PLM 엔지니어 시작
    { date: "2022.06", frontend: 0, backend: 0, others: 28 }, // PLM 프로젝트 완수, 업무 숙련도 향상
    { date: "2023.12", frontend: 0, backend: 0, others: 40 }, // PLM 전문화, 고객사 프로젝트 경험
    { date: "2024.01", frontend: 5, backend: 12, others: 42 }, // C# .NET 개발 시작
    { date: "2024.04", frontend: 12, backend: 22, others: 44 }, // Spring Boot + Thymeleaf 첫 프로젝트
    { date: "2024.07", frontend: 28, backend: 35, others: 46 }, // React 전환 + Spring Cloud MSA
    { date: "2024.11", frontend: 45, backend: 38, others: 48 }, // Chart.js 데이터 시각화
    { date: "2024.12", frontend: 52, backend: 40, others: 50 }, // Electron 데스크탑 앱 개발
    { date: "2025.01", frontend: 65, backend: 42, others: 52 }, // WebSocket 실시간 통신 + React Flow
    { date: "2025.02", frontend: 70, backend: 43, others: 53 }, // AI Embedding API 통합
    { date: "2025.04", frontend: 73, backend: 44, others: 54 }, // Tanstack Query + Next.js 팀 협업
    { date: "2025.07", frontend: 78, backend: 46, others: 54 }, // Next.js SSG/SEO 최적화
    { date: "2025.08", frontend: 80, backend: 50, others: 55 }, // LLM API + TypeORM 다국어 자동화
    { date: "2025.10", frontend: 85, backend: 52, others: 55 }, // Framer Motion 인터랙티브 UI
];

// 성장 근거 (프로젝트 기반)
export const growthEvidence: GrowthEvidence[] = [
    { period: "2021.09", event: "PLM 엔지니어 시작", tech: "Teamcenter PLM BOM 구조 설계", category: "others" },
    { period: "2022.06", event: "PLM 프로젝트 완수", tech: "RDNL 시스템 구축 및 커스터마이징", category: "others" },
    { period: "2023.12", event: "PLM 숙련화", tech: "고객사 맞춤형 솔루션 개발", category: "others" },
    { period: "2024.01", event: "개발자 전환", tech: "Windows Forms 레거시 UI 개선", category: "backend" },
    { period: "2024.04", event: "Spring Boot 프로젝트", tech: "Thymeleaf 템플릿 엔진 + JPA", category: "backend" },
    { period: "2024.07", event: "React 본격 전환", tech: "SNMP 네트워크 모니터링 UI", category: "frontend" },
    { period: "2024.11", event: "데이터 시각화", tech: "Chart.js + Recharts + shadcn/ui", category: "frontend" },
    { period: "2024.12", event: "Electron 멀티플랫폼", tech: "IPC 통신 + SQLite ORM", category: "frontend" },
    { period: "2025.01", event: "실시간 통신 구현", tech: "WebSocket + Canvas Rendering (Konva)", category: "frontend" },
    { period: "2025.02", event: "AI 기반 시각화", tech: "OpenAI Embedding API + React Flow", category: "frontend" },
    { period: "2025.04", event: "협업 프로젝트", tech: "Next.js 13 App Router + Tanstack Query", category: "frontend" },
    { period: "2025.07", event: "SSG 최적화", tech: "Next.js Static Generation + SEO", category: "frontend" },
    { period: "2025.08", event: "다국어 자동화 시스템", tech: "TypeORM + Claude API 번역 + Multi-platform Posting", category: "backend" },
];

export const noteCategories: NoteCategory[] = [
    {
        title: "기술 스택별 체계화",
        description: "프론트엔드, 백엔드, 데이터베이스로 대분류",
        items: ["각 기술의 핵심 개념 정리", "실습 코드와 예제", "트러블슈팅 경험", "베스트 프랙티스"],
    },
    {
        title: "프로젝트 회고록",
        description: "10개 프로젝트의 상세 기록과 회고",
        items: ["구현 과정 단계별 기록", "기술적 도전과 해결", "배운 점과 아쉬운 점", "다음 프로젝트 개선 방향"],
    },
    {
        title: "도구 및 환경 설정",
        description: "개발 생산성을 위한 도구와 환경",
        items: ["Git 워크플로우", "CI/CD 파이프라인", "개발 환경 자동화", "Electron 앱 배포"],
    },
];