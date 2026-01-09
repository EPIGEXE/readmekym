import type { DeveloperData } from "../data/developDataType";


// 2025.01 - 2025.03 또는 2024.01 - 현재 형식으로 반환
export const formatPeriod = (startYear: number, startMonth: number, endYear: number | null, endMonth: number | null) => {
    const start = `${startYear}.${String(startMonth).padStart(2, "0")}`;
    const end = endYear === null || endMonth === null ? "현재" : `${endYear}.${String(endMonth).padStart(2, "0")}`;
    return `${start} - ${end}`;
};

// developerData에서 연도 배열 생성
export const getYearsArray = (developerData: DeveloperData) => {
    const years = [];
    for (let year = developerData.yearRange.start; year <= developerData.yearRange.end; year++) {
        years.push(year);
    }
    return years;
};