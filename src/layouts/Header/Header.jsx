import React, { useLayoutEffect, useState, useEffect, useMemo } from 'react'
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBagShopping, faBell, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { updateDoc } from 'firebase/firestore'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCart } from '../../redux/slices/cartSlice'
import { logout } from '../../redux/slices/authSlice'
import { fetchCategories } from '../../redux/slices/categorySlice'
import { fetchUser } from '../../redux/slices/userSlice'
import { getShopInfo } from '../../redux/slices/shopSlice'
import defaultAvatar from '../../assets/image/default/default-avatar.png'
import cartEmpty from '../../assets/image/default/cart-empty.jpg'
import { collection, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase.config'
import logoShop from '../../assets/image/logo/logo.png'

function Header({ location }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isLoggedIn, user } = useSelector((state) => state.auth)
    const { categories, status } = useSelector((state) => state.category)
    const { cart, status: cartStatus } = useSelector((state) => state.cart)
    const { shopInfo } = useSelector((state) => state.shop)
    const [navOption, setNavOption] = useState('Trang chủ')
    const [notifications, setNotifications] = useState([])
    const [isScrollPastHero, setIsScrollPastHero] = useState(false)
    const [isHeaderFixed, setIsHeaderFixed] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const heroSection = document.querySelector('.slideshow-background')
            if (heroSection) {
                const heroBottom = heroSection.offsetTop + heroSection.offsetHeight
                const scrollPosition = window.scrollY
                setIsScrollPastHero(scrollPosition > heroBottom - 100) // -100 để transition mượt hơn
                setIsHeaderFixed(scrollPosition >= heroBottom)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useLayoutEffect(() => {
        window.scrollTo(0, 0)
    }, [navigate])

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(fetchCart())
            dispatch(fetchUser())
        }
        dispatch(fetchCategories())
        dispatch(getShopInfo())
    }, [isLoggedIn, dispatch])

    useEffect(() => {
        if (user) {
            let docs
            if (user.role === 'admin') {
                docs = doc(db, 'notifications', 'admin')
            } else {
                docs = doc(db, 'notifications', user._id)
            }
            const unsubscribe = onSnapshot(docs, (doc) => {
                if (doc.exists()) {
                    const allNotifs = doc.data().notifications || []

                    const recentNotifs = Array.from(allNotifs).sort(
                        (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
                    )
                    setNotifications(recentNotifs)
                }
            })

            return () => unsubscribe()
        }
    }, [user])

    const handleReadNotification = async () => {
        try {
            const notificationRef = doc(db, 'notifications', user.role === 'admin' ? 'admin' : user._id)

            // Tìm các thông báo chưa đọc
            const unreadNotifications = notifications.filter((notif) => !notif.read)

            // Nếu không có thông báo nào chưa đọc thì return
            if (unreadNotifications.length === 0) return

            // Tạo mảng notifications mới, chỉ cập nhật những thông báo chưa đọc
            const updatedNotifications = notifications.map((notif) => {
                if (!notif.read) {
                    return { ...notif, read: true }
                }
                return notif
            })

            // Cập nhật vào Firestore
            await updateDoc(notificationRef, {
                notifications: updatedNotifications,
            })
        } catch (error) {
            console.error('Lỗi khi đánh dấu đã đọc:', error)
        }
    }

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
            to: '/products?page=1',
            className: 'show_detail',
        },
        {
            title: 'Liên hệ',
            to: '/',
        },
        {
            title: 'Chính sách',
            to: '/policy',
        },
    ]

    const handleLogout = async () => {
        await dispatch(logout())
        navigate('/user/login')
    }

    return (
        <>
            <div
                className={`header d-flex ${isScrollPastHero ? 'header-scrolled' : ''} 
            ${location.pathname === '/' && isHeaderFixed ? 'header-fixed' : ''} ${
                    location.pathname === '/' ? 'header-home' : ''
                } ${
                    location.pathname.includes('/seller') || location.pathname.includes('/products/')
                        ? 'header-fixed shadow'
                        : ''
                }`}
            >
                <div className="container d-flex align-items-center justify-content-between">
                    <div className="header-section h-100">
                        <Link to={'/'} className="d-flex h-100 align-items-center">
                            <img src={shopInfo?.logo} alt="" className="h-100" />
                        </Link>
                    </div>
                    {!location.pathname.includes('/seller') && (
                        <div className="header-section">
                            <div className="nav-wrapper">
                                {navList.map((nav) => (
                                    <Link
                                        key={nav.title}
                                        to={nav.to}
                                        onClick={() => {
                                            setNavOption(nav.title)
                                        }}
                                        className={`nav-option ${navOption == nav.title ? 'checked' : ''} ${
                                            nav?.className
                                        }`}
                                    >
                                        <p className="nav-title">{nav.title}</p>
                                    </Link>
                                ))}
                                {location.pathname !== '/products' && (
                                    <div className="nav-shop-category max-md row g-2 rounded-4 px-4 py-3 shadow-lg ">
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
                                                <div
                                                    key={category._id}
                                                    className=" col-md-4 col-lg-3 d-inline-flex flex-column  "
                                                >
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
                                )}
                            </div>
                        </div>
                    )}
                    <div className="header-section d-flex">
                        {isLoggedIn ? (
                            <>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 notification-container  rounded-3 position-relative">
                                        <FontAwesomeIcon
                                            className="fs-2"
                                            icon={faBell}
                                            onMouseEnter={() => handleReadNotification()}
                                        />
                                        {notifications.filter((notif) => !notif.read).length > 0 && (
                                            <span className="notification-count">
                                                {notifications.filter((notif) => !notif.read).length}
                                            </span>
                                        )}
                                        <div className="notification-mini position-absolute shadow rounded-4 p-4">
                                            <div className="mb-3 notification-item-container scrollbar-y">
                                                {notifications.length === 0 ? (
                                                    <p className="fs-4 text-center">Không có thông báo nào</p>
                                                ) : (
                                                    notifications.map((notif, index) => (
                                                        <div
                                                            key={index}
                                                            className="d-flex align-items-center py-3 px-2 border-bottom hover-icon"
                                                            style={{
                                                                cursor: 'pointer',
                                                                backgroundColor: notif.read ? 'transparent' : '#f0f0f0',
                                                            }}
                                                            onClick={() => {
                                                                navigate(notif.link)
                                                            }}
                                                        >
                                                            <img src={shopInfo?.logo} alt="" height={32} />
                                                            <p className="fs-4 ms-2">{notif.message}</p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                            {notifications.length > 0 && (
                                                <div className="d-flex w-100">
                                                    <button className="primary-btn mt-3 mx-auto fs-3 py-2">
                                                        Xem tất cả
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {user?.role !== 'admin' && (
                                        <div
                                            className="p-2 cart-container rounded-3 position-relative mx-3"
                                            onClick={() => navigate('/cart')}
                                        >
                                            <FontAwesomeIcon className="fs-2" icon={faBagShopping} />
                                            {cart && cart.items && cart.items.length > 0 && (
                                                <span className="cart-count">{cart.items.length}</span>
                                            )}
                                            <div className="cart-mini position-absolute shadow rounded-4 p-4">
                                                {cartStatus === 'loading' ? (
                                                    <section className="dots-container mt-4">
                                                        <div className="dot"></div>
                                                        <div className="dot"></div>
                                                        <div className="dot"></div>
                                                        <div className="dot"></div>
                                                        <div className="dot"></div>
                                                    </section>
                                                ) : (
                                                    <>
                                                        <div className="mb-3 cart-product-container scrollbar-y">
                                                            {cartStatus === 'succeeded' && cart.items.length === 0 ? (
                                                                <div className="d-flex justify-content-center align-items-center">
                                                                    <img
                                                                        src={cartEmpty}
                                                                        alt=""
                                                                        style={{
                                                                            width: 300,
                                                                            height: 300,
                                                                            objectFit: 'cover',
                                                                        }}
                                                                    />
                                                                </div>
                                                            ) : cartStatus === 'failed' ? (
                                                                <p className="fs-4 fw-medium">Không thể lấy giỏ hàng</p>
                                                            ) : (
                                                                cartStatus === 'succeeded' &&
                                                                cart.items.map((item, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="d-flex align-items-center pb-4 mb-4 border-bottom"
                                                                    >
                                                                        <img
                                                                            src={item.variant.product?.urlImage || ''}
                                                                            className="me-4"
                                                                            alt=""
                                                                            width={50}
                                                                            height={50}
                                                                        />
                                                                        <div className="w-100">
                                                                            <p className="fs-4 fw-medium ellipsis">
                                                                                {item.variant.product?.name || ''}
                                                                            </p>
                                                                            <p className="fw-medium">
                                                                                {item.quantity} x{' '}
                                                                                {item.variant.price || 0}đ
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                        {cartStatus === 'succeeded' && cart.items.length > 0 && (
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <p className="fs-4 fw-medium">
                                                                    {cart.items.length} sản phẩm có trong giỏ hàng
                                                                </p>
                                                                <div
                                                                    className="primary-btn fs-3 p-3 shadow-none"
                                                                    onClick={() => navigate('/cart')}
                                                                >
                                                                    Xem giỏ hàng
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <div
                                        className="user-actions-container position-relative d-flex align-items-center"
                                        style={{ minWidth: 200 }}
                                    >
                                        <img
                                            src={user?.urlImage || defaultAvatar}
                                            alt=""
                                            className="rounded-circle shadow mx-3"
                                            style={{ height: 32, width: 32 }}
                                        />
                                        <p className="fs-4 fw-bold me-5 ">{user?.name || user?.email.split('@')[0]}</p>
                                        <div className="position-absolute py-3 px-3 user-actions shadow rounded-3">
                                            <Link
                                                className="user-action fs-4 fw-medium py-3 px-2 border-bottom"
                                                to={'/user/account/profile'}
                                            >
                                                Tài khoản của tôi
                                            </Link>
                                            {user?.role !== 'admin' && (
                                                <Link className="user-action fs-4 fw-medium py-3 px-2 border-bottom">
                                                    Đơn mua
                                                </Link>
                                            )}
                                            {user?.role === 'admin' && (
                                                <Link
                                                    className="user-action fs-4 fw-medium py-3 px-2 border-bottom"
                                                    to={'/seller'}
                                                >
                                                    Quản lý cửa hàng
                                                </Link>
                                            )}
                                            <Link
                                                className="user-action fs-4 fw-medium py-3 px-2"
                                                onClick={() => handleLogout()}
                                            >
                                                <FontAwesomeIcon icon={faRightFromBracket} className="fs-3 me-2" /> Đăng
                                                xuất
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div
                                className="primary-btn btn-sm fw-bold"
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
