import React, { useLayoutEffect, useState, useEffect, useMemo } from 'react'
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import './MainLayout.scss'
import LogoShop from '../components/LogoShop'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBagShopping, faEnvelope, faLocationDot, faPhone, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faSquareFacebook } from '@fortawesome/free-brands-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCart } from '../redux/slices/cartSlice'
import { logout } from '../redux/slices/authSlice'
import { fetchCategories } from '../redux/slices/categorySlice'
import defaultAvatar from '../assets/image/default/default-avatar.png'
import cartEmpty from '../assets/image/default/cart-empty.jpg'
import Header from './Header/Header'

function Mainlayout({ children }) {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <>
            <Header location={location} />

            <div className="h-100 shop-body" style={{ marginTop: location.pathname == '/' ? 'var(--header-height)' : '0px' }}>
                {children}
            </div>
            <footer className=" bg-black text-white">
                <div className="d-flex container p-5 max-md">
                    <div className="w-25">
                        <div style={{ height: 80 }}>
                            <LogoShop />
                        </div>
                        <div className="d-flex p-3 align-items-center">
                            <FontAwesomeIcon className="me-4" size="xl" icon={faPhone} /> <p>(+84) 0123456789</p>
                        </div>
                        <div className="d-flex p-3 align-items-center">
                            <FontAwesomeIcon className="me-4" size="xl" icon={faEnvelope} /> <p>heartie@gmail.com</p>
                        </div>
                        <div className="d-flex p-3 align-items-center">
                            <FontAwesomeIcon className="me-4" size="xl" icon={faLocationDot} /> <p>VRC2+2MP, Phường Linh Trung, Thủ Đức, Hồ Chí Minh</p>
                        </div>
                    </div>
                    <div className="w-25 d-flex flex-column ms-2">
                        <p className="fw-bold fs-3">Thông tin</p>
                        <Link className="text-white p-2">Tài khoản cá nhân</Link>
                        <Link className="text-white p-2">Đăng nhập</Link>
                        <Link className="text-white p-2">Giỏ hàng</Link>
                        <Link className="text-white p-2">Sản phẩm</Link>
                        <Link className="text-white p-2">Về chúng tôi</Link>
                        <Link className="text-white p-2">FAQ</Link>
                    </div>
                    <div className="w-25 d-flex flex-column ms-2">
                        <p className="fw-bold fs-3">Dịch vụ</p>
                        <Link className="text-white p-2">Chính sách bảo mật</Link>
                        <Link className="text-white p-2">Điều khoản sử dụng</Link>
                        <Link className="text-white p-2">Chính sách đổi trả</Link>
                    </div>
                    <div className="w-25 d-flex flex-column ms-2">
                        <p className="fw-bold fs-3">Theo dõi chúng tôi</p>
                        <p className="ms-2 p-2">Kết nối với chúng tôi trên các nền tảng xã hội để cập nhật xu hướng thời trang mới nhất và nhận ưu đãi độc quyền</p>
                        <div className="flex">
                            <Link>
                                <FontAwesomeIcon color="#1877f2" size="2xl" icon={faSquareFacebook} />
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Mainlayout
