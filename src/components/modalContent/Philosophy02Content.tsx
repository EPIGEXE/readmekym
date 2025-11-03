import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 성장하는 개발자 - 빠른 학습과 실전 적용
export function Philosophy02Content() {
    // 기술 성장 타임라인 차트 데이터
    const growthChartData = [
        { date: "2021.09", frontend: 0, backend: 0, others: 10 },
        { date: "2022.06", frontend: 0, backend: 0, others: 25 },
        { date: "2023.12", frontend: 0, backend: 0, others: 35 },
        { date: "2024.01", frontend: 8, backend: 20, others: 38 },
        { date: "2024.04", frontend: 15, backend: 40, others: 42 },
        { date: "2024.07", frontend: 28, backend: 50, others: 46 },
        { date: "2024.11", frontend: 48, backend: 53, others: 48 },
        { date: "2024.12", frontend: 58, backend: 55, others: 50 },
        { date: "2025.01", frontend: 70, backend: 57, others: 52 },
        { date: "2025.02", frontend: 75, backend: 58, others: 53 },
        { date: "2025.07", frontend: 80, backend: 60, others: 54 },
        { date: "2025.08", frontend: 83, backend: 62, others: 55 },
        { date: "2025.10", frontend: 85, backend: 63, others: 55 },
    ];

    // 성장 근거 (프로젝트 기반)
    const growthEvidence = [
        { period: "2021.09", event: "PLM 엔지니어 시작", tech: "Teamcenter BOM 설계", category: "others" },
        { period: "2022.06", event: "PLM 전문화", tech: "A사/B사 프로젝트 완수", category: "others" },
        { period: "2024.01", event: "C# .NET 레거시 개선", tech: "Windows Forms 개선", category: "backend" },
        { period: "2024.04", event: "Spring Boot 첫 프로젝트", tech: "Thymeleaf UI 재구축", category: "backend" },
        { period: "2024.07", event: "SNMP 마이크로서비스", tech: "Spring Cloud 구축", category: "backend" },
        { period: "2024.07", event: "React 전환 시작", tech: "SNMP 인터페이스 서버", category: "frontend" },
        { period: "2024.11", event: "차트 시각화 프로젝트", tech: "Chart.js + shadcn/ui", category: "frontend" },
        { period: "2024.12", event: "Electron 데스크탑 앱", tech: "React + SQLite 가계부", category: "frontend" },
        { period: "2025.01", event: "WebSocket 실시간 통신", tech: "Konva 도면 기반 UI", category: "frontend" },
        { period: "2025.01", event: "팀 협업 프로젝트", tech: "Next.js + Tanstack Query", category: "frontend" },
        { period: "2025.02", event: "AI 그래프 시각화", tech: "React Flow + Dagre", category: "frontend" },
        { period: "2025.07", event: "Next.js SSG 마스터", tech: "SEO 최적화 스캠 방지", category: "frontend" },
        { period: "2025.08", event: "LLM API 통합", tech: "TypeORM + 다국어 자동번역", category: "backend" },
        { period: "2025.10", event: "Framer Motion 애니메이션", tech: "인터랙티브 포트폴리오", category: "frontend" },
    ];

    return (
        <div className="space-y-8 md:space-y-12">
            {/* 인트로 */}
            <div className="border-l-4 border-green-500 pl-4 md:pl-6 py-2 md:py-3">
                <p className="text-base md:text-xl text-gray-800 leading-relaxed mb-2">빠르게 배우고 바로 적용합니다</p>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    새로운 기술을 학습하고 실전 프로젝트로 검증하는 사이클을 반복합니다.
                </p>
            </div>

            {/* 기술 성장 차트 */}
            <div className="space-y-4 md:space-y-6">
                <div className="border-b border-gray-200 pb-2 md:pb-3">
                    <h4
                        className="text-xs text-gray-500 uppercase tracking-widest"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                        Skill Growth Timeline
                    </h4>
                </div>
                <div className="w-full h-64 md:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={growthChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} stroke="#e5e7eb" />
                            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} stroke="#e5e7eb" domain={[0, 100]} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                }}
                            />
                            <Legend wrapperStyle={{ fontSize: "12px" }} iconType="line" />
                            <Line
                                type="monotone"
                                dataKey="frontend"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                name="Frontend"
                                dot={{ fill: "#3b82f6", r: 3 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="backend"
                                stroke="#10b981"
                                strokeWidth={2}
                                name="Backend"
                                dot={{ fill: "#10b981", r: 3 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="others"
                                stroke="#6b7280"
                                strokeWidth={2}
                                name="Tools & Others"
                                dot={{ fill: "#6b7280", r: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 성장 근거 타임라인 */}
            <div className="space-y-4 md:space-y-6">
                <div className="border-b border-gray-200 pb-2 md:pb-3">
                    <h4
                        className="text-xs text-gray-500 uppercase tracking-widest"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                        Growth Evidence
                    </h4>
                </div>
                <div className="space-y-3 md:space-y-4">
                    {growthEvidence.map((item, idx) => (
                        <div key={idx} className="flex gap-3 md:gap-4 items-start">
                            <div
                                className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                                    item.category === "frontend"
                                        ? "bg-blue-500"
                                        : item.category === "backend"
                                        ? "bg-green-600"
                                        : "bg-gray-500"
                                }`}
                            />
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4">
                                <div className="text-xs text-gray-500 font-medium">{item.period}</div>
                                <div className="md:col-span-4">
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                                        <h5 className="text-sm font-semibold text-gray-900">{item.event}</h5>
                                        <span className="text-xs text-gray-500">{item.tech}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 하단 통계 */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-gray-200">
                <div className="text-center space-y-1 md:space-y-2">
                    <div className="text-2xl md:text-3xl font-light text-green-500">85%</div>
                    <div
                        className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                        Frontend Skill
                    </div>
                </div>
                <div className="text-center space-y-1 md:space-y-2">
                    <div className="text-2xl md:text-3xl font-light text-green-500">14</div>
                    <div
                        className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                        Projects
                    </div>
                </div>
                <div className="text-center space-y-1 md:space-y-2">
                    <div className="text-2xl md:text-3xl font-light text-green-500">1Y</div>
                    <div
                        className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                        React Journey
                    </div>
                </div>
            </div>
        </div>
    );
}