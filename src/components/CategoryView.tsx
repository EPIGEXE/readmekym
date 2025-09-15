import { motion } from 'framer-motion'

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
}

const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
}

export function CategoryView() {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            key="category-content"
        >
            {/* Experience Section */}
            <motion.section className="mb-12" variants={fadeInUp}>
                <h2 className="text-lg font-semibold mb-6 border-b border-gray-200 pb-2">
                    EXPERIENCE
                </h2>
                <motion.div className="space-y-6" variants={staggerContainer}>
                    <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={fadeInUp}>
                        <div className="text-sm text-gray-600">
                            2022 - Present
                        </div>
                        <div className="md:col-span-3">
                            <h3 className="font-medium mb-1">Frontend Developer</h3>
                            <p className="text-sm text-gray-600 mb-2">TechCorp Inc.</p>
                            <p className="text-sm leading-relaxed">
                                React 기반 웹 애플리케이션 개발 및 유지보수.
                                사용자 경험 개선을 통한 전환율 25% 향상.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={fadeInUp}>
                        <div className="text-sm text-gray-600">
                            2021 - 2022
                        </div>
                        <div className="md:col-span-3">
                            <h3 className="font-medium mb-1">Junior Developer</h3>
                            <p className="text-sm text-gray-600 mb-2">StartupLab</p>
                            <p className="text-sm leading-relaxed">
                                풀스택 개발 담당. Node.js와 React를 활용한
                                MVP 제품 개발 및 배포.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Projects Section */}
            <motion.section className="mb-12" variants={fadeInUp}>
                <h2 className="text-lg font-semibold mb-6 border-b border-gray-200 pb-2">
                    PROJECTS
                </h2>
                <motion.div className="space-y-6" variants={staggerContainer}>
                    <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={fadeInUp}>
                        <div className="text-sm text-gray-600">
                            2024
                        </div>
                        <div className="md:col-span-3">
                            <h3 className="font-medium mb-1">E-Commerce Platform</h3>
                            <p className="text-sm leading-relaxed mb-2">
                                Next.js, TypeScript, Tailwind CSS를 활용한
                                온라인 쇼핑몰 구축
                            </p>
                            <div className="flex gap-2 text-xs">
                                <span className="bg-gray-200 px-2 py-1 rounded">Next.js</span>
                                <span className="bg-gray-200 px-2 py-1 rounded">TypeScript</span>
                                <span className="bg-gray-200 px-2 py-1 rounded">Tailwind</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={fadeInUp}>
                        <div className="text-sm text-gray-600">
                            2023
                        </div>
                        <div className="md:col-span-3">
                            <h3 className="font-medium mb-1">Task Management App</h3>
                            <p className="text-sm leading-relaxed mb-2">
                                React Query와 Zustand를 활용한
                                팀 협업 툴 개발
                            </p>
                            <div className="flex gap-2 text-xs">
                                <span className="bg-gray-200 px-2 py-1 rounded">React</span>
                                <span className="bg-gray-200 px-2 py-1 rounded">React Query</span>
                                <span className="bg-gray-200 px-2 py-1 rounded">Zustand</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Skills Section */}
            <motion.section className="mb-12" variants={fadeInUp}>
                <h2 className="text-lg font-semibold mb-6 border-b border-gray-200 pb-2">
                    SKILLS
                </h2>
                <motion.div className="space-y-4" variants={staggerContainer}>
                    <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={fadeInUp}>
                        <div className="text-sm text-gray-600 font-medium">
                            Frontend
                        </div>
                        <div className="md:col-span-3">
                            <p className="text-sm">
                                React, Next.js, TypeScript, JavaScript, HTML5, CSS3,
                                Tailwind CSS, Styled Components, React Query, Zustand
                            </p>
                        </div>
                    </motion.div>

                    <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={fadeInUp}>
                        <div className="text-sm text-gray-600 font-medium">
                            Backend
                        </div>
                        <div className="md:col-span-3">
                            <p className="text-sm">
                                Node.js, Express.js, Python, Django, PostgreSQL, MongoDB
                            </p>
                        </div>
                    </motion.div>

                    <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={fadeInUp}>
                        <div className="text-sm text-gray-600 font-medium">
                            Tools & Others
                        </div>
                        <div className="md:col-span-3">
                            <p className="text-sm">
                                Git, Docker, AWS, Vercel, Figma, Linear, Notion
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Education Section */}
            <motion.section className="mb-12" variants={fadeInUp}>
                <h2 className="text-lg font-semibold mb-6 border-b border-gray-200 pb-2">
                    EDUCATION
                </h2>
                <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={fadeInUp}>
                    <div className="text-sm text-gray-600">
                        2013 - 2020
                    </div>
                    <div className="md:col-span-3">
                        <h3 className="font-medium mb-1">Computer Science</h3>
                        <p className="text-sm text-gray-600">University of Seoul</p>
                    </div>
                </motion.div>
            </motion.section>
        </motion.div>
    )
}