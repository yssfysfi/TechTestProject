import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router"
import Login from "./Pages/Login"
import Dashboard from "./Pages/Dashboard"
import Signup from './Pages/Signup'
function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("accessToken")
    );

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={<Login onLogin={() => setIsAuthenticated(true)} />}
                />
                <Route
                    path="/signup"
                    element={<Signup/>}
                />

                <Route
                    path="/dashboard"
                    element={
                        isAuthenticated ? (
                            <Dashboard />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    )
}

export default App
