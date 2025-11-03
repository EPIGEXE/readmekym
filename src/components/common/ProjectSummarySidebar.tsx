import { motion, AnimatePresence } from "framer-motion";
import { Drawer } from "vaul";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SkillBadge } from "../ui/SkillBadge";
import type { SidebarData } from "../../types/common";
import { formatWithEmphasis } from "../../utils/textFormatter";

interface ProjectSummarySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    projectSummaryData: SidebarData | null;
}

export const ProjectSummarySidebar = ({ isOpen, onClose, projectSummaryData }: ProjectSummarySidebarProps) => {
    // ============================ Hooks ============================
    const navigate = useNavigate(); // 페이지 이동

    // ============================ 상태 관리 ============================
    const [isMobile, setIsMobile] = useState(false); // 모바일 여부

    // ============================ useEffect ============================
    // 모바일 여부 감지
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 767px)");
        const checkMobile = () => {
            setIsMobile(mediaQuery.matches);
        };
        checkMobile();
        mediaQuery.addEventListener("change", checkMobile);
        return () => mediaQuery.removeEventListener("change", checkMobile);
    }, []);

    // ============================ 렌더링 ============================
    // 컨텐츠
    const content = (
        <div className="space-y-4 md:space-y-6">
            {/* 프로젝트 개요 */}
            <div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 md:mb-6">{projectSummaryData?.description}</p>

                {/* 프로젝트 메타 정보 */}
                <div className="mb-4 md:mb-6">
                    <div className="flex items-center justify-between text-xs md:text-sm border-b border-gray-100 pb-2 md:pb-3">
                        <span
                            className="text-gray-500 uppercase tracking-wider font-medium"
                            style={{ fontFamily: "'Pretendard', sans-serif" }}
                        >
                            Role
                        </span>
                        <span className="text-gray-900 font-medium">{projectSummaryData?.role}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs md:text-sm pt-2 md:pt-3">
                        <span
                            className="text-gray-500 uppercase tracking-wider font-medium"
                            style={{ fontFamily: "'Pretendard', sans-serif" }}
                        >
                            Team Size
                        </span>
                        <span className="text-gray-900 font-medium">
                            {projectSummaryData?.teamSize} Member
                            {projectSummaryData?.teamSize && projectSummaryData.teamSize > 1 ? "s" : ""}
                        </span>
                    </div>
                </div>

                {/* 프로젝트 소개 */}
                {projectSummaryData?.fullDescription && (
                    <div className="mb-4 md:mb-6">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">소개</h3>
                        <p className="text-sm md:text-base text-gray-800 leading-relaxed">
                            {formatWithEmphasis(
                                projectSummaryData.fullDescription.length > 200
                                    ? projectSummaryData.fullDescription.substring(0, 200) + "..."
                                    : projectSummaryData.fullDescription
                            )}
                        </p>
                    </div>
                )}
            </div>

            {/* 주요 기술 */}
            {projectSummaryData?.skills && projectSummaryData.skills.length > 0 && (
                <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">주요 기술</h3>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {projectSummaryData.skills.slice(0, 4).map((skill, index) => (
                            <SkillBadge
                                key={index}
                                skill={{
                                    id: skill.id,
                                    name: skill.name,
                                    category: skill.category as "frontend" | "backend" | "other",
                                }}
                                size="sm"
                            />
                        ))}
                        {projectSummaryData.skills.length > 4 && (
                            <span className="inline-flex items-center px-2.5 md:px-3 py-1 md:py-1.5 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">
                                +{projectSummaryData.skills.length - 4}개 더
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* 주요 성과 */}
            {projectSummaryData?.achievements && projectSummaryData.achievements.length > 0 && (
                <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">주요 성과</h3>
                    <div className="space-y-2 md:space-y-3">
                        {projectSummaryData.achievements.slice(0, 2).map((achievement, index) => (
                            <div key={index} className="flex items-start gap-2 md:gap-3 text-xs md:text-sm">
                                <span className="text-gray-400 font-light mt-0.5 min-w-[16px] md:min-w-[20px]">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="text-gray-700 leading-relaxed">{formatWithEmphasis(achievement)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 상세 보기 버튼 */}
            <div className="pt-4 md:pt-6 border-t border-gray-200">
                <button
                    onClick={() => {
                        if (projectSummaryData?.id) {
                            navigate(`/project/${projectSummaryData.id}`);
                        }
                        onClose();
                    }}
                    className="w-full py-2.5 md:py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-xs md:text-sm tracking-wider uppercase font-medium"
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                >
                    Read More →
                </button>
            </div>
        </div>
    );

    // 모바일: 바텀 시트로 나옴
    if (isMobile) {
        return (
            <Drawer.Root open={isOpen} onOpenChange={onClose}>
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
                    <Drawer.Content className="bg-white flex flex-col rounded-t-[20px] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
                        {/* 핸들 */}
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mt-4 mb-4" />

                        {/* 헤더 */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-start justify-between">
                            <div className="flex items-center flex-1 min-w-0">
                                <span className={`text-2xl font-light mr-2 ${projectSummaryData?.color}`}>
                                    {projectSummaryData?.number}
                                </span>
                                <Drawer.Title className="text-base font-semibold text-gray-900 leading-tight truncate">
                                    {projectSummaryData?.title}
                                </Drawer.Title>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors ml-2 flex-shrink-0"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        {/* 컨텐츠 */}
                        <div className="px-4 py-6 overflow-y-auto flex-1">
                            <Drawer.Description asChild>
                                <div>{content}</div>
                            </Drawer.Description>
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        );
    }

    // 데스크탑: 사이드바로 나옴
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 bg-black/50 z-40 hidden md:block"
                        onClick={onClose}
                    />

                    {/* 사이드바 */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 overflow-y-auto"
                    >
                        <div className="p-6">
                            {/* 헤더 */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center flex-1 min-w-0">
                                    <span
                                        className={`text-3xl font-light mr-3 ${
                                            projectSummaryData?.color || "text-gray-300"
                                        }`}
                                    >
                                        {projectSummaryData?.number}
                                    </span>
                                    <h2
                                        className="text-lg font-semibold text-gray-900 leading-tight truncate"
                                        title={projectSummaryData?.title}
                                    >
                                        {projectSummaryData?.title}
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors ml-2 flex-shrink-0"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>

                            {/* 컨텐츠 */}
                            {content}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
