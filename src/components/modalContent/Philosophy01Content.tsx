import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { projects } from "./philosophyData";

interface Philosophy01ContentProps {
    onImageClick?: (images: string[], index: number) => void; // 이미지 클릭 함수, 전체 이미지를 전달하면 라이트박스로 전달해서 오픈
}

// 만드는 개발자 - 사이드 프로젝트 소개
export function Philosophy01Content({ onImageClick }: Philosophy01ContentProps) {
    //=========================== 핸들러 ============================
    // 캐러셀 이미지 클릭 핸들러
    const handleCarouselClick = (idx: number, imageIdx: number) => {
        const allImages = projects.flatMap((p) => p.images); // 모든 이미지 배열열
        const globalIndex = projects.slice(0, idx).reduce((acc, p) => acc + p.images.length, 0) + imageIdx; // 모든 이미지 중 현재 이미지 인덱스
        onImageClick?.(allImages, globalIndex); // 모든 이미지 배열과 전체 이미지 인덱스를 라이트박스로 전달해서 오픈
    };

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
                                    spaceBetween={0} // 슬라이드 간격 0
                                    slidesPerView={1} // 슬라이드 1개씩 보여줌
                                    navigation // 네비게이션 버튼 표시
                                    pagination={{
                                        clickable: true, // 페이지네이션 버튼 클릭 가능
                                    }}
                                    loop={project.images.length > 1} // 이미지 개수가 1개 이상이면 루프 설정
                                    watchSlidesProgress // 슬라이드 진행상황 감시 (인접 슬라이드 미리 로드용)
                                    className="editorial-swiper" // 커스텀 스타일 적용
                                    style={
                                        {
                                            "--swiper-navigation-color": "#374151", // 네비게이션 버튼 색상
                                            "--swiper-navigation-size": "16px", // 네비게이션 버튼 크기
                                        } as React.CSSProperties
                                    }
                                >
                                    {project.images.map((image, imageIdx) => (
                                        <SwiperSlide key={imageIdx}>
                                            <div
                                                className="w-full aspect-video cursor-pointer bg-white flex items-center justify-center"
                                                onClick={() => {
                                                    handleCarouselClick(idx, imageIdx);
                                                }}
                                            >
                                                <LazyLoadImage
                                                    src={image}
                                                    alt={`${project.title} - ${imageIdx + 1}`}
                                                    effect="blur"
                                                    threshold={300} // 뷰포트 500px 전에 미리 로드 시작
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
