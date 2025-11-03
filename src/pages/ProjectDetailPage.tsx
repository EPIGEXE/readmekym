import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { detailedDeveloperData } from "../data/detailedDeveloperData";
import { SkillBadge } from "../components/ui/SkillBadge";
import { fadeInUpEaseOut, staggerContainer } from "../styles/framerMotion";
import { formatPeriod } from "../utils/utils";
import { developerData } from "../data/devloperData";
import { formatWithEmphasis } from "../utils/textFormatter";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Lightbox from "yet-another-react-lightbox";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

export function ProjectDetailPage() {
    // ============================ Hooks ============================
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate(); // 브라우저 히스토리 기반 뒤로가기 하려고

    // ============================ 상태 관리 ============================
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [viewMode, setViewMode] = useState<"slider" | "list">("slider");
    const [currentPage, setCurrentPage] = useState(1);

    // 그리드 페이지네이션 설정
    const imagesPerPage = 6; // 2x3 그리드

    // ============================ 상수 정의 ============================
    const project = detailedDeveloperData.projects.find((p) => p.id === id);
    const skills = developerData.projects.find((p) => p.id === id)?.skills;

    const period = id?.startsWith("exp-")
        ? developerData.experiences.find((e) => e.id === id)
        : developerData.projects.find((p) => p.id === id);

    // ============================ useEffect ============================
    // 페이지 이동 시 맨 위로 스크롤
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // ============================ 핸들러 ============================
    const handleSliderModeClick = () => {
        setViewMode("slider");
        setCurrentPage(1);
    };
    
    const handleListModeClick = () => {
        setViewMode("list");
        setCurrentPage(1);
    };

    // ============================ 렌더링 ============================
    // 프로젝트가 없으면 나오는 페이지 반환
    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-xl md:text-2xl font-bold mb-4">Project not found</h2>
                    <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                        ← Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <motion.div initial="initial" animate="animate" variants={staggerContainer} className="min-h-screen">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6">
                {/* 컨텐츠 전체 테두리 */}
                <div className="border-2 md:border-4 border-gray-700 p-4 md:p-8">
                    {/* 뒤로가기 버튼 */}
                    <motion.button
                        variants={fadeInUpEaseOut}
                        onClick={() => navigate(-1)}
                        className="text-sm md:text-lg text-gray-500 tracking-widest uppercase mb-8 md:mb-12 hover:text-gray-700 transition-colors cursor-pointer"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                        ← Back
                    </motion.button>
                    {/* 히어로 섹션 */}
                    <motion.section className="mb-12 md:mb-24" variants={fadeInUpEaseOut}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16 items-start">
                            {/* 왼쪽 컨텐츠 */}
                            <div className="lg:col-span-3 space-y-4 md:space-y-8">
                                <div
                                    className="text-sm md:text-lg text-gray-500 tracking-widest uppercase"
                                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                                >
                                    {project.experienceId ? "Work Project" : "Personal Project"}
                                </div>

                                <h1 className="text-3xl md:text-5xl text-black font-black leading-tight">
                                    {project.title}
                                </h1>

                                <div className="w-16 md:w-24 h-px bg-gray-300"></div>

                                <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-500">
                                    <Calendar className="w-3 md:w-4 h-3 md:h-4" />
                                    {period && (
                                        <span>
                                            {formatPeriod(
                                                period.startYear,
                                                period.startMonth,
                                                period.endYear,
                                                period.endMonth
                                            )}
                                        </span>
                                    )}
                                </div>

                                <p className="text-base md:text-xl font-light text-gray-800 leading-relaxed">
                                    {project.shortDescription}
                                </p>

                                {/* 이미지 갤러리 */}
                                {project.images && project.images.length > 0 && (
                                    <div className="w-full mt-8 md:mt-12">
                                        {/* 구분선 */}
                                        <div className="w-16 md:w-24 h-px bg-gray-300 mb-6 md:mb-8"></div>

                                        {/* 토글 버튼 */}
                                        <div className="flex items-center gap-1 mb-6 md:mb-8">
                                            <button
                                                className={`text-[10px] md:text-xs px-4 py-2 tracking-widest uppercase transition-colors ${
                                                    viewMode === "slider"
                                                        ? "text-gray-900 border-b-2 border-gray-900"
                                                        : "text-gray-400 hover:text-gray-600"
                                                }`}
                                                onClick={handleSliderModeClick}

                                            >
                                                Slider
                                            </button>
                                            <span className="text-gray-300 mx-1">|</span>
                                            <button
                                                className={`text-[10px] md:text-xs px-4 py-2 tracking-widest uppercase transition-colors ${
                                                    viewMode === "list"
                                                        ? "text-gray-900 border-b-2 border-gray-900"
                                                        : "text-gray-400 hover:text-gray-600"
                                                }`}
                                                onClick={handleListModeClick}
                                            >
                                                Grid
                                            </button>
                                        </div>

                                        {/* 슬라이더 뷰 */}
                                        {viewMode === "slider" && (
                                            <div className="min-h-[50vh]">
                                                <Swiper
                                                    modules={[Navigation, Pagination, Autoplay]}
                                                    spaceBetween={0} // 슬라이드 간격 0
                                                    slidesPerView={1} // 슬라이드 1개씩 보여줌
                                                    navigation // 네비게이션 버튼 표시
                                                    pagination={{
                                                        clickable: true,
                                                    }} // 페이지네이션 버튼 클릭 가능
                                                    autoplay={{ delay: 5000, disableOnInteraction: false }} // 자동 재생 설정 5초마다 재생, 사용자 상호작용 시 재생 중단
                                                    loop={project.images.length > 1} // 이미지 개수가 1개 이상이면 루프 설정
                                                    className="editorial-swiper" // 커스텀 스타일 적용
                                                    style={
                                                        {
                                                            "--swiper-navigation-color": "#374151", // 네비게이션 버튼 색상
                                                            "--swiper-navigation-size": "20px", // 네비게이션 버튼 크기
                                                        } as React.CSSProperties
                                                    }
                                                >
                                                    {project.images.map((image, index) => (
                                                        <SwiperSlide key={index}>
                                                            <div
                                                                className="w-full h-[50vh] cursor-pointer bg-white flex items-center justify-center"
                                                                onClick={() => {
                                                                    setLightboxIndex(index);
                                                                    setLightboxOpen(true);
                                                                }}
                                                            >
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <LazyLoadImage
                                                                        src={image}
                                                                        alt={`${project.title} - Image ${index + 1}`}
                                                                        effect="blur"
                                                                        className="max-w-full max-h-full object-contain"
                                                                        style={{ display: "block" }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
                                            </div>
                                        )}

                                        {/* 그리드 뷰 */}
                                        {viewMode === "list" &&
                                            (() => {
                                                const totalPages = Math.ceil( // 총 페이지 수
                                                    (project.images?.length || 0) / imagesPerPage 
                                                );
                                                const startIndex = (currentPage - 1) * imagesPerPage; // 시작 인덱스
                                                const endIndex = startIndex + imagesPerPage; // 끝 인덱스
                                                const currentImages = project.images.slice(startIndex, endIndex); // 현재 페이지에 보여줄 이미지 배열

                                                return (
                                                    <div>
                                                        {/* 그리드 */}
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 min-h-[50vh]">
                                                            {currentImages.map((image, idx) => {
                                                                const actualIndex = startIndex + idx;
                                                                return (
                                                                    <div
                                                                        key={actualIndex}
                                                                        className="aspect-[4/3] cursor-pointer bg-white hover:opacity-90 transition-opacity flex items-center justify-center p-3"
                                                                        onClick={() => {
                                                                            setLightboxIndex(actualIndex);
                                                                            setLightboxOpen(true);
                                                                        }}
                                                                    >
                                                                        <LazyLoadImage
                                                                            src={image}
                                                                            alt={`${project.title} - Image ${
                                                                                actualIndex + 1
                                                                            }`}
                                                                            effect="blur"
                                                                            className="max-w-full max-h-full object-contain"
                                                                            style={{ display: "block" }}
                                                                        />
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                        {/* 페이지네이션 */}
                                                        {totalPages > 1 && (
                                                            <div className="flex items-center justify-center gap-3 mt-8">
                                                                {/* 이전 버튼 */}
                                                                <button
                                                                    onClick={() =>
                                                                        setCurrentPage((prev) => Math.max(1, prev - 1))
                                                                    }
                                                                    disabled={currentPage === 1}
                                                                    className={`text-xs tracking-widest uppercase px-3 py-2 transition-colors ${
                                                                        currentPage === 1
                                                                            ? "text-gray-300 cursor-not-allowed"
                                                                            : "text-gray-500 hover:text-gray-900"
                                                                    }`}
                                                                >
                                                                    ← Prev
                                                                </button>

                                                                {/* 페이지 번호 */}
                                                                <div className="flex items-center gap-2">
                                                                    {Array.from(
                                                                        { length: totalPages },
                                                                        (_, i) => i + 1
                                                                    ).map((page) => (
                                                                        <button
                                                                            key={page}
                                                                            onClick={() => setCurrentPage(page)}
                                                                            className={`w-8 h-8 text-xs transition-colors ${
                                                                                currentPage === page
                                                                                    ? "text-gray-900 border-b-2 border-gray-900"
                                                                                    : "text-gray-400 hover:text-gray-600"
                                                                            }`}
                                                                        >
                                                                            {String(page).padStart(2, "0")}
                                                                        </button>
                                                                    ))}
                                                                </div>

                                                                {/* 다음 버튼 */}
                                                                <button
                                                                    onClick={() =>
                                                                        setCurrentPage((prev) =>
                                                                            Math.min(totalPages, prev + 1)
                                                                        )
                                                                    }
                                                                    disabled={currentPage === totalPages}
                                                                    className={`text-xs tracking-widest uppercase px-3 py-2 transition-colors ${
                                                                        currentPage === totalPages
                                                                            ? "text-gray-300 cursor-not-allowed"
                                                                            : "text-gray-500 hover:text-gray-900"
                                                                    }`}
                                                                >
                                                                    Next →
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}

                                        {/* Lightbox */}
                                        <Lightbox
                                            open={lightboxOpen}
                                            close={() => setLightboxOpen(false)}
                                            index={lightboxIndex}
                                            slides={project.images.map((image) => ({ src: image }))}
                                        />
                                    </div>
                                )}

                                {/* 프로젝트 링크 */}
                                {(project.repository || project.live || project.SeeMore) && (
                                    <div className="flex gap-3 md:gap-4 pt-2 md:pt-4">
                                        {project.repository && (
                                            <a
                                                href={project.repository}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm md:text-base text-gray-600 hover:text-gray-900 transition-colors underline decoration-dotted"
                                            >
                                                Repository →
                                            </a>
                                        )}
                                        {project.SeeMore && (
                                            <a
                                                href={project.SeeMore}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm md:text-base text-gray-600 hover:text-gray-900 transition-colors underline decoration-dotted"
                                            >
                                                See More →
                                            </a>
                                        )}
                                        {project.live && (
                                            <a
                                                href={project.live}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm md:text-base text-gray-600 hover:text-gray-900 transition-colors underline decoration-dotted"
                                            >
                                                Live →
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.section>

                    {/* 설명 */}
                    <motion.section variants={fadeInUpEaseOut} className="mb-12 md:mb-24">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                            <div>
                                <div
                                    className="text-sm md:text-base text-gray-500 uppercase tracking-widest"
                                >
                                    Overview
                                </div>
                            </div>
                            <div className="md:col-span-3">
                                <p
                                    className="text-sm md:text-lg text-gray-700 whitespace-pre-line"
                                    style={{ lineHeight: "1.9", letterSpacing: "-0.01em" }}
                                >
                                    {formatWithEmphasis(project.fullDescription)}
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    {/* 스킬 */}
                    <motion.section variants={fadeInUpEaseOut} className="mb-12 md:mb-24">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                            <div>
                                <div
                                    className="text-sm md:text-base text-gray-500 uppercase tracking-widest"
                                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                                >
                                    Technology
                                </div>
                            </div>
                            <div className="md:col-span-3">
                                {/* 7-column 매거진 그리드 스타일 */}
                                <div className="grid grid-cols-1 gap-px bg-gray-200">
                                    {skills?.map((skill) => (
                                        <div
                                            key={skill.id}
                                            className="bg-white p-4 md:p-5 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="grid grid-cols-12 gap-4 items-start">
                                                <div className="col-span-4 md:col-span-3">
                                                    <SkillBadge skill={skill} />
                                                </div>
                                                <div className="col-span-7 md:col-span-8">
                                                    <p
                                                        className="text-xs md:text-sm text-gray-600"
                                                        style={{ lineHeight: "1.65", letterSpacing: "-0.01em" }}
                                                    >
                                                        {skill.usage}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* 구현 상세 */}
                    {project.implementation.length > 0 && (
                        <motion.section variants={fadeInUpEaseOut} className="mb-12 md:mb-24">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                                <div className="md:sticky md:top-8 md:self-start">
                                    <div
                                        className="text-sm md:text-base text-gray-500 uppercase tracking-widest"
                                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                                    >
                                        Implementation
                                    </div>
                                </div>
                                <div className="md:col-span-3 space-y-16 md:space-y-20">
                                    {project.implementation.map((impl, index) => (
                                        <div key={impl.id} className="space-y-5 md:space-y-6">
                                            <div className="flex items-start gap-4 md:gap-6">
                                                <span className="text-4xl md:text-5xl font-light text-gray-300 leading-none mt-1">
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>
                                                <div className="flex-1">
                                                    <h3 className="text-lg md:text-2xl font-bold text-black leading-tight">
                                                        {impl.title}
                                                    </h3>
                                                </div>
                                            </div>

                                            <p
                                                className="text-sm md:text-base text-gray-700 pl-16 md:pl-20"
                                                style={{ lineHeight: "1.8", letterSpacing: "-0.01em" }}
                                            >
                                                {formatWithEmphasis(impl.description)}
                                            </p>

                                            <div className="pl-16 md:pl-20 space-y-4 md:space-y-5">
                                                {impl.challenges && (
                                                    <div className="border-l-4 border-red-500 pl-6 py-1">
                                                        <h4
                                                            className="text-xs md:text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider"
                                                            style={{ letterSpacing: "0.1em" }}
                                                        >
                                                            Challenge
                                                        </h4>
                                                        {Array.isArray(impl.challenges) ? (
                                                            <ul className="space-y-3 md:space-y-3.5">
                                                                {impl.challenges.map((challenge, idx) => (
                                                                    <li
                                                                        key={idx}
                                                                        className="text-xs md:text-sm text-gray-800 relative pl-4"
                                                                        style={{
                                                                            lineHeight: "1.75",
                                                                            letterSpacing: "-0.01em",
                                                                        }}
                                                                    >
                                                                        <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                                                                        {formatWithEmphasis(challenge)}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p
                                                                className="text-xs md:text-sm text-gray-800"
                                                                style={{ lineHeight: "1.75", letterSpacing: "-0.01em" }}
                                                            >
                                                                {formatWithEmphasis(impl.challenges)}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                {impl.solution && (
                                                    <div className="border-l-4 border-gray-800 pl-6 py-1">
                                                        <h4
                                                            className="text-xs md:text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider"
                                                            style={{ letterSpacing: "0.1em" }}
                                                        >
                                                            Solution
                                                        </h4>
                                                        {Array.isArray(impl.solution) ? (
                                                            <ul className="space-y-3 md:space-y-3.5">
                                                                {impl.solution.map((solution, idx) => (
                                                                    <li
                                                                        key={idx}
                                                                        className="text-xs md:text-sm text-gray-800 relative pl-4"
                                                                        style={{
                                                                            lineHeight: "1.75",
                                                                            letterSpacing: "-0.01em",
                                                                        }}
                                                                    >
                                                                        <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-gray-700 rounded-full"></span>
                                                                        {formatWithEmphasis(solution)}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p
                                                                className="text-xs md:text-sm text-gray-800"
                                                                style={{ lineHeight: "1.75", letterSpacing: "-0.01em" }}
                                                            >
                                                                {formatWithEmphasis(impl.solution)}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {/* 도전과제 & 성과 */}
                    <motion.section variants={fadeInUpEaseOut} className="mb-12 md:mb-24">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                            <div>
                                <div
                                    className="text-sm md:text-base text-gray-500 uppercase tracking-widest"
                                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                                >
                                    Results
                                </div>
                            </div>
                            <div className="md:col-span-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                    {project.challenges.length > 0 && (
                                        <div>
                                            <h3 className="text-base md:text-lg font-bold text-black mb-4 md:mb-5 flex items-center gap-3">
                                                <span className="w-8 h-px bg-gray-400"></span>
                                                Challenges
                                            </h3>
                                            <ul className="space-y-3 md:space-y-4">
                                                {project.challenges.map((challenge, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-xs md:text-sm text-gray-700"
                                                        style={{ lineHeight: "1.75", letterSpacing: "-0.01em" }}
                                                    >
                                                        {formatWithEmphasis(challenge)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {project.achievements.length > 0 && (
                                        <div>
                                            <h3 className="text-base md:text-lg font-bold text-black mb-4 md:mb-5 flex items-center gap-3">
                                                <span className="w-8 h-px bg-gray-400"></span>
                                                Achievements
                                            </h3>
                                            <ul className="space-y-3 md:space-y-4">
                                                {project.achievements.map((achievement, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-xs md:text-sm text-gray-700"
                                                        style={{ lineHeight: "1.75", letterSpacing: "-0.01em" }}
                                                    >
                                                        {formatWithEmphasis(achievement)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* 회고 */}
                    <motion.section variants={fadeInUpEaseOut} className="mb-12 md:mb-20">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                            <div>
                                <div
                                    className="text-sm md:text-base text-gray-500 uppercase tracking-widest"
                                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                                >
                                    Reflection
                                </div>
                            </div>
                            <div className="md:col-span-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                                    <div className="border-l-2 border-gray-200 pl-5">
                                        <h3 className="text-base md:text-lg font-bold text-black mb-4 md:mb-5">
                                            What Went Well
                                        </h3>
                                        <ul className="space-y-2.5 md:space-y-3">
                                            {project.retrospective.whatWentWell.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="text-xs md:text-sm text-gray-700"
                                                    style={{ lineHeight: "1.7", letterSpacing: "-0.01em" }}
                                                >
                                                    {formatWithEmphasis(item)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="border-l-2 border-gray-200 pl-5">
                                        <h3 className="text-base md:text-lg font-bold text-black mb-4 md:mb-5">
                                            Improvements
                                        </h3>
                                        <ul className="space-y-2.5 md:space-y-3">
                                            {project.retrospective.whatCouldBeImproved.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="text-xs md:text-sm text-gray-700"
                                                    style={{ lineHeight: "1.7", letterSpacing: "-0.01em" }}
                                                >
                                                    {formatWithEmphasis(item)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="border-l-2 border-gray-200 pl-5">
                                        <h3 className="text-base md:text-lg font-bold text-black mb-4 md:mb-5">
                                            Lessons Learned
                                        </h3>
                                        <ul className="space-y-2.5 md:space-y-3">
                                            {project.retrospective.lessonsLearned.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="text-xs md:text-sm text-gray-700"
                                                    style={{ lineHeight: "1.7", letterSpacing: "-0.01em" }}
                                                >
                                                    {formatWithEmphasis(item)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                </div>
            </div>
        </motion.div>
    );
}
