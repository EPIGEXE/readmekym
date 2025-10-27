import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { developerData } from "../data/devloperData";
import { detailedDeveloperData } from "../data/detailedDeveloperData";
import type { SkillTag, StackedSkills, Project, Experience } from "../types";
import { YearDivider } from "../components/YearDivider";
import { SkillBadge } from "../components/ui/SkillBadge";
import { PhilosophySidebar } from "../components/common/PhilosophySidebar";
import { Signpost, X } from "lucide-react";

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
    const [isMobile, setIsMobile] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const year2021Ref = useRef<HTMLDivElement>(null);
    const year2022Ref = useRef<HTMLDivElement>(null);
    const year2023Ref = useRef<HTMLDivElement>(null);
    const year2024Ref = useRef<HTMLDivElement>(null);
    const year2025Ref = useRef<HTMLDivElement>(null);

    // ===== 상수 정의 =====
    // 데스크톱 기준
    const MONTH_HEIGHT = 80;
    const EXPERIENCE_WIDTH = 280;
    const PROJECT_WIDTH = 560; // 2줄 고정 (280px × 2)
    const SKILLS_WIDTH = 200;
    const PROJECT_LANE_WIDTH = 280; // 각 프로젝트 레인 너비

    // 모바일 기준 (축소)
    const MOBILE_MONTH_HEIGHT = 60;
    const MOBILE_EXPERIENCE_WIDTH = 140;
    const MOBILE_PROJECT_WIDTH = 140; // 1레인
    const MOBILE_SKILLS_WIDTH = 100;

    // 연도 범위 계산 (2021년 9월부터 시작)
    const totalYears = developerData.yearRange.end - developerData.yearRange.start + 1;
    const TOTAL_HEIGHT = totalYears * MONTH_HEIGHT * 12 - 8 * MONTH_HEIGHT;
    const MOBILE_TOTAL_HEIGHT = totalYears * MOBILE_MONTH_HEIGHT * 12 - 8 * MOBILE_MONTH_HEIGHT;

    // ===== 스타일 계산 함수들 =====

    /**
     * 경력 바의 스타일을 계산 (연도 넘어가는 경력 지원)
     */
    const getExperienceBarStyle = (experience: Experience) => {
        const monthHeight = isMobile ? MOBILE_MONTH_HEIGHT : MONTH_HEIGHT;
        const expStartYear = experience.startYear;
        const expEndYear = experience.endYear;

        // 시작 연도에서의 오프셋 계산 (2021년 8월부터 시작)
        const startYearOffset = (expStartYear - developerData.yearRange.start) * monthHeight * 12;
        const absoluteTop = startYearOffset + (experience.startMonth - 9) * monthHeight;

        // 전체 높이 계산
        let totalHeight = 0;
        if (expStartYear === expEndYear) {
            // 같은 연도 내 경력
            totalHeight = (experience.endMonth - experience.startMonth + 1) * monthHeight;
        } else {
            // 시작 연도 높이
            totalHeight += (12 - experience.startMonth + 1) * monthHeight;
            // 중간 연도들 높이
            for (let year = expStartYear + 1; year < expEndYear; year++) {
                totalHeight += 12 * monthHeight;
            }
            // 종료 연도 높이
            totalHeight += experience.endMonth * monthHeight;
        }

        return {
            top: `${absoluteTop}px`,
            height: `${Math.max(totalHeight - 8, monthHeight)}px`,
        };
    };

    /**
     * 프로젝트 바의 스타일을 계산 (연도 넘어가는 프로젝트 지원)
     */
    const getProjectBarStyle = (project: Project) => {
        const monthHeight = isMobile ? MOBILE_MONTH_HEIGHT : MONTH_HEIGHT;
        const projectStartYear = project.startYear;
        const projectEndYear = project.endYear;

        // 시작 연도에서의 오프셋 계산 (2021년 8월부터 시작)
        const startYearOffset = (projectStartYear - developerData.yearRange.start) * monthHeight * 12;
        const absoluteTop = startYearOffset + (project.startMonth - 9) * monthHeight;

        // 전체 높이 계산
        let totalHeight = 0;

        if (projectStartYear === projectEndYear) {
            // 같은 연도 내 프로젝트
            totalHeight = (project.endMonth - project.startMonth + 1) * monthHeight;
        } else {
            // 시작 연도 높이
            totalHeight += (12 - project.startMonth + 1) * monthHeight;

            // 중간 연도들 높이
            for (let year = projectStartYear + 1; year < projectEndYear; year++) {
                totalHeight += 12 * monthHeight;
            }

            // 종료 연도 높이
            totalHeight += project.endMonth * monthHeight;
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

    // 연도별 ref 맵핑
    const yearRefMap: { [key: number]: React.RefObject<HTMLDivElement | null> } = {
        2021: year2021Ref,
        2022: year2022Ref,
        2023: year2023Ref,
        2024: year2024Ref,
        2025: year2025Ref,
    };

    // 스크롤 함수
    const scrollToYear = (year: number) => {
        const ref = yearRefMap[year];
        if (ref && ref.current) {
            const offsetTop = ref.current.offsetTop - 100; // 헤더 높이만큼 오프셋
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
        setIsNavOpen(false);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsNavOpen(false);
    };

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

    // 반응형 화면 감지 (matchMedia 사용 - 개발자 도구 반응형 모드 대응)
    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 767px)'); // md breakpoint (모바일)

        const checkMobile = () => {
            console.log('Screen width (matchMedia):', mediaQuery.matches);
            setIsMobile(mediaQuery.matches);
        };

        // 초기 체크
        checkMobile();

        // 미디어 쿼리 변경 감지
        const handler = (e: MediaQueryListEvent) => {
            console.log('Media query changed:', e.matches);
            setIsMobile(e.matches);
        };

        mediaQuery.addEventListener('change', handler);

        return () => {
            mediaQuery.removeEventListener('change', handler);
        };
    }, []);

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
     * 모바일에서는 모두 0번 레인에 배치
     */
    const calculateProjectLayout = (): Array<Project & { laneIndex: number; offset: number; zIndex: number }> => {
        const allProjects: Array<Project & { laneIndex: number; offset: number; zIndex: number }> = [];

        // 시작 시점 기준으로 정렬 (연도 우선, 월 보조)
        const sortedProjects = [...developerData.projects].sort((a, b) => {
            if (a.startYear !== b.startYear) return a.startYear - b.startYear;
            return a.startMonth - b.startMonth;
        });

        // 각 프로젝트를 경력/개인에 따라 레인 배치
        sortedProjects.forEach((project, index) => {
            // 모바일에서는 모두 0번 레인, 데스크톱에서는 경력/개인 구분
            const laneIndex = isMobile ? 0 : (project.experienceId ? 0 : 1);

            // 겹침 감지 및 오프셋 계산 (모바일/데스크톱 모두)
            let offset = 0;
            const zIndex = 10 + index;

            if (index > 0) {
                // 같은 레인의 직전 프로젝트 찾기
                const sameLaneProjects = allProjects.filter(p => p.laneIndex === laneIndex);

                if (sameLaneProjects.length > 0) {
                    const prevProject = sameLaneProjects[sameLaneProjects.length - 1];

                    const prevEndTime = prevProject.endYear * 12 + prevProject.endMonth;
                    const currentStartTime = project.startYear * 12 + project.startMonth;

                    // 직전 프로젝트와 겹치면 들여쓰기
                    if (prevEndTime >= currentStartTime) {
                        offset = prevProject.offset + 12; // 직전 프로젝트의 오프셋 + 12px
                    } else {
                        // 겹치지 않으면 리셋 (원래대로)
                        offset = 0;
                    }
                }
            }

            // 결과 배열에 추가
            allProjects.push({
                ...project,
                laneIndex,
                offset,
                zIndex,
            });
        });

        return allProjects;
    };

    // ===== 이펙트 훅들 =====

    /**
     * 경력과 프로젝트 간의 연결선을 계산하고 생성하는 이펙트
     * 개인 프로젝트(experienceId가 없는)는 연결선 제외
     * 모바일에서는 연결선 표시 안 함
     */
    useEffect(() => {
        const calculateConnections = () => {
            if (!containerRef.current || isMobile) {
                setConnections([]);
                return;
            }

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

        // 초기 계산
        const timer = setTimeout(calculateConnections, 100);

        // 윈도우 리사이즈 시 재계산
        const handleResize = () => {
            calculateConnections();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
        };
    }, [developerData, isMobile]);

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
    const renderMonthlyGrid = () => {
        const monthHeight = isMobile ? MOBILE_MONTH_HEIGHT : MONTH_HEIGHT;

        return (
            <div className="absolute inset-0">
                {yearsArray.map((_, yearIndex) => (
                    <div key={yearIndex}>
                        {[...Array(12)].map((_, idx) => {
                            // 2021년(첫 해) 1-8월은 렌더링하지 않음
                            if (yearIndex === 0 && idx < 8) return null;

                            const adjustedTop =
                                yearIndex === 0
                                    ? (idx - 8) * monthHeight
                                    : yearIndex * monthHeight * 12 + idx * monthHeight - 8 * monthHeight;

                            return (
                                <div
                                    key={`${yearIndex}-${idx}`}
                                    className="border-b border-gray-50"
                                    style={{
                                        position: "absolute",
                                        top: `${adjustedTop}px`,
                                        width: "100%",
                                        height: `${monthHeight}px`,
                                    }}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };

    /**
     * 연도 라벨을 렌더링 (고정 위치)
     */
    const renderYearLabels = () => {
        const monthHeight = isMobile ? MOBILE_MONTH_HEIGHT : MONTH_HEIGHT;

        return (
            <div className={isMobile ? "w-6" : "w-20"}>
                {yearsArray.map((year, yearIndex) => (
                    <div
                        key={year}
                        ref={yearRefMap[year]}
                        className="sticky bg-[#F8F8F8] border border-gray-200 rounded shadow-sm flex items-center justify-center"
                        style={{
                            top: isMobile ? "80px" : "100px",
                            height: isMobile ? "60px" : "40px",
                            marginBottom: `${yearIndex === 0 ? monthHeight * 4 - (isMobile ? 50 : 40) : monthHeight * 12 - (isMobile ? 50 : 40)}px`,
                        }}
                    >
                        <div
                            className={`${isMobile ? "text-xs" : "text-2xl"} font-bold text-gray-900`}
                            style={isMobile ? {
                                writingMode: 'vertical-rl',
                                textOrientation: 'upright',
                                letterSpacing: '-1px'
                            } : {}}
                        >
                            {year}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    /**
     * 월 라벨을 렌더링
     */
    const renderMonthLabels = () => {
        const monthHeight = isMobile ? MOBILE_MONTH_HEIGHT : MONTH_HEIGHT;

        return (
            <div className={isMobile ? "w-5" : "w-12"}>
                {yearsArray.map((_, yearIndex) => (
                    <div key={yearIndex}>
                        {[...Array(12)].map((_, month) => {
                            // 2021년(첫 해) 1-8월은 렌더링하지 않음
                            if (yearIndex === 0 && month < 8) return null;

                            return (
                                <div
                                    key={`${yearIndex}-${month}`}
                                    className={`${isMobile ? "text-[9px]" : "text-sm"} text-gray-500 font-medium text-center border-b border-gray-50`}
                                    style={{
                                        height: `${monthHeight}px`,
                                        lineHeight: `${monthHeight}px`,
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
    };

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
    const renderExperienceColumn = () => {
        const width = isMobile ? MOBILE_EXPERIENCE_WIDTH : EXPERIENCE_WIDTH;
        const height = isMobile ? MOBILE_TOTAL_HEIGHT : TOTAL_HEIGHT;

        return (
            <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
                {renderMonthlyGrid()}

                {developerData.experiences.map((experience) => (
                    <motion.div
                        key={experience.id}
                        className="absolute px-2 group"
                        style={{ ...getExperienceBarStyle(experience), width: `${width - 16}px` }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0,
                            duration: 0.4,
                            ease: "easeOut",
                        }}
                    >
                        <div
                            className={`h-full ${isMobile ? "bg-transparent border-l-4 !border-l-gray-400" : getEventColor()} relative ${isMobile ? "" : "border-l-4"}`}
                            data-type="experience"
                            data-id={experience.id}
                        >
                            <div className={`${isMobile ? "sticky top-[80px]" : "sticky top-20"} ${isMobile ? "p-1" : "p-3"} z-10`}>
                                <div className={`${isMobile ? "text-xs leading-snug" : "text-sm"} font-bold text-gray-900 tracking-wide drop-shadow-sm ${isMobile ? "break-words" : ""}`}>
                                    • {experience.title}
                                </div>
                                {experience.subtitle && !isMobile && (
                                    <div className="text-xs text-gray-700 font-semibold drop-shadow-sm mt-1">
                                        {experience.subtitle}
                                    </div>
                                )}
                                {experience.description && !isMobile && (
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
    };

    /**
     * 프로젝트 컬럼을 렌더링 (데스크톱: 2레인, 모바일: 1레인)
     */
    const renderProjectsColumn = () => {
        const projectsWithLayout = calculateProjectLayout();
        const width = isMobile ? MOBILE_PROJECT_WIDTH : PROJECT_WIDTH;
        const height = isMobile ? MOBILE_TOTAL_HEIGHT : TOTAL_HEIGHT;
        const laneWidth = isMobile ? MOBILE_PROJECT_WIDTH : PROJECT_LANE_WIDTH;

        return (
            <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
                {renderMonthlyGrid()}

                {projectsWithLayout.map((project) => (
                    <motion.div
                        key={project.id}
                        className="absolute px-2 group cursor-pointer"
                        style={{
                            ...getProjectBarStyle(project),
                            left: `${project.laneIndex * laneWidth + project.offset}px`,
                            width: `${laneWidth - 16 - project.offset}px`,
                            zIndex: project.zIndex,
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
                            className={`h-full ${isMobile ? "bg-transparent border-0" : "bg-white border border-gray-200"} relative border-l-4 transition-all duration-200 ${
                                isMobile ? "" : "shadow-sm"
                            } ${
                                isMobile ? "" : "group-hover:shadow-lg"
                            } ${
                                project.experienceId
                                    ? "!border-l-emerald-500"
                                    : "!border-l-orange-500"
                            }`}
                            data-type="project"
                            data-id={project.id}
                            {...(project.experienceId && { "data-experience-id": project.experienceId })}
                        >
                            <div className={`${isMobile ? "sticky top-[80px]" : "sticky top-20"} ${isMobile ? "p-1" : "p-3"} z-10`}>
                                <div className={`${isMobile ? "text-xs leading-snug" : "text-sm"} font-bold text-gray-900 tracking-wide ${isMobile ? "break-words" : ""}`}>
                                    <span className="crayon-hover crayon-hover-red tracking-wide drop-shadow-sm">
                                        • {project.title}
                                    </span>
                                </div>
                                {project.description && !isMobile && (
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
        const width = isMobile ? MOBILE_SKILLS_WIDTH : SKILLS_WIDTH;
        const height = isMobile ? MOBILE_TOTAL_HEIGHT : TOTAL_HEIGHT;
        const monthHeight = isMobile ? MOBILE_MONTH_HEIGHT : MONTH_HEIGHT;

        return (
            <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
                {renderMonthlyGrid()}

                {/* 타임라인의 각 프로젝트 스킬들 */}
                {developerData.projects.map((project) => {
                    const yearOffset = (project.startYear - developerData.yearRange.start) * monthHeight * 12;
                    const projectTop = yearOffset + (project.startMonth - 9) * monthHeight;

                    const adjustedTop = projectTop + 5;

                    return (
                        <div
                            key={`project-skills-${project.id}`}
                            className={`absolute ${isMobile ? "left-1 right-1" : "left-2 right-2"}`}
                            style={{ top: `${adjustedTop}px` }}
                            data-skills={JSON.stringify(project.skills)}
                            data-project-id={project.id}
                        >
                            <div className={`flex flex-wrap ${isMobile ? "gap-0.5" : "gap-1"}`}>
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
            <div className={`flex ${isMobile ? "gap-2" : "gap-4"} mb-6 sticky top-0 bg-[#F8F8F8] z-20 py-4 ${isMobile ? "overflow-x-hidden" : ""}`}>
                <div className={isMobile ? "w-6" : "w-20"}></div>
                <div className={isMobile ? "w-5" : "w-12"}></div>
                <div className={`flex ${isMobile ? "gap-2" : "gap-8"}`}>
                    <div
                        className={`${isMobile ? "text-sm" : "text-[28px]"} font-semibold crayon-highlight crayon-highlight-gold font-cafe24-gowoonbam inline-block`}
                        style={{ width: `${isMobile ? MOBILE_EXPERIENCE_WIDTH : EXPERIENCE_WIDTH}px` }}
                    >
                        {isMobile ? "EXP" : "EXPERIENCE"}
                    </div>
                    <div className="flex" style={{ width: `${isMobile ? MOBILE_PROJECT_WIDTH : PROJECT_WIDTH}px` }}>
                        {!isMobile ? (
                            <>
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
                            </>
                        ) : (
                            <div
                                className="text-sm font-semibold crayon-highlight crayon-highlight-forest font-cafe24-gowoonbam inline-block"
                                style={{ width: `${MOBILE_PROJECT_WIDTH}px` }}
                            >
                                PROJECTS
                            </div>
                        )}
                    </div>
                    {!isMobile && (
                        <div
                            className="text-[28px] font-semibold crayon-highlight crayon-highlight-silver font-cafe24-gowoonbam inline-block"
                            style={{ width: `${SKILLS_WIDTH}px` }}
                        >
                            SKILLS
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-4">
                {/* 타임라인 컨테이너 */}
                <div className="flex-1">
                    <div className={`flex ${isMobile ? "gap-2" : "gap-4"}`}>
                        {/* 연도 및 월 라벨 */}
                        <div className="flex">
                            {renderYearLabels()}
                            {renderMonthLabels()}
                        </div>

                        {/* 타임라인 그리드 */}
                        <div className={`flex ${isMobile ? "gap-1" : "gap-8"} relative`} ref={containerRef}>
                            {!isMobile && (
                                <YearDivider
                                    totalHeight={isMobile ? MOBILE_TOTAL_HEIGHT : TOTAL_HEIGHT}
                                    monthHeight={isMobile ? MOBILE_MONTH_HEIGHT : MONTH_HEIGHT}
                                    yearsArray={yearsArray}
                                />
                            )}
                            {!isMobile && renderConnections()}
                            {renderExperienceColumn()}
                            {renderProjectsColumn()}
                            {!isMobile && renderSkillsColumn()}
                        </div>
                    </div>
                </div>

                {/* 수집된 스킬들을 우측에 별도로 표시 (데스크톱만) */}
                {!isMobile && stackedSkills.frontend.concat(stackedSkills.backend, stackedSkills.other).length > 0 && (
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
                                    onClick={scrollToTop}
                                    className="px-4 py-2 rounded-full bg-gray-700 text-white shadow-lg text-sm font-medium whitespace-nowrap hover:bg-gray-600 transition-colors"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    맨 위로
                                </motion.button>
                                <motion.button
                                    onClick={() => scrollToYear(2021)}
                                    className="px-4 py-2 rounded-full bg-white border border-gray-300 text-gray-700 shadow-lg text-sm font-medium whitespace-nowrap hover:bg-gray-50 transition-colors"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    2021
                                </motion.button>
                                <motion.button
                                    onClick={() => scrollToYear(2022)}
                                    className="px-4 py-2 rounded-full bg-white border border-gray-300 text-gray-700 shadow-lg text-sm font-medium whitespace-nowrap hover:bg-gray-50 transition-colors"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    2022
                                </motion.button>
                                <motion.button
                                    onClick={() => scrollToYear(2023)}
                                    className="px-4 py-2 rounded-full bg-white border border-gray-300 text-gray-700 shadow-lg text-sm font-medium whitespace-nowrap hover:bg-gray-50 transition-colors"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    2023
                                </motion.button>
                                <motion.button
                                    onClick={() => scrollToYear(2024)}
                                    className="px-4 py-2 rounded-full bg-white border border-gray-300 text-gray-700 shadow-lg text-sm font-medium whitespace-nowrap hover:bg-gray-50 transition-colors"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    2024
                                </motion.button>
                                <motion.button
                                    onClick={() => scrollToYear(2025)}
                                    className="px-4 py-2 rounded-full bg-white border border-gray-300 text-gray-700 shadow-lg text-sm font-medium whitespace-nowrap hover:bg-gray-50 transition-colors"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    2025
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
        </motion.section>
    );
}
