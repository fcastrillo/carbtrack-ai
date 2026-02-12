import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { HoyPage } from './pages/HoyPage'
import { BitacoraPage } from './pages/BitacoraPage'
import { LaboratorioPage } from './pages/LaboratorioPage'
import { CargaDatosPage } from './pages/CargaDatosPage'
import { PerfilPage } from './pages/PerfilPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0a0a] text-white pb-16">
        <div className="min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<HoyPage />} />
            <Route path="/bitacora" element={<BitacoraPage />} />
            <Route path="/laboratorio" element={<LaboratorioPage />} />
            <Route path="/carga-datos" element={<CargaDatosPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App
