import Singin from '../pages/Auth/Signin.jsx'
import Home from '../pages/Home/Home.jsx'
import { Fragment } from 'react'

const publicRoutes = [
    { path: '/', element: Home },
    { path: '/user/login', element: Singin, layout: Fragment },
]
const privateRoutes = []

export { publicRoutes, privateRoutes }
