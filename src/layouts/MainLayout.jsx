import React, { useLayoutEffect, useState, useEffect } from 'react'
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import './MainLayout.scss'
import LogoShop from '../components/LogoShop'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBagShopping, faEnvelope, faLocationDot, faPhone, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faSquareFacebook } from '@fortawesome/free-brands-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCart } from '../redux/slices/cartSlice'
import { logout } from '../redux/slices/authSlice'
import defaultAvatar from '../assets/image/default/default-avatar.png'

function Mainlayout({ children }) {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const { isLoggedIn, user } = useSelector((state) => state.auth)
    const { cart } = useSelector((state) => state.cart)
    const [navOption, setNavOption] = useState('Trang chủ')

    useEffect(() => {
        if (user) {
            console.log(user)
        }

        if (cart) {
            console.log(cart)
        }
    }, [cart, user])

    useLayoutEffect(() => {
        window.scrollTo(0, 0)
    }, [navigate])

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(fetchCart())
        }
    }, [isLoggedIn, dispatch])

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

    const handleLogout = async () => {
        await dispatch(logout())
        navigate('/user/login')
    }

    return (
        <>
            <div className={`header d-flex  ${location.pathname === '/' && 'position-fixed top-0 end-0 start-0 '} shadow`}>
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
                        {isLoggedIn ? (
                            <>
                                <div className="d-flex align-items-center">
                                    <div className="p-2 cart-container rounded-3 position-relative" onClick={() => navigate('/cart')}>
                                        <FontAwesomeIcon className="fs-2" icon={faBagShopping} />
                                        {cart && cart.items && cart.items.length > 0 && <span className="cart-count">{cart.items.length}</span>}
                                        <div className="cart-mini position-absolute shadow rounded-3 p-4">
                                            <div className="mb-3 cart-product-container">
                                                {cart &&
                                                    cart.items &&
                                                    cart.items.map((item, index) => (
                                                        <div key={index} className="d-flex align-items-center pb-4 mb-4 border-bottom">
                                                            <img src={item.variant.imageUrl || ''} className="me-4" alt="" width={50} height={50} />
                                                            <div className="w-100">
                                                                <p className="fs-4 fw-medium ellipsis">{item.variant.product?.name || ''}</p>
                                                                <p className="fw-medium">
                                                                    {item.quantity} x {item.variant.price || 0}đ
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="fs-4 fw-medium">{cart ? cart.items.length : 0} sản phẩm có trong giỏ hàng</p>
                                                <div className="primary-btn p-3 shadow-none" onClick={() => navigate('/cart')}>
                                                    <p>Xem giỏ hàng</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="user-actions-container position-relative d-flex align-items-center" style={{ minWidth: 200 }}>
                                        <img src={user.avatar || defaultAvatar} alt="" className="rounded-circle shadow mx-3" style={{ height: 32, width: 32 }} />
                                        <p className="fs-4 fw-medium me-5 ">{user.name || user.email.split('@')[0]}</p>
                                        <div className="position-absolute py-3 px-3 user-actions shadow rounded-3">
                                            <Link className="user-action fs-4 fw-medium py-3 px-2 border-bottom">Tài khoản của tôi</Link>
                                            <Link className="user-action fs-4 fw-medium py-3 px-2 border-bottom">Đơn mua</Link>
                                            <Link className="user-action fs-4 fw-medium py-3 px-2 border-bottom" to={'/seller'}>
                                                Quản lý cửa hàng
                                            </Link>
                                            <Link className="user-action fs-4 fw-medium py-3 px-2" onClick={() => handleLogout()}>
                                                <FontAwesomeIcon icon={faRightFromBracket} className="fs-3 me-2" /> Đăng xuất
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </>
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
