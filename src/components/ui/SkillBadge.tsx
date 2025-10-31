import type { SkillTag } from "../../types/common"

interface SkillBadgeProps {
    skill: SkillTag
    size?: 'sm' | 'md'
}

export function SkillBadge({ skill, size = 'md' }: SkillBadgeProps) {
    const dotColor = skill.category === 'frontend'
        ? 'bg-blue-500'    // 프론트엔드: 선명한 파란색 (UI/UX 연상)
        : skill.category === 'backend'
        ? 'bg-green-600'   // 백엔드: 진한 초록색 (서버/데이터 연상)
        : 'bg-gray-500'    // 기타: 회색 (보조적 도구/기타 기술)

    const sizeClasses = size === 'sm'
        ? 'text-xs px-2 py-1'
        : 'text-xs px-3 py-1'

    const dotSizeClasses = size === 'sm'
        ? 'w-2 h-2 mr-2'      // sm 크기: 더 큰 점
        : 'w-2.5 h-2.5 mr-2'  // md 크기: 훨씬 더 큰 점

    return (
        <span className={`inline-flex items-center bg-gray-50 text-gray-900 rounded font-medium border border-gray-200 ${sizeClasses}`}>
            <span className={`${dotColor} rounded-full ${dotSizeClasses} shadow-sm`}></span>
            {skill.name}
        </span>
    )
}