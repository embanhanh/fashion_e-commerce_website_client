import Auth from '../pages/Auth/Auth.jsx'
import Home from '../pages/Home/Home.jsx'
import { Fragment } from 'react'

const publicRoutes = [
    { path: '/', element: Home },
    { path: '/user/login', element: Auth, layout: Fragment },
    { path: '/user/signup', element: Auth, layout: Fragment },
]
const privateRoutes = []

export { publicRoutes, privateRoutes }
