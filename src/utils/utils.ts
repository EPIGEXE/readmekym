// 기간 포맷팅 함수

import type { DeveloperData } from "../data/developDataType";


// 2025.01 - 2025.03 형식으로 반환
export const formatPeriod = (startYear: number, startMonth: number, endYear: number, endMonth: number) => {
    return `${startYear}.${String(startMonth).padStart(2, "0")} - ${endYear}.${String(endMonth).padStart(2, "0")}`;
};

// developerData에서 연도 배열 생성
export const getYearsArray = (developerData: DeveloperData) => {
    const years = [];
    for (let year = developerData.yearRange.start; year <= developerData.yearRange.end; year++) {
        years.push(year);
    }
    return years;
};