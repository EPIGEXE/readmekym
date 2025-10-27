import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion } from "framer-motion";

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
            title: '다국어 멀티 블로그 포스팅 프로그램',
            tech: 'Electron · React · TypeScript · TypeORM · SQLite',
            year: '2025',
            description: 'LLM API 자동 번역과 dev.to, Google Blogger, Qiita 3개 플랫폼 동시 포스팅 도구',
            image: '/loudSelf.png',
        },
        {
            title: '온라인 스캠 방지 사이트',
            tech: 'Next.js · TypeScript · Tailwind CSS',
            year: '2025',
            description: '증가하는 온라인 스캠 피해 예방을 위한 교육용 웹사이트',
            image: '/fonzi.png',
        },
        {
            title: '가계부 프로그램',
            tech: 'Electron · React · SQLite',
            year: '2024-2025',
            description: '데스크탑 가계부 애플리케이션',
            image: '/save.png',
        },
        {
            title: '온실가스 차트 웹페이지',
            tech: 'React · Chart.js · shadcn/ui',
            year: '2024',
            description: '한국 온실가스 배출량 데이터 시각화 웹페이지',
            image: '/greengas.png',
        },
    ];

    return (
        <div className="space-y-8 md:space-y-12">
            {/* 인트로 */}
            <div className="border-l-4 border-blue-500 pl-4 md:pl-6 py-2 md:py-3">
                <p className="text-base md:text-xl text-gray-800 leading-relaxed mb-2" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                    아이디어가 떠오르면 바로 구현합니다
                </p>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
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

// 성장하는 개발자 - 초기 vs 후기 프로젝트 비교
function Philosophy02Content() {
    const timeline = [
        { year: '2021', level: 25, label: 'PLM 엔지니어', color: 'from-orange-300 to-orange-400' },
        { year: '2024 초', level: 50, label: 'C# & Spring Boot', color: 'from-yellow-400 to-yellow-500' },
        { year: '2024 말', level: 75, label: 'React 전문화', color: 'from-lime-400 to-lime-500' },
        { year: '2025', level: 90, label: '풀스택 개발자', color: 'from-green-400 to-green-600' },
    ];

    const improvements = [
        { category: 'Frontend', before: 'Thymeleaf', after: 'React + TypeScript' },
        { category: 'Styling', before: 'Bootstrap', after: 'Tailwind CSS' },
        { category: 'State Management', before: 'Props Drilling', after: 'Zustand + React Query' },
        { category: 'Backend', before: '.NET Framework', after: 'Spring Boot + Microservices' },
        { category: 'Database', before: 'MS SQL', after: 'PostgreSQL + TypeORM + SQLite' },
    ];

    return (
        <div className="space-y-8 md:space-y-12">
            {/* 인트로 */}
            <div className="border-l-4 border-green-500 pl-4 md:pl-6 py-2 md:py-3">
                <p className="text-base md:text-xl text-gray-800 leading-relaxed mb-2" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                    매일의 개발이 곧 성장입니다
                </p>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                    초기 프로젝트와 최근 프로젝트를 비교하면 코드 품질과 설계 능력의 성장이 명확히 보입니다.
                </p>
            </div>

            {/* 타임라인 */}
            <div className="space-y-4 md:space-y-6">
                <div className="flex items-baseline justify-between border-b border-gray-200 pb-2 md:pb-3">
                    <h4 className="text-xs text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                        Growth Timeline
                    </h4>
                    <span className="text-xs text-gray-400">2021 - 2025</span>
                </div>
                <div className="space-y-3 md:space-y-4">
                    {timeline.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-6 items-center">
                            <div className="space-y-1">
                                <div className="text-xs md:text-sm text-gray-600 font-medium">
                                    {item.year}
                                </div>
                                <div className="text-xs text-gray-400">{item.label}</div>
                            </div>
                            <div className="md:col-span-4 space-y-2">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="flex-1 h-2.5 md:h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                                            style={{ width: `${item.level}%` }}
                                        />
                                    </div>
                                    <span className="text-xs md:text-sm font-semibold text-gray-900 w-10 md:w-12 text-right">{item.level}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 개선 사항 */}
            <div className="space-y-4 md:space-y-6">
                <div className="border-b border-gray-200 pb-2 md:pb-3">
                    <h4 className="text-xs text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                        Key Improvements
                    </h4>
                </div>
                <div className="space-y-3 md:space-y-4">
                    {improvements.map((row, idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-6 pb-3 md:pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                            <div className="text-xs md:text-sm text-gray-600 font-medium">{row.category}</div>
                            <div className="md:col-span-4 grid grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-1">
                                    <div className="text-xs text-gray-400 uppercase tracking-wider" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                                        Before
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-500">{row.before}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs text-green-600 uppercase tracking-wider font-medium" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                                        After
                                    </div>
                                    <div className="text-xs md:text-sm text-green-700 font-semibold">{row.after}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Before/After 비교 이미지 */}
            <div className="space-y-4 md:space-y-6">
                <div className="border-b border-gray-200 pb-2 md:pb-3">
                    <h4 className="text-xs text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                        Project Comparison
                    </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2 md:space-y-3">
                        <div className="flex items-baseline gap-2 md:gap-3">
                            <span className="text-lg md:text-2xl font-light text-gray-400">Before</span>
                            <span className="text-xs text-gray-400">2024 초 - Axilog 개선</span>
                        </div>
                        {/* Before 이미지 placeholder - 이미지 추가 시 교체 */}
                        <div className="w-full aspect-video bg-gray-50 border-2 border-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400 text-xs md:text-sm">[ C# .NET 프로젝트 스크린샷 ]</span>
                        </div>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                        <div className="flex items-baseline gap-2 md:gap-3">
                            <span className="text-lg md:text-2xl font-light text-green-500">After</span>
                            <span className="text-xs text-gray-400">2025 - 통합 출입통제</span>
                        </div>
                        {/* After 이미지 placeholder - 이미지 추가 시 교체 */}
                        <div className="w-full aspect-video bg-gray-50 border-2 border-green-200 rounded flex items-center justify-center">
                            <span className="text-gray-400 text-xs md:text-sm">[ React + Konva 프로젝트 스크린샷 ]</span>
                        </div>
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
                <p className="text-base md:text-xl text-gray-800 leading-relaxed mb-2" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                    기록하지 않으면 기억되지 않습니다
                </p>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
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
    if (!philosophyData) return null;

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
                        className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg md:rounded-lg shadow-2xl max-w-6xl w-[95vw] max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-8 py-4 md:py-6 flex items-start justify-between">
                            <div>
                                <span className={`text-2xl md:text-4xl font-light ${philosophyData.color} block mb-1 md:mb-2`}>
                                    {philosophyData.number}
                                </span>
                                <Dialog.Title className="text-lg md:text-2xl font-semibold text-gray-900 font-cafe24-gowoonbam">
                                    {philosophyData.title}
                                </Dialog.Title>
                            </div>
                            <Dialog.Close asChild>
                                <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
                                    <X className="w-5 md:w-6 h-5 md:h-6" />
                                    <span className="sr-only">Close</span>
                                </button>
                            </Dialog.Close>
                        </div>

                        {/* Content - 스크롤 영역 */}
                        <div className="px-4 md:px-8 py-6 md:py-8 overflow-y-auto max-h-[calc(90vh-100px)] md:max-h-[calc(90vh-140px)]">
                            <Dialog.Description asChild>
                                <div>
                                    {philosophyData.id === "01" && <Philosophy01Content />}
                                    {philosophyData.id === "02" && <Philosophy02Content />}
                                    {philosophyData.id === "03" && <Philosophy03Content />}
                                </div>
                            </Dialog.Description>
                        </div>
                    </motion.div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
