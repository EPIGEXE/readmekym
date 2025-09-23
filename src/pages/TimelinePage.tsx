import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { developerData } from "../data/devloperData";
import { detailedDeveloperData } from "../data/detailedDeveloperData";
import type { SkillTag, StackedSkills, Project, Experience } from "../types";
import { YearDivider } from "../components/YearDivider";
import { SkillBadge } from "../components/ui/SkillBadge";
import { PhilosophySidebar } from "../components/common/PhilosophySidebar";

// 애니메이션 설정
const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

// 연결선 타입 정의
interface Connection {
    id: string;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    color: string;
}

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

export function TimelinePage() {
    // ===== 상태 관리 =====
    const [stackedSkills, setStackedSkills] = useState<StackedSkills>({
        frontend: [],
        backend: [],
        other: [],
    });

    const [isAllSkillsStacked, setIsAllSkillsStacked] = useState<boolean>(false);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [selectedProjectSummary, setSelectedProjectSummary] = useState<SidebarData | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    // ===== 상수 정의 =====
    const MONTH_HEIGHT = 80;
    const EXPERIENCE_WIDTH = 280;
    const PROJECT_WIDTH = 560; // 2줄 고정 (280px × 2)
    const SKILLS_WIDTH = 200;
    const PROJECT_LANE_WIDTH = 280; // 각 프로젝트 레인 너비

    // 연도 범위 계산 (2021년 9월부터 시작)
    const totalYears = developerData.yearRange.end - developerData.yearRange.start + 1;
    const TOTAL_HEIGHT = totalYears * MONTH_HEIGHT * 12 - 8 * MONTH_HEIGHT;

    // ===== 스타일 계산 함수들 =====

    /**
     * 경력 바의 스타일을 계산 (연도 넘어가는 경력 지원)
     */
    const getExperienceBarStyle = (experience: Experience) => {
        const expStartYear = experience.startYear;
        const expEndYear = experience.endYear;

        // 시작 연도에서의 오프셋 계산 (2021년 8월부터 시작)
        const startYearOffset = (expStartYear - developerData.yearRange.start) * MONTH_HEIGHT * 12;
        const absoluteTop = startYearOffset + (experience.startMonth - 9) * MONTH_HEIGHT;

        // 전체 높이 계산
        let totalHeight = 0;
        if (expStartYear === expEndYear) {
            // 같은 연도 내 경력
            totalHeight = (experience.endMonth - experience.startMonth + 1) * MONTH_HEIGHT;
        } else {
            // 시작 연도 높이
            totalHeight += (12 - experience.startMonth + 1) * MONTH_HEIGHT;
            // 중간 연도들 높이
            for (let year = expStartYear + 1; year < expEndYear; year++) {
                totalHeight += 12 * MONTH_HEIGHT;
            }
            // 종료 연도 높이
            totalHeight += experience.endMonth * MONTH_HEIGHT;
        }

        return {
            top: `${absoluteTop}px`,
            height: `${Math.max(totalHeight - 8, MONTH_HEIGHT)}px`,
        };
    };

    /**
     * 프로젝트 바의 스타일을 계산 (연도 넘어가는 프로젝트 지원)
     */
    const getProjectBarStyle = (project: Project) => {
        const projectStartYear = project.startYear;
        const projectEndYear = project.endYear;

        // 시작 연도에서의 오프셋 계산 (2021년 8월부터 시작)
        const startYearOffset = (projectStartYear - developerData.yearRange.start) * MONTH_HEIGHT * 12;
        const absoluteTop = startYearOffset + (project.startMonth - 9) * MONTH_HEIGHT;

        // 전체 높이 계산
        let totalHeight = 0;

        if (projectStartYear === projectEndYear) {
            // 같은 연도 내 프로젝트
            totalHeight = (project.endMonth - project.startMonth + 1) * MONTH_HEIGHT;
        } else {
            // 시작 연도 높이
            totalHeight += (12 - project.startMonth + 1) * MONTH_HEIGHT;

            // 중간 연도들 높이
            for (let year = projectStartYear + 1; year < projectEndYear; year++) {
                totalHeight += 12 * MONTH_HEIGHT;
            }

            // 종료 연도 높이
            totalHeight += project.endMonth * MONTH_HEIGHT;
        }

        return {
            top: `${absoluteTop}px`,
            height: `${totalHeight - 8}px`,
        };
    };

    // ===== 색상 헬퍼 함수들 =====

    const getEventColor = () => {
        // 흰색 배경 + 테두리로 명확한 구분
        return "bg-white border border-gray-200 border-l-4 !border-l-gray-400 shadow-sm";
    };

    // ===== 데이터 처리 함수들 =====

    /**
     * 연도 배열 생성
     */
    const getYearsArray = () => {
        const years = [];
        for (let year = developerData.yearRange.start; year <= developerData.yearRange.end; year++) {
            years.push(year);
        }
        return years;
    };

    const yearsArray = getYearsArray();

    // 프로젝트 클릭 핸들러
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
            setIsSidebarOpen(true);
        }
    };

    // Click outside to close sidebar
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

    /**
     * 프로젝트를 경력/개인 2개 레인에 배치하는 레이아웃 계산 함수
     * 0번 레인: 경력 관련 프로젝트 (experienceId 있음)
     * 1번 레인: 개인 프로젝트 (experienceId 없음)
     */
    const calculateProjectLayout = (): Array<Project & { laneIndex: number }> => {
        const allProjects: Array<Project & { laneIndex: number }> = [];

        // 시작 시점 기준으로 정렬 (연도 우선, 월 보조)
        const sortedProjects = [...developerData.projects].sort((a, b) => {
            if (a.startYear !== b.startYear) return a.startYear - b.startYear;
            return a.startMonth - b.startMonth;
        });

        // 각 프로젝트를 경력/개인에 따라 레인 배치
        sortedProjects.forEach((project) => {
            const laneIndex = project.experienceId ? 0 : 1; // 경력 관련: 0번 레인, 개인: 1번 레인

            // 결과 배열에 추가
            allProjects.push({
                ...project,
                laneIndex,
            });
        });

        return allProjects;
    };

    // ===== 이펙트 훅들 =====

    /**
     * 경력과 프로젝트 간의 연결선을 계산하고 생성하는 이펙트
     * 개인 프로젝트(experienceId가 없는)는 연결선 제외
     */
    useEffect(() => {
        const calculateConnections = () => {
            if (!containerRef.current) return;

            const newConnections: Connection[] = [];
            const container = containerRef.current;
            const containerRect = container.getBoundingClientRect();

            // DOM 요소들 찾기
            const experienceElements = container.querySelectorAll('[data-type="experience"]');
            const projectElements = container.querySelectorAll('[data-type="project"]');

            // 각 경력에 대해 연결된 프로젝트들과 연결선 생성
            experienceElements.forEach((expEl) => {
                const expId = expEl.getAttribute("data-id");
                const expRect = expEl.getBoundingClientRect();
                const expRightX = expRect.right - containerRect.left;

                // 해당 경력의 프로젝트들과 연결 (개인 프로젝트 제외)
                projectElements.forEach((projEl) => {
                    const projExpId = projEl.getAttribute("data-experience-id");

                    // 경력과 연관된 프로젝트만 연결선 생성 (개인 프로젝트는 data-experience-id 속성 없음)
                    if (expId === projExpId && projExpId) {
                        const projRect = projEl.getBoundingClientRect();
                        const projCenterY = projRect.top + projRect.height / 2 - containerRect.top;
                        const projLeftX = projRect.left - containerRect.left;

                        newConnections.push({
                            id: `exp-${expId}-proj-${projEl.getAttribute("data-id")}`,
                            fromX: expRightX + 8,
                            fromY: projCenterY,
                            toX: projLeftX - 8,
                            toY: projCenterY,
                            color: "#dc2626",
                        });
                    }
                });
            });

            setConnections(newConnections);
        };

        const timer = setTimeout(calculateConnections, 100);
        return () => clearTimeout(timer);
    }, [developerData]);

    /**
     * Intersection Observer를 사용해 프로젝트가 뷰포트에 들어올 때 스킬 누적
     */
    useEffect(() => {
        const stickyPosition = 100; // sticky top position (연도 라벨의 sticky 위치)
        const passedProjects = new Set<string>();

        const handleScroll = () => {
            const projectElements = document.querySelectorAll("[data-skills]");

            projectElements.forEach((element) => {
                const rect = element.getBoundingClientRect();
                const projectId = element.getAttribute("data-project-id");

                if (!projectId) return;

                // sticky 위치를 지나갔는지 확인
                const hasPassedSticky = rect.top <= stickyPosition;

                if (hasPassedSticky && !passedProjects.has(projectId)) {
                    // sticky 위치를 지나감 - 스킬 추가
                    passedProjects.add(projectId);

                    const skillsData = element.getAttribute("data-skills");
                    if (skillsData) {
                        const skills: SkillTag[] = JSON.parse(skillsData);

                        setStackedSkills((prev) => {
                            const newStacked = { ...prev };
                            skills.forEach((skill) => {
                                const categorySkills = newStacked[skill.category];
                                // ID로 중복 체크 - 모든 스킬 ID를 저장
                                if (!categorySkills.some((s) => s.id === skill.id)) {
                                    categorySkills.push(skill);
                                }
                            });
                            return newStacked;
                        });
                    }
                } else if (!hasPassedSticky && passedProjects.has(projectId)) {
                    // sticky 위치 위로 다시 올라감 - 이 프로젝트의 스킬만 제거
                    passedProjects.delete(projectId);

                    const skillsData = element.getAttribute("data-skills");
                    if (skillsData) {
                        const skills: SkillTag[] = JSON.parse(skillsData);

                        setStackedSkills((prev) => {
                            const newStacked = { ...prev };
                            skills.forEach((skill) => {
                                // 이 스킬 ID를 제거 (ID는 프로젝트별로 고유하므로 다른 프로젝트 체크 불필요)
                                const categorySkills = newStacked[skill.category];
                                const skillIndex = categorySkills.findIndex((s) => s.id === skill.id);
                                if (skillIndex > -1) {
                                    categorySkills.splice(skillIndex, 1);
                                }
                            });
                            return newStacked;
                        });
                    }
                }
            });

            // 바닥 스크롤 처리
            const documentHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const isNearBottom = scrollTop + windowHeight >= documentHeight - 50;

            // 바닥에 도달했을 때만 모든 스킬 추가
            if (isNearBottom) {
                if (!isAllSkillsStacked) {
                    console.log("바닥 도달 - 모든 스킬 강제 추가");

                    // 모든 프로젝트를 passedProjects에 추가
                    developerData.projects.forEach((project) => {
                        passedProjects.add(project.id);
                    });

                    // 모든 스킬 수집 (ID 기반으로 모든 스킬 포함)
                    const allSkills: SkillTag[] = [];
                    developerData.projects.forEach((project) => {
                        project.skills.forEach((skill) => {
                            allSkills.push(skill);
                        });
                    });

                    // 스킬 스택 설정
                    setStackedSkills({
                        frontend: allSkills.filter((skill) => skill.category === "frontend"),
                        backend: allSkills.filter((skill) => skill.category === "backend"),
                        other: allSkills.filter((skill) => skill.category === "other"),
                    });

                    setIsAllSkillsStacked(true);
                }
            } else {
                if (isAllSkillsStacked) {
                    console.log("바닥에서 벗어남 - 스킬 초기화");

                    // 완전 초기화
                    passedProjects.clear();
                    setStackedSkills({ frontend: [], backend: [], other: [] });
                    setIsAllSkillsStacked(false);

                    // 현재 상태에서 다시 계산
                    projectElements.forEach((element) => {
                        const rect = element.getBoundingClientRect();
                        const projectId = element.getAttribute("data-project-id");

                        if (projectId && rect.top <= stickyPosition) {
                            passedProjects.add(projectId);

                            const skillsData = element.getAttribute("data-skills");
                            if (skillsData) {
                                const skills: SkillTag[] = JSON.parse(skillsData);
                                setStackedSkills((prev) => {
                                    const newStacked = { ...prev };
                                    skills.forEach((skill) => {
                                        const categorySkills = newStacked[skill.category];
                                        if (!categorySkills.some((s) => s.id === skill.id)) {
                                            categorySkills.push(skill);
                                        }
                                    });
                                    return newStacked;
                                });
                            }
                        }
                    });
                }
            }
        };

        // 초기 체크
        setTimeout(handleScroll, 100);

        // 스크롤 이벤트
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // ===== 렌더링 함수들 =====

    /**
     * 월별 그리드 라인을 렌더링
     */
    const renderMonthlyGrid = () => (
        <div className="absolute inset-0">
            {yearsArray.map((_, yearIndex) => (
                <div key={yearIndex}>
                    {[...Array(12)].map((_, idx) => {
                        // 2021년(첫 해) 1-8월은 렌더링하지 않음
                        if (yearIndex === 0 && idx < 8) return null;

                        const adjustedTop =
                            yearIndex === 0
                                ? (idx - 8) * MONTH_HEIGHT
                                : yearIndex * MONTH_HEIGHT * 12 + idx * MONTH_HEIGHT - 8 * MONTH_HEIGHT;

                        return (
                            <div
                                key={`${yearIndex}-${idx}`}
                                className="border-b border-gray-50"
                                style={{
                                    position: "absolute",
                                    top: `${adjustedTop}px`,
                                    width: "100%",
                                    height: `${MONTH_HEIGHT}px`,
                                }}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );

    /**
     * 연도 라벨을 렌더링 (고정 위치)
     */
    const renderYearLabels = () => (
        <div className="w-20 relative">
            {yearsArray.map((year, yearIndex) => (
                <div
                    key={year}
                    className="sticky bg-[#F8F8F8] border border-gray-200 rounded shadow-sm"
                    style={{
                        top: "100px",
                        height: "40px",
                        marginBottom: `${yearIndex === 0 ? MONTH_HEIGHT * 4 - 40 : MONTH_HEIGHT * 12 - 40}px`,
                    }}
                >
                    <div className="text-2xl font-bold text-gray-900 flex items-center justify-center h-full">
                        {year}
                    </div>
                </div>
            ))}
        </div>
    );

    /**
     * 월 라벨을 렌더링
     */
    const renderMonthLabels = () => (
        <div className="w-12">
            {yearsArray.map((_, yearIndex) => (
                <div key={yearIndex}>
                    {[...Array(12)].map((_, month) => {
                        // 2021년(첫 해) 1-8월은 렌더링하지 않음
                        if (yearIndex === 0 && month < 8) return null;

                        return (
                            <div
                                key={`${yearIndex}-${month}`}
                                className="text-sm text-gray-500 font-medium text-center border-b border-gray-50"
                                style={{
                                    height: `${MONTH_HEIGHT}px`,
                                    lineHeight: `${MONTH_HEIGHT}px`,
                                }}
                            >
                                {month + 1}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );

    /**
     * 연결선 SVG를 렌더링
     */
    const renderConnections = () => (
        <svg className="absolute inset-0 pointer-events-none z-10" style={{ width: "100%", height: "100%" }}>
            {connections.map((conn) => (
                <g key={conn.id}>
                    {/* 시작점 원형 */}
                    <circle cx={conn.fromX} cy={conn.fromY} r="5" fill={conn.color} stroke="white" strokeWidth="2" />
                    {/* 연결선 */}
                    <line
                        x1={conn.fromX + 5}
                        y1={conn.fromY}
                        x2={conn.toX - 5}
                        y2={conn.toY}
                        stroke={conn.color}
                        strokeWidth="2"
                        strokeDasharray="4,2"
                    />
                    {/* 끝점 원형 */}
                    <circle cx={conn.toX} cy={conn.toY} r="5" fill={conn.color} stroke="white" strokeWidth="2" />
                </g>
            ))}
        </svg>
    );

    /**
     * 경력 컬럼을 렌더링
     */
    const renderExperienceColumn = () => (
        <div className="relative" style={{ width: `${EXPERIENCE_WIDTH}px`, height: `${TOTAL_HEIGHT}px` }}>
            {renderMonthlyGrid()}

            {developerData.experiences.map((experience) => (
                <motion.div
                    key={experience.id}
                    className="absolute px-2 group"
                    style={{ ...getExperienceBarStyle(experience), width: `${EXPERIENCE_WIDTH - 16}px` }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0,
                        duration: 0.4,
                        ease: "easeOut",
                    }}
                >
                    <div
                        className={`h-full ${getEventColor()} relative border-l-4`}
                        data-type="experience"
                        data-id={experience.id}
                    >
                        <div className="sticky top-20 p-3 z-10">
                            <div className="text-sm font-bold text-gray-900 tracking-wide drop-shadow-sm">
                                • {experience.title}
                            </div>
                            {experience.subtitle && (
                                <div className="text-xs text-gray-700 font-semibold drop-shadow-sm mt-1">
                                    {experience.subtitle}
                                </div>
                            )}
                            {experience.description && (
                                <div className="text-xs text-gray-700 leading-relaxed font-medium drop-shadow-sm mt-1">
                                    {experience.description}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );

    /**
     * 프로젝트 컬럼을 렌더링 (3레인 시스템)
     */
    const renderProjectsColumn = () => {
        const projectsWithLayout = calculateProjectLayout();

        return (
            <div className="relative" style={{ width: `${PROJECT_WIDTH}px`, height: `${TOTAL_HEIGHT}px` }}>
                {renderMonthlyGrid()}

                {projectsWithLayout.map((project) => (
                    <motion.div
                        key={project.id}
                        className="absolute px-2 group cursor-pointer"
                        style={{
                            ...getProjectBarStyle(project),
                            left: `${project.laneIndex * PROJECT_LANE_WIDTH}px`,
                            width: `${PROJECT_LANE_WIDTH - 16}px`,
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0,
                            duration: 0.4,
                            ease: "easeOut",
                        }}
                        data-skills={JSON.stringify(project.skills)}
                        onClick={() => handleProjectClick(project.id)}
                    >
                        <div
                            className={`h-full ${getEventColor()} relative border-l-4 transition-all duration-200 group-hover:shadow-lg`}
                            data-type="project"
                            data-id={project.id}
                            {...(project.experienceId && { "data-experience-id": project.experienceId })}
                        >
                            <div className="sticky top-20 p-3 z-10">
                                <div className="text-sm font-bold text-gray-900 tracking-wide">
                                    <span className="crayon-hover crayon-hover-red tracking-wide drop-shadow-sm">
                                        • {project.title}
                                    </span>
                                </div>
                                {project.description && (
                                    <div className="text-xs text-gray-700 leading-relaxed font-medium mt-1 drop-shadow-sm">
                                        {project.description}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    };

    /**
     * 스킬 컬럼을 렌더링
     */
    const renderSkillsColumn = () => {
        const allCollectedSkills = stackedSkills.frontend.concat(stackedSkills.backend, stackedSkills.other);

        return (
            <div className="relative" style={{ width: `${SKILLS_WIDTH}px`, height: `${TOTAL_HEIGHT}px` }}>
                {renderMonthlyGrid()}

                {/* 타임라인의 각 프로젝트 스킬들 */}
                {developerData.projects.map((project) => {
                    const yearOffset = (project.startYear - developerData.yearRange.start) * MONTH_HEIGHT * 12;
                    const projectTop = yearOffset + (project.startMonth - 9) * MONTH_HEIGHT;

                    const adjustedTop = projectTop + 5;

                    return (
                        <div
                            key={`project-skills-${project.id}`}
                            className="absolute left-2 right-2"
                            style={{ top: `${adjustedTop}px` }}
                            data-skills={JSON.stringify(project.skills)}
                            data-project-id={project.id}
                        >
                            <div className="flex flex-wrap gap-1">
                                {project.skills.map((skill, skillIdx) => {
                                    // 해당 스킬 ID가 수집되었는지 확인
                                    const isCollected = allCollectedSkills.some((s) => s.id === skill.id);

                                    return (
                                        <div
                                            key={`${project.id}-${skill.name}-${skillIdx}`}
                                            className={`inline-block transition-all duration-300 ${
                                                isCollected ? "opacity-30 blur-sm" : "opacity-100"
                                            }`}
                                        >
                                            <SkillBadge skill={skill} size="sm" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // ===== 메인 렌더링 =====
    return (
        <motion.section className="mb-12" initial="initial" animate="animate" variants={staggerContainer}>
            {/* 컬럼 헤더 */}
            <div className="flex gap-4 mb-6 sticky top-0 bg-[#F8F8F8] z-20 py-4">
                <div className="w-20"></div>
                <div className="w-12"></div>
                <div className="flex gap-8">
                    <div
                        className="text-[28px] font-semibold crayon-highlight crayon-highlight-gold font-cafe24-gowoonbam inline-block"
                        style={{ width: `${EXPERIENCE_WIDTH}px` }}
                    >
                        EXPERIENCE
                    </div>
                    <div className="flex" style={{ width: `${PROJECT_WIDTH}px` }}>
                        <div
                            className="text-[28px] font-semibold crayon-highlight mr-8 crayon-highlight-forest font-cafe24-gowoonbam inline-block"
                            style={{ width: `${PROJECT_LANE_WIDTH}px` }}
                        >
                            WORK PROJECTS
                        </div>
                        <div
                            className="text-[28px] font-semibold crayon-highlight crayon-highlight-orange font-cafe24-gowoonbam inline-block"
                            style={{ width: `${PROJECT_LANE_WIDTH}px` }}
                        >
                            PERSONAL PROJECTS
                        </div>
                    </div>
                    <div
                        className="text-[28px] font-semibold crayon-highlight crayon-highlight-silver font-cafe24-gowoonbam inline-block"
                        style={{ width: `${SKILLS_WIDTH}px` }}
                    >
                        SKILLS
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                {/* 타임라인 컨테이너 */}
                <div className="flex gap-4">
                    {/* 연도 및 월 라벨 */}
                    <div className="flex">
                        {renderYearLabels()}
                        {renderMonthLabels()}
                    </div>

                    {/* 타임라인 그리드 */}
                    <div className="flex gap-8 relative" ref={containerRef}>
                        <YearDivider totalHeight={TOTAL_HEIGHT} monthHeight={MONTH_HEIGHT} yearsArray={yearsArray} />
                        {renderConnections()}
                        {renderExperienceColumn()}
                        {renderProjectsColumn()}
                        {renderSkillsColumn()}
                    </div>
                </div>

                {/* 수집된 스킬들을 우측에 별도로 표시 */}
                {stackedSkills.frontend.concat(stackedSkills.backend, stackedSkills.other).length > 0 && (
                    <div className="sticky top-20 ml-4 self-start">
                        <div className="flex flex-wrap gap-1" style={{ width: "200px" }}>
                            {(() => {
                                // 모든 수집된 스킬에서 이름별로 중복 제거
                                const allSkills = stackedSkills.frontend.concat(
                                    stackedSkills.backend,
                                    stackedSkills.other
                                );
                                const uniqueSkills = allSkills.reduce((acc, skill) => {
                                    if (!acc.some((s) => s.name === skill.name)) {
                                        acc.push(skill);
                                    }
                                    return acc;
                                }, [] as typeof allSkills);

                                return uniqueSkills.map((skill, idx) => (
                                    <motion.div
                                        key={`external-stacked-${skill.name}`}
                                        className="inline-block"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ delay: idx * 0.05, type: "spring" }}
                                    >
                                        <SkillBadge skill={skill} size="sm" />
                                    </motion.div>
                                ));
                            })()}
                        </div>
                    </div>
                )}
            </div>

            {/* Project Sidebar */}
            <PhilosophySidebar
                ref={sidebarRef}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                philosophyData={selectedProjectSummary}
            />
        </motion.section>
    );
}
