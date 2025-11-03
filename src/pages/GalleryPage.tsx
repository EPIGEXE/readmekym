import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { developerData } from "../data/devloperData";
import { SkillBadge } from "../components/ui/SkillBadge";
import { Calendar, Briefcase, Code, User, Signpost, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { fadeInUpEaseOut, staggerContainer } from "../styles/framerMotion";
import { formatPeriod } from "../utils/utils";
import type { Experience, Project } from "../data/developDataType";

type GalleryItem = Experience | Project;

export function GalleryPage() {
    // ============================ Hooks ============================
    const navigate = useNavigate();

    // ============================ 상태 관리 ============================
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== "undefined") {
            return window.matchMedia("(max-width: 767px)").matches;
        }
        return false;
    }); // 화면이 모바일인지 여부
    const [isNavOpen, setIsNavOpen] = useState(false); // 네비게이션 메뉴 열림 여부

    // ============================ useRef ============================
    // 스크롤 섹션 위치 이동을 위한 ref
    const experienceSectionRef = useRef<HTMLDivElement>(null);
    const workProjectsSectionRef = useRef<HTMLDivElement>(null);
    const personalProjectsSectionRef = useRef<HTMLDivElement>(null);

    // ============================ 상수 정의 ============================
    // 모든 아이템을 하나로 합치고 시간순 정렬 (오래된 것부터)
    const allItems: GalleryItem[] = [...developerData.experiences, ...developerData.projects].sort((a, b) => {
        if (a.startYear !== b.startYear) return a.startYear - b.startYear;
        return a.startMonth - b.startMonth;
    });

    // 섹션별로 데이터 분리
    const experienceItems = allItems.filter((item) => item.type === "experience");
    const workProjectItems = allItems.filter(
        (item) => item.type === "project" && "experienceId" in item && item.experienceId
    );
    const personalProjectItems = allItems.filter(
        (item) => item.type === "project" && (!("experienceId" in item) || !item.experienceId)
    );

    // ============================ useEffect ============================
    // 화면이 모바일인지 감지
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 767px)");
        const checkMobile = () => {
            setIsMobile(mediaQuery.matches);
        };
        checkMobile();
        mediaQuery.addEventListener("change", checkMobile);
        return () => mediaQuery.removeEventListener("change", checkMobile);
    }, []);

    // ============================ 핸들러 ============================
    // 아이템 클릭 시 경력 또는 프로젝트 상세 페이지로 이동
    const handleItemClick = (item: GalleryItem) => {
        if (item.type === "experience") {
            navigate(`/experience/${item.id}`);
        } else {
            navigate(`/project/${item.id}`);
        }
    };

    // ============================ 유틸 함수 ============================
    // 모바일: 섹션으로 스크롤 이동
    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            const offsetTop = ref.current.offsetTop;
            window.scrollTo({ top: offsetTop - 80, behavior: "smooth" });
        }
        setIsNavOpen(false);
    };

    // 모바일: 맨 위로 스크롤 이동
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setIsNavOpen(false);
    };

    // 아이템 타입 정보 반환
    const getItemTypeInfo = (item: GalleryItem) => {
        if (item.type === "experience") {
            return {
                icon: Briefcase,
                label: "EXPERIENCE",
                color: "text-amber-600",
                bgColor: "bg-amber-50",
            };
        } else if ("experienceId" in item && item.experienceId) {
            return {
                icon: Code,
                label: "WORK PROJECT",
                color: "text-emerald-600",
                bgColor: "bg-emerald-50",
            };
        } else {
            return {
                icon: User,
                label: "PERSONAL PROJECT",
                color: "text-orange-600",
                bgColor: "bg-orange-50",
            };
        }
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            key="gallery-content"
            className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8"
        >
            {/* 경력 섹션 */}
            {experienceItems.length > 0 && (
                <motion.section ref={experienceSectionRef} className="mb-12 md:mb-16" variants={fadeInUpEaseOut}>
                    <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                        <h3 className="text-2xl md:text-3xl font-black text-black">
                            <span className="crayon-highlight crayon-highlight-gold font-cafe24-gowoonbam">
                                EXPERIENCE
                            </span>
                        </h3>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {experienceItems.map((item, index) => {
                            const { label, color } = getItemTypeInfo(item);
                            return (
                                <motion.article
                                    key={item.id}
                                    variants={fadeInUpEaseOut}
                                    className="group cursor-pointer relative p-3 md:p-4 border-drawing"
                                    onClick={() => handleItemClick(item)}
                                >
                                    <div className="space-y-2 md:space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-[10px] md:text-xs font-bold tracking-widest ${color}`}
                                            >
                                                {label}
                                            </span>
                                            <span className="text-[10px] md:text-xs text-gray-400">
                                                #{String(index + 1).padStart(2, "0")}
                                            </span>
                                        </div>

                                        <h4 className="text-lg md:text-xl font-bold text-black leading-tight transition-colors">
                                            <span className="crayon-hover crayon-hover-red">{item.title}</span>
                                        </h4>

                                        {"subtitle" in item && item.subtitle && (
                                            <p className="text-xs md:text-sm text-gray-600 font-medium">
                                                {item.subtitle}
                                            </p>
                                        )}

                                        <p className="text-xs md:text-sm text-gray-700 leading-relaxed line-clamp-3">
                                            {item.description}
                                        </p>

                                        <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            <span>
                                                {formatPeriod(
                                                    item.startYear,
                                                    item.startMonth,
                                                    item.endYear,
                                                    item.endMonth
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                </motion.section>
            )}

            {/* 회사 프로젝트 섹션 */}
            {workProjectItems.length > 0 && (
                <motion.section ref={workProjectsSectionRef} className="mb-12 md:mb-16" variants={fadeInUpEaseOut}>
                    <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                        <h3 className="text-2xl md:text-3xl font-black text-black">
                            <span className="crayon-highlight crayon-highlight-forest font-cafe24-gowoonbam">
                                WORK PROJECTS
                            </span>
                        </h3>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {workProjectItems.map((item, index) => {
                            const { label, color } = getItemTypeInfo(item);
                            const globalIndex = experienceItems.length + index + 1;
                            return (
                                <motion.article
                                    key={item.id}
                                    variants={fadeInUpEaseOut}
                                    className="group cursor-pointer relative border-drawing"
                                    onClick={() => handleItemClick(item)}
                                >
                                    <div className="p-3 md:p-4">
                                        <div className="space-y-2 md:space-y-3">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`text-[10px] md:text-xs font-bold tracking-widest ${color}`}
                                                >
                                                    {label}
                                                </span>
                                                <span className="text-[10px] md:text-xs text-gray-400">
                                                    #{String(globalIndex).padStart(2, "0")}
                                                </span>
                                            </div>

                                            <h4 className="text-lg md:text-xl font-bold text-black leading-tight transition-colors">
                                                <span className="crayon-hover crayon-hover-red">{item.title}</span>
                                            </h4>

                                            <p className="text-xs md:text-sm text-gray-700 leading-relaxed line-clamp-3">
                                                {item.description}
                                            </p>

                                            <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-gray-500">
                                                <Calendar className="w-3 h-3" />
                                                <span>
                                                    {formatPeriod(
                                                        item.startYear,
                                                        item.startMonth,
                                                        item.endYear,
                                                        item.endMonth
                                                    )}
                                                </span>
                                            </div>

                                            {"skills" in item && item.skills && item.skills.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {item.skills.slice(0, 3).map((skill, idx) => (
                                                        <SkillBadge key={idx} skill={skill} size="sm" />
                                                    ))}
                                                    {item.skills.length > 3 && (
                                                        <span className="text-[10px] md:text-xs text-gray-500 px-2 py-1">
                                                            +{item.skills.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                </motion.section>
            )}

            {/* 개인 프로젝트 섹션 */}
            {personalProjectItems.length > 0 && (
                <motion.section ref={personalProjectsSectionRef} className="mb-12 md:mb-16" variants={fadeInUpEaseOut}>
                    <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                        <h3 className="text-2xl md:text-3xl font-black text-black">
                            <span className="crayon-highlight crayon-highlight-orange font-cafe24-gowoonbam">
                                PERSONAL PROJECTS
                            </span>
                        </h3>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {personalProjectItems.map((item, index) => {
                            const { label, color } = getItemTypeInfo(item);
                            const globalIndex = experienceItems.length + workProjectItems.length + index + 1;
                            return (
                                <motion.article
                                    key={item.id}
                                    variants={fadeInUpEaseOut}
                                    className="group cursor-pointer relative border-drawing"
                                    onClick={() => handleItemClick(item)}
                                >
                                    <div className="p-3 md:p-4">
                                        <div className="space-y-2 md:space-y-3">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`text-[10px] md:text-xs font-bold tracking-widest ${color}`}
                                                >
                                                    {label}
                                                </span>
                                                <span className="text-[10px] md:text-xs text-gray-400">
                                                    #{String(globalIndex).padStart(2, "0")}
                                                </span>
                                            </div>

                                            <h4 className="text-lg md:text-xl font-bold text-black leading-tight transition-colors">
                                                <span className="crayon-hover crayon-hover-red">{item.title}</span>
                                            </h4>

                                            <p className="text-xs md:text-sm text-gray-700 leading-relaxed line-clamp-3">
                                                {item.description}
                                            </p>

                                            <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-gray-500">
                                                <Calendar className="w-3 h-3" />
                                                <span>
                                                    {formatPeriod(
                                                        item.startYear,
                                                        item.startMonth,
                                                        item.endYear,
                                                        item.endMonth
                                                    )}
                                                </span>
                                            </div>

                                            {"skills" in item && item.skills && item.skills.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {item.skills.slice(0, 3).map((skill, idx) => (
                                                        <SkillBadge key={idx} skill={skill} size="sm" />
                                                    ))}
                                                    {item.skills.length > 3 && (
                                                        <span className="text-[10px] md:text-xs text-gray-500 px-2 py-1">
                                                            +{item.skills.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                </motion.section>
            )}

            {/* 모바일: 플로팅 네비게이션 버튼 */}
            {isMobile && (
                <div className="fixed bottom-6 right-4 z-50">
                    {/* 모바일: 네비게이션 메뉴 */}
                    <AnimatePresence>
                        {isNavOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.2 }}
                                className="absolute bottom-16 right-0 flex flex-col gap-2 mb-2"
                            >
                                <motion.button
                                    onClick={scrollToTop}
                                    className="px-4 py-2 rounded-full bg-gray-700 text-white shadow-lg text-sm font-medium whitespace-nowrap hover:bg-gray-600 transition-colors"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    맨 위로
                                </motion.button>
                                {experienceItems.length > 0 && (
                                    <motion.button
                                        onClick={() => scrollToSection(experienceSectionRef)}
                                        className="px-4 py-2 rounded-full bg-white border border-amber-400 text-amber-600 shadow-lg text-sm font-medium whitespace-nowrap hover:bg-amber-50 transition-colors"
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        경력
                                    </motion.button>
                                )}
                                {workProjectItems.length > 0 && (
                                    <motion.button
                                        onClick={() => scrollToSection(workProjectsSectionRef)}
                                        className="px-4 py-2 rounded-full bg-white border border-emerald-400 text-emerald-600 shadow-lg text-sm font-medium whitespace-nowrap hover:bg-emerald-50 transition-colors"
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        회사
                                    </motion.button>
                                )}
                                {personalProjectItems.length > 0 && (
                                    <motion.button
                                        onClick={() => scrollToSection(personalProjectsSectionRef)}
                                        className="px-4 py-2 rounded-full bg-white border border-orange-400 text-orange-600 shadow-lg text-sm font-medium whitespace-nowrap hover:bg-orange-50 transition-colors"
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        개인
                                    </motion.button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* 모바일: 토글 버튼 */}
                    <motion.button
                        onClick={() => setIsNavOpen(!isNavOpen)}
                        className="w-14 h-14 rounded-full bg-gray-800 text-white shadow-xl flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ rotate: isNavOpen ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isNavOpen ? <X className="w-6 h-6" /> : <Signpost className="w-6 h-6" />}
                    </motion.button>
                </div>
            )}
        </motion.div>
    );
}
