import React, { useState } from 'react'
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import './MainLayout.scss'
import LogoShop from '../components/LogoShop'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons'
import { faSquareFacebook } from '@fortawesome/free-brands-svg-icons'

function Mainlayout({ children }) {
    const navigate = useNavigate()
    const location = useLocation()
    const navList = [
        {
            title: 'Trang chủ',
            to: '/',
        },
        {
            title: 'Cửa hàng',
            to: '/products',
            className: 'show_detail',
        },
        {
            title: 'Liên hệ',
            to: '/',
        },
        {
            title: 'Chính sách',
            to: '/',
        },
    ]

    const [navOption, setNavOption] = useState('Trang chủ')

    return (
        <>
            <div className={`header d-flex  ${location.pathname === '/' && 'position-fixed top-0 end-0 start-0 shadow'}`}>
                <div className="container d-flex align-items-center justify-content-between">
                    <div className="header-section h-100">
                        <LogoShop type={'dark'} />
                    </div>
                    <div className="header-section">
                        <div className="nav-wrapper">
                            {navList.map((nav) => (
                                <Link
                                    key={nav.title}
                                    to={nav.to}
                                    onClick={() => {
                                        setNavOption(nav.title)
                                    }}
                                    className={`nav-option ${navOption == nav.title ? 'checked' : ''} ${nav?.className}`}
                                >
                                    <p className="nav-title">{nav.title}</p>
                                </Link>
                            ))}
                            <div className="nav-shop-category z-3 max-md row rounded-4 px-4 pt-4 pb-5 shadow-lg ">
                                <div className=" col-md-4 col-lg-3 g-4 d-inline-flex flex-column  ">
                                    <Link className="fw-bold fs-4 p-2">Danh mục cha</Link>
                                    <Link className="fs-4 p-2">Danh mục con</Link>
                                </div>
                                <div className=" col-md-4 col-lg-3 g-4 d-inline-flex flex-column  ">
                                    <Link className="fw-bold fs-4 p-2">Danh mục cha</Link>
                                    <Link className="fs-4 p-2">Danh mục con</Link>
                                </div>
                                <div className=" col-md-4 col-lg-3 g-4 d-inline-flex flex-column  ">
                                    <Link className="fw-bold fs-4 p-2">Danh mục cha</Link>
                                    <Link className="fs-4 p-2">Danh mục con</Link>
                                </div>
                                <div className=" col-md-4 col-lg-3 g-4 d-inline-flex flex-column  ">
                                    <Link className="fw-bold fs-4 p-2">Danh mục cha</Link>
                                    <Link className="fs-4 p-2">Danh mục con</Link>
                                </div>
                                <div className=" col-md-4 col-lg-3 g-4 d-inline-flex flex-column  ">
                                    <Link className="fw-bold fs-4 p-2">Danh mục cha</Link>
                                    <Link className="fs-4 p-2">Danh mục con</Link>
                                </div>
                                <div className=" col-md-4 col-lg-3 g-4 d-inline-flex flex-column  ">
                                    <Link className="fw-bold fs-4 p-2">Danh mục cha</Link>
                                    <Link className="fs-4 p-2">Danh mục con</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="header-section d-flex">
                        {localStorage.getItem('token') != null ? (
                            <></>
                        ) : (
                            <div
                                className="primary-btn btn-sm"
                                onClick={() => {
                                    navigate('/user/login')
                                }}
                            >
                                <p>Đăng nhập</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
