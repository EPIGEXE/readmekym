// 연도 라벨 렌더링

import { memo } from "react";
import { motion } from "framer-motion";
import {
    CURRENT_MONTH,
    EXPERIENCE_WIDTH,
    MOBILE_EXPERIENCE_WIDTH,
    MOBILE_MONTH_HEIGHT,
    MOBILE_PROJECT_WIDTH,
    MOBILE_SKILLS_WIDTH,
    MOBILE_TOTAL_HEIGHT,
    MONTH_HEIGHT,
    PROJECT_WIDTH,
    SKILLS_WIDTH,
    TOTAL_HEIGHT,
    YEARS_ARRAY,
} from "./const";
import { developerData } from "../../data/devloperData";
import { calculateProjectLayout, getBarHeight } from "./utils";
import type { StackedSkills } from "../../pages/TimelinePage";
import { SkillBadge } from "../../components/ui/SkillBadge";

// 이전 연도 라벨과의 간격을 계산해서 marginBottom으로 위치
export const YearLabels = memo(({ isMobile }: { isMobile: boolean }) => {
    const monthHeight = isMobile ? MOBILE_MONTH_HEIGHT : MONTH_HEIGHT;
    const yearHeight = isMobile ? 60 : 40;
    const height = isMobile ? MOBILE_TOTAL_HEIGHT : TOTAL_HEIGHT;

    // 연도별 마진 계산 함수
    const getYearMargin = (yearIndex: number) => {
        const isLastYear = yearIndex === YEARS_ARRAY.length - 1;
        const isSecondToLastYear = yearIndex === YEARS_ARRAY.length - 2;

        if (isLastYear) {
            // 마지막 해: 현재 월까지만 마진 (하지만 이미 컨테이너 높이로 제한됨)
            return CURRENT_MONTH * monthHeight - yearHeight;
        } else if (isSecondToLastYear) {
            // 마지막 해 바로 전: 12개월 전체 마진 (마지막 해로 이어지므로)
            return monthHeight * 12 - yearHeight;
        } else if (yearIndex === 0) {
            // 첫 해: 9-12월만 (4개월)
            return monthHeight * 4 - yearHeight;
        } else {
            // 중간 해들: 12개월 전체
            return monthHeight * 12 - yearHeight;
        }
    };

    return (
        <div className={isMobile ? "w-6" : "w-20"} style={{ height: `${height}px` }}>
            {YEARS_ARRAY.map((year, yearIndex) => {
                const isLastYear = yearIndex === YEARS_ARRAY.length - 1;

                return (
                    <div
                        key={year}
                        data-year={year}
                        className="sticky bg-[#F8F8F8] border border-gray-200 rounded shadow-sm flex items-center justify-center"
                        style={{
                            top: isMobile ? "80px" : "100px",
                            height: `${yearHeight}px`,
                            marginBottom: isLastYear ? "0px" : `${getYearMargin(yearIndex)}px`,
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
});

// 월 라벨 렌더링
// 렌더링 해야하는 월의 개수를 계산해서 렌더링
export const MonthLabels = memo(({ isMobile }: { isMobile: boolean }) => {
    const monthHeight = isMobile ? MOBILE_MONTH_HEIGHT : MONTH_HEIGHT;
    const isLastYear = (yearIndex: number) => yearIndex === YEARS_ARRAY.length - 1;

    return (
        <div className={isMobile ? "w-5" : "w-12"}>
            {YEARS_ARRAY.map((_, yearIndex) => (
                <div key={yearIndex}>
                    {[...Array(12)].map((_, month) => {
                        // 2021년(첫 해) 1-8월은 렌더링하지 않음
                        if (yearIndex === 0 && month < 8) return null;

                        // 현재 연도(마지막 해)는 현재 월까지만 렌더링
                        if (isLastYear(yearIndex) && month >= CURRENT_MONTH) return null;

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
});

 /**
     * 경력 컬럼을 렌더링
     */
export const ExperienceColumn = memo(({ isMobile }: { isMobile: boolean }) => {
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
                            isMobile,
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
});

/**
     * 프로젝트 컬럼을 렌더링 (데스크톱: 2레인, 모바일: 1레인)
     */
export const ProjectsColumn = memo(({ isMobile, handleProjectClick }: { isMobile: boolean, handleProjectClick: (projectId: string) => void }) => {
    const projectsWithLayout = calculateProjectLayout(isMobile);
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
                        ...getBarHeight(isMobile, project.startYear, project.endYear, project.startMonth, project.endMonth),
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
});

/**
     * 스킬 컬럼을 렌더링
     */
export const SkillsColumn = memo(({ isMobile, stackedSkills }: { isMobile: boolean, stackedSkills: StackedSkills }) => {
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
});