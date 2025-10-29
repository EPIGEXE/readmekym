import { motion } from "framer-motion";
import { Outlet, Link } from "react-router-dom";
import { Calendar, Grid3x3, Image, Github, FileText } from "lucide-react";
import { fadeInUpCustom, staggerContainer } from "../styles/framerMotion";

export function Layout() {
    return (
        <div className="min-h-screen bg-[#F8F8F8] text-black">
            <motion.div
                className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-16"
                initial="initial"
                animate="animate"
                variants={staggerContainer}
            >
                {/* 헤더 */}
                <motion.header className="mb-16" variants={fadeInUpCustom}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                        <div>
                            <motion.p className="text-xs md:text-sm font-light text-gray-600 mb-2" variants={fadeInUpCustom}>
                                ENDLESS EXPLORATION • KIM YOUNGMIN • 1995.02.05
                            </motion.p>
                            <motion.h1
                                className="text-3xl md:text-5xl font-bold tracking-tight font-cafe24-gowoonbam"
                                variants={fadeInUpCustom}
                            >
                                README.KYM
                            </motion.h1>
                        </div>

                        {/* 페이지 토글 버튼 */}
                        <motion.div className="flex gap-2 w-full md:w-auto md:mt-4" variants={fadeInUpCustom}>
                            <Link to="/" className="flex-1 md:flex-none">
                                <motion.div
                                    className={`flex items-center justify-center gap-2 px-3 md:px-4 py-2 transition-all ${
                                        location.pathname === "/"
                                            ? "bg-black text-white"
                                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Grid3x3 size={16} />
                                    <span className="text-xs md:text-sm font-medium">Category</span>
                                </motion.div>
                            </Link>

                            <Link to="/timeline" className="flex-1 md:flex-none">
                                <motion.div
                                    className={`flex items-center justify-center gap-2 px-3 md:px-4 py-2 transition-all ${
                                        location.pathname === "/timeline"
                                            ? "bg-black text-white"
                                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Calendar size={16} />
                                    <span className="text-xs md:text-sm font-medium">Timeline</span>
                                </motion.div>
                            </Link>

                            <Link to="/gallery" className="flex-1 md:flex-none">
                                <motion.div
                                    className={`flex items-center justify-center gap-2 px-3 md:px-4 py-2 transition-all ${
                                        location.pathname === "/gallery"
                                            ? "bg-black text-white"
                                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Image size={16} />
                                    <span className="text-xs md:text-sm font-medium">Gallery</span>
                                </motion.div>
                            </Link>
                        </motion.div>
                    </div>
                </motion.header>

                {/* 메인 콘텐츠 */}
                <Outlet />

                {/* Footer */}
                <motion.footer className="pt-8 border-t border-gray-200" variants={fadeInUpCustom}>
                    <motion.div className="flex flex-col md:flex-row gap-6 text-sm text-gray-600" variants={fadeInUpCustom}>
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
    );
}
