import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { developerData } from '../data/devloperData'
import { SkillBadge } from '../components/ui/SkillBadge'
import { Calendar, Briefcase, Code, User } from 'lucide-react'
import type { Experience, Project } from '../types'

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

type GalleryItem = (Experience | Project) & {
    itemType: 'experience' | 'project'
}

export function GalleryPage() {
    const navigate = useNavigate()

    // 모든 아이템을 하나로 합치고 시간순 정렬 (오래된 것부터)
    const allItems: GalleryItem[] = [
        ...developerData.experiences.map(exp => ({ ...exp, itemType: 'experience' as const })),
        ...developerData.projects.map(proj => ({ ...proj, itemType: 'project' as const }))
    ].sort((a, b) => {
        if (a.startYear !== b.startYear) return a.startYear - b.startYear
        return a.startMonth - b.startMonth
    })

    // 섹션별로 데이터 분리
    const experienceItems = allItems.filter(item => item.itemType === 'experience')
    const workProjectItems = allItems.filter(item =>
        item.itemType === 'project' && 'experienceId' in item && item.experienceId
    )
    const personalProjectItems = allItems.filter(item =>
        item.itemType === 'project' && (!('experienceId' in item) || !item.experienceId)
    )

    const formatPeriod = (startYear: number, startMonth: number, endYear: number, endMonth: number) => {
        return `${startYear}.${String(startMonth).padStart(2, '0')} - ${endYear}.${String(endMonth).padStart(2, '0')}`
    }

    const getItemTypeInfo = (item: GalleryItem) => {
        if (item.itemType === 'experience') {
            return {
                icon: Briefcase,
                label: 'EXPERIENCE',
                color: 'text-amber-600',
                bgColor: 'bg-amber-50'
            }
        } else if ('experienceId' in item && item.experienceId) {
            return {
                icon: Code,
                label: 'WORK PROJECT',
                color: 'text-emerald-600',
                bgColor: 'bg-emerald-50'
            }
        } else {
            return {
                icon: User,
                label: 'PERSONAL PROJECT',
                color: 'text-orange-600',
                bgColor: 'bg-orange-50'
            }
        }
    }

    const handleItemClick = (item: GalleryItem) => {
        if (item.itemType === 'experience') {
            navigate(`/experience/${item.id}`)
        } else {
            navigate(`/project/${item.id}`)
        }
    }

    // 갤러리 페이지
    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            key="gallery-content"
            className="max-w-7xl mx-auto"
        >

            {/* Experience Stories */}
            {experienceItems.length > 0 && (
                <motion.section className="mb-16" variants={fadeInUp}>
                    <div className="flex items-center gap-4 mb-8">
                        <h3 className="text-3xl font-black text-black">
                            <span className="crayon-highlight crayon-highlight-gold font-cafe24-gowoonbam">EXPERIENCE</span>
                        </h3>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {experienceItems.map((item, index) => {
                            const { label, color } = getItemTypeInfo(item)
                            return (
                                <motion.article
                                    key={item.id}
                                    variants={fadeInUp}
                                    className="group cursor-pointer relative p-4 border-drawing"
                                    onClick={() => handleItemClick(item)}
                                >

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold tracking-widest ${color}`}>{label}</span>
                                            <span className="text-xs text-gray-400">#{String(index + 1).padStart(2, '0')}</span>
                                        </div>

                                        <h4 className="text-xl font-bold text-black leading-tight transition-colors">
                                            <span className="crayon-hover crayon-hover-red">
                                                {item.title}
                                            </span>
                                        </h4>

                                        {'subtitle' in item && item.subtitle && (
                                            <p className="text-sm text-gray-600 font-medium">
                                                {item.subtitle}
                                            </p>
                                        )}

                                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                                            {item.description}
                                        </p>

                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            <span>{formatPeriod(item.startYear, item.startMonth, item.endYear, item.endMonth)}</span>
                                        </div>
                                    </div>
                                </motion.article>
                            )
                        })}
                    </div>
                </motion.section>
            )}

            {/* Work Projects Stories */}
            {workProjectItems.length > 0 && (
                <motion.section className="mb-16" variants={fadeInUp}>
                    <div className="flex items-center gap-4 mb-8">
                        <h3 className="text-3xl font-black text-black">
                            <span className="crayon-highlight crayon-highlight-forest font-cafe24-gowoonbam">WORK PROJECTS</span>
                        </h3>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {workProjectItems.map((item, index) => {
                            const { label, color } = getItemTypeInfo(item)
                            const globalIndex = experienceItems.length + index + 1
                            return (
                                <motion.article
                                    key={item.id}
                                    variants={fadeInUp}
                                    className="group cursor-pointer relative p-4 border-drawing"
                                    onClick={() => handleItemClick(item)}
                                >

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold tracking-widest ${color}`}>{label}</span>
                                            <span className="text-xs text-gray-400">#{String(globalIndex).padStart(2, '0')}</span>
                                        </div>

                                        <h4 className="text-xl font-bold text-black leading-tight transition-colors">
                                            <span className="crayon-hover crayon-hover-red">
                                                {item.title}
                                            </span>
                                        </h4>

                                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                                            {item.description}
                                        </p>

                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            <span>{formatPeriod(item.startYear, item.startMonth, item.endYear, item.endMonth)}</span>
                                        </div>

                                        {'skills' in item && item.skills && item.skills.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {item.skills.slice(0, 3).map((skill, idx) => (
                                                    <SkillBadge key={idx} skill={skill} size="sm" />
                                                ))}
                                                {item.skills.length > 3 && (
                                                    <span className="text-xs text-gray-500 px-2 py-1">
                                                        +{item.skills.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.article>
                            )
                        })}
                    </div>
                </motion.section>
            )}

            {/* Personal Projects Stories */}
            {personalProjectItems.length > 0 && (
                <motion.section className="mb-16" variants={fadeInUp}>
                    <div className="flex items-center gap-4 mb-8">
                        <h3 className="text-3xl font-black text-black">
                            <span className="crayon-highlight crayon-highlight-orange font-cafe24-gowoonbam">PERSONAL PROJECTS</span>
                        </h3>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {personalProjectItems.map((item, index) => {
                            const { label, color } = getItemTypeInfo(item)
                            const globalIndex = experienceItems.length + workProjectItems.length + index + 1
                            return (
                                <motion.article
                                    key={item.id}
                                    variants={fadeInUp}
                                    className="group cursor-pointer relative p-4 border-drawing"
                                    onClick={() => handleItemClick(item)}
                                >

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold tracking-widest ${color}`}>{label}</span>
                                            <span className="text-xs text-gray-400">#{String(globalIndex).padStart(2, '0')}</span>
                                        </div>

                                        <h4 className="text-xl font-bold text-black leading-tight transition-colors">
                                            <span className="crayon-hover crayon-hover-red">
                                                {item.title}
                                            </span>
                                        </h4>

                                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                                            {item.description}
                                        </p>

                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            <span>{formatPeriod(item.startYear, item.startMonth, item.endYear, item.endMonth)}</span>
                                        </div>

                                        {'skills' in item && item.skills && item.skills.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {item.skills.slice(0, 3).map((skill, idx) => (
                                                    <SkillBadge key={idx} skill={skill} size="sm" />
                                                ))}
                                                {item.skills.length > 3 && (
                                                    <span className="text-xs text-gray-500 px-2 py-1">
                                                        +{item.skills.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.article>
                            )
                        })}
                    </div>
                </motion.section>
            )}

        </motion.div>
    )
}