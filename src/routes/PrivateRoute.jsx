import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Unauthorized from '../pages/Unauthorized/Unauthorized'
function PrivateRoute({ children, allowedRoles }) {
    const { user, isLoggedIn } = useSelector((state) => state.auth)
    if (!isLoggedIn) {
        return <Navigate to="/user/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Unauthorized />
    }

    return children
}

export default PrivateRoute
