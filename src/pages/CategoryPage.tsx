import { motion } from "framer-motion";
import { developerData } from "../data/devloperData";
import { detailedDeveloperData } from "../data/detailedDeveloperData";
import type { SkillTag } from "../types";
import { SkillBadge } from "../components/ui/SkillBadge";
import { ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { PhilosophySidebar } from "../components/common/PhilosophySidebar";

interface SidebarData {
    id: string;
    number: string;
    title: string;
    description: string;
    color: string;
    details: string;
    type?: "philosophy" | "project";
    role?: string;
    teamSize?: number;
    skills?: Array<{ id: string; name: string; category: string; experience: string }>;
    achievements?: string[];
    fullDescription?: string;
}


const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }, // 0.8에서 0.4로 줄여서 더 빠르게
};

const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1, // 0.15에서 0.05로 줄여서 더 빠르게
        },
    },
};

export function CategoryPage() {
    const [selectedPhilosophy, setSelectedPhilosophy] = useState<SidebarData | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedProjectSummary, setSelectedProjectSummary] = useState<SidebarData | null>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const philosophyData = [
        {
            id: "01",
            number: "01",
            title: "만들어내는 개발자",
            description: "개인 프로젝트를 통해 계속해서\n새로운 것을 만들어내고 구현해봅니다.",
            color: "text-blue-500",
            details: "공사 중...",
        },
        {
            id: "02",
            number: "02",
            title: "성장하는 개발자",
            description: "매일매일 항상 개발하며\n개인 프로젝트의 품질이 지속적으로 향상됩니다.",
            color: "text-green-500",
            details: "공사 중...",
        },
        {
            id: "03",
            number: "03",
            title: "정리하는 개발자",
            description: "솔루션 엔지니어부터 지금까지\n공부한 것을 정리하며 기록합니다.",
            color: "text-purple-500",
            details: "공사 중...",
        },
    ];

    const handlePhilosophyClick = (id: string) => {
        const philosophy = philosophyData.find((p) => p.id === id);
        if (philosophy) {
            setSelectedPhilosophy({
                ...philosophy,
                type: "philosophy" as const,
            });
            setSelectedProjectSummary(null);
            setIsSidebarOpen(true);
        }
    };

    const handleProjectClick = (projectId: string) => {
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
    };

    // Click outside to close sidebar - Best Practice
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
                className="py-15 mb-24"
                initial="initial"
                animate="animate"
                variants={fadeInUp}>
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                        {/* Left Content */}
                        <motion.div className="lg:col-span-3 space-y-16" variants={staggerContainer}>
                            <motion.div variants={fadeInUp}>
                                <div
                                    className="text-lg text-gray-500 mb-6 tracking-widest uppercase"
                                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                                >
                                    Web Developer
                                </div>
                                <h1 className="text-7xl text-gray-900 leading-none mb-8 font-cafe24-gowoonbam">
                                    김영민
                                </h1>
                                <div className="w-24 h-px bg-gray-300 mb-8"></div>
                                <p
                                    className="text-2xl font-light text-gray-800 leading-relaxed max-w-2xl"
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
                            <div className="w-80 h-80 bg-gray-100 overflow-hidden">
                                <img src="/kym.jpg" alt="김영민 프로필" className="w-full h-full object-cover" />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Philosophy Section - Full Width */}
                <motion.div variants={fadeInUp} className="mt-20 space-y-12">
                    <div className="text-center">
                        <div
                            className="text-base text-gray-500 uppercase tracking-widest mb-8"
                            style={{ fontFamily: "'Pretendard', sans-serif" }}
                        >
                            Philosophy
                        </div>
                        <div className="w-16 h-px bg-gray-300 mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
                        <button
                            onClick={() => handlePhilosophyClick("01")}
                            className="text-left group cursor-pointer transition-all duration-300 hover:-translate-y-2"
                        >
                            <span className="text-4xl font-light text-gray-300 group-hover:text-blue-500 transition-colors block mb-6 translate-x-[70px]">
                                01
                            </span>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center ">
                                <span className="crayon-hover crayon-hover-blue font-cafe24-gowoonbam">
                                    만들어내는 개발자
                                </span>
                                <ChevronRight className="ml-2 w-5 h-5 text-gray-400" />
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                개인 프로젝트를 통해 계속해서
                                <br />
                                새로운 것을 만들어내고 구현해봅니다.
                            </p>
                        </button>

                        <button
                            onClick={() => handlePhilosophyClick("02")}
                            className="text-center group cursor-pointer transition-all duration-300 hover:-translate-y-2"
                        >
                            <span className="text-4xl font-light text-gray-300 group-hover:text-green-500 transition-colors block mb-6">
                                02
                            </span>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center justify-center font-cafe24-gowoonbam">
                                <span className="crayon-hover crayon-hover-green font-cafe24-gowoonbam">
                                    성장하는 개발자
                                </span>
                                <ChevronRight className="ml-2 w-5 h-5 text-gray-400" />
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                매일매일 항상 개발하며
                                <br />
                                개인 프로젝트의 품질이 지속적으로 향상됩니다.
                            </p>
                        </button>

                        <button
                            onClick={() => handlePhilosophyClick("03")}
                            className="text-right group cursor-pointer transition-all duration-300 hover:-translate-y-2"
                        >
                            <span className="text-4xl font-light text-gray-300 group-hover:text-purple-500 transition-colors block mb-6 -translate-x-[70px]">
                                03
                            </span>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center justify-end font-cafe24-gowoonbam">
                                <span className="crayon-hover crayon-hover-purple font-cafe24-gowoonbam">
                                    정리하는 개발자
                                </span>
                                <ChevronRight className="ml-2 w-5 h-5 text-gray-400" />
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                솔루션 엔지니어부터 지금까지
                                <br />
                                공부한 것을 정리하며 기록합니다.
                            </p>
                        </button>
                    </div>
                </motion.div>
            </motion.section>

            {/* Philosophy Sidebar */}
            <PhilosophySidebar
                ref={sidebarRef}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                philosophyData={selectedPhilosophy || selectedProjectSummary}
            />

            {/* Experience Section */}
            <motion.section
                className="mb-12"
                initial="initial"
                animate="animate"
                variants={staggerContainer}>
                <h2 className="text-[28px] font-semibold mb-6 border-b border-gray-200 pb-2">
                    <motion.span
                        className="crayon-highlight crayon-highlight-gold font-cafe24-gowoonbam inline-block"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0 }}
                    >
                        EXPERIENCE
                    </motion.span>
                </h2>
                <motion.div className="space-y-6" variants={staggerContainer}>
                    {developerData.experiences.map((experience) => (
                        <motion.div
                            key={experience.id}
                            className="grid grid-cols-1 md:grid-cols-4 gap-4"
                            variants={fadeInUp}
                        >
                            <div className="text-sm text-gray-600">
                                {formatPeriod(
                                    experience.startYear,
                                    experience.startMonth,
                                    experience.endYear,
                                    experience.endMonth
                                )}
                            </div>
                            <div className="md:col-span-3">
                                <h3 className="font-medium mb-1">{experience.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">{experience.subtitle}</p>
                                <p className="text-sm leading-relaxed">{experience.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            {/* Work Projects Section */}
            <motion.section
                className="mb-12"
                initial="initial"
                animate="animate"
                variants={staggerContainer}>
                <h2 className="text-[28px] font-semibold mb-6 border-b border-gray-200 pb-2">
                    <motion.span
                        className="crayon-highlight crayon-highlight-forest font-cafe24-gowoonbam inline-block"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0 }}
                    >
                        WORK PROJECTS
                    </motion.span>
                </h2>
                <motion.div className="space-y-6" variants={staggerContainer}>
                    {developerData.projects
                        .filter((p) => p.experienceId)
                        .map((project) => (
                            <motion.div
                                key={project.id}
                                className="grid grid-cols-1 md:grid-cols-4 gap-4 cursor-pointer group p-3 rounded-lg transition-all duration-300 hover:translate-x-2"
                                variants={fadeInUp}
                                onClick={() => handleProjectClick(project.id)}
                            >
                                <div className="text-sm text-gray-600">
                                    {formatPeriod(
                                        project.startYear,
                                        project.startMonth,
                                        project.endYear,
                                        project.endMonth
                                    )}
                                </div>
                                <div className="md:col-span-3">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium mb-1">
                                            <span className="crayon-hover crayon-hover-red">{project.title}</span>
                                        </h3>
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </div>
                                    {project.description && (
                                        <p className="text-sm leading-relaxed text-gray-600 mb-2">
                                            {project.description}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-1 text-xs">
                                        {project.skills.map((skill, idx) => (
                                            <SkillBadge key={idx} skill={skill} size="sm" />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                </motion.div>
            </motion.section>

            {/* Personal Projects Section */}
            <motion.section
                className="mb-12"
                initial="initial"
                animate="animate"
                variants={staggerContainer}>
                <h2 className="text-[28px] font-semibold mb-6 border-b border-gray-200 pb-2">
                    <motion.span
                        className="crayon-highlight crayon-highlight-orange font-cafe24-gowoonbam inline-block"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0 }}
                    >
                        PERSONAL PROJECTS
                    </motion.span>
                </h2>
                <motion.div className="space-y-6" variants={staggerContainer}>
                    {developerData.projects
                        .filter((p) => !p.experienceId)
                        .map((project) => (
                            <motion.div
                                key={project.id}
                                className="grid grid-cols-1 md:grid-cols-4 gap-4 cursor-pointer group p-3 rounded-lg transition-all duration-300 hover:translate-x-2"
                                variants={fadeInUp}
                                onClick={() => handleProjectClick(project.id)}
                            >
                                <div className="text-sm text-gray-600">
                                    {formatPeriod(
                                        project.startYear,
                                        project.startMonth,
                                        project.endYear,
                                        project.endMonth
                                    )}
                                </div>
                                <div className="md:col-span-3">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium mb-1">
                                            <span className="crayon-hover crayon-hover-red">{project.title}</span>
                                        </h3>
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </div>
                                    {project.description && (
                                        <p className="text-sm leading-relaxed text-gray-600 mb-2">
                                            {project.description}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-1 text-xs">
                                        {project.skills.map((skill, idx) => (
                                            <SkillBadge key={idx} skill={skill} size="sm" />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                </motion.div>
            </motion.section>

            {/* Skills Section */}
            <motion.section
                className="mb-12"
                initial="initial"
                animate="animate"
                variants={staggerContainer}>
                <h2 className="text-[28px] font-semibold mb-6 border-b border-gray-200 pb-2">
                    <motion.span
                        className="crayon-highlight crayon-highlight-silver font-cafe24-gowoonbam inline-block"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0 }}
                    >
                        SKILLS
                    </motion.span>
                </h2>
                <motion.div className="space-y-4" variants={staggerContainer}>
                    {skillsByCategory.frontend.length > 0 && (
                        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={fadeInUp}>
                            <div className="text-sm text-gray-600 font-medium">Frontend</div>
                            <div className="md:col-span-3">
                                <div className="flex flex-wrap gap-2">
                                    {skillsByCategory.frontend.map((skill, idx) => (
                                        <SkillBadge key={idx} skill={skill} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {skillsByCategory.backend.length > 0 && (
                        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={fadeInUp}>
                            <div className="text-sm text-gray-600 font-medium">Backend</div>
                            <div className="md:col-span-3">
                                <div className="flex flex-wrap gap-2">
                                    {skillsByCategory.backend.map((skill, idx) => (
                                        <SkillBadge key={idx} skill={skill} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {skillsByCategory.other.length > 0 && (
                        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={fadeInUp}>
                            <div className="text-sm text-gray-600 font-medium">Tools & Others</div>
                            <div className="md:col-span-3">
                                <div className="flex flex-wrap gap-2">
                                    {skillsByCategory.other.map((skill, idx) => (
                                        <SkillBadge key={idx} skill={skill} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </motion.section>
        </div>
    );
}
