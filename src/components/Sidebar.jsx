import React, { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { FaCircleUser, FaBagShopping, FaRegHeart, FaLocationDot, FaRegBell, FaTicket } from 'react-icons/fa6'
import './Sidebar.scss'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUser } from '../redux/slices/userSlice'

function Sidebar() {
    const userMenuItem = [
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
            path: '/user/account/vouchers',
            name: 'Vouchers',
            icon: <FaTicket />,
        },
        {
            path: '/user/account/notifications',
            name: 'Thông báo',
            icon: <FaRegBell />,
        },
    ]

    const adminMenuItem = [
        {
            path: '/user/account/profile',
            name: 'Thông tin cá nhân',
            icon: <FaCircleUser />,
        },
        {
            path: '/user/account/notifications',
            name: 'Thông báo',
            icon: <FaRegBell />,
        },
    ]

    const dispatch = useDispatch()
    const location = useLocation()

    // Lấy dữ liệu từ Redux store
    const { user, loading, error } = useSelector((state) => state.user)

    // Chỉ gọi fetchUser khi ở trang profile
    useEffect(() => {
        if (location.pathname === '/user/account/profile') {
            dispatch(fetchUser())
        }
    }, [dispatch, location.pathname])

    // Chọn menu item dựa trên role của user
    const menuItems = user?.role === 'admin' ? adminMenuItem : userMenuItem

    return (
        <nav className="sidebar-nav mt-4">
            <div className="d-flex flex-row align-items-center p-3 border-bottom text-start">
                <img
                    src={user?.urlImage || 'https://via.placeholder.com/80'}
                    alt="User Avatar"
                    className="avatar-img rounded-circle mb-2 me-4"
                    style={{ width: '50px', height: '50px' }}
                />

                <div className="fs-2 fw-medium">
                    <p className="">Xin chào, </p>
                    <p className="mt-2 fs-2">{user?.name || 'Người dùng'}</p>
                </div>
            </div>
            <div className="d-flex flex-column d-inline-flex">
                <ul className="nav nav-pills flex-column mb-auto">
                    {menuItems.map((item, index) => (
                        <li key={index} className="nav-item">
                            <NavLink
                                className={({ isActive }) =>
                                    isActive ? 'sidebar-nav-link active' : 'sidebar-nav-link'
                                }
                                to={item.path}
                                end
                            >
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
