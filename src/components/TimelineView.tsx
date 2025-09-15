import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { timelineYears } from '../data/timelineData'
import type { SkillTag, StackedSkills } from '../types'

const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
}

export function TimelineView() {
    const [stackedSkills, setStackedSkills] = useState<StackedSkills>({
        frontend: [],
        backend: [],
        other: []
    })
    
    const [connections, setConnections] = useState<Array<{
        id: string
        fromX: number
        fromY: number
        toX: number
        toY: number
        color: string
    }>>([])
    
    const containerRef = useRef<HTMLDivElement>(null)

    const monthHeight = 80;
    const columnWidth = 200;
    
    // 경력 항목들 사이의 간격을 계산하는 함수
    const getExperienceBarStyle = (year: number, startMonth: number, endMonth?: number, yearIndex: number, globalIndex: number) => {
        const yearOffset = yearIndex * monthHeight * 12;
        const monthOffset = (startMonth - 1) * monthHeight;
        const spacingOffset = globalIndex * 15; // 전체 경력 순서에 따른 간격
        
        const top = yearOffset + monthOffset + spacingOffset;
        const baseHeight = endMonth 
            ? (endMonth - startMonth + 1) * monthHeight 
            : (13 - startMonth) * monthHeight;
        const adjustedHeight = Math.max(baseHeight - 10, monthHeight); // 최소 높이 보장
        
        return {
            top: `${top}px`,
            height: `${adjustedHeight}px`
        };
    };

    const getProjectBarStyle = (year: number, startMonth: number, endMonth?: number, yearIndex: number, itemIndex: number = 0) => {
        const yearOffset = yearIndex * monthHeight * 12;
        const top = yearOffset + (startMonth - 1) * monthHeight + (itemIndex * 8);
        const height = endMonth 
            ? (endMonth - startMonth + 1) * monthHeight - (itemIndex > 0 ? 5 : 0)
            : (13 - startMonth) * monthHeight - (itemIndex > 0 ? 5 : 0);
        
        return {
            top: `${top}px`,
            height: `${height}px`
        };
    };

    const getEventColor = (type: string) => {
        const colors: Record<string, string> = {
            experience: 'bg-gray-100 border-l-red-600',
            education: 'bg-gray-100 border-l-violet-600',
            project: 'bg-gray-100 border-l-emerald-600',
            skill: 'bg-gray-100 border-l-orange-600'
        };
        return colors[type] || '';
    };

    const getEventPointColor = (type: string) => {
        const colors: Record<string, string> = {
            experience: 'text-red-600',
            education: 'text-violet-600',
            project: 'text-emerald-600',
            skill: 'text-orange-600'
        };
        return colors[type] || '';
    };

    const getSkillColor = (category: string) => {
        const colors: Record<string, string> = {
            frontend: 'bg-gray-200 border-gray-300',
            backend: 'bg-gray-200 border-gray-300', 
            other: 'bg-gray-200 border-gray-300'
        };
        return colors[category] || 'bg-gray-200 border-gray-300';
    };

    const getSkillPointColor = (category: string) => {
        const colors: Record<string, string> = {
            frontend: 'text-cyan-600',
            backend: 'text-lime-600', 
            other: 'text-fuchsia-600'
        };
        return colors[category] || 'text-gray-600';
    };

    const totalHeight = timelineYears.length * monthHeight * 12;

    // 실제 렌더링된 요소들의 위치를 계산해서 연결선 생성
    useEffect(() => {
        const calculateConnections = () => {
            if (!containerRef.current) return;
            
            const newConnections: typeof connections = [];
            const container = containerRef.current;
            const containerRect = container.getBoundingClientRect();
            
            // 모든 경력 요소 찾기
            const experienceElements = container.querySelectorAll('[data-type="experience"]');
            const projectElements = container.querySelectorAll('[data-type="project"]');
            
            experienceElements.forEach((expEl) => {
                const expYear = expEl.getAttribute('data-year');
                const expIndex = expEl.getAttribute('data-index');
                const expRect = expEl.getBoundingClientRect();
                const expCenterY = expRect.top + expRect.height / 2 - containerRect.top;
                const expRightX = expRect.right - containerRect.left;
                
                // 같은 연도의 프로젝트들과 연결 확인
                projectElements.forEach((projEl) => {
                    const projYear = projEl.getAttribute('data-year');
                    const projIndex = projEl.getAttribute('data-index');
                    
                    if (expYear === projYear) {
                        // 실제 시기 겹침 확인 로직은 나중에... 일단 같은 연도면 연결
                        const projRect = projEl.getBoundingClientRect();
                        const projCenterY = projRect.top + projRect.height / 2 - containerRect.top;
                        const projLeftX = projRect.left - containerRect.left;
                        
                        newConnections.push({
                            id: `exp-${expYear}-${expIndex}-proj-${projIndex}`,
                            fromX: expRightX + 8, // 바 밖으로 8px 더 나가기
                            fromY: projCenterY,   // 프로젝트 Y 위치에 맞춤
                            toX: projLeftX - 8,   // 프로젝트 바 앞에서 8px 떨어져서 끝나기
                            toY: projCenterY,
                            color: '#dc2626'
                        });
                    }
                });
            });
            
            setConnections(newConnections);
        };
        
        // DOM 업데이트 후 계산
        const timer = setTimeout(calculateConnections, 100);
        return () => clearTimeout(timer);
    }, [timelineYears]);

    // Intersection Observer로 경력과 프로젝트가 뷰포트를 지날 때 스킬 추가
    useEffect(() => {
        const skillElements = document.querySelectorAll('[data-related-skills]');
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const skillsData = entry.target.getAttribute('data-related-skills');
                        if (skillsData) {
                            const skills: SkillTag[] = JSON.parse(skillsData);
                            
                            setStackedSkills(prev => {
                                const newStacked = { ...prev };
                                
                                skills.forEach(skill => {
                                    const categorySkills = newStacked[skill.category];
                                    if (!categorySkills.some(s => s.name === skill.name)) {
                                        categorySkills.push(skill);
                                    }
                                });
                                
                                console.log('Added skills:', skills, 'New state:', newStacked);
                                return newStacked;
                            });
                        }
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: '-10% 0px -10% 0px'
            }
        );

        skillElements.forEach(el => observer.observe(el));

        return () => {
            skillElements.forEach(el => observer.unobserve(el));
        };
    }, []);

    return (
        <motion.section 
            className="mb-12"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
        >
            {/* Column Headers */}
            <div className="flex gap-4 mb-6 sticky top-0 bg-[#F8F8F8] z-20 pb-4">
                <div className="w-20"></div>
                <div className="w-12"></div>
                <div className="flex gap-4">
                    <div className="text-sm font-semibold text-gray-700" style={{ width: `${columnWidth}px` }}>
                        EXPERIENCE & EDUCATION
                    </div>
                    <div className="text-sm font-semibold text-gray-700" style={{ width: `${columnWidth}px` }}>
                        PROJECTS
                    </div>
                    <div className="text-sm font-semibold text-gray-700" style={{ width: `${columnWidth}px` }}>
                        SKILLS
                    </div>
                </div>
            </div>


            <div className="flex gap-4">
                {/* Timeline Container */}
                <div className="flex gap-4">
                    {/* Year and Month Labels */}
                    <div className="flex">
                        {/* Year Labels - Sticky */}
                        <div className="w-20 relative">
                            {timelineYears.map((yearData, yearIndex) => (
                                <div
                                    key={yearData.year}
                                    className="sticky bg-[#F8F8F8] border border-gray-200 rounded shadow-sm"
                                    style={{ 
                                        top: '100px',
                                        height: '40px',
                                        marginBottom: `${monthHeight * 12 - 40}px`
                                    }}
                                >
                                    <div className="text-2xl font-bold text-gray-900 flex items-center justify-center h-full">
                                        {yearData.year}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Month Labels */}
                        <div className="w-12">
                            {timelineYears.map((_, yearIndex) => (
                                <div key={yearIndex}>
                                    {[...Array(12)].map((_, month) => (
                                        <div 
                                            key={`${yearIndex}-${month}`} 
                                            className="text-sm text-gray-500 font-medium text-center border-b border-gray-50"
                                            style={{ height: `${monthHeight}px`, lineHeight: `${monthHeight}px` }}
                                        >
                                            {month + 1}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline Grid */}
                    <div className="flex gap-8 relative" ref={containerRef}>
                        {/* 계산된 연결선들을 동그라미 + 선으로 렌더링 */}
                        <svg 
                            className="absolute inset-0 pointer-events-none z-10"
                            style={{ width: '100%', height: '100%' }}
                        >
                            {connections.map((conn) => (
                                <g key={conn.id}>
                                    {/* 시작점 동그라미 */}
                                    <circle
                                        cx={conn.fromX}
                                        cy={conn.fromY}
                                        r="6"
                                        fill={conn.color}
                                        stroke="white"
                                        strokeWidth="2"
                                    />
                                    {/* 연결선 */}
                                    <line
                                        x1={conn.fromX + 6}
                                        y1={conn.fromY}
                                        x2={conn.toX - 6}
                                        y2={conn.toY}
                                        stroke={conn.color}
                                        strokeWidth="3"
                                    />
                                    {/* 끝점 화살표 */}
                                    <polygon
                                        points={`${conn.toX-6},${conn.toY-4} ${conn.toX-6},${conn.toY+4} ${conn.toX+2},${conn.toY}`}
                                        fill={conn.color}
                                    />
                                </g>
                            ))}
                        </svg>
                        {/* Experience Column */}
                        <div className="relative" style={{ width: `${columnWidth}px`, height: `${totalHeight}px` }}>
                            <div className="absolute inset-0">
                                {timelineYears.map((_, yearIndex) => (
                                    <div key={yearIndex}>
                                        {[...Array(12)].map((_, idx) => (
                                            <div 
                                                key={`${yearIndex}-${idx}`}
                                                className={`border-b ${yearIndex > 0 && idx === 0 ? 'border-gray-300' : 'border-gray-50'}`}
                                                style={{ 
                                                    position: 'absolute',
                                                    top: `${yearIndex * monthHeight * 12 + idx * monthHeight}px`,
                                                    width: '100%',
                                                    height: `${monthHeight}px` 
                                                }}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                            {timelineYears.map((yearData, yearIndex) => {
                                let experienceGlobalIndex = 0;
                                // 이전 연도들의 경력 항목 수를 계산
                                for (let i = 0; i < yearIndex; i++) {
                                    experienceGlobalIndex += timelineYears[i].events.experience.length;
                                }
                                
                                return yearData.events.experience.map((event, idx) => (
                                    <motion.div
                                        key={`${yearData.year}-${idx}`}
                                        className="absolute w-full px-2 group"
                                        style={getExperienceBarStyle(yearData.year, event.startMonth, event.endMonth, yearIndex, experienceGlobalIndex + idx)}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + yearIndex * 0.2, duration: 0.8, ease: "easeOut" }}
                                        data-related-skills={event.relatedSkills ? JSON.stringify(event.relatedSkills) : undefined}
                                    >
                                        
                                        <div 
                                            className={`h-full ${getEventColor(event.type)} relative border-l-4 shadow-sm`}
                                            data-type="experience"
                                            data-year={yearData.year}
                                            data-index={idx}
                                        >
                                            <div className="sticky top-20 p-3 z-10">
                                                <div className={`text-sm font-semibold ${getEventPointColor(event.type)}`}>• {event.title}</div>
                                                {event.subtitle && (
                                                    <div className="text-xs text-gray-600 mt-1">{event.subtitle}</div>
                                                )}
                                                {event.description && (
                                                    <div className="text-xs text-gray-500 mt-1 leading-relaxed">{event.description}</div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            })}
                        </div>

                        {/* Projects Column */}
                        <div className="relative" style={{ width: `${columnWidth}px`, height: `${totalHeight}px` }}>
                            <div className="absolute inset-0">
                                {timelineYears.map((_, yearIndex) => (
                                    <div key={yearIndex}>
                                        {[...Array(12)].map((_, idx) => (
                                            <div 
                                                key={`${yearIndex}-${idx}`}
                                                className={`border-b ${yearIndex > 0 && idx === 0 ? 'border-gray-300' : 'border-gray-50'}`}
                                                style={{ 
                                                    position: 'absolute',
                                                    top: `${yearIndex * monthHeight * 12 + idx * monthHeight}px`,
                                                    width: '100%',
                                                    height: `${monthHeight}px` 
                                                }}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                            {timelineYears.map((yearData, yearIndex) => (
                                yearData.events.projects.map((event, idx) => (
                                    <motion.div
                                        key={`${yearData.year}-${idx}`}
                                        className="absolute w-full px-2 group"
                                        style={getProjectBarStyle(yearData.year, event.startMonth, event.endMonth, yearIndex, idx)}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + yearIndex * 0.2, duration: 0.8, ease: "easeOut" }}
                                        data-related-skills={event.relatedSkills ? JSON.stringify(event.relatedSkills) : undefined}
                                    >
                                        
                                        <div 
                                            className={`h-full ${getEventColor(event.type)} relative border-l-4 shadow-sm`}
                                            data-type="project"
                                            data-year={yearData.year}
                                            data-index={idx}
                                        >
                                            <div className="sticky top-20 p-3 z-10">
                                                <div className={`text-sm font-semibold ${getEventPointColor(event.type)}`}>• {event.title}</div>
                                                {event.description && (
                                                    <div className="text-xs text-gray-500 mt-1 leading-relaxed">{event.description}</div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ))}
                        </div>

                        {/* Skills Column */}
                        <div className="relative" style={{ width: `${columnWidth}px`, height: `${totalHeight}px` }}>
                            <div className="absolute inset-0">
                                {timelineYears.map((_, yearIndex) => (
                                    <div key={yearIndex}>
                                        {[...Array(12)].map((_, idx) => (
                                            <div 
                                                key={`${yearIndex}-${idx}`}
                                                className={`border-b ${yearIndex > 0 && idx === 0 ? 'border-gray-300' : 'border-gray-50'}`}
                                                style={{ 
                                                    position: 'absolute',
                                                    top: `${yearIndex * monthHeight * 12 + idx * monthHeight}px`,
                                                    width: '100%',
                                                    height: `${monthHeight}px` 
                                                }}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>


                            {/* Original Project Skills at their timeline positions */}
                            {timelineYears.map((yearData, yearIndex) => (
                                yearData.events.projects.map((project, projectIdx) => (
                                    project.relatedSkills?.map((skill, skillIdx) => (
                                        <motion.div
                                            key={`${yearData.year}-${projectIdx}-skill-${skillIdx}`}
                                            className="absolute px-2"
                                            style={{
                                                top: `${yearIndex * monthHeight * 12 + (project.startMonth - 1) * monthHeight + skillIdx * 25}px`,
                                                width: `${columnWidth}px`,
                                                height: '20px',
                                            }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.7 + yearIndex * 0.2, duration: 0.6 }}
                                        >
                                            <div className={`h-full ${getSkillColor(skill.category)} px-2 flex items-center shadow-sm border`}>
                                                <div className={`w-2 h-2 rounded-full ${getSkillPointColor(skill.category)} mr-2`}></div>
                                                <span className="text-xs font-medium text-gray-700">{skill.name}</span>
                                            </div>
                                        </motion.div>
                                    ))
                                ))
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sticky Skills Display */}
                <div className="fixed top-20 right-8 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs z-30">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Accumulated Skills</h3>
                    
                    {(['frontend', 'backend', 'other'] as const).map(category => (
                        stackedSkills[category].length > 0 && (
                            <div key={category} className="mb-3">
                                <div className={`text-xs font-medium mb-2 ${getSkillPointColor(category)}`}>
                                    {category.toUpperCase()}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {stackedSkills[category].map((skill, idx) => (
                                        <motion.span
                                            key={skill.name}
                                            className={`text-xs px-2 py-1 rounded ${getSkillColor(category)} border`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.1, duration: 0.4 }}
                                        >
                                            {skill.name}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                    
                    {Object.values(stackedSkills).every(arr => arr.length === 0) && (
                        <p className="text-xs text-gray-500 italic">Scroll to see skills appear</p>
                    )}
                </div>

            </div>

            {/* Legend */}
            <div className="mt-12 flex flex-wrap gap-6 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-3 bg-red-600 border border-red-500"></div>
                    <span className="font-medium">Experience</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-3 bg-violet-600 border border-violet-500"></div>
                    <span className="font-medium">Education</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-3 bg-emerald-600 border border-emerald-500"></div>
                    <span className="font-medium">Projects</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-3 bg-cyan-500 border border-cyan-400"></div>
                    <span className="font-medium">Frontend Skills</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-3 bg-lime-500 border border-lime-400"></div>
                    <span className="font-medium">Backend Skills</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-3 bg-fuchsia-500 border border-fuchsia-400"></div>
                    <span className="font-medium">Other Skills</span>
                </div>
            </div>
        </motion.section>
    )
}