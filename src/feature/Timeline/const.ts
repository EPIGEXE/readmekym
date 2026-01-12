import { developerData } from "../../data/devloperData";

// 타임라인 바 길이 정의
// 데스크톱 기준
export const MONTH_HEIGHT = 80;
export const EXPERIENCE_WIDTH = 280;
export const PROJECT_WIDTH = 560; // 2줄 고정 (280px × 2)
export const SKILLS_WIDTH = 200;

// 모바일 기준
export const MOBILE_MONTH_HEIGHT = 60;
export const MOBILE_EXPERIENCE_WIDTH = 140;
export const MOBILE_PROJECT_WIDTH = 140; // 1레인
export const MOBILE_SKILLS_WIDTH = 100;

// 현재 날짜 (앱 로드 시 한 번만 계산)
const now = new Date();
export const CURRENT_YEAR = now.getFullYear();
export const CURRENT_MONTH = now.getMonth() + 1; // 0-indexed이므로 +1

// 연도 범위
export const YEAR_RANGE_START = developerData.yearRange.start;
export const DYNAMIC_YEAR_RANGE = {
    start: YEAR_RANGE_START,
    end: Math.max(developerData.yearRange.end, CURRENT_YEAR),
};

// 높이 계산
const totalYears = DYNAMIC_YEAR_RANGE.end - DYNAMIC_YEAR_RANGE.start + 1;
const fullYearMonths = (totalYears - 1) * 12; // 마지막 해 제외한 월 수
const lastYearMonths = CURRENT_MONTH; // 현재 연도의 현재 월까지
const totalMonths = fullYearMonths + lastYearMonths - 8; // 첫해 1-8월 제외

export const TOTAL_HEIGHT = totalMonths * MONTH_HEIGHT;
export const MOBILE_TOTAL_HEIGHT = totalMonths * MOBILE_MONTH_HEIGHT;

// 연도 배열
export const YEARS_ARRAY: number[] = []; // [2021, 2022, 2023, 2024, 2025, 2026]
for (let year = DYNAMIC_YEAR_RANGE.start; year <= DYNAMIC_YEAR_RANGE.end; year++) {
    YEARS_ARRAY.push(year);
}

// 반응형 너비 기준
export const TIMELINE_BASE_WIDTH = EXPERIENCE_WIDTH + PROJECT_WIDTH + SKILLS_WIDTH + 250;

