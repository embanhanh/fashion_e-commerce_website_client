import React, { useLayoutEffect, useState, useEffect, useMemo } from 'react'
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import './MainLayout.scss'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCart } from '../redux/slices/cartSlice'
import { logout } from '../redux/slices/authSlice'
import { fetchCategories } from '../redux/slices/categorySlice'
import defaultAvatar from '../assets/image/default/default-avatar.png'
import cartEmpty from '../assets/image/default/cart-empty.jpg'
import Header from './Header/Header'
import Footer from './Footer/Footer'
function Mainlayout({ children }) {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <>
            <Header location={location} />

            <div
                className="h-100 shop-body"
                style={{
                    backgroundColor: location.pathname.includes('/account') ? '#f5f5f5' : 'transparent',
                }}
            >
                {children}
            </div>
            <Footer />
        </>
    )
}

export default Mainlayout
