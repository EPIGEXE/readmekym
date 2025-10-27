import { motion, AnimatePresence } from "framer-motion";
import { developerData } from "../data/devloperData";
import { detailedDeveloperData } from "../data/detailedDeveloperData";
import type { SkillTag } from "../types";
import { SkillBadge } from "../components/ui/SkillBadge";
import { ChevronRight, ChevronDown, Menu, X, Signpost } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { PhilosophySidebar } from "../components/common/PhilosophySidebar";
import { PhilosophyModal } from "../components/common/PhilosophyModal";

interface SidebarData {
    id: string;
    number: string;
    title: string;
    description: string;
    color: string;
    details: string;
    type?: "project";
    role?: string;
    teamSize?: number;
    skills?: Array<{ id: string; name: string; category: string; experience: string }>;
    achievements?: string[];
    fullDescription?: string;
}

interface PhilosophyData {
    id: string;
    number: string;
    title: string;
    description: string;
    color: string;
}

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }, 
};

const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export function CategoryPage() {
    const [selectedPhilosophy, setSelectedPhilosophy] = useState<PhilosophyData | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProjectSummary, setSelectedProjectSummary] = useState<SidebarData | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const experienceSectionRef = useRef<HTMLDivElement>(null);
    const workProjectsSectionRef = useRef<HTMLDivElement>(null);
    const personalProjectsSectionRef = useRef<HTMLDivElement>(null);

    const philosophyData = [
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

    const handlePhilosophyClick = (id: string) => {
        const philosophy = philosophyData.find((p) => p.id === id);
        if (philosophy) {
            setSelectedPhilosophy(philosophy);
            setIsModalOpen(true);
        }
    };

    const handleProjectClick = (projectId: string) => {
        if (isMobile) {
            // Mobile: toggle expand/collapse
            setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
        } else {
            // Desktop: open sidebar
            const detailedProject = detailedDeveloperData.projects.find((p) => p.id === projectId);
            if (detailedProject) {
                const projectSummary = {
                    id: detailedProject.id,
                    number: detailedProject.id.split("-")[1].padStart(2, "0"),
                    title: detailedProject.title,
                    description: detailedProject.shortDescription,
                    color: detailedProject.experienceId ? "text-emerald-600" : "text-orange-600",
                    details: "",
                    type: "project" as const,
                    role: detailedProject.role,
                    teamSize: detailedProject.teamSize,
                    skills: detailedProject.skills.map((skill) => ({
                        id: skill.id,
                        name: skill.name,
                        category: skill.category,
                        experience:
                            skill.experience === "beginner"
                                ? "Beginner"
                                : skill.experience === "intermediate"
                                ? "Intermediate"
                                : "Advanced",
                    })),
                    achievements: detailedProject.achievements.slice(0, 4),
                    fullDescription: detailedProject.fullDescription,
                };
                setSelectedProjectSummary(projectSummary);
                setSelectedPhilosophy(null);
                setIsSidebarOpen(true);
            }
        }
    };

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            const offsetTop = ref.current.offsetTop - 80; // 헤더 높이만큼 오프셋
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
        setIsNavOpen(false); // 스크롤 후 메뉴 닫기
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Check mobile
    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 767px)');
        const checkMobile = () => {
            setIsMobile(mediaQuery.matches);
        };
        checkMobile();
        mediaQuery.addEventListener('change', checkMobile);
        return () => mediaQuery.removeEventListener('change', checkMobile);
    }, []);

    // 사이드 바 클릭 밖에서 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsSidebarOpen(false);
            }
        };

        if (isSidebarOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarOpen]);

    // 모든 스킬 수집 (중복 제거)
    const allSkills: SkillTag[] = [];
    developerData.projects.forEach((project) => {
        project.skills.forEach((skill) => {
            if (!allSkills.some((s) => s.name === skill.name)) {
                allSkills.push(skill);
            }
        });
    });

    // 카테고리별 스킬 분류
    const skillsByCategory = {
        frontend: allSkills.filter((s) => s.category === "frontend"),
        backend: allSkills.filter((s) => s.category === "backend"),
        other: allSkills.filter((s) => s.category === "other"),
    };

    // 기간 포맷팅 함수
    const formatPeriod = (startYear: number, startMonth: number, endYear: number, endMonth: number) => {
        return `${startYear}.${String(startMonth).padStart(2, "0")} - ${endYear}.${String(endMonth).padStart(2, "0")}`;
    };

    return (
        <div key="category-content">
            {/* Hero Section */}
            <motion.section
                className="py-8 md:py-15 mb-12 md:mb-24"
                initial="initial"
                animate="animate"
                variants={fadeInUp}>
                <div className="max-w-6xl mx-auto px-4 md:px-0">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 items-start">
                        {/* Left Content */}
                        <motion.div className="lg:col-span-3 space-y-8 md:space-y-16" variants={staggerContainer}>
                            <motion.div variants={fadeInUp}>
                                <div
                                    className="text-sm md:text-lg text-gray-500 mb-4 md:mb-6 tracking-widest uppercase"
                                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                                >
                                    Web Developer
                                </div>
                                <h1 className="text-5xl md:text-7xl text-gray-900 leading-none mb-6 md:mb-8 font-cafe24-gowoonbam">
                                    김영민
                                </h1>
                                <div className="w-16 md:w-24 h-px bg-gray-300 mb-6 md:mb-8"></div>
                                <p
                                    className="text-base md:text-2xl font-light text-gray-800 leading-relaxed max-w-2xl"
                                    style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                                >
                                    끊임없이 아이디어를 코드로 구현하며,
                                    <br />
                                    매일의 개발을 통해 성장하고,
                                    <br />
                                    모든 학습을 체계적으로 정리합니다.
                                </p>
                            </motion.div>
                        </motion.div>

                        {/* Right Photo */}
                        <motion.div className="lg:col-span-2 flex justify-center lg:justify-end" variants={fadeInUp}>
                            <div className="w-64 h-64 md:w-80 md:h-80 bg-gray-100 overflow-hidden">
                                <img src="/kym.jpg" alt="김영민 프로필" className="w-full h-full object-cover" />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Philosophy Section - Full Width */}
                <motion.div variants={fadeInUp} className="mt-12 md:mt-20 space-y-8 md:space-y-12">
                    <div className="text-center">
                        <div
                            className="text-sm md:text-base text-gray-500 uppercase tracking-widest mb-6 md:mb-8"
                            style={{ fontFamily: "'Pretendard', sans-serif" }}
                        >
                            Philosophy
                        </div>
                        <div className="w-12 md:w-16 h-px bg-gray-300 mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 max-w-6xl mx-auto px-4 md:px-0">
                        <button
                            onClick={() => handlePhilosophyClick("01")}
                            className="text-left md:text-left group cursor-pointer transition-all duration-300 hover:-translate-y-2"
                        >
                            <span className="text-3xl md:text-4xl font-light text-gray-300 group-hover:text-blue-500 transition-colors block mb-4 md:mb-6 md:translate-x-[70px]">
                                01
                            </span>
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
                                <span className="crayon-hover crayon-hover-blue font-cafe24-gowoonbam">
                                    {philosophyData.find((p) => p.id === "01")?.title}
                                </span>
                                <ChevronRight className="ml-2 w-4 md:w-5 h-4 md:h-5 text-gray-400" />
                            </h3>
                            <p className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                                {philosophyData.find((p) => p.id === "01")?.description}
                            </p>
                        </button>

                        <button
                            onClick={() => handlePhilosophyClick("02")}
                            className="text-left md:text-center group cursor-pointer transition-all duration-300 hover:-translate-y-2"
                        >
                            <span className="text-3xl md:text-4xl font-light text-gray-300 group-hover:text-green-500 transition-colors block mb-4 md:mb-6">
                                02
                            </span>
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center md:justify-center font-cafe24-gowoonbam">
                                <span className="crayon-hover crayon-hover-green font-cafe24-gowoonbam">
                                    {philosophyData.find((p) => p.id === "02")?.title}
                                </span>
                                <ChevronRight className="ml-2 w-4 md:w-5 h-4 md:h-5 text-gray-400" />
                            </h3>
                            <p className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                                {philosophyData.find((p) => p.id === "02")?.description}
                            </p>
                        </button>

                        <button
                            onClick={() => handlePhilosophyClick("03")}
                            className="text-left md:text-right group cursor-pointer transition-all duration-300 hover:-translate-y-2"
                        >
                            <span className="text-3xl md:text-4xl font-light text-gray-300 group-hover:text-purple-500 transition-colors block mb-4 md:mb-6 md:-translate-x-[70px]">
                                03
                            </span>
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center md:justify-end font-cafe24-gowoonbam">
                                <span className="crayon-hover crayon-hover-purple font-cafe24-gowoonbam">
                                    {philosophyData.find((p) => p.id === "03")?.title}
                                </span>
                                <ChevronRight className="ml-2 w-4 md:w-5 h-4 md:h-5 text-gray-400" />
                            </h3>
                            <p className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                                {philosophyData.find((p) => p.id === "03")?.description}
                            </p>
                        </button>
                    </div>
                </motion.div>
            </motion.section>

            {/* Philosophy Modal */}
            <PhilosophyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                philosophyData={selectedPhilosophy}
            />

            {/* Project Sidebar */}
            <PhilosophySidebar
                ref={sidebarRef}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                philosophyData={selectedProjectSummary}
            />

            {/* Experience Section */}
            <motion.section
                ref={experienceSectionRef}
                className="mb-8 md:mb-12 px-4 md:px-0"
                initial="initial"
                animate="animate"
                variants={staggerContainer}>
                <h2 className="text-2xl md:text-[28px] font-semibold mb-4 md:mb-6 border-b border-gray-200 pb-2">
                    <motion.span
                        className="crayon-highlight crayon-highlight-gold font-cafe24-gowoonbam inline-block"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0 }}
                    >
                        EXPERIENCE
                    </motion.span>
                </h2>
                <motion.div className="space-y-4 md:space-y-6" variants={staggerContainer}>
                    {developerData.experiences.map((experience) => (
                        <motion.div
                            key={experience.id}
                            className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4"
                            variants={fadeInUp}
                        >
                            <div className="text-xs md:text-sm text-gray-600">
                                {formatPeriod(
                                    experience.startYear,
                                    experience.startMonth,
                                    experience.endYear,
                                    experience.endMonth
                                )}
                            </div>
                            <div className="md:col-span-3">
                                <h3 className="text-base md:text-lg font-medium mb-1">{experience.title}</h3>
                                <p className="text-xs md:text-sm text-gray-600 mb-2">{experience.subtitle}</p>
                                <p className="text-xs md:text-sm leading-relaxed">{experience.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            {/* Work Projects Section */}
            <motion.section
                ref={workProjectsSectionRef}
                className="mb-8 md:mb-12 px-4 md:px-0"
                initial="initial"
                animate="animate"
                variants={staggerContainer}>
                <h2 className="text-2xl md:text-[28px] font-semibold mb-4 md:mb-6 border-b border-gray-200 pb-2">
                    <motion.span
                        className="crayon-highlight crayon-highlight-forest font-cafe24-gowoonbam inline-block"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0 }}
                    >
                        WORK PROJECTS
                    </motion.span>
                </h2>
                <motion.div className="space-y-4 md:space-y-6" variants={staggerContainer}>
                    {developerData.projects
                        .filter((p) => p.experienceId)
                        .map((project) => {
                            const detailedProject = detailedDeveloperData.projects.find(p => p.id === project.id);
                            const isExpanded = expandedProjectId === project.id;

                            return (
                                <motion.div
                                    key={project.id}
                                    className="cursor-pointer group rounded-lg transition-all duration-300"
                                    variants={fadeInUp}
                                >
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 p-2 md:p-3 md:hover:translate-x-2 transition-all duration-300"
                                        onClick={() => handleProjectClick(project.id)}
                                    >
                                        <div className="text-xs md:text-sm text-gray-600">
                                            {formatPeriod(
                                                project.startYear,
                                                project.startMonth,
                                                project.endYear,
                                                project.endMonth
                                            )}
                                        </div>
                                        <div className="md:col-span-3">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-base md:text-lg font-medium mb-1">
                                                    <span className="crayon-hover crayon-hover-red">{project.title}</span>
                                                </h3>
                                                {isMobile ? (
                                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                ) : (
                                                    <ChevronRight className="w-3 md:w-4 h-3 md:h-4 text-gray-400" />
                                                )}
                                            </div>
                                            {!isMobile && project.description && (
                                                <p className="text-xs md:text-sm leading-relaxed text-gray-600 mb-2">
                                                    {project.description}
                                                </p>
                                            )}
                                            {!isMobile && (
                                                <div className="flex flex-wrap gap-1 text-xs">
                                                    {project.skills.map((skill, idx) => (
                                                        <SkillBadge key={idx} skill={skill} size="sm" />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Mobile Expanded Content */}
                                    <AnimatePresence initial={false}>
                                        {isMobile && isExpanded && detailedProject && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden px-2 pb-4 space-y-3"
                                            >
                                            <p className="text-xs text-gray-700 leading-relaxed">
                                                {detailedProject.fullDescription}
                                            </p>

                                            {detailedProject.role && (
                                                <div className="text-xs">
                                                    <span className="font-medium text-gray-700">Role:</span>
                                                    <span className="text-gray-600 ml-2">{detailedProject.role}</span>
                                                </div>
                                            )}

                                            {detailedProject.teamSize && (
                                                <div className="text-xs">
                                                    <span className="font-medium text-gray-700">Team Size:</span>
                                                    <span className="text-gray-600 ml-2">{detailedProject.teamSize}명</span>
                                                </div>
                                            )}

                                            <div>
                                                <div className="text-xs font-medium text-gray-700 mb-1.5">Skills</div>
                                                <div className="flex flex-wrap gap-1">
                                                    {detailedProject.skills.map((skill, idx) => (
                                                        <SkillBadge key={idx} skill={skill} size="sm" />
                                                    ))}
                                                </div>
                                            </div>

                                            {detailedProject.achievements.length > 0 && (
                                                <div>
                                                    <div className="text-xs font-medium text-gray-700 mb-1.5">Achievements</div>
                                                    <ul className="space-y-1">
                                                        {detailedProject.achievements.slice(0, 3).map((achievement, idx) => (
                                                            <li key={idx} className="text-xs text-gray-600 leading-relaxed">
                                                                • {achievement}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                </motion.div>
            </motion.section>

            {/* Personal Projects Section */}
            <motion.section
                ref={personalProjectsSectionRef}
                className="mb-8 md:mb-12 px-4 md:px-0"
                initial="initial"
                animate="animate"
                variants={staggerContainer}>
                <h2 className="text-2xl md:text-[28px] font-semibold mb-4 md:mb-6 border-b border-gray-200 pb-2">
                    <motion.span
                        className="crayon-highlight crayon-highlight-orange font-cafe24-gowoonbam inline-block"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0 }}
                    >
                        PERSONAL PROJECTS
                    </motion.span>
                </h2>
                <motion.div className="space-y-4 md:space-y-6" variants={staggerContainer}>
                    {developerData.projects
                        .filter((p) => !p.experienceId)
                        .map((project) => {
                            const detailedProject = detailedDeveloperData.projects.find(p => p.id === project.id);
                            const isExpanded = expandedProjectId === project.id;

                            return (
                                <motion.div
                                    key={project.id}
                                    className="cursor-pointer group rounded-lg transition-all duration-300"
                                    variants={fadeInUp}
                                >
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 p-2 md:p-3 md:hover:translate-x-2 transition-all duration-300"
                                        onClick={() => handleProjectClick(project.id)}
                                    >
                                        <div className="text-xs md:text-sm text-gray-600">
                                            {formatPeriod(
                                                project.startYear,
                                                project.startMonth,
                                                project.endYear,
                                                project.endMonth
                                            )}
                                        </div>
                                        <div className="md:col-span-3">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-base md:text-lg font-medium mb-1">
                                                    <span className="crayon-hover crayon-hover-red">{project.title}</span>
                                                </h3>
                                                {isMobile ? (
                                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                ) : (
                                                    <ChevronRight className="w-3 md:w-4 h-3 md:h-4 text-gray-400" />
                                                )}
                                            </div>
                                            {!isMobile && project.description && (
                                                <p className="text-xs md:text-sm leading-relaxed text-gray-600 mb-2">
                                                    {project.description}
                                                </p>
                                            )}
                                            {!isMobile && (
                                                <div className="flex flex-wrap gap-1 text-xs">
                                                    {project.skills.map((skill, idx) => (
                                                        <SkillBadge key={idx} skill={skill} size="sm" />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Mobile Expanded Content */}
                                    <AnimatePresence initial={false}>
                                        {isMobile && isExpanded && detailedProject && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden px-2 pb-4 space-y-3"
                                            >
                                            <p className="text-xs text-gray-700 leading-relaxed">
                                                {detailedProject.fullDescription}
                                            </p>

                                            {detailedProject.role && (
                                                <div className="text-xs">
                                                    <span className="font-medium text-gray-700">Role:</span>
                                                    <span className="text-gray-600 ml-2">{detailedProject.role}</span>
                                                </div>
                                            )}

                                            {detailedProject.teamSize && (
                                                <div className="text-xs">
                                                    <span className="font-medium text-gray-700">Team Size:</span>
                                                    <span className="text-gray-600 ml-2">{detailedProject.teamSize}명</span>
                                                </div>
                                            )}

                                            <div>
                                                <div className="text-xs font-medium text-gray-700 mb-1.5">Skills</div>
                                                <div className="flex flex-wrap gap-1">
                                                    {detailedProject.skills.map((skill, idx) => (
                                                        <SkillBadge key={idx} skill={skill} size="sm" />
                                                    ))}
                                                </div>
                                            </div>

                                            {detailedProject.achievements.length > 0 && (
                                                <div>
                                                    <div className="text-xs font-medium text-gray-700 mb-1.5">Achievements</div>
                                                    <ul className="space-y-1">
                                                        {detailedProject.achievements.slice(0, 3).map((achievement, idx) => (
                                                            <li key={idx} className="text-xs text-gray-600 leading-relaxed">
                                                                • {achievement}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                </motion.div>
            </motion.section>

            {/* Skills Section */}
            <motion.section
                className="mb-20 md:mb-12 px-4 md:px-0"
                initial="initial"
                animate="animate"
                variants={staggerContainer}>
                <h2 className="text-2xl md:text-[28px] font-semibold mb-4 md:mb-6 border-b border-gray-200 pb-2">
                    <motion.span
                        className="crayon-highlight crayon-highlight-silver font-cafe24-gowoonbam inline-block"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0 }}
                    >
                        SKILLS
                    </motion.span>
                </h2>
                <motion.div className="space-y-3 md:space-y-4" variants={staggerContainer}>
                    {skillsByCategory.frontend.length > 0 && (
                        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4" variants={fadeInUp}>
                            <div className="text-xs md:text-sm text-gray-600 font-medium">Frontend</div>
                            <div className="md:col-span-3">
                                <div className="flex flex-wrap gap-1.5 md:gap-2">
                                    {skillsByCategory.frontend.map((skill, idx) => (
                                        <SkillBadge key={idx} skill={skill} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {skillsByCategory.backend.length > 0 && (
                        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4" variants={fadeInUp}>
                            <div className="text-xs md:text-sm text-gray-600 font-medium">Backend</div>
                            <div className="md:col-span-3">
                                <div className="flex flex-wrap gap-1.5 md:gap-2">
                                    {skillsByCategory.backend.map((skill, idx) => (
                                        <SkillBadge key={idx} skill={skill} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {skillsByCategory.other.length > 0 && (
                        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4" variants={fadeInUp}>
                            <div className="text-xs md:text-sm text-gray-600 font-medium">Tools & Others</div>
                            <div className="md:col-span-3">
                                <div className="flex flex-wrap gap-1.5 md:gap-2">
                                    {skillsByCategory.other.map((skill, idx) => (
                                        <SkillBadge key={idx} skill={skill} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </motion.section>

            {/* Mobile Floating Navigation */}
            {isMobile && (
                <div className="fixed bottom-6 right-4 z-50">
                    {/* Navigation Menu */}
                    <AnimatePresence>
                        {isNavOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.2 }}
                                className="absolute bottom-16 right-0 flex flex-col gap-2 mb-2"
                            >
                                <motion.button
                                    onClick={() => {
                                        scrollToTop();
                                        setIsNavOpen(false);
                                    }}
                                    className="px-4 py-2 rounded-full bg-gray-700 text-white shadow-lg text-sm font-medium whitespace-nowrap hover:bg-gray-600 transition-colors"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    맨 위로
                                </motion.button>
                                <motion.button
                                    onClick={() => scrollToSection(experienceSectionRef)}
                                    className="px-4 py-2 rounded-full bg-white border border-gray-300 text-gray-700 shadow-lg text-sm font-medium whitespace-nowrap hover:bg-gray-50 transition-colors"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    경력
                                </motion.button>
                                <motion.button
                                    onClick={() => scrollToSection(workProjectsSectionRef)}
                                    className="px-4 py-2 rounded-full bg-white border border-emerald-400 text-emerald-600 shadow-lg text-sm font-medium whitespace-nowrap hover:bg-emerald-50 transition-colors"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    회사
                                </motion.button>
                                <motion.button
                                    onClick={() => scrollToSection(personalProjectsSectionRef)}
                                    className="px-4 py-2 rounded-full bg-white border border-orange-400 text-orange-600 shadow-lg text-sm font-medium whitespace-nowrap hover:bg-orange-50 transition-colors"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    개인
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Toggle Button */}
                    <motion.button
                        onClick={() => setIsNavOpen(!isNavOpen)}
                        className="w-14 h-14 rounded-full bg-gray-800 text-white shadow-xl flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ rotate: isNavOpen ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isNavOpen ? <X className="w-6 h-6" /> : <Signpost className="w-6 h-6" />}
                    </motion.button>
                </div>
            )}
        </div>
    );
}
