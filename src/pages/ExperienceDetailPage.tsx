import { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Building } from "lucide-react";
import { detailedDeveloperData } from "../data/detailedDeveloperData";
import { developerData } from "../data/devloperData";
import { fadeInUpEaseOut } from "../styles/framerMotion";
import { formatPeriod } from "../utils/utils";
import { formatWithEmphasis } from "../utils/textFormatter";

export function ExperienceDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const experience = detailedDeveloperData.experiences.find((e) => e.id === id);
    const period = developerData.experiences.find((e) => e.id === id);

    // 연결된 프로젝트
    const relatedProjects = experience?.projects
        ?.map((projectId) => developerData.projects.find((p) => p.id === projectId))
        .filter(Boolean);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!experience) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-xl md:text-2xl font-bold mb-4">Experience not found</h2>
                    <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                        ← Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <motion.div initial="initial" animate="animate" className="min-h-screen">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6">
                {/* Content with Border */}
                <div className="border-2 md:border-4 border-gray-700 p-4 md:p-8">
                    {/* Back Button */}
                    <motion.button
                        variants={fadeInUpEaseOut}
                        onClick={() => navigate(-1)}
                        className="text-sm md:text-lg text-gray-500 tracking-widest uppercase mb-8 md:mb-12 hover:text-gray-700 transition-colors cursor-pointer"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                        ← Back
                    </motion.button>
                    {/* Hero Section */}
                    <motion.section className="mb-12 md:mb-24" variants={fadeInUpEaseOut}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16 items-start">
                            {/* Left Content */}
                            <div className="lg:col-span-3 space-y-4 md:space-y-8">
                                <div
                                    className="text-sm md:text-lg text-gray-500 tracking-widest uppercase"
                                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                                >
                                    Experience
                                </div>

                                <h1 className="text-3xl md:text-5xl text-black font-black leading-tight">
                                    {experience.title}
                                </h1>

                                <div className="w-16 md:w-24 h-px bg-gray-300"></div>

                                <div className="space-y-2 md:space-y-3">
                                    <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-500">
                                        {period && (
                                            <>
                                                <Calendar className="w-3 md:w-4 h-3 md:h-4" />
                                                <span>
                                                    {formatPeriod(
                                                        period.startYear,
                                                        period.startMonth,
                                                        period.endYear,
                                                        period.endMonth
                                                    )}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-500">
                                        <Building className="w-3 md:w-4 h-3 md:h-4" />
                                        <span>
                                            {experience.company.name} · {experience.position.title}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-base md:text-xl font-light text-gray-800 leading-relaxed">
                                    {experience.shortDescription}
                                </p>

                                {experience.company.website && (
                                    <div className="pt-2 md:pt-4">
                                        <a
                                            href={experience.company.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm md:text-base text-gray-600 hover:text-gray-900 transition-colors underline decoration-dotted"
                                        >
                                            Company Website →
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.section>

                    {/* Company Info */}
                    <motion.section variants={fadeInUpEaseOut} className="mb-12 md:mb-24">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                            <div>
                                <div
                                    className="text-sm md:text-base text-gray-500 uppercase tracking-widest"
                                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                                >
                                    Company
                                </div>
                            </div>
                            <div className="md:col-span-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                                    <div>
                                        <h3 className="text-xs md:text-sm font-bold text-black mb-1 md:mb-2 uppercase tracking-wider">
                                            Industry
                                        </h3>
                                        <p className="text-sm md:text-base text-gray-700">
                                            {experience.company.industry}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs md:text-sm font-bold text-black mb-1 md:mb-2 uppercase tracking-wider">
                                            Size
                                        </h3>
                                        <p className="text-sm md:text-base text-gray-700">{experience.company.size}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs md:text-sm font-bold text-black mb-1 md:mb-2 uppercase tracking-wider">
                                            Department
                                        </h3>
                                        <p className="text-sm md:text-base text-gray-700">
                                            {experience.position.department}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Description */}
                    <motion.section variants={fadeInUpEaseOut} className="mb-12 md:mb-24">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                            <div>
                                <div
                                    className="text-sm md:text-base text-gray-500 uppercase tracking-widest"
                                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                                >
                                    Overview
                                </div>
                            </div>
                            <div className="md:col-span-3">
                                <p
                                    className="text-sm md:text-lg text-gray-700 whitespace-pre-line"
                                    style={{ lineHeight: "1.9", letterSpacing: "-0.01em" }}
                                >
                                    {formatWithEmphasis(experience.fullDescription)}
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    {/* Projects */}
                    {relatedProjects && relatedProjects.length > 0 && (
                        <motion.section variants={fadeInUpEaseOut} className="mb-12 md:mb-24">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                                <div>
                                    <div
                                        className="text-sm md:text-base text-gray-500 uppercase tracking-widest"
                                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                                    >
                                        Projects
                                    </div>
                                </div>
                                <div className="md:col-span-3">
                                    <ul className="space-y-3 md:space-y-4">
                                        {relatedProjects.map(
                                            (project) =>
                                                project && (
                                                    <li key={project.id}>
                                                        <div
                                                            onClick={() => navigate(`/project/${project.id}`)}
                                                            className="group cursor-pointer"
                                                        >
                                                            <h3 className="text-sm md:text-base text-gray-600 hover:text-gray-900 transition-colors underline decoration-dotted">
                                                                {project.title} →
                                                            </h3>
                                                        </div>
                                                    </li>
                                                )
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {/* Key Contributions */}
                    <motion.section variants={fadeInUpEaseOut} className="mb-12 md:mb-24">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                            <div>
                                <div
                                    className="text-sm md:text-base text-gray-500 uppercase tracking-widest"
                                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                                >
                                    Contributions
                                </div>
                            </div>
                            <div className="md:col-span-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                    <div>
                                        <h3 className="text-base md:text-lg font-bold text-black mb-4 md:mb-5 flex items-center gap-3">
                                            <span className="w-8 h-px bg-gray-400"></span>
                                            Responsibilities
                                        </h3>
                                        <ul className="space-y-3 md:space-y-4">
                                            {experience.responsibilities.map((responsibility, index) => (
                                                <li
                                                    key={index}
                                                    className="text-xs md:text-sm text-gray-700"
                                                    style={{ lineHeight: "1.75", letterSpacing: "-0.01em" }}
                                                >
                                                    {formatWithEmphasis(responsibility)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-base md:text-lg font-bold text-black mb-4 md:mb-5 flex items-center gap-3">
                                            <span className="w-8 h-px bg-gray-400"></span>
                                            Achievements
                                        </h3>
                                        <ul className="space-y-3 md:space-y-4">
                                            {experience.achievements.map((achievement, index) => (
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
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Retrospective */}
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                                    <div className="space-y-6 md:space-y-8">
                                        <div className="border-l-2 border-gray-200 pl-5">
                                            <h3 className="text-base md:text-lg font-bold text-black mb-4 md:mb-5">
                                                What Went Well
                                            </h3>
                                            <ul className="space-y-2.5 md:space-y-3">
                                                {experience.retrospective.whatWentWell.map((item, index) => (
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
                                                {experience.retrospective.whatCouldBeImproved.map((item, index) => (
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

                                    <div className="space-y-6 md:space-y-8">
                                        <div className="border-l-2 border-gray-200 pl-5">
                                            <h3 className="text-base md:text-lg font-bold text-black mb-4 md:mb-5">
                                                Lessons Learned
                                            </h3>
                                            <ul className="space-y-2.5 md:space-y-3">
                                                {experience.retrospective.lessonsLearned.map((item, index) => (
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
                                                Career Growth
                                            </h3>
                                            <ul className="space-y-2.5 md:space-y-3">
                                                {experience.retrospective.careerGrowth.map((item, index) => (
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
                        </div>
                    </motion.section>
                </div>
            </div>
        </motion.div>
    );
}
