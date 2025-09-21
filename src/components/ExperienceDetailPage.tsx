import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Building } from 'lucide-react'
import type { DetailedExperience } from '../types'
import { SkillBadge } from './ui/SkillBadge'

interface ExperienceDetailPageProps {
    experience: DetailedExperience
    onBack: () => void
}

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
}

const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.15
        }
    }
}

export function ExperienceDetailPage({ experience, onBack }: ExperienceDetailPageProps) {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const formatPeriod = (startYear: number, startMonth: number, endYear: number, endMonth: number) => {
        return `${startYear}.${String(startMonth).padStart(2, '0')} - ${endYear}.${String(endMonth).padStart(2, '0')}`
    }

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="min-h-screen"
        >
            <div className="max-w-6xl mx-auto px-6 py-6">
                {/* Content with Border */}
                <div className="border-4 border-gray-700 p-8">
                {/* Back Button */}
                <motion.button
                    variants={fadeInUp}
                    onClick={onBack}
                    className="text-lg text-gray-500 tracking-widest uppercase mb-12 hover:text-gray-700 transition-colors"
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                >
                    ← Gallery
                </motion.button>
                        {/* Hero Section */}
                <motion.section className="mb-24" variants={fadeInUp}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
                        {/* Left Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="text-lg text-gray-500 tracking-widest uppercase" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                                Experience
                            </div>

                            <h1 className="text-5xl text-black font-black leading-tight">
                                {experience.title}
                            </h1>

                            <div className="w-24 h-px bg-gray-300"></div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatPeriod(experience.startYear, experience.startMonth, experience.endYear, experience.endMonth)}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <Building className="w-4 h-4" />
                                    <span>{experience.company.name} · {experience.position.title}</span>
                                </div>
                            </div>

                            <p className="text-xl font-light text-gray-800 leading-relaxed" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                                {experience.shortDescription}
                            </p>

                            {experience.company.website && (
                                <div className="pt-4">
                                    <a
                                        href={experience.company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 hover:text-gray-900 transition-colors underline decoration-dotted"
                                    >
                                        Company Website →
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Right Image Placeholder */}
                        <div className="lg:col-span-1">
                            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                                <div className="text-center text-gray-400">
                                    <div className="text-4xl mb-2">🏢</div>
                                    <div className="text-sm font-light">Company Image</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Company Info */}
                <motion.section variants={fadeInUp} className="mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-base text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                            Company
                        </div>
                        <div className="md:col-span-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                    <h3 className="text-sm font-bold text-black mb-2 uppercase tracking-wider">Industry</h3>
                                    <p className="text-gray-700">{experience.company.industry}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-black mb-2 uppercase tracking-wider">Size</h3>
                                    <p className="text-gray-700">{experience.company.size}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-black mb-2 uppercase tracking-wider">Department</h3>
                                    <p className="text-gray-700">{experience.position.department}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Description */}
                <motion.section variants={fadeInUp} className="mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-base text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                            Overview
                        </div>
                        <div className="md:col-span-3">
                            <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                                {experience.fullDescription}
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Responsibilities */}
                <motion.section variants={fadeInUp} className="mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-base text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                            Responsibilities
                        </div>
                        <div className="md:col-span-3">
                            <div className="space-y-4">
                                {experience.responsibilities.map((responsibility, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <span className="text-lg font-light text-gray-400 mt-0.5">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <p className="text-gray-700 leading-relaxed">{responsibility}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Skills */}
                <motion.section variants={fadeInUp} className="mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-base text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                            Technology
                        </div>
                        <div className="md:col-span-3 space-y-6">
                            {experience.skills.map((skill) => (
                                <div key={skill.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <SkillBadge skill={skill} />
                                        <span className="text-xs text-gray-500 uppercase tracking-wider">
                                            {skill.experience === 'beginner' && 'Beginner'}
                                            {skill.experience === 'intermediate' && 'Intermediate'}
                                            {skill.experience === 'advanced' && 'Advanced'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">{skill.usage}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Achievements */}
                <motion.section variants={fadeInUp} className="mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-base text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                            Achievements
                        </div>
                        <div className="md:col-span-3">
                            <div className="space-y-4">
                                {experience.achievements.map((achievement, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <span className="text-lg font-light text-gray-400 mt-0.5">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <p className="text-gray-700 leading-relaxed">{achievement}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Retrospective */}
                <motion.section variants={fadeInUp} className="mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-base text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                            Reflection
                        </div>
                        <div className="md:col-span-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-black mb-4">What Went Well</h3>
                                        <ul className="space-y-2">
                                            {experience.retrospective.whatWentWell.map((item, index) => (
                                                <li key={index} className="text-sm text-gray-700 leading-relaxed">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-black mb-4">Improvements</h3>
                                        <ul className="space-y-2">
                                            {experience.retrospective.whatCouldBeImproved.map((item, index) => (
                                                <li key={index} className="text-sm text-gray-700 leading-relaxed">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-black mb-4">Lessons Learned</h3>
                                        <ul className="space-y-2">
                                            {experience.retrospective.lessonsLearned.map((item, index) => (
                                                <li key={index} className="text-sm text-gray-700 leading-relaxed">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-black mb-4">Career Growth</h3>
                                        <ul className="space-y-2">
                                            {experience.retrospective.careerGrowth.map((item, index) => (
                                                <li key={index} className="text-sm text-gray-700 leading-relaxed">
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
    )
}