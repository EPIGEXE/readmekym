import { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { detailedDeveloperData } from "../data/detailedDeveloperData";
import { SkillBadge } from "../components/ui/SkillBadge";
import { fadeInUpEaseOut, staggerContainer } from "../styles/framerMotion";
import { formatPeriod } from "../utils/utils";
import { developerData } from "../data/devloperData";

export function ProjectDetailPage() {
    // ============================ Hooks ============================
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate(); // 브라우저 히스토리 기반 뒤로가기 하려고

    // ============================ 상수 정의 ============================
    const project = detailedDeveloperData.projects.find((p) => p.id === id);

    const period = id?.startsWith("exp-")
        ? developerData.experiences.find((e) => e.id === id)
        : developerData.projects.find((p) => p.id === id);

    // ============================ useEffect ============================
    // 페이지 이동 시 맨 위로 스크롤
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // ============================ 렌더링 ============================
    // 프로젝트가 없으면 나오는 페이지 반환
    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-xl md:text-2xl font-bold mb-4">Project not found</h2>
                    <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
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
                        className="text-sm md:text-lg text-gray-500 tracking-widest uppercase mb-8 md:mb-12 hover:text-gray-700 transition-colors"
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

                                <p
                                    className="text-base md:text-xl font-light text-gray-800 leading-relaxed"
                                    style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                                >
                                    {project.shortDescription}
                                </p>

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
                    <motion.section variants={fadeInUpEaseOut} className="mb-12 md:mb-20">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                            <div
                                className="text-sm md:text-base text-gray-500 uppercase tracking-widest"
                                style={{ fontFamily: "'Pretendard', sans-serif" }}
                            >
                                Overview
                            </div>
                            <div className="md:col-span-3">
                                <p
                                    className="text-sm md:text-lg leading-relaxed text-gray-700 whitespace-pre-line"
                                    style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                                >
                                    {project.fullDescription}
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    {/* 스킬 */}
                    <motion.section variants={fadeInUpEaseOut} className="mb-12 md:mb-20">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                            <div
                                className="text-sm md:text-base text-gray-500 uppercase tracking-widest"
                                style={{ fontFamily: "'Pretendard', sans-serif" }}
                            >
                                Technology
                            </div>
                            <div className="md:col-span-3 space-y-4 md:space-y-6">
                                {project.skills.map((skill) => (
                                    <div
                                        key={skill.id}
                                        className="border-b border-gray-200 pb-3 md:pb-4 last:border-b-0"
                                    >
                                        <div className="flex items-center justify-between mb-1 md:mb-2">
                                            <SkillBadge skill={skill} />
                                            <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">
                                                {skill.experience === "beginner" && "Beginner"}
                                                {skill.experience === "intermediate" && "Intermediate"}
                                                {skill.experience === "advanced" && "Advanced"}
                                            </span>
                                        </div>
                                        <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                                            {skill.usage}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    {/* 구현 상세 */}
                    {project.implementation.length > 0 && (
                        <motion.section variants={fadeInUpEaseOut} className="mb-12 md:mb-20">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                                <div
                                    className="text-sm md:text-base text-gray-500 uppercase tracking-widest"
                                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                                >
                                    Implementation
                                </div>
                                <div className="md:col-span-3 space-y-8 md:space-y-12">
                                    {project.implementation.map((impl, index) => (
                                        <div key={impl.id} className="space-y-3 md:space-y-4">
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <span className="text-sm md:text-lg font-light text-gray-400">
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>
                                                <h3 className="text-base md:text-xl font-bold text-black">
                                                    {impl.title}
                                                </h3>
                                            </div>

                                            <p className="text-sm md:text-base text-gray-700 leading-relaxed ml-8 md:ml-12">
                                                {impl.description}
                                            </p>

                                            {impl.challenges && (
                                                <div className="ml-8 md:ml-12 bg-red-50 border-l-2 md:border-l-4 border-red-200 p-3 md:p-4">
                                                    <h4 className="text-xs md:text-sm font-medium text-red-800 mb-1 md:mb-2">
                                                        Challenge
                                                    </h4>
                                                    {Array.isArray(impl.challenges) ? (
                                                        <ul className="space-y-1.5 md:space-y-2">
                                                            {impl.challenges.map((challenge, index) => (
                                                                <li key={index} className="text-xs md:text-sm text-red-700 leading-relaxed">
                                                                    {challenge}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-xs md:text-sm text-red-700">{impl.challenges}</p>
                                                    )}
                                                </div>
                                            )}

                                            {impl.solution && (
                                                <div className="ml-8 md:ml-12 bg-green-50 border-l-2 md:border-l-4 border-green-200 p-3 md:p-4">
                                                    <h4 className="text-xs md:text-sm font-medium text-green-800 mb-1 md:mb-2">
                                                        Solution
                                                    </h4>
                                                    {Array.isArray(impl.solution) ? (
                                                        <ul className="space-y-1.5 md:space-y-2">
                                                            {impl.solution.map((solution, index) => (
                                                                <li key={index} className="text-xs md:text-sm text-green-700 leading-relaxed">
                                                                    {solution}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-xs md:text-sm text-green-700">{impl.solution}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {/* 도전과제 & 성과 */}
                    <motion.section variants={fadeInUpEaseOut} className="mb-12 md:mb-20">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                            <div
                                className="text-sm md:text-base text-gray-500 uppercase tracking-widest"
                                style={{ fontFamily: "'Pretendard', sans-serif" }}
                            >
                                Results
                            </div>
                            <div className="md:col-span-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                    {project.challenges.length > 0 && (
                                        <div>
                                            <h3 className="text-base md:text-lg font-bold text-black mb-3 md:mb-4">
                                                Challenges
                                            </h3>
                                            <ul className="space-y-2 md:space-y-3">
                                                {project.challenges.map((challenge, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-xs md:text-sm text-gray-700 leading-relaxed"
                                                    >
                                                        {challenge}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {project.achievements.length > 0 && (
                                        <div>
                                            <h3 className="text-base md:text-lg font-bold text-black mb-3 md:mb-4">
                                                Achievements
                                            </h3>
                                            <ul className="space-y-2 md:space-y-3">
                                                {project.achievements.map((achievement, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-xs md:text-sm text-gray-700 leading-relaxed"
                                                    >
                                                        {achievement}
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
                            <div
                                className="text-sm md:text-base text-gray-500 uppercase tracking-widest"
                                style={{ fontFamily: "'Pretendard', sans-serif" }}
                            >
                                Reflection
                            </div>
                            <div className="md:col-span-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                                    <div>
                                        <h3 className="text-base md:text-lg font-bold text-black mb-3 md:mb-4">
                                            What Went Well
                                        </h3>
                                        <ul className="space-y-1.5 md:space-y-2">
                                            {project.retrospective.whatWentWell.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="text-xs md:text-sm text-gray-700 leading-relaxed"
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-base md:text-lg font-bold text-black mb-3 md:mb-4">
                                            Improvements
                                        </h3>
                                        <ul className="space-y-1.5 md:space-y-2">
                                            {project.retrospective.whatCouldBeImproved.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="text-xs md:text-sm text-gray-700 leading-relaxed"
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-base md:text-lg font-bold text-black mb-3 md:mb-4">
                                            Lessons Learned
                                        </h3>
                                        <ul className="space-y-1.5 md:space-y-2">
                                            {project.retrospective.lessonsLearned.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="text-xs md:text-sm text-gray-700 leading-relaxed"
                                                >
                                                    {item}
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
