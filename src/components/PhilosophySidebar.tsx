import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { forwardRef } from 'react'
import { SkillBadge } from './ui/SkillBadge'

interface PhilosophySidebarProps {
    isOpen: boolean
    onClose: () => void
    onViewDetail?: () => void
    philosophyData: {
        id: string
        number: string
        title: string
        description: string
        color: string
        details: string
        type?: 'philosophy' | 'project'
        role?: string
        teamSize?: number
        skills?: Array<{ id: string; name: string; category: string; experience: string }>
        achievements?: string[]
        fullDescription?: string
    } | null
}

export const PhilosophySidebar = forwardRef<HTMLDivElement, PhilosophySidebarProps>(
    ({ isOpen, onClose, onViewDetail, philosophyData }, ref) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Sidebar */}
                    <motion.div
                        ref={ref}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 overflow-y-auto"
                    >
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center flex-1 min-w-0">
                                    <span
                                        className={`text-3xl font-light mr-3 ${philosophyData?.color || 'text-gray-300'}`}
                                    >
                                        {philosophyData?.number}
                                    </span>
                                    <h2
                                        className="text-lg font-semibold text-gray-900 leading-tight truncate"
                                        title={philosophyData?.title}
                                        style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                                    >
                                        {philosophyData?.title}
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors ml-2 flex-shrink-0"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>

                            {/* Content */}
                            {philosophyData?.type === 'project' ? (
                                <div className="space-y-6">
                                    {/* Project Overview */}
                                    <div>
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            {philosophyData?.description}
                                        </p>

                                        {/* Project Meta Info - Magazine Style */}
                                        <div className="mb-6">
                                            <div className="flex items-center justify-between text-sm border-b border-gray-100 pb-3">
                                                <span className="text-gray-500 uppercase tracking-wider font-medium" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                                                    Role
                                                </span>
                                                <span className="text-gray-900 font-medium">
                                                    {philosophyData?.role}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm pt-3">
                                                <span className="text-gray-500 uppercase tracking-wider font-medium" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                                                    Team Size
                                                </span>
                                                <span className="text-gray-900 font-medium">
                                                    {philosophyData?.teamSize} Member{philosophyData?.teamSize && philosophyData.teamSize > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Project Introduction */}
                                        {philosophyData?.fullDescription && (
                                            <div className="mb-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3">소개</h3>
                                                <p className="text-gray-800 leading-relaxed">
                                                    {philosophyData.fullDescription.length > 200
                                                        ? philosophyData.fullDescription.substring(0, 200) + '...'
                                                        : philosophyData.fullDescription
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Key Skills */}
                                    {philosophyData?.skills && philosophyData.skills.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">주요 기술</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {philosophyData.skills.slice(0, 4).map((skill, index) => (
                                                    <SkillBadge
                                                        key={index}
                                                        skill={{
                                                            id: skill.id,
                                                            name: skill.name,
                                                            category: skill.category as 'frontend' | 'backend' | 'other'
                                                        }}
                                                        size="sm"
                                                    />
                                                ))}
                                                {philosophyData.skills.length > 4 && (
                                                    <span className="inline-flex items-center px-3 py-1.5 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">
                                                        +{philosophyData.skills.length - 4}개 더
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Key Achievements */}
                                    {philosophyData?.achievements && philosophyData.achievements.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">주요 성과</h3>
                                            <div className="space-y-3">
                                                {philosophyData.achievements.slice(0, 3).map((achievement, index) => (
                                                    <div key={index} className="flex items-start gap-3 text-sm">
                                                        <span className="text-gray-400 font-light mt-0.5 min-w-[20px]">
                                                            {String(index + 1).padStart(2, '0')}
                                                        </span>
                                                        <span className="text-gray-700 leading-relaxed">{achievement}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* View Detail Button */}
                                    <div className="pt-6 border-t border-gray-200">
                                        <button
                                            onClick={onViewDetail}
                                            className="w-full py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wider uppercase font-medium"
                                            style={{ fontFamily: "'Pretendard', sans-serif" }}
                                        >
                                            Read More →
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">개요</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {philosophyData?.description}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">상세 설명</h3>
                                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                            {philosophyData?.details}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
})