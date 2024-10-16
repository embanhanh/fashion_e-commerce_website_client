import React, { useLayoutEffect, useState, useEffect, useMemo } from 'react'
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBagShopping, faEnvelope, faLocationDot, faPhone, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faSquareFacebook } from '@fortawesome/free-brands-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCart } from '../../redux/slices/cartSlice'
import { logout } from '../../redux/slices/authSlice'
import { fetchCategories } from '../../redux/slices/categorySlice'
import { fetchUser } from '../../redux/slices/userSlice'
import LogoShop from '../../components/LogoShop'
import defaultAvatar from '../../assets/image/default/default-avatar.png'
import cartEmpty from '../../assets/image/default/cart-empty.jpg'

function Header({ location }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isLoggedIn } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.user)
    const { categories, status } = useSelector((state) => state.category)
    const { cart, error } = useSelector((state) => state.cart)
    const [navOption, setNavOption] = useState('Trang chủ')

    useLayoutEffect(() => {
        window.scrollTo(0, 0)
    }, [navigate])

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(fetchCart())
            dispatch(fetchUser())
        }
        dispatch(fetchCategories())
    }, [isLoggedIn, dispatch])

    const filteredCategories = useMemo(() => {
        return categories
            .filter((category) => !category.parentCategory)
            .map((parent) => ({
                ...parent,
                children: categories.filter((child) => child.parentCategory && child.parentCategory._id === parent._id),
            }))
    }, [categories])

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
                            <div className="nav-shop-category z-3 max-md row g-2 rounded-4 px-4 py-3 shadow-lg ">
                                {status === 'loading' ? (
                                    <div className="dots-container mt-4">
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                    </div>
                                ) : (
                                    filteredCategories.map((category) => (
                                        <div key={category._id} className=" col-md-4 col-lg-3 d-inline-flex flex-column  ">
                                            <Link className="fw-bold fs-4 p-1">{category.name}</Link>
                                            {category.children &&
                                                category.children.map((child) => (
                                                    <Link key={child._id} className="fs-4 p-1">
                                                        {child.name}
                                                    </Link>
                                                ))}
                                        </div>
                                    ))
                                )}
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
                                            {!cart ? (
                                                <section className="dots-container mt-4">
                                                    <div className="dot"></div>
                                                    <div className="dot"></div>
                                                    <div className="dot"></div>
                                                    <div className="dot"></div>
                                                    <div className="dot"></div>
                                                </section>
                                            ) : (
                                                <>
                                                    <div className="mb-3 cart-product-container">
                                                        {cart && cart.items && cart.items.length === 0 && (
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <img src={cartEmpty} alt="" style={{ width: 300, height: 300, objectFit: 'cover' }} />
                                                            </div>
                                                        )}

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
                                                    {cart && cart.items && cart.items.length > 0 && (
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <p className="fs-4 fw-medium">{cart ? cart.items.length : 0} sản phẩm có trong giỏ hàng</p>
                                                            <div className="primary-btn p-3 shadow-none" onClick={() => navigate('/cart')}>
                                                                <p>Xem giỏ hàng</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="user-actions-container position-relative d-flex align-items-center" style={{ minWidth: 200 }}>
                                        <img src={user?.urlImage || defaultAvatar} alt="" className="rounded-circle shadow mx-3" style={{ height: 32, width: 32 }} />
                                        <p className="fs-4 fw-medium me-5 ">{user?.name || user?.email.split('@')[0]}</p>
                                        <div className="position-absolute py-3 px-3 user-actions shadow rounded-3">
                                            <Link className="user-action fs-4 fw-medium py-3 px-2 border-bottom" to={'/user/account/profile'}>
                                                Tài khoản của tôi
                                            </Link>
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
        </>
    )
}

export default Header
