import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CategoryPage } from './pages/CategoryPage'
import { TimelinePage } from './pages/TimelinePage'
import { GalleryPage } from './pages/GalleryPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ExperienceDetailPage } from './pages/ExperienceDetailPage'

function App() {
    return (
        <BrowserRouter>
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
        </BrowserRouter>
    )
}

export default App;