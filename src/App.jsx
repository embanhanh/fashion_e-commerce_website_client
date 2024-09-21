// import React from 'react'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import MainLayout from './layouts/MainLayout.jsx'
// import PrivateRoute from './routes/PrivateRoute.jsx'
// import './App.css'
// import { privateRoutes, publicRoutes } from './routes/index.js'

// function App() {
//     return (
//         <>
//             <Router>
//                 <Routes>
//                     {publicRoutes.map((route, index) => {
//                         const Layout = route.layout ? route.layout : MainLayout
//                         const Page = route.element
//                         return (
//                             <Route
//                                 key={index}
//                                 element={
//                                     <Layout>
//                                         <Page></Page>
//                                     </Layout>
//                                 }
//                                 path={route.path}
//                             >
//                                 {route.children}
//                             </Route>
//                         )
//                     })}
//                     {privateRoutes.map((route, index) => {
//                         const Layout = route.layout ? route.layout : MainLayout
//                         const Page = route.element
//                         return (
//                             <Route
//                                 key={index}
//                                 element={
//                                     <PrivateRoute>
//                                         <Layout>
//                                             <Page />
//                                         </Layout>
//                                     </PrivateRoute>
//                                 }
//                                 path={route.path}
//                             />
//                         )
//                     })}
//                 </Routes>
//             </Router>
//         </>
//     )
// }

// export default App


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import PrivateRoute from './routes/PrivateRoute.jsx';
import { privateRoutes, publicRoutes } from './routes/index.js';

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                {publicRoutes.map((route, index) => {
                    const Layout = route.layout ? route.layout : MainLayout;
                    const Page = route.element;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        >
                            {/* Render route children if there are any */}
                            {route.children && route.children.map((child, childIndex) => (
                                <Route
                                    key={childIndex}
                                    path={child.path}
                                    element={<child.element/>}
                                />
                            ))}
                        </Route>
                    );
                })}

                {/* Private Routes */}
                {privateRoutes.map((route, index) => {
                    const Layout = route.layout ? route.layout : MainLayout;
                    const Page = route.element;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <PrivateRoute>
                                    <Layout>
                                        <Page />
                                    </Layout>
                                </PrivateRoute>
                            }
                        >
                            {/* Render route children if there are any */}
                            {route.children && route.children.map((child, childIndex) => (
                                <Route
                                    key={childIndex}
                                    path={child.path}
                                    element={<child.element/>}
                                />
                            ))}
                        </Route>
                    );
                })}
            </Routes>
        </Router>
    );
}

export default App;
