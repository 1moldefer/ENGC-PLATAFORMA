import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from 'src/contexts/AuthContext'
import Login from 'src/pages/Login'
import SignUp from 'src/pages/SignUp'
import Dashboard from 'src/pages/Dashboard'
import Chamados from 'src/pages/Chamados'
import AppLayout from 'src/components/layout/Layout'

import POPs from 'src/pages/Pops'
import Inventario from 'src/pages/Inventario'

// Placeholder components
const OS = () => <div className="text-gray-500 p-8">Módulo de OS (Em construção)</div>
const Rondas = () => <div className="text-gray-500 p-8">Módulo de Rondas (Em construção)</div>

const ProtectedRoute = () => {
    const { session, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return session ? <AppLayout /> : <Navigate to="/login" />
}

export default function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Navigate to="/app" />} />
                        <Route path="/app" element={<Dashboard />} />
                        <Route path="/app/chamados" element={<Chamados />} />
                        <Route path="/app/os" element={<OS />} />
                        <Route path="/app/rondas" element={<Rondas />} />
                        <Route path="/app/equipamentos" element={<Inventario />} />
                        <Route path="/app/pops" element={<POPs />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </AuthProvider>
        </Router>
    )
}
