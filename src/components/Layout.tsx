import { motion } from 'framer-motion'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { Calendar, Grid3x3, Image, Github, FileText } from 'lucide-react'
import { fadeInUp, staggerContainer } from '../styles/framerMotion'

export function Layout() {
    const location = useLocation()
    const isViewPage = ['/', '/timeline', '/gallery'].includes(location.pathname)

    return (
        <div className="min-h-screen bg-[#F8F8F8] text-black">
            <motion.div
                className="max-w-[1400px] mx-auto px-8 py-16"
                initial="initial"
                animate="animate"
                variants={staggerContainer}
            >
                {/* Header */}
                <motion.header className="mb-16" variants={fadeInUp}>
                    <div className="flex justify-between items-start">
                        <div>
                            <motion.p
                                className="text-sm font-light text-gray-600 mb-2"
                                variants={fadeInUp}
                            >
                                ENDLESS EXPLORATION • KIM YOUNGMIN • 1995.02.05
                            </motion.p>
                            <motion.h1
                                className="text-5xl font-bold tracking-tight font-cafe24-gowoonbam"
                                variants={fadeInUp}
                            >
                                README.KYM
                            </motion.h1>
                        </div>

                        {/* View Toggle Button */}
                        {isViewPage && (
                            <motion.div
                                className="flex gap-2 mt-4"
                                variants={fadeInUp}
                            >
                                <Link to="/">
                                    <motion.div
                                        className={`flex items-center gap-2 px-4 py-2 transition-all ${
                                            location.pathname === '/'
                                                ? 'bg-black text-white'
                                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                        }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Grid3x3 size={16} />
                                        <span className="text-sm font-medium">Category</span>
                                    </motion.div>
                                </Link>

                                <Link to="/timeline">
                                    <motion.div
                                        className={`flex items-center gap-2 px-4 py-2 transition-all ${
                                            location.pathname === '/timeline'
                                                ? 'bg-black text-white'
                                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                        }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Calendar size={16} />
                                        <span className="text-sm font-medium">Timeline</span>
                                    </motion.div>
                                </Link>

                                <Link to="/gallery">
                                    <motion.div
                                        className={`flex items-center gap-2 px-4 py-2 transition-all ${
                                            location.pathname === '/gallery'
                                                ? 'bg-black text-white'
                                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                        }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Image size={16} />
                                        <span className="text-sm font-medium">Gallery</span>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </motion.header>

                {/* Main Content */}
                <Outlet />

                {/* Contact */}
                <motion.footer className="pt-8 border-t border-gray-200" variants={fadeInUp}>
                    <motion.div className="flex flex-col md:flex-row gap-6 text-sm text-gray-600" variants={fadeInUp}>
                        <motion.a
                            href="https://github.com/EPIGEXE"
                            className="hover:text-black transition-colors flex items-center gap-2"
                            whileHover={{ x: 2 }}
                        >
                            <Github size={16} />
                            GitHub
                        </motion.a>
                        <motion.a
                            href="https://befitting-silica-24b.notion.site/ALL-in-One-97eb5e1df97b4782bd93725af829e629?pvs=74"
                            className="hover:text-black transition-colors flex items-center gap-2"
                            whileHover={{ x: 2 }}
                        >
                            <FileText size={16} />
                            Notion
                        </motion.a>
                        <p className="text-gray-600">kym950205@gmail.com</p>
                        <p className="text-gray-600">© 2025 Kim Youngmin. All rights reserved.</p>
                    </motion.div>
                </motion.footer>
            </motion.div>
        </div>
    )
}