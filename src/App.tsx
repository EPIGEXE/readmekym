import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Layout } from './components/Layout'

// Lazy load pages for code splitting
const CategoryPage = lazy(() => import('./pages/CategoryPage').then(m => ({ default: m.CategoryPage })))
const TimelinePage = lazy(() => import('./pages/TimelinePage').then(m => ({ default: m.TimelinePage })))
const GalleryPage = lazy(() => import('./pages/GalleryPage').then(m => ({ default: m.GalleryPage })))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })))
const ExperienceDetailPage = lazy(() => import('./pages/ExperienceDetailPage').then(m => ({ default: m.ExperienceDetailPage })))

// Loading fallback component
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
)

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<CategoryPage />} />
                        <Route path="timeline" element={<TimelinePage />} />
                        <Route path="gallery" element={<GalleryPage />} />
                    </Route>
                    {/* Detail pages without Layout */}
                    <Route path="/project/:id" element={<ProjectDetailPage />} />
                    <Route path="/experience/:id" element={<ExperienceDetailPage />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default App;