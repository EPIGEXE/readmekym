import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { developerData } from "../data/devloperData";
import { detailedDeveloperData } from "../data/detailedDeveloperData";
import { YearDivider } from "../components/ui/YearDivider";
import { SkillBadge } from "../components/ui/SkillBadge";
import { Signpost, X } from "lucide-react";
import { ProjectSummarySidebar } from "../components/common/ProjectSummarySidebar";
import type { SidebarData, SkillTag } from "../types/common";
import {
    EXPERIENCE_WIDTH,
    MOBILE_EXPERIENCE_WIDTH,
    MOBILE_MONTH_HEIGHT,
    MOBILE_PROJECT_WIDTH,
    MONTH_HEIGHT,
    PROJECT_WIDTH,
    SKILLS_WIDTH,
    TOTAL_HEIGHT,
    MOBILE_TOTAL_HEIGHT,
    YEARS_ARRAY,
    TIMELINE_BASE_WIDTH,
} from "../feature/Timeline/const";
import {
    ExperienceColumn,
    MonthLabels,
    ProjectsColumn,
    SkillsColumn,
    YearLabels,
} from "../feature/Timeline/RenderUtils";

export interface StackedSkills {
    frontend: SkillTag[];
    backend: SkillTag[];
    other: SkillTag[];
}

export function TimelinePage() {
    // ============================ 상태 관리 ============================
    const [stackedSkills, setStackedSkills] = useState<StackedSkills>({
        frontend: [],
        backend: [],
        other: [],
    }); // 스크롤 시 쌓이는 스킬 스택

    const isAllSkillsStackedRef = useRef<boolean>(false); // 모든 스킬이 쌓였는지 여부 (ref로 관리하여 불필요한 리렌더링 방지)

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

    const [viewportWidth, setViewportWidth] = useState(() => {
        if (typeof window !== "undefined") {
            return window.innerWidth;
        }
        return 1400;
    }); // 뷰포트 너비 추적

    // ============================ useRef ============================
    const yearPositionsRef = useRef<{ [key: number]: number }>({}); // 연도별 위치 저장용 ref

    // ============================ 반응형 스케일링 계산 ============================
    // 화면 너비에 맞게 스케일 계산 (최소 0.6, 최대 1)
    const timelineScale = Math.min(1, Math.max(0.6, (viewportWidth - 150) / TIMELINE_BASE_WIDTH));
    // 스킬 컬럼 표시 여부 (너비 1200px 이상에서만 표시)
    const showSkills = !isMobile && viewportWidth > 1200;

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

    // 화면 크기 감지 (모바일 여부 + 뷰포트 너비)
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setViewportWidth(width);
            setIsMobile(width <= 767);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Intersection Observer로 프로젝트 스킬 감지
    useEffect(() => {
        // 스킬 데이터 캐시 (JSON.parse 반복 방지)
        const skillsCache = new Map<string, SkillTag[]>();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const projectId = entry.target.getAttribute("data-project-id");
                    if (!projectId) return;

                    // 캐시에서 스킬 데이터 가져오기 또는 파싱
                    let skills = skillsCache.get(projectId);
                    if (!skills) {
                        const skillsData = entry.target.getAttribute("data-skills");
                        if (skillsData) {
                            skills = JSON.parse(skillsData);
                            skillsCache.set(projectId, skills!);
                        }
                    }
                    if (!skills) return;

                    // 요소가 상단 100px 라인을 지나갔는지 확인
                    const hasPassedSticky = entry.boundingClientRect.top <= 100;

                    if (hasPassedSticky) {
                        // sticky 위치를 지나감 - 스킬 추가
                        setStackedSkills((prev) => {
                            const newStacked = { ...prev };
                            let hasChange = false;
                            skills!.forEach((skill) => {
                                const categorySkills = newStacked[skill.category];
                                if (!categorySkills.some((s) => s.id === skill.id)) {
                                    categorySkills.push(skill);
                                    hasChange = true;
                                }
                            });
                            return hasChange ? newStacked : prev;
                        });
                    } else {
                        // sticky 위치 위로 올라감 - 스킬 제거
                        setStackedSkills((prev) => {
                            const newStacked = { ...prev };
                            let hasChange = false;
                            skills!.forEach((skill) => {
                                const categorySkills = newStacked[skill.category];
                                const skillIndex = categorySkills.findIndex((s) => s.id === skill.id);
                                if (skillIndex > -1) {
                                    categorySkills.splice(skillIndex, 1);
                                    hasChange = true;
                                }
                            });
                            return hasChange ? newStacked : prev;
                        });
                    }
                });
            },
            {
                // sticky 위치(100px)를 기준으로 감지
                rootMargin: "-100px 0px 0px 0px",
                threshold: [0, 1], // 요소가 경계를 넘을 때 트리거
            }
        );

        // 바닥 감지용 sentinel 요소 Observer
        const bottomObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // 바닥에 도달 - 모든 스킬 추가
                        if (!isAllSkillsStackedRef.current) {
                            const allSkills: SkillTag[] = [];
                            developerData.projects.forEach((project) => {
                                project.skills.forEach((skill) => {
                                    allSkills.push(skill);
                                });
                            });

                            setStackedSkills({
                                frontend: allSkills.filter((skill) => skill.category === "frontend"),
                                backend: allSkills.filter((skill) => skill.category === "backend"),
                                other: allSkills.filter((skill) => skill.category === "other"),
                            });
                            isAllSkillsStackedRef.current = true;
                        }
                    } else {
                        // 바닥에서 벗어남
                        if (isAllSkillsStackedRef.current) {
                            setStackedSkills({ frontend: [], backend: [], other: [] });
                            isAllSkillsStackedRef.current = false;

                            // 현재 보이는 프로젝트들의 스킬 다시 계산
                            document.querySelectorAll("[data-project-id]").forEach((element) => {
                                const rect = element.getBoundingClientRect();
                                if (rect.top <= 100) {
                                    const projectId = element.getAttribute("data-project-id");
                                    const skills = projectId ? skillsCache.get(projectId) : null;
                                    if (skills) {
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
                });
            },
            { threshold: 0 }
        );

        // DOM이 렌더링된 후 요소 관찰 시작
        const timer = setTimeout(() => {
            document.querySelectorAll("[data-project-id]").forEach((el) => {
                observer.observe(el);
            });

            // 바닥 sentinel 요소 관찰
            const sentinel = document.getElementById("bottom-sentinel");
            if (sentinel) {
                bottomObserver.observe(sentinel);
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
            bottomObserver.disconnect();
            skillsCache.clear();
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
                skills: developerData.projects.find((p) => p.id === projectId)?.skills,
                achievements: detailedProject.achievements.slice(0, 4),
                fullDescription: detailedProject.fullDescription,
            };
            setSelectedProjectSummary(projectSummary);
            setIsSidebarOpen(true);
        }
    };

    // ============================ 유틸 함수 ============================
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
                <div
                    className={`flex ${isMobile ? "gap-2" : "gap-8"}`}
                    style={
                        !isMobile && timelineScale < 1
                            ? {
                                  transform: `scale(${timelineScale})`,
                                  transformOrigin: "left center",
                              }
                            : {}
                    }
                >
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
                    {showSkills && (
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
                <div
                    className="flex-1"
                    style={
                        !isMobile && timelineScale < 1
                            ? {
                                  transform: `scale(${timelineScale})`,
                                  transformOrigin: "left top",
                                  height: `${TOTAL_HEIGHT * timelineScale}px`, // 스케일에 맞게 높이 조정
                              }
                            : {}
                    }
                >
                    <div className={`flex ${isMobile ? "gap-2" : "gap-4"}`}>
                        {/* 연도 및 월 라벨 */}
                        <div className="flex">
                            <YearLabels isMobile={isMobile} />
                            <MonthLabels isMobile={isMobile} />
                        </div>

                        {/* 타임라인 그리드 */}
                        <div className={`flex ${isMobile ? "gap-1" : "gap-8"} relative`}>
                            {!isMobile && (
                                <YearDivider
                                    totalHeight={isMobile ? MOBILE_TOTAL_HEIGHT : TOTAL_HEIGHT}
                                    monthHeight={isMobile ? MOBILE_MONTH_HEIGHT : MONTH_HEIGHT}
                                    yearsArray={YEARS_ARRAY}
                                />
                            )}
                            <ExperienceColumn isMobile={isMobile} />
                            <ProjectsColumn isMobile={isMobile} handleProjectClick={handleProjectClick} />
                            {showSkills && <SkillsColumn isMobile={isMobile} stackedSkills={stackedSkills} />}
                        </div>
                    </div>
                </div>

                {/* 수집된 스킬들을 우측에 별도로 표시 (데스크톱만) */}
                {showSkills && stackedSkills.frontend.concat(stackedSkills.backend, stackedSkills.other).length > 0 && (
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

            {/* 바닥 감지용 sentinel 요소 (Intersection Observer용) */}
            <div id="bottom-sentinel" className="h-1" aria-hidden="true" />

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
