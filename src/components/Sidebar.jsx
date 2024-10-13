import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FaUser, FaBagShopping, FaRegHeart, FaLocationDot, FaCreditCard, FaRegBell, FaGear, FaCircleUser } from 'react-icons/fa6'
import './Sidebar.scss'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUser } from '../redux/slices/userSlice'

function Sidebar() {
    const menuItem = [
        {
            path: '/user/account/profile',
            name: 'Thông tin cá nhân',
            icon: <FaCircleUser />,
        },
        {
            path: '/user/account/orders',
            name: 'Đơn hàng',
            icon: <FaBagShopping />,
        },
        {
            path: '/user/account/wishlists',
            name: 'Danh sách yêu thích',
            icon: <FaRegHeart />,
        },
        {
            path: '/user/account/addresses',
            name: 'Địa chỉ',
            icon: <FaLocationDot />,
        },
        {
            path: '/user/account/notifications',
            name: 'Thông báo',
            icon: <FaRegBell />,
        },
    ]
    const dispatch = useDispatch()

    // Lấy dữ liệu từ Redux store
    const { user, loading, error } = useSelector((state) => state.user)

    // Gọi fetchUser khi component được mount
    useEffect(() => {
        dispatch(fetchUser())
    }, [dispatch])

    // Hiển thị loading nếu đang tải dữ liệu
    if (loading) {
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    }

    // Hiển thị lỗi nếu có
    if (error) {
        return <div>Đã xảy ra lỗi: {error}</div>
    }

    return (
        <nav className="sidebar-nav mt-4">
            <div className="avartar-profile d-flex flex-row align-items-center bg-light p-3 border-bottom">
                <img
                    src={user?.urlImage || 'https://via.placeholder.com/80'} // Đường dẫn avatar từ Redux store hoặc ảnh mặc định
                    alt="User Avatar"
                    className="avatar-img rounded-circle mb-2 me-4"
                    style={{ width: '69px', height: '69px' }}
                />
                
                <div className="greeting-text">
                    <h5 className="m-0">Xin chào, </h5> 
                    <h2 className="mt-2">{user?.name || 'Người dùng'}</h2>
                </div>
            </div>
            <div className="d-flex flex-column bg-light d-inline-flex  h-100">
                <ul className="nav nav-pills flex-column mb-auto">
                    {menuItem.map((item, index) => (
                        <li key={index} className="nav-item">
                            <NavLink className={({ isActive }) => (isActive ? 'sidebar-nav-link active' : 'sidebar-nav-link')} to={item.path} end>
                                <span className="icon-container">{item.icon}</span>
                                <span className="d-block">{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}

export default Sidebar
