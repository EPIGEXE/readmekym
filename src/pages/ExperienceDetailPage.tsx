import { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Building } from "lucide-react";
import { detailedDeveloperData } from "../data/detailedDeveloperData";
import { SkillBadge } from "../components/ui/SkillBadge";
import { developerData } from "../data/devloperData";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
};

const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

export function ExperienceDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const experience = detailedDeveloperData.experiences.find((e) => e.id === id);
    const period = developerData.experiences.find((e) => e.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!experience) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-xl md:text-2xl font-bold mb-4">Experience not found</h2>
                    <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
                        ← Back
                    </button>
                </div>
            </div>
        );
    }

    const formatPeriod = (startYear: number, startMonth: number, endYear: number, endMonth: number) => {
        return `${startYear}.${String(startMonth).padStart(2, "0")} - ${endYear}.${String(endMonth).padStart(2, "0")}`;
    };

    return (
        <motion.div initial="initial" animate="animate" variants={staggerContainer} className="min-h-screen">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6">
                {/* Content with Border */}
                <div className="border-2 md:border-4 border-gray-700 p-4 md:p-8">
                    {/* Back Button */}
                    <motion.button
                        variants={fadeInUp}
                        onClick={() => navigate(-1)}
                        className="text-sm md:text-lg text-gray-500 tracking-widest uppercase mb-8 md:mb-12 hover:text-gray-700 transition-colors"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                        ← Back
                    </motion.button>
                    {/* Hero Section */}
                    <motion.section className="mb-12 md:mb-24" variants={fadeInUp}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16 items-start">
                            {/* Left Content */}
                            <div className="lg:col-span-2 space-y-4 md:space-y-8">
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

                                <p
                                    className="text-base md:text-xl font-light text-gray-800 leading-relaxed"
                                >
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
                    <motion.section variants={fadeInUp} className="mb-12 md:mb-20">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                            <div
                                className="text-sm md:text-base text-gray-500 uppercase tracking-widest"
                                style={{ fontFamily: "'Pretendard', sans-serif" }}
                            >
                                Company
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
                    <motion.section variants={fadeInUp} className="mb-12 md:mb-20">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                            <div
                                className="text-sm md:text-base text-gray-500 uppercase tracking-widest"
                                style={{ fontFamily: "'Pretendard', sans-serif" }}
                            >
                                Overview
                            </div>
                            <div className="md:col-span-3">
                                <p
                                    className="text-sm md:text-lg text-gray-700 whitespace-pre-line"
                                    style={{ lineHeight: '1.9', letterSpacing: '-0.01em' }}
                                >
                                    {experience.fullDescription}
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    {/* Responsibilities */}
                    <motion.section variants={fadeInUp} className="mb-12 md:mb-20">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                            <div
                                className="text-sm md:text-base text-gray-500 uppercase tracking-widest"
                                style={{ fontFamily: "'Pretendard', sans-serif" }}
                            >
                                Responsibilities
                            </div>
                            <div className="md:col-span-3">
                                <div className="space-y-3 md:space-y-4">
                                    {experience.responsibilities.map((responsibility, index) => (
                                        <div key={index} className="flex items-start gap-3 md:gap-4">
                                            <span className="text-sm md:text-lg font-light text-gray-400 mt-0.5">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <p className="text-sm md:text-base text-gray-700" style={{ lineHeight: '1.8', letterSpacing: '-0.01em' }}>
                                                {responsibility}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Skills */}
                    <motion.section variants={fadeInUp} className="mb-12 md:mb-20">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                            <div
                                className="text-sm md:text-base text-gray-500 uppercase tracking-widest"
                                style={{ fontFamily: "'Pretendard', sans-serif" }}
                            >
                                Technology
                            </div>
                            <div className="md:col-span-3 space-y-4 md:space-y-6">
                                {experience.skills.map((skill) => (
                                    <div
                                        key={skill.id}
                                        className="border-b border-gray-200 pb-3 md:pb-4 last:border-b-0"
                                    >
                                        <div className="flex items-center justify-between mb-1 md:mb-2">
                                            <SkillBadge skill={skill} />
                                        </div>
                                        <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                                            {skill.usage}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    {/* Achievements */}
                    <motion.section variants={fadeInUp} className="mb-12 md:mb-20">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                            <div
                                className="text-sm md:text-base text-gray-500 uppercase tracking-widest"
                                style={{ fontFamily: "'Pretendard', sans-serif" }}
                            >
                                Achievements
                            </div>
                            <div className="md:col-span-3">
                                <div className="space-y-3 md:space-y-4">
                                    {experience.achievements.map((achievement, index) => (
                                        <div key={index} className="flex items-start gap-3 md:gap-4">
                                            <span className="text-sm md:text-lg font-light text-gray-400 mt-0.5">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <p className="text-sm md:text-base text-gray-700" style={{ lineHeight: '1.8', letterSpacing: '-0.01em' }}>
                                                {achievement}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Retrospective */}
                    <motion.section variants={fadeInUp} className="mb-12 md:mb-20">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                            <div
                                className="text-sm md:text-base text-gray-500 uppercase tracking-widest"
                                style={{ fontFamily: "'Pretendard', sans-serif" }}
                            >
                                Reflection
                            </div>
                            <div className="md:col-span-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                    <div className="space-y-6 md:space-y-8">
                                        <div>
                                            <h3 className="text-base md:text-lg font-bold text-black mb-3 md:mb-4">
                                                What Went Well
                                            </h3>
                                            <ul className="space-y-2.5 md:space-y-3">
                                                {experience.retrospective.whatWentWell.map((item, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-xs md:text-sm text-gray-700"
                                                        style={{ lineHeight: '1.7', letterSpacing: '-0.01em' }}
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
                                            <ul className="space-y-2.5 md:space-y-3">
                                                {experience.retrospective.whatCouldBeImproved.map((item, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-xs md:text-sm text-gray-700"
                                                        style={{ lineHeight: '1.7', letterSpacing: '-0.01em' }}
                                                    >
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-6 md:space-y-8">
                                        <div>
                                            <h3 className="text-base md:text-lg font-bold text-black mb-3 md:mb-4">
                                                Lessons Learned
                                            </h3>
                                            <ul className="space-y-2.5 md:space-y-3">
                                                {experience.retrospective.lessonsLearned.map((item, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-xs md:text-sm text-gray-700"
                                                        style={{ lineHeight: '1.7', letterSpacing: '-0.01em' }}
                                                    >
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-base md:text-lg font-bold text-black mb-3 md:mb-4">
                                                Career Growth
                                            </h3>
                                            <ul className="space-y-2.5 md:space-y-3">
                                                {experience.retrospective.careerGrowth.map((item, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-xs md:text-sm text-gray-700"
                                                        style={{ lineHeight: '1.7', letterSpacing: '-0.01em' }}
                                                    >
                                                        {item}
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
