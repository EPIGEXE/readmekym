import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { developerData } from "../data/devloperData";
import { detailedDeveloperData } from "../data/detailedDeveloperData";
import type { StackedSkills, Project } from "../types";
import { YearDivider } from "../components/YearDivider";
import { SkillBadge } from "../components/ui/SkillBadge";
import { Signpost, X } from "lucide-react";
import { ProjectSummarySidebar } from "../components/common/ProjectSummarySidebar";
import type { SidebarData, SkillTag } from "../types/common";
import { getYearsArray } from "../utils/utils";

export function TimelinePage() {
    // ============================ 상태 관리 ============================
    const [stackedSkills, setStackedSkills] = useState<StackedSkills>({
        frontend: [],
        backend: [],
        other: [],
    }); // 스크롤 시 쌓이는 스킬 스택

    const [isAllSkillsStacked, setIsAllSkillsStacked] = useState<boolean>(false); // 모든 스킬이 쌓였는지 여부: 바닥에 도달 했을 때 모든 스킬을 추가가

    const [selectedProjectSummary, setSelectedProjectSummary] = useState<SidebarData | null>(null); // 선택된 프로젝트 summary 데이터
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 프로젝트 사이드바 열림 여부

    // ----------------------- 모바일 관련 상태 관리 ---------------------
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== "undefined") {
            return window.matchMedia("(max-width: 767px)").matches;
        }
        return false;
    }); // 화면이 모바일인지 여부

    const [isNavOpen, setIsNavOpen] = useState(false); // 네비게이션 메뉴 열림 여부

    // ============================ useRef ============================
    const yearPositionsRef = useRef<{ [key: number]: number }>({}); // 연도별 위치 저장용 ref

    // ============================ 상수 정의 ============================
    // 데스크톱 기준
    const MONTH_HEIGHT = 80;
    const EXPERIENCE_WIDTH = 280;
    const PROJECT_WIDTH = 560; // 2줄 고정 (280px × 2)
    const SKILLS_WIDTH = 200;

    // 모바일 기준
    const MOBILE_MONTH_HEIGHT = 60;
    const MOBILE_EXPERIENCE_WIDTH = 140;
    const MOBILE_PROJECT_WIDTH = 140; // 1레인
    const MOBILE_SKILLS_WIDTH = 100;

    // 연도 범위 계산 (2021년 9월부터 시작)
    const totalYears = developerData.yearRange.end - developerData.yearRange.start + 1;
    const TOTAL_HEIGHT = totalYears * MONTH_HEIGHT * 12 - 8 * MONTH_HEIGHT;
    const MOBILE_TOTAL_HEIGHT = totalYears * MOBILE_MONTH_HEIGHT * 12 - 8 * MOBILE_MONTH_HEIGHT;

    // 연도 배열 생성
    const yearsArray = getYearsArray(developerData);

    // ============================ useEffect ============================
    // 연도 위치 초기화
    // 모바일에서 연도별 위치 이동을 위해서 연도 위치를 저장
    // !important: 연도 위치를 따로 계산해서 저장하는 이유는 연도 라벨들이 sticky기 때문에 움직이기 때문에 저장하는 것임
    // 따라서 데스크탑에서 모바일로 스크롤 중간에 변경하면 모바일 위치가 잘못 잡히는 문제가 발생하나 매우 예외적인 상황으로 상정하고 처리하지 않음
    useEffect(() => {
        const saveYearPositions = () => {
            const yearElements = document.querySelectorAll<HTMLDivElement>("[data-year]");
            yearElements.forEach((element) => {
                const year = Number(element.getAttribute("data-year"));
                if (!isNaN(year)) {
                    yearPositionsRef.current[year] = element.offsetTop;
                }
            });
        };

        // 레이아웃이 완료된 후 위치 저장
        saveYearPositions();
    }, [isMobile]); // isMobile 변경 시 재계산

    // 화면이 모바일인지 감지
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 767px)");
        const checkMobile = () => {
            setIsMobile(mediaQuery.matches);
        };
        checkMobile();
        mediaQuery.addEventListener("change", checkMobile);
        return () => mediaQuery.removeEventListener("change", checkMobile);
    }, []);

    // 스크롤 이벤트로 뷰포트를 지나는 스킬의 추가/제거 처리
    useEffect(() => {
        const stickyPosition = 100; // sticky top position (연도 라벨의 sticky 위치)

        const handleScroll = () => {
            const projectElements = document.querySelectorAll("[data-skills]");

            projectElements.forEach((element) => {
                const rect = element.getBoundingClientRect();
                const projectId = element.getAttribute("data-project-id");

                if (!projectId) return;

                // sticky 위치를 지나갔는지 확인
                const hasPassedSticky = rect.top <= stickyPosition;

                if (hasPassedSticky) {
                    // sticky 위치를 지나감 - 스킬 추가
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
                } else if (!hasPassedSticky) {
                    // sticky 위치 위로 다시 올라감 - 이 프로젝트의 스킬만 제거

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
                    // 완전 초기화
                    setStackedSkills({ frontend: [], backend: [], other: [] });
                    setIsAllSkillsStacked(false);

                    // 현재 상태에서 다시 계산
                    projectElements.forEach((element) => {
                        const rect = element.getBoundingClientRect();
                        const projectId = element.getAttribute("data-project-id");

                        if (projectId && rect.top <= stickyPosition) {
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
        handleScroll();

        // 스크롤 이벤트
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // ============================ 핸들러 ============================
    // 프로젝트 클릭 핸들러
    const handleProjectClick = (projectId: string) => {
        const detailedProject = detailedDeveloperData.projects.find((p) => p.id === projectId);
        if (detailedProject) {
            const projectSummary: SidebarData = {
                id: detailedProject.id,
                number: detailedProject.id.split("-")[1].padStart(2, "0"),
                title: detailedProject.title,
                description: detailedProject.shortDescription,
                color: detailedProject.experienceId ? "text-emerald-600" : "text-orange-600",
                role: detailedProject.role,
                teamSize: detailedProject.teamSize,
                skills: detailedProject.skills,
                achievements: detailedProject.achievements.slice(0, 4),
                fullDescription: detailedProject.fullDescription,
            };
            setSelectedProjectSummary(projectSummary);
            setIsSidebarOpen(true);
        }
    };

    // ============================ 유틸 함수 ============================
    // --------------------- 레이아웃 관련 유틸 함수 ----------------------------
    // 경력, 프로젝트 바의 높이 계산
    const getBarHeight = (startYear: number, endYear: number, startMonth: number, endMonth: number) => {
        const monthHeight = isMobile ? MOBILE_MONTH_HEIGHT : MONTH_HEIGHT;

        // 시작 연도에서의 오프셋 계산 (2021년 8월부터 시작)
        const startYearOffset = (startYear - developerData.yearRange.start) * monthHeight * 12;
        const absoluteTop = startYearOffset + (startMonth - 9) * monthHeight;

        // 전체 높이 계산
        let totalHeight = 0;

        if (startYear === endYear) {
            // 같은 연도 내 프로젝트
            totalHeight = (endMonth - startMonth + 1) * monthHeight;
        } else {
            // 시작 연도 높이
            totalHeight += (12 - startMonth + 1) * monthHeight;

            // 중간 연도들 높이
            for (let year = startYear + 1; year < endYear; year++) {
                totalHeight += 12 * monthHeight;
            }

            // 종료 연도 높이
            totalHeight += endMonth * monthHeight;
        }

        return {
            top: `${absoluteTop}px`,
            height: `${Math.max(totalHeight - 8, monthHeight)}px`,
        };
    };

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
            const laneIndex = isMobile ? 0 : project.experienceId ? 0 : 1;

            // 겹침 감지 및 오프셋 계산
            let offset = 0;
            const zIndex = 10 + index;

            if (index > 0) {
                // 같은 레인의 직전 프로젝트 찾기
                const sameLaneProjects = allProjects.filter((p) => p.laneIndex === laneIndex);

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

    // 연도 라벨 렌더링
    // 이전 연도 라벨과의 간격을 계산해서 marginBottom으로 위치
    const renderYearLabels = () => {
        const monthHeight = isMobile ? MOBILE_MONTH_HEIGHT : MONTH_HEIGHT;
        const yearHeight = isMobile ? 60 : 40;
        const height = isMobile ? MOBILE_TOTAL_HEIGHT : TOTAL_HEIGHT;

        return (
            <div className={isMobile ? "w-6" : "w-20"} style={{ height: `${height}px` }}>
                {yearsArray.map((year, yearIndex) => {
                    const isLastYear = yearIndex === yearsArray.length - 1;

                    return (
                        <div
                            key={year}
                            data-year={year}
                            className="sticky bg-[#F8F8F8] border border-gray-200 rounded shadow-sm flex items-center justify-center"
                            style={{
                                top: isMobile ? "80px" : "100px",
                                height: `${yearHeight}px`,
                                marginBottom: isLastYear
                                    ? "0px"
                                    : `${
                                          yearIndex === 0 ? monthHeight * 4 - yearHeight : monthHeight * 12 - yearHeight
                                      }px`,
                            }}
                        >
                            <div
                                className={`${isMobile ? "text-xs" : "text-2xl"} font-bold text-gray-900`}
                                style={
                                    isMobile
                                        ? {
                                              writingMode: "vertical-rl",
                                              textOrientation: "upright",
                                              letterSpacing: "-1px",
                                          }
                                        : {}
                                }
                            >
                                {year}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // 월 라벨 렌더링
    // 렌더링 해야하는 월의 개수를 계산해서 렌더링
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
                                    className={`${
                                        isMobile ? "text-[9px]" : "text-sm"
                                    } text-gray-500 font-medium text-center border-b border-gray-50`}
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
     * 경력 컬럼을 렌더링
     */
    const renderExperienceColumn = () => {
        const width = isMobile ? MOBILE_EXPERIENCE_WIDTH : EXPERIENCE_WIDTH;
        const height = isMobile ? MOBILE_TOTAL_HEIGHT : TOTAL_HEIGHT;

        return (
            <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
                {developerData.experiences.map((experience) => (
                    <motion.div
                        key={experience.id}
                        className="absolute px-2 group"
                        style={{
                            ...getBarHeight(
                                experience.startYear,
                                experience.endYear,
                                experience.startMonth,
                                experience.endMonth
                            ),
                            width: `${isMobile ? width : width - 16}px`,
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0,
                            duration: 0.4,
                            ease: "easeOut",
                        }}
                    >
                        <div
                            className={`h-full "bg-transparent border-l-4 !border-l-gray-400" relative ${
                                isMobile ? "" : "border-l-4"
                            }`}
                            data-type="experience"
                            data-id={experience.id}
                        >
                            <div
                                className={`${isMobile ? "sticky top-[80px]" : "sticky top-20"} ${
                                    isMobile ? "p-1" : "p-3"
                                } z-10 bg-[#F8F8F8]`}
                            >
                                <div
                                    className={`${
                                        isMobile ? "text-xs" : "text-sm"
                                    } font-bold text-gray-900 tracking-wide drop-shadow-sm leading-snug break-words`}
                                >
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
        const laneWidth = isMobile ? MOBILE_PROJECT_WIDTH : PROJECT_WIDTH / 2;

        return (
            <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
                {projectsWithLayout.map((project) => (
                    <motion.div
                        key={project.id}
                        className="absolute px-2 group cursor-pointer"
                        style={{
                            ...getBarHeight(project.startYear, project.endYear, project.startMonth, project.endMonth),
                            left: `${project.laneIndex * laneWidth + project.offset}px`,
                            width: `${isMobile ? laneWidth - project.offset : laneWidth - 16 - project.offset}px`,
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
                            className={`h-full "bg-transparent border-0" relative border-l-4 transition-all duration-200 ${
                                project.experienceId ? "!border-l-emerald-500" : "!border-l-orange-500"
                            }`}
                            data-type="project"
                            data-id={project.id}
                            {...(project.experienceId && { "data-experience-id": project.experienceId })}
                        >
                            <div
                                className={`${isMobile ? "sticky top-[80px]" : "sticky top-20"} ${
                                    isMobile ? "p-1" : "p-3"
                                } z-10 bg-[#F8F8F8]`}
                            >
                                <div
                                    className={`${
                                        isMobile ? "text-xs" : "text-sm"
                                    } font-bold text-gray-900 tracking-wide break-words leading-snug`}
                                >
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

    // 모바일: 연도별 스크롤 이동
    const scrollToYear = (year: number) => {
        const savedPosition = yearPositionsRef.current[year];
        if (savedPosition !== undefined) {
            window.scrollTo({ top: savedPosition - 80, behavior: "smooth" });
        }
        setIsNavOpen(false);
    };

    // 모바일: 맨 위로 스크롤 이동
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setIsNavOpen(false);
    };

    return (
        <section className="mb-12">
            {/* 컬럼 헤더 */}
            <div
                className="flex mb-6 sticky top-0 bg-[#F8F8F8] z-20 py-4"
                style={{ paddingLeft: isMobile ? "52px" : "150px" }}
            >
                <div className={`flex ${isMobile ? "gap-2" : "gap-8"}`}>
                    <div
                        className={`${
                            isMobile ? "text-sm" : "text-[28px]"
                        } font-semibold crayon-highlight crayon-highlight-gold font-cafe24-gowoonbam inline-block`}
                        style={{ width: `${isMobile ? MOBILE_EXPERIENCE_WIDTH : EXPERIENCE_WIDTH}px` }}
                    >
                        EXPERIENCE
                    </div>
                    <div className="flex" style={{ width: `${isMobile ? MOBILE_PROJECT_WIDTH : PROJECT_WIDTH}px` }}>
                        {!isMobile ? (
                            <>
                                <div
                                    className="text-[28px] font-semibold crayon-highlight mr-8 crayon-highlight-forest font-cafe24-gowoonbam inline-block"
                                    style={{ width: `${PROJECT_WIDTH / 2}px` }}
                                >
                                    WORK PROJECTS
                                </div>
                                <div
                                    className="text-[28px] font-semibold crayon-highlight crayon-highlight-orange font-cafe24-gowoonbam inline-block"
                                    style={{ width: `${PROJECT_WIDTH / 2}px` }}
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
                        <div className={`flex ${isMobile ? "gap-1" : "gap-8"} relative`}>
                            {!isMobile && (
                                <YearDivider
                                    totalHeight={isMobile ? MOBILE_TOTAL_HEIGHT : TOTAL_HEIGHT}
                                    monthHeight={isMobile ? MOBILE_MONTH_HEIGHT : MONTH_HEIGHT}
                                    yearsArray={yearsArray}
                                />
                            )}
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

            {/* Project Summary 사이드바 */}
            <ProjectSummarySidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                projectSummaryData={selectedProjectSummary}
            />

            {/* 모바일: 플로팅 네비게이션 */}
            {isMobile && (
                <div className="fixed bottom-6 right-4 z-50">
                    {/* 네비게이션 메뉴 */}
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

                    {/* 토글 버튼 */}
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
        </section>
    );
}
