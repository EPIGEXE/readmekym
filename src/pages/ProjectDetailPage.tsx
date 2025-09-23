import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { detailedDeveloperData } from '../data/detailedDeveloperData'
import { SkillBadge } from '../components/ui/SkillBadge'

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

export function ProjectDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const project = detailedDeveloperData.projects.find(p => p.id === id)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Project not found</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ← Back
                    </button>
                </div>
            </div>
        )
    }

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
                    onClick={() => navigate(-1)}
                    className="text-lg text-gray-500 tracking-widest uppercase mb-12 hover:text-gray-700 transition-colors"
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                >
                    ← Back
                </motion.button>
                        {/* Hero Section */}
                <motion.section className="mb-24" variants={fadeInUp}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
                        {/* Left Content */}
                        <div className="lg:col-span-3 space-y-8">
                            <div className="text-lg text-gray-500 tracking-widest uppercase" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                                {project.experienceId ? 'Work Project' : 'Personal Project'}
                            </div>

                            <h1 className="text-5xl text-black font-black leading-tight">
                                {project.title}
                            </h1>

                            <div className="w-24 h-px bg-gray-300"></div>

                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>{formatPeriod(project.startYear, project.startMonth, project.endYear, project.endMonth)}</span>
                            </div>

                            <p className="text-xl font-light text-gray-800 leading-relaxed" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                                {project.shortDescription}
                            </p>

                            {/* Project Links */}
                            {(project.repository || project.live || project.SeeMore) && (
                                <div className="flex gap-4 pt-4">
                                    {project.repository && (
                                        <a
                                            href={project.repository}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-gray-900 transition-colors underline decoration-dotted"
                                        >
                                            Repository →
                                        </a>
                                    )}
                                    {project.SeeMore && (
                                        <a
                                            href={project.SeeMore}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-gray-900 transition-colors underline decoration-dotted"
                                        >
                                            See More →
                                        </a>
                                    )}
                                    {project.live && (
                                        <a
                                            href={project.live}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-gray-900 transition-colors underline decoration-dotted"
                                        >
                                            Live →
                                        </a>
                                    )}
                                </div>
                            )}
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
                                {project.fullDescription}
                            </p>
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
                            {project.skills.map((skill) => (
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

                {/* Implementation Details */}
                {project.implementation.length > 0 && (
                    <motion.section variants={fadeInUp} className="mb-20">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="text-base text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                                Implementation
                            </div>
                            <div className="md:col-span-3 space-y-12">
                                {project.implementation.map((impl, index) => (
                                    <div key={impl.id} className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-lg font-light text-gray-400">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <h3 className="text-xl font-bold text-black">{impl.title}</h3>
                                        </div>

                                        <p className="text-gray-700 leading-relaxed ml-12">{impl.description}</p>

                                        {impl.challenges && (
                                            <div className="ml-12 bg-red-50 border-l-4 border-red-200 p-4">
                                                <h4 className="text-sm font-medium text-red-800 mb-2">Challenge</h4>
                                                <p className="text-sm text-red-700">{impl.challenges}</p>
                                            </div>
                                        )}

                                        {impl.solution && (
                                            <div className="ml-12 bg-green-50 border-l-4 border-green-200 p-4">
                                                <h4 className="text-sm font-medium text-green-800 mb-2">Solution</h4>
                                                <p className="text-sm text-green-700">{impl.solution}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* Challenges & Achievements */}
                <motion.section variants={fadeInUp} className="mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-base text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                            Results
                        </div>
                        <div className="md:col-span-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {project.challenges.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-black mb-4">Challenges</h3>
                                        <ul className="space-y-3">
                                            {project.challenges.map((challenge, index) => (
                                                <li key={index} className="text-gray-700 leading-relaxed">
                                                    {challenge}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {project.achievements.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-black mb-4">Achievements</h3>
                                        <ul className="space-y-3">
                                            {project.achievements.map((achievement, index) => (
                                                <li key={index} className="text-gray-700 leading-relaxed">
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

                {/* Retrospective */}
                <motion.section variants={fadeInUp} className="mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-base text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                            Reflection
                        </div>
                        <div className="md:col-span-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                    <h3 className="text-lg font-bold text-black mb-4">What Went Well</h3>
                                    <ul className="space-y-2">
                                        {project.retrospective.whatWentWell.map((item, index) => (
                                            <li key={index} className="text-sm text-gray-700 leading-relaxed">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-black mb-4">Improvements</h3>
                                    <ul className="space-y-2">
                                        {project.retrospective.whatCouldBeImproved.map((item, index) => (
                                            <li key={index} className="text-sm text-gray-700 leading-relaxed">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-black mb-4">Lessons Learned</h3>
                                    <ul className="space-y-2">
                                        {project.retrospective.lessonsLearned.map((item, index) => (
                                            <li key={index} className="text-sm text-gray-700 leading-relaxed">
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
    )
}