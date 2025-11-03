import { LazyLoadImage } from "react-lazy-load-image-component";

// 정리하는 개발자 - 노션 학습 기록
export function Philosophy03Content({ onImageClick }: { onImageClick?: (images: string[], index: number) => void }) {
    const noteCategories = [
        {
            title: "기술 스택별 체계화",
            description: "프론트엔드, 백엔드, 데이터베이스로 대분류",
            items: ["각 기술의 핵심 개념 정리", "실습 코드와 예제", "트러블슈팅 경험", "베스트 프랙티스"],
        },
        {
            title: "프로젝트 회고록",
            description: "10개 프로젝트의 상세 기록과 회고",
            items: ["구현 과정 단계별 기록", "기술적 도전과 해결", "배운 점과 아쉬운 점", "다음 프로젝트 개선 방향"],
        },
        {
            title: "도구 및 환경 설정",
            description: "개발 생산성을 위한 도구와 환경",
            items: ["Git 워크플로우", "CI/CD 파이프라인", "개발 환경 자동화", "Electron 앱 배포"],
        },
    ];

    return (
        <div className="space-y-8 md:space-y-12">
            {/* 인트로 */}
            <div className="border-l-4 border-purple-500 pl-4 md:pl-6 py-2 md:py-3">
                <p className="text-base md:text-xl text-gray-800 leading-relaxed mb-2">
                    기록하지 않으면 기억되지 않습니다
                </p>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    솔루션 엔지니어 시절부터 현재까지 배운 모든 것을 체계적으로 정리하고 있습니다.
                </p>
            </div>

            {/* 노션 워크스페이스 */}
            <div className="space-y-3 md:space-y-4">
                <div className="flex items-baseline justify-between border-b border-gray-200 pb-2 md:pb-3">
                    <h4
                        className="text-xs text-gray-500 uppercase tracking-widest"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                        Notion Workspace
                    </h4>
                    <a
                        href="https://befitting-silica-24b.notion.site/ALL-in-One-97eb5e1df97b4782bd93725af829e629?pvs=74"
                        className="text-xs text-purple-600 hover:text-purple-700 uppercase tracking-wider font-medium transition-colors"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Open Workspace →
                    </a>
                </div>
                {/* 노션 스크린샷 */}
                <div className="w-full cursor-pointer" onClick={() => onImageClick?.(["/notion.png"], 0)}>
                    <LazyLoadImage
                        src="/notion.png"
                        alt="노션 워크스페이스"
                        effect="blur"
                        className="w-full h-auto border-2 border-gray-200 rounded hover:border-purple-200 transition-colors"
                    />
                </div>
            </div>

            {/* 정리 방식 및 구조 */}
            <div className="space-y-6 md:space-y-8">
                {noteCategories.map((category, idx) => (
                    <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 pb-6 md:pb-8 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                        {/* 왼쪽: 넘버 */}
                        <div className="space-y-2 md:space-y-3">
                            <div className="text-3xl md:text-5xl font-light text-gray-200">
                                {String(idx + 1).padStart(2, "0")}
                            </div>
                        </div>

                        {/* 오른쪽: 내용 */}
                        <div className="md:col-span-4 space-y-2 md:space-y-3">
                            <div className="space-y-2">
                                <h5 className="text-lg md:text-xl font-semibold text-gray-900 font-cafe24-gowoonbam">
                                    {category.title}
                                </h5>
                                <p className="text-xs md:text-sm text-gray-600">{category.description}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                                {category.items.map((item, itemIdx) => (
                                    <div
                                        key={itemIdx}
                                        className="flex items-start gap-2 text-xs md:text-sm text-gray-600"
                                    >
                                        <span className="text-purple-400 mt-0.5">•</span>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 하단 통계 */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-gray-200">
                <div className="text-center space-y-1 md:space-y-2">
                    <div className="text-2xl md:text-3xl font-light text-purple-500">6</div>
                    <div
                        className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                        Main Categories
                    </div>
                </div>
                <div className="text-center space-y-1 md:space-y-2">
                    <div className="text-2xl md:text-3xl font-light text-purple-500">25+</div>
                    <div
                        className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                        Topics
                    </div>
                </div>
                <div className="text-center space-y-1 md:space-y-2">
                    <div className="text-2xl md:text-3xl font-light text-purple-500">4Y+</div>
                    <div
                        className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                        Since 2021
                    </div>
                </div>
            </div>
        </div>
    );
}