import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Singin from './pages/Auth/Signin.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import Home from './pages/Home/Home.jsx'
import PrivateRoute from './routes/PrivateRoute.jsx'
import './App.css'

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Singin />}></Route>
                    <Route
                        element={
                            <PrivateRoute>
                                <MainLayout />
                            </PrivateRoute>
                        }
                    >
                        <Route path="/home" element={<Home />} />
                    </Route>
                </Routes>
            </Router>
        </>
    )
}

export default App
