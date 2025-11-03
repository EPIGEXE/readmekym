import * as Dialog from "@radix-ui/react-dialog";
import { Drawer } from "vaul";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PhilosophyModalProps {
    isOpen: boolean;
    onClose: () => void;
    philosophyData: {
        id: string;
        number: string;
        title: string;
        description: string;
        color: string;
    } | null;
}

// 만드는 개발자 - 사이드 프로젝트 소개
function Philosophy01Content() {
    const projects = [
        {
            title: '온실가스 차트 웹페이지',
            tech: 'React · Chart.js · shadcn/ui',
            year: '2024.11',
            description: '한국 온실가스 배출량 데이터 시각화 웹페이지',
            image: '/greengas.png',
        },
        {
            title: '가계부 프로그램',
            tech: 'Electron · React · SQLite',
            year: '2024.12-2025.01',
            description: '데스크탑 가계부 애플리케이션',
            image: '/save.png',
        },
        {
            title: '시맨틱 검색 기반 마인드맵 서비스',
            tech: 'React · React Flow · Dagre · AI Embedding API · Tailwind CSS',
            year: '2025.01-02',
            description: 'AI 임베딩을 활용한 의미적 검색 마인드맵',
            image: '/mindmap.png',
        },
        {
            title: 'WELKIT - 신입사원 온보딩 플랫폼',
            tech: 'React · TypeScript · Next.js · Tanstack Query · Tailwind CSS',
            year: '2025.01-03',
            description: '신입사원을 위한 용어 사전 및 커뮤니티 서비스',
            image: '/welkit.png',
        },
        {
            title: '온라인 스캠 방지 사이트',
            tech: 'Next.js · TypeScript · Tailwind CSS',
            year: '2025.07',
            description: '증가하는 온라인 스캠 피해 예방을 위한 교육용 웹사이트',
            image: '/fonzi.png',
        },
        {
            title: '다국어 멀티 블로그 포스팅 프로그램',
            tech: 'Electron · React · TypeScript · TypeORM · SQLite',
            year: '2025.08-09',
            description: 'LLM API 자동 번역과 dev.to, Google Blogger, Qiita 3개 플랫폼 동시 포스팅 도구',
            image: '/loudSelf.png',
        },
        {
            title: '개인 포트폴리오 웹사이트',
            tech: 'React · TypeScript · Tailwind CSS · Framer Motion',
            year: '2025.10',
            description: '인터랙티브한 타임라인과 갤러리로 구성된 포트폴리오',
            image: '/portfolio.png',
        },
    ];

    return (
        <div className="space-y-8 md:space-y-12">
            {/* 인트로 */}
            <div className="border-l-4 border-blue-500 pl-4 md:pl-6 py-2 md:py-3">
                <p className="text-base md:text-xl text-gray-800 leading-relaxed mb-2">
                    아이디어가 떠오르면 바로 구현합니다
                </p>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    실무에서 배운 기술과 새롭게 익힌 스택을 활용해 유용한 프로그램을 만들기 위해 노력합니다.
                </p>
            </div>

            {/* 프로젝트 목록 */}
            <div className="space-y-6 md:space-y-8">
                {projects.map((project, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 pb-6 md:pb-8 border-b border-gray-100 last:border-0 last:pb-0">
                        {/* 왼쪽: 넘버링 + 연도 */}
                        <div className="space-y-2 md:space-y-3">
                            <div className="text-3xl md:text-5xl font-light text-gray-200">
                                {String(idx + 1).padStart(2, '0')}
                            </div>
                            <div className="border-t border-gray-200 pt-2">
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                                    Year
                                </div>
                                <div className="text-xs md:text-sm text-gray-900 font-medium">
                                    {project.year}
                                </div>
                            </div>
                        </div>

                        {/* 오른쪽: 내용 */}
                        <div className="md:col-span-4 space-y-2 md:space-y-3">
                            <div className="space-y-2">
                                <h4 className="text-lg md:text-xl font-semibold text-gray-900 font-cafe24-gowoonbam">
                                    {project.title}
                                </h4>
                                <p className="text-xs text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                                    {project.tech}
                                </p>
                                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                                    {project.description}
                                </p>
                            </div>
                            {/* 프로젝트 이미지 */}
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-auto border border-gray-200 rounded"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* 하단 통계 */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-gray-200">
                <div className="text-center space-y-1 md:space-y-2">
                    <div className="text-2xl md:text-3xl font-light text-blue-500">{projects.length}</div>
                    <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                        Personal Projects
                    </div>
                </div>
                <div className="text-center space-y-1 md:space-y-2">
                    <div className="text-2xl md:text-3xl font-light text-blue-500">8+</div>
                    <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                        Tech Stack
                    </div>
                </div>
                <div className="text-center space-y-1 md:space-y-2">
                    <div className="text-2xl md:text-3xl font-light text-blue-500">1Y+</div>
                    <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                        Development
                    </div>
                </div>
            </div>
        </div>
    );
}

// 성장하는 개발자 - 빠른 학습과 실전 적용
function Philosophy02Content() {
    // 기술 성장 타임라인 차트 데이터
    const growthChartData = [
        { date: '2021.09', frontend: 0, backend: 0, others: 10 },
        { date: '2022.06', frontend: 0, backend: 0, others: 25 },
        { date: '2023.12', frontend: 0, backend: 0, others: 35 },
        { date: '2024.01', frontend: 8, backend: 20, others: 38 },
        { date: '2024.04', frontend: 15, backend: 40, others: 42 },
        { date: '2024.07', frontend: 28, backend: 50, others: 46 },
        { date: '2024.11', frontend: 48, backend: 53, others: 48 },
        { date: '2024.12', frontend: 58, backend: 55, others: 50 },
        { date: '2025.01', frontend: 70, backend: 57, others: 52 },
        { date: '2025.02', frontend: 75, backend: 58, others: 53 },
        { date: '2025.07', frontend: 80, backend: 60, others: 54 },
        { date: '2025.08', frontend: 83, backend: 62, others: 55 },
        { date: '2025.10', frontend: 85, backend: 63, others: 55 },
    ];

    // 성장 근거 (프로젝트 기반)
    const growthEvidence = [
        { period: '2021.09', event: 'PLM 엔지니어 시작', tech: 'Teamcenter BOM 설계', category: 'others' },
        { period: '2022.06', event: 'PLM 전문화', tech: 'A사/B사 프로젝트 완수', category: 'others' },
        { period: '2024.01', event: 'C# .NET 레거시 개선', tech: 'Windows Forms 개선', category: 'backend' },
        { period: '2024.04', event: 'Spring Boot 첫 프로젝트', tech: 'Thymeleaf UI 재구축', category: 'backend' },
        { period: '2024.07', event: 'SNMP 마이크로서비스', tech: 'Spring Cloud 구축', category: 'backend' },
        { period: '2024.07', event: 'React 전환 시작', tech: 'SNMP 인터페이스 서버', category: 'frontend' },
        { period: '2024.11', event: '차트 시각화 프로젝트', tech: 'Chart.js + shadcn/ui', category: 'frontend' },
        { period: '2024.12', event: 'Electron 데스크탑 앱', tech: 'React + SQLite 가계부', category: 'frontend' },
        { period: '2025.01', event: 'WebSocket 실시간 통신', tech: 'Konva 도면 기반 UI', category: 'frontend' },
        { period: '2025.01', event: '팀 협업 프로젝트', tech: 'Next.js + Tanstack Query', category: 'frontend' },
        { period: '2025.02', event: 'AI 그래프 시각화', tech: 'React Flow + Dagre', category: 'frontend' },
        { period: '2025.07', event: 'Next.js SSG 마스터', tech: 'SEO 최적화 스캠 방지', category: 'frontend' },
        { period: '2025.08', event: 'LLM API 통합', tech: 'TypeORM + 다국어 자동번역', category: 'backend' },
        { period: '2025.10', event: 'Framer Motion 애니메이션', tech: '인터랙티브 포트폴리오', category: 'frontend' },
    ];

    return (
        <div className="space-y-8 md:space-y-12">
            {/* 인트로 */}
            <div className="border-l-4 border-green-500 pl-4 md:pl-6 py-2 md:py-3">
                <p className="text-base md:text-xl text-gray-800 leading-relaxed mb-2">
                    빠르게 배우고 바로 적용합니다
                </p>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    새로운 기술을 학습하고 실전 프로젝트로 검증하는 사이클을 반복합니다.
                </p>
            </div>

            {/* 기술 성장 차트 */}
            <div className="space-y-4 md:space-y-6">
                <div className="border-b border-gray-200 pb-2 md:pb-3">
                    <h4 className="text-xs text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                        Skill Growth Timeline
                    </h4>
                </div>
                <div className="w-full h-64 md:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={growthChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 10, fill: '#9ca3af' }}
                                stroke="#e5e7eb"
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: '#9ca3af' }}
                                stroke="#e5e7eb"
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                            />
                            <Legend
                                wrapperStyle={{ fontSize: '12px' }}
                                iconType="line"
                            />
                            <Line
                                type="monotone"
                                dataKey="frontend"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                name="Frontend"
                                dot={{ fill: '#3b82f6', r: 3 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="backend"
                                stroke="#10b981"
                                strokeWidth={2}
                                name="Backend"
                                dot={{ fill: '#10b981', r: 3 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="others"
                                stroke="#6b7280"
                                strokeWidth={2}
                                name="Tools & Others"
                                dot={{ fill: '#6b7280', r: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 성장 근거 타임라인 */}
            <div className="space-y-4 md:space-y-6">
                <div className="border-b border-gray-200 pb-2 md:pb-3">
                    <h4 className="text-xs text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                        Growth Evidence
                    </h4>
                </div>
                <div className="space-y-3 md:space-y-4">
                    {growthEvidence.map((item, idx) => (
                        <div key={idx} className="flex gap-3 md:gap-4 items-start">
                            <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                                item.category === 'frontend' ? 'bg-blue-500' :
                                item.category === 'backend' ? 'bg-green-600' :
                                'bg-gray-500'
                            }`} />
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4">
                                <div className="text-xs text-gray-500 font-medium">
                                    {item.period}
                                </div>
                                <div className="md:col-span-4">
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                                        <h5 className="text-sm font-semibold text-gray-900">
                                            {item.event}
                                        </h5>
                                        <span className="text-xs text-gray-500">
                                            {item.tech}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 하단 통계 */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-gray-200">
                <div className="text-center space-y-1 md:space-y-2">
                    <div className="text-2xl md:text-3xl font-light text-green-500">85%</div>
                    <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                        Frontend Skill
                    </div>
                </div>
                <div className="text-center space-y-1 md:space-y-2">
                    <div className="text-2xl md:text-3xl font-light text-green-500">14</div>
                    <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                        Projects
                    </div>
                </div>
                <div className="text-center space-y-1 md:space-y-2">
                    <div className="text-2xl md:text-3xl font-light text-green-500">1Y</div>
                    <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                        React Journey
                    </div>
                </div>
            </div>
        </div>
    );
}

// 정리하는 개발자 - 노션 학습 기록
function Philosophy03Content() {
    const noteCategories = [
        {
            title: '기술 스택별 체계화',
            description: '프론트엔드, 백엔드, 데이터베이스로 대분류',
            items: ['각 기술의 핵심 개념 정리', '실습 코드와 예제', '트러블슈팅 경험', '베스트 프랙티스'],
        },
        {
            title: '프로젝트 회고록',
            description: '10개 프로젝트의 상세 기록과 회고',
            items: ['구현 과정 단계별 기록', '기술적 도전과 해결', '배운 점과 아쉬운 점', '다음 프로젝트 개선 방향'],
        },
        {
            title: '도구 및 환경 설정',
            description: '개발 생산성을 위한 도구와 환경',
            items: ['Git 워크플로우', 'CI/CD 파이프라인', '개발 환경 자동화', 'Electron 앱 배포'],
        },
    ];

    return (
        <div className="space-y-8 md:space-y-12">
            {/* 인트로 */}
            <div className="border-l-4 border-purple-500 pl-4 md:pl-6 py-2 md:py-3">
                <p className="text-base md:text-xl text-gray-800 leading-relaxed mb-2">
                    기록하지 않으면 기억되지 않습니다
                </p>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    솔루션 엔지니어 시절부터 현재까지 배운 모든 것을 체계적으로 정리하고 있습니다.
                </p>
            </div>

            {/* 노션 워크스페이스 */}
            <div className="space-y-3 md:space-y-4">
                <div className="flex items-baseline justify-between border-b border-gray-200 pb-2 md:pb-3">
                    <h4 className="text-xs text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                        Notion Workspace
                    </h4>
                    <a
                        href="https://befitting-silica-24b.notion.site/ALL-in-One-97eb5e1df97b4782bd93725af829e629?pvs=74"
                        className="text-xs text-purple-600 hover:text-purple-700 uppercase tracking-wider font-medium transition-colors"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Open Workspace →
                    </a>
                </div>
                {/* 노션 스크린샷 */}
                <img
                    src="/notion.png"
                    alt="노션 워크스페이스"
                    className="w-full h-auto border-2 border-gray-200 rounded hover:border-purple-200 transition-colors"
                />
            </div>

            {/* 정리 방식 및 구조 */}
            <div className="space-y-6 md:space-y-8">
                {noteCategories.map((category, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 pb-6 md:pb-8 border-b border-gray-100 last:border-0 last:pb-0">
                        {/* 왼쪽: 넘버 */}
                        <div className="space-y-2 md:space-y-3">
                            <div className="text-3xl md:text-5xl font-light text-gray-200">
                                {String(idx + 1).padStart(2, '0')}
                            </div>
                        </div>

                        {/* 오른쪽: 내용 */}
                        <div className="md:col-span-4 space-y-2 md:space-y-3">
                            <div className="space-y-2">
                                <h5 className="text-lg md:text-xl font-semibold text-gray-900 font-cafe24-gowoonbam">
                                    {category.title}
                                </h5>
                                <p className="text-xs md:text-sm text-gray-600">
                                    {category.description}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                                {category.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="flex items-start gap-2 text-xs md:text-sm text-gray-600">
                                        <span className="text-purple-400 mt-0.5">•</span>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 하단 통계 */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-gray-200">
                <div className="text-center space-y-1 md:space-y-2">
                    <div className="text-2xl md:text-3xl font-light text-purple-500">6</div>
                    <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                        Main Categories
                    </div>
                </div>
                <div className="text-center space-y-1 md:space-y-2">
                    <div className="text-2xl md:text-3xl font-light text-purple-500">25+</div>
                    <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                        Topics
                    </div>
                </div>
                <div className="text-center space-y-1 md:space-y-2">
                    <div className="text-2xl md:text-3xl font-light text-purple-500">4Y+</div>
                    <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                        Since 2021
                    </div>
                </div>
            </div>
        </div>
    );
}

export function PhilosophyModal({ isOpen, onClose, philosophyData }: PhilosophyModalProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 767px)');
        const checkMobile = () => {
            setIsMobile(mediaQuery.matches);
        };
        checkMobile();
        mediaQuery.addEventListener('change', checkMobile);
        return () => mediaQuery.removeEventListener('change', checkMobile);
    }, []);

    if (!philosophyData) return null;

    const content = (
        <>
            {philosophyData.id === "01" && <Philosophy01Content />}
            {philosophyData.id === "02" && <Philosophy02Content />}
            {philosophyData.id === "03" && <Philosophy03Content />}
        </>
    );

    // Mobile: Bottom Sheet
    if (isMobile) {
        return (
            <Drawer.Root open={isOpen} onOpenChange={onClose}>
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
                    <Drawer.Content className="bg-white flex flex-col rounded-t-[20px] h-[90vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
                        {/* Handle */}
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mt-4 mb-4" />

                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-start justify-between">
                            <div>
                                <span className={`text-2xl font-light ${philosophyData.color} block mb-1`}>
                                    {philosophyData.number}
                                </span>
                                <Drawer.Title className="text-lg font-semibold text-gray-900 font-cafe24-gowoonbam">
                                    {philosophyData.title}
                                </Drawer.Title>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-4 py-6 overflow-y-auto flex-1">
                            <Drawer.Description asChild>
                                <div>{content}</div>
                            </Drawer.Description>
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        );
    }

    // Desktop: Modal
    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                {/* Backdrop */}
                <Dialog.Overlay asChild>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 bg-black/50 z-40"
                    />
                </Dialog.Overlay>

                {/* Modal Content */}
                <Dialog.Content asChild>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-2xl max-w-6xl w-[95vw] max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-start justify-between">
                            <div>
                                <span className={`text-4xl font-light ${philosophyData.color} block mb-2`}>
                                    {philosophyData.number}
                                </span>
                                <Dialog.Title className="text-2xl font-semibold text-gray-900 font-cafe24-gowoonbam">
                                    {philosophyData.title}
                                </Dialog.Title>
                            </div>
                            <Dialog.Close asChild>
                                <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
                                    <X className="w-6 h-6" />
                                    <span className="sr-only">Close</span>
                                </button>
                            </Dialog.Close>
                        </div>

                        {/* Content - 스크롤 영역 */}
                        <div className="px-8 py-8 overflow-y-auto max-h-[calc(90vh-140px)]">
                            <Dialog.Description asChild>
                                <div>{content}</div>
                            </Dialog.Description>
                        </div>
                    </motion.div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
