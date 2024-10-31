import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import PrivateRoute from './routes/PrivateRoute.jsx'
import './App.scss'
import { privateRoutes, publicRoutes } from './routes/index.js'

function App() {
    return (
        <>
            <Router>
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Layout = route.layout ? route.layout : MainLayout
                        const Page = route.element
                        return (
                            <Route
                                key={index}
                                element={
                                    <Layout>
                                        <Page key={route.path}></Page>
                                    </Layout>
                                }
                                path={route.path}
                            >
                                {route.children?.map((child, idx) => {
                                    const ChildLayout = child.layout ? child.layout : Layout
                                    const ChildPage = child.element

                                    return (
                                        <Route
                                            key={idx}
                                            path={child.path}
                                            element={
                                                <ChildLayout>
                                                    <ChildPage key={child.path} />
                                                </ChildLayout>
                                            }
                                        >
                                            {child.children?.map((subChild, subIdx) => {
                                                const SubChildLayout = subChild.layout ? subChild.layout : ChildLayout
                                                const SubChildPage = subChild.element

                                                return (
                                                    <Route
                                                        key={subIdx}
                                                        path={subChild.path}
                                                        element={
                                                            <SubChildLayout>
                                                                <SubChildPage key={subChild.path} />
                                                            </SubChildLayout>
                                                        }
                                                    />
                                                )
                                            })}
                                        </Route>
                                    )
                                })}
                            </Route>
                        )
                    })}
                    {privateRoutes.map((route, index) => {
                        const Layout = route.layout ? route.layout : MainLayout
                        const Page = route.element
                        return (
                            <Route
                                key={index}
                                element={
                                    <PrivateRoute allowedRoles={route.allowedRoles}>
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    </PrivateRoute>
                                }
                                path={route.path}
                            >
                                {route.children?.map((child, idx) => {
                                    const ChildLayout = child.layout ? child.layout : Layout
                                    const ChildPage = child.element

                                    return (
                                        <Route
                                            key={idx}
                                            path={child.path}
                                            element={
                                                <PrivateRoute allowedRoles={child.allowedRoles || route.allowedRoles}>
                                                    <ChildLayout>
                                                        <ChildPage />
                                                    </ChildLayout>
                                                </PrivateRoute>
                                            }
                                        />
                                    )
                                })}
                            </Route>
                        )
                    })}
                </Routes>
            </Router>
        </>
    )
}

export default App
