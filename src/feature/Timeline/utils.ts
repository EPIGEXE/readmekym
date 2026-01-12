import type { Project } from "../../data/developDataType";
import { developerData } from "../../data/devloperData";
import { MOBILE_MONTH_HEIGHT, MONTH_HEIGHT } from "./const";

// 경력, 프로젝트 바의 높이 계산
export const getBarHeight = (isMobile: boolean, startYear: number, endYear: number | null, startMonth: number, endMonth: number | null) => {
    const monthHeight = isMobile ? MOBILE_MONTH_HEIGHT : MONTH_HEIGHT;

    // null인 경우 현재 날짜 사용
    const now = new Date();
    const actualEndYear = endYear ?? now.getFullYear();
    const actualEndMonth = endMonth ?? (now.getMonth() + 1);

    // 시작 연도에서의 오프셋 계산 (2021년 8월부터 시작)
    const startYearOffset = (startYear - developerData.yearRange.start) * monthHeight * 12;
    const absoluteTop = startYearOffset + (startMonth - 9) * monthHeight;

    // 전체 높이 계산
    let totalHeight = 0;

    if (startYear === actualEndYear) {
        // 같은 연도 내 프로젝트
        totalHeight = (actualEndMonth - startMonth + 1) * monthHeight;
    } else {
        // 시작 연도 높이
        totalHeight += (12 - startMonth + 1) * monthHeight;

        // 중간 연도들 높이
        for (let year = startYear + 1; year < actualEndYear; year++) {
            totalHeight += 12 * monthHeight;
        }

        // 종료 연도 높이
        totalHeight += actualEndMonth * monthHeight;
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
export const calculateProjectLayout = (isMobile: boolean): Array<Project & { laneIndex: number; offset: number; zIndex: number }> => {
    const allProjects: Array<Project & { laneIndex: number; offset: number; zIndex: number }> = [];

    // null인 경우 현재 날짜 사용하는 헬퍼 함수
    const now = new Date();
    const getEndTime = (endYear: number | null, endMonth: number | null) => {
        const actualEndYear = endYear ?? now.getFullYear();
        const actualEndMonth = endMonth ?? (now.getMonth() + 1);
        return actualEndYear * 12 + actualEndMonth;
    };

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

                const prevEndTime = getEndTime(prevProject.endYear, prevProject.endMonth);
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