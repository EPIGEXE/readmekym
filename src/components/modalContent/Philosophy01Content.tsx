import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { LazyLoadImage } from "react-lazy-load-image-component";

// 만드는 개발자 - 사이드 프로젝트 소개
export function Philosophy01Content({ onImageClick }: { onImageClick?: (images: string[], index: number) => void }) {
    const projects = [
        {
            title: "온실가스 차트 웹페이지",
            tech: "React · Chart.js · shadcn/ui",
            year: "2024.11",
            description: "한국 온실가스 배출량 데이터 시각화 웹페이지",
            images: [
                "/gallery/proj-7/greenGas1.png",
                "/gallery/proj-7/greenGas2.png",
                "/gallery/proj-7/greenGas3.png",
                "/gallery/proj-7/greenGas1.gif",
                "/gallery/proj-7/greenGas2.gif",
            ],
        },
        {
            title: "가계부 프로그램",
            tech: "Electron · React · SQLite",
            year: "2024.12-2025.01",
            description: "데스크탑 가계부 애플리케이션",
            images: [
                "/gallery/proj-8/saveWise1.png",
                "/gallery/proj-8/saveWise2.png",
                "/gallery/proj-8/saveWise3.png",
                "/gallery/proj-8/saveWise4.png",
                "/gallery/proj-8/saveWise5.png",
                "/gallery/proj-8/saveWise6.png",
                "/gallery/proj-8/saveWise1.gif",
                "/gallery/proj-8/saveWise2.gif",
                "/gallery/proj-8/saveWise3.gif",
            ],
        },
        {
            title: "시맨틱 검색 기반 마인드맵 서비스",
            tech: "React · React Flow · Dagre · AI Embedding API · Tailwind CSS",
            year: "2025.01-02",
            description: "AI 임베딩을 활용한 의미적 검색 마인드맵",
            images: ["/gallery/proj-12/MindMap1.png", "/gallery/proj-12/MindMap1.gif", "/gallery/proj-12/MindMap2.gif"],
        },
        {
            title: "WELKIT - 신입사원 온보딩 플랫폼",
            tech: "React · TypeScript · Next.js · Tanstack Query · Tailwind CSS",
            year: "2025.01-03",
            description: "신입사원을 위한 용어 사전 및 커뮤니티 서비스",
            images: [
                "/gallery/proj-11/welkit1.png",
                "/gallery/proj-11/welkit2.png",
                "/gallery/proj-11/welkit3.png",
                "/gallery/proj-11/welkit4.png",
            ],
        },
        {
            title: "온라인 스캠 방지 사이트",
            tech: "Next.js · TypeScript · Tailwind CSS",
            year: "2025.07",
            description: "증가하는 온라인 스캠 피해 예방을 위한 교육용 웹사이트",
            images: [
                "/gallery/proj-9/fonzi1.png",
                "/gallery/proj-9/fonzi2.png",
                "/gallery/proj-9/fonzi3.png",
                "/gallery/proj-9/fonzi4.png",
                "/gallery/proj-9/fonzi5.png",
                "/gallery/proj-9/fonzi6.png",
                "/gallery/proj-9/fonzi7.png",
                "/gallery/proj-9/fonzi8.png",
            ],
        },
        {
            title: "다국어 멀티 블로그 포스팅 프로그램",
            tech: "Electron · React · TypeScript · TypeORM · SQLite",
            year: "2025.08-09",
            description: "LLM API 자동 번역과 dev.to, Google Blogger, Qiita 3개 플랫폼 동시 포스팅 도구",
            images: [
                "/gallery/proj-10/loudSelf1.png",
                "/gallery/proj-10/loudSelf2.png",
                "/gallery/proj-10/loudSelf3.png",
                "/gallery/proj-10/loudSelf4.png",
                "/gallery/proj-10/loudSelf5.png",
                "/gallery/proj-10/loudSelf6.png",
                "/gallery/proj-10/loudSelf7.png",
                "/gallery/proj-10/loudSelf1.gif",
                "/gallery/proj-10/loudSelf2.gif",
            ],
        },
    ];

    return (
        <div className="space-y-8 md:space-y-12">
            {/* 인트로 */}
            <div className="border-l-4 border-blue-500 pl-4 md:pl-6 py-2 md:py-3">
                <p className="text-base md:text-xl text-gray-800 leading-relaxed mb-2">
                    아이디어가 떠오르면 바로 구현합니다
                </p>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    실무에서 배운 기술과 새롭게 익힌 스택을 활용해 유용한 프로그램을 만들기 위해 노력합니다.
                </p>
            </div>

            {/* 프로젝트 목록 */}
            <div className="space-y-6 md:space-y-8">
                {projects.map((project, idx) => (
                    <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 pb-6 md:pb-8 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                        {/* 왼쪽: 넘버링 + 연도 */}
                        <div className="space-y-2 md:space-y-3">
                            <div className="text-3xl md:text-5xl font-light text-gray-200">
                                {String(idx + 1).padStart(2, "0")}
                            </div>
                            <div className="border-t border-gray-200 pt-2">
                                <div
                                    className="text-xs text-gray-500 uppercase tracking-widest mb-1"
                                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                                >
                                    Year
                                </div>
                                <div className="text-xs md:text-sm text-gray-900 font-medium">{project.year}</div>
                            </div>
                        </div>

                        {/* 오른쪽: 내용 */}
                        <div className="md:col-span-4 space-y-2 md:space-y-3">
                            <div className="space-y-2">
                                <h4 className="text-lg md:text-xl font-semibold text-gray-900 font-cafe24-gowoonbam">
                                    {project.title}
                                </h4>
                                <p
                                    className="text-xs text-gray-500 uppercase tracking-wider"
                                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                                >
                                    {project.tech}
                                </p>
                                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                                    {project.description}
                                </p>
                            </div>
                            {/* 프로젝트 이미지 캐러셀 */}
                            <div className="w-full">
                                <Swiper
                                    modules={[Navigation, Pagination]}
                                    spaceBetween={0}
                                    slidesPerView={1}
                                    navigation
                                    pagination={{
                                        clickable: true,
                                    }}
                                    loop={project.images.length > 1}
                                    className="editorial-swiper"
                                    style={
                                        {
                                            "--swiper-navigation-color": "#374151",
                                            "--swiper-navigation-size": "16px",
                                        } as React.CSSProperties
                                    }
                                >
                                    {project.images.map((image, imageIdx) => (
                                        <SwiperSlide key={imageIdx}>
                                            <div
                                                className="w-full aspect-video cursor-pointer bg-white flex items-center justify-center"
                                                onClick={() => {
                                                    const allImages = projects.flatMap((p) => p.images);
                                                    const globalIndex =
                                                        projects
                                                            .slice(0, idx)
                                                            .reduce((acc, p) => acc + p.images.length, 0) + imageIdx;
                                                    onImageClick?.(allImages, globalIndex);
                                                }}
                                            >
                                                <LazyLoadImage
                                                    src={image}
                                                    alt={`${project.title} - ${imageIdx + 1}`}
                                                    effect="blur"
                                                    className="max-w-full max-h-full object-contain border border-gray-200 rounded hover:opacity-90 transition-opacity"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 하단 통계 */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-gray-200">
                <div className="text-center space-y-1 md:space-y-2">
                    <div className="text-2xl md:text-3xl font-light text-blue-500">{projects.length}</div>
                    <div
                        className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                        Personal Projects
                    </div>
                </div>
                <div className="text-center space-y-1 md:space-y-2">
                    <div className="text-2xl md:text-3xl font-light text-blue-500">8+</div>
                    <div
                        className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                        Tech Stack
                    </div>
                </div>
                <div className="text-center space-y-1 md:space-y-2">
                    <div className="text-2xl md:text-3xl font-light text-blue-500">1Y+</div>
                    <div
                        className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                        Development
                    </div>
                </div>
            </div>
        </div>
    );
}