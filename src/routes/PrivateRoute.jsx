import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PrivateRoute({ children, allowedRoles }) {
    const { user, isLoggedIn } = useSelector((state) => state.auth)
    if (!isLoggedIn) {
        return <Navigate to="/user/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    return children
}

export default PrivateRoute
