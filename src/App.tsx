import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Calendar, Grid3x3, Image } from 'lucide-react'
import { CategoryView } from './components/CategoryView'
import { TimelineView } from './components/TimelineView'
import { GalleryView } from './components/GalleryView'
import { fadeInUp, staggerContainer } from './styles/framerMotion'

function App() {
    const [viewMode, setViewMode] = useState<'category' | 'timeline' | 'gallery'>('category')

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
                        <motion.div
                            className="flex gap-2 mt-4"
                            variants={fadeInUp}
                        >
                            <motion.button
                                onClick={() => setViewMode('category')}
                                className={`flex items-center gap-2 px-4 py-2 transition-all ${
                                    viewMode === 'category'
                                        ? 'bg-black text-white'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Grid3x3 size={16} />
                                <span className="text-sm font-medium">Category</span>
                            </motion.button>

                            <motion.button
                                onClick={() => setViewMode('timeline')}
                                className={`flex items-center gap-2 px-4 py-2 transition-all ${
                                    viewMode === 'timeline'
                                        ? 'bg-black text-white'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Calendar size={16} />
                                <span className="text-sm font-medium">Timeline</span>
                            </motion.button>

                            <motion.button
                                onClick={() => setViewMode('gallery')}
                                className={`flex items-center gap-2 px-4 py-2 transition-all ${
                                    viewMode === 'gallery'
                                        ? 'bg-black text-white'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Image size={16} />
                                <span className="text-sm font-medium">Gallery</span>
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.header>

                {/* Content based on view mode */}
                <AnimatePresence mode="wait">
                    {viewMode === 'category' ? (
                        <motion.div
                            key="category"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CategoryView />
                        </motion.div>
                    ) : viewMode === 'timeline' ? (
                        <motion.div
                            key="timeline"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <TimelineView />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="gallery"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <GalleryView />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Contact */}
                <motion.footer className="pt-8 border-t border-gray-200" variants={fadeInUp}>
                    <motion.div className="flex flex-col md:flex-row gap-6 text-sm text-gray-600" variants={fadeInUp}>
                        <motion.a
                            href="mailto:kim@example.com"
                            className="hover:text-black transition-colors"
                            whileHover={{ x: 2 }}
                        >
                            kim@example.com
                        </motion.a>
                        <motion.a
                            href="https://github.com/kimym"
                            className="hover:text-black transition-colors"
                            whileHover={{ x: 2 }}
                        >
                            github.com/kimym
                        </motion.a>
                        <motion.a
                            href="https://linkedin.com/in/kimym"
                            className="hover:text-black transition-colors"
                            whileHover={{ x: 2 }}
                        >
                            linkedin.com/in/kimym
                        </motion.a>
                    </motion.div>
                </motion.footer>
            </motion.div>
        </div>
    );
}

export default App;