import React, { useEffect, useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import './Auth.scss'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import { signInWithPopup } from 'firebase/auth'
import { auth, fbProvider, ggProvider } from '../../firebase.config'
import brand1 from '../../assets/image/brand/brand-1.png'
import brand2 from '../../assets/image/brand/brand-2.png'
import Notification from '../../components/Notification'
import { useDispatch, useSelector } from 'react-redux'
import {
    loginWithFirebaseAction,
    registerUser,
    loginUser,
    checkEmailAction,
    verifyEmailAction,
    resetPasswordAction,
} from '../../redux/slices/authSlice'
import { getShopInfo } from '../../redux/slices/shopSlice'
import { validateEmail } from '../../utils/StringUtil'

function Auth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const mode =
        location.pathname == '/user/signup'
            ? 'signup'
            : location.pathname == '/user/forgot-password'
            ? 'forgot-password'
            : 'login'
    const { from } = location.state || { from: '/' }
    const { isLoggedIn, loading } = useSelector((state) => state.auth)
    const { shopInfo } = useSelector((state) => state.shop)

    useEffect(() => {
        if (!shopInfo) {
            dispatch(getShopInfo())
        }
    }, [shopInfo])

    useEffect(() => {
        setAuthError('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setError('')
        setError2('')
        setError3('')
        setShowPassword(false)
        setShowPassword2(false)
        setStep(1)
        setVerificationCode('')
        setCountdown(0)
    }, [mode])

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            navigate('/')
        }
    }, [navigate])

    const inputRefs = useRef([])
    const countdownRef = useRef(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [error2, setError2] = useState('')
    const [error3, setError3] = useState('')
    const [authError, setAuthError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [notication, setNotication] = useState('')
    const [verificationCode, setVerificationCode] = useState('')
    const [step, setStep] = useState(1)
    const [countdown, setCountdown] = useState(0)

    useEffect(() => {
        if (countdown > 0) {
            countdownRef.current = setInterval(() => {
                setCountdown((prev) => prev - 1)
            }, 1000)
        } else {
            clearInterval(countdownRef.current)
        }

        // Cleanup khi component unmount
        return () => {
            if (countdownRef.current) {
                clearInterval(countdownRef.current)
            }
        }
    }, [countdown])

    const handleLoginWithFb = async (e) => {
        setIsLoading(true)
        try {
            const result = await signInWithPopup(auth, fbProvider)
            if (result) {
                const user = result.user
                const idToken = await user.getIdToken()

                await dispatch(loginWithFirebaseAction({ token: idToken, provider: 'facebook' })).unwrap()
                Swal.fire({
                    title: 'Đăng nhập thành công',
                    text: 'Chúc bạn mua sắm vui vẻ',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => {
                    navigate(from)
                })
            }
        } catch (error) {
            const errorMessage = error.message
            setAuthError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLoginWithGg = async (e) => {
        try {
            const result = await signInWithPopup(auth, ggProvider)
            if (result) {
                const user = result.user
                const idToken = await user.getIdToken()

                await dispatch(loginWithFirebaseAction({ token: idToken, provider: 'google' })).unwrap()
                Swal.fire({
                    title: 'Đăng nhập thành công',
                    text: 'Chúc bạn mua sắm vui vẻ',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => {
                    navigate(from)
                })
            }
        } catch (error) {
            const errorMessage = error.message
            setAuthError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async () => {
        if (!validateEmail(email)) {
            setError('Email không hợp lệ')
            return
        }
        if (mode === 'signup') {
            if (confirmPassword !== password) {
                setError3('Mật khẩu nhập lại không trùng khớp')
            } else {
                setIsLoading(true)
                try {
                    if (step == 1) {
                        await dispatch(checkEmailAction({ email, mode })).unwrap()
                        setStep(2)
                        setCountdown(300)
                    } else {
                        await handleVerifyEmail()
                    }
                } catch (e) {
                    setAuthError(e.message)
                } finally {
                    setIsLoading(false)
                }
            }
        } else if (mode === 'login') {
            setIsLoading(true)
            try {
                await dispatch(loginUser({ email, password })).unwrap()
                Swal.fire({
                    title: 'Đăng nhập thành công',
                    text: 'Chúc bạn mua sắm vui vẻ',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => {
                    navigate(from)
                })
            } catch (e) {
                setAuthError(e.message)
            } finally {
                setIsLoading(false)
            }
        } else if (mode === 'forgot-password') {
            setIsLoading(true)
            try {
                if (step == 1) {
                    await dispatch(checkEmailAction({ email, mode })).unwrap()
                    setStep(2)
                    setCountdown(300)
                } else if (step == 2) {
                    await handleVerifyEmail()
                } else if (step == 3) {
                    if (confirmPassword !== password) {
                        setError3('Mật khẩu nhập lại không trùng khớp')
                    } else {
                        await dispatch(resetPasswordAction({ email, code: verificationCode, password })).unwrap()
                        Swal.fire({
                            title: 'Mật khẩu thay đổi thành công',
                            text: 'Bạn có thể đăng nhập bằng mật khẩu mới',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        }).then(() => {
                            navigate('/user/login')
                        })
                    }
                }
            } catch (e) {
                setAuthError(e.message)
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleVerifyEmail = async () => {
        try {
            if (verificationCode.length !== 6) {
                setAuthError('Vui lòng nhập đủ mã xác thực')
                return
            }

            await dispatch(
                verifyEmailAction({
                    email,
                    code: verificationCode,
                    password,
                    mode,
                })
            ).unwrap()

            if (mode == 'signup') {
                Swal.fire({
                    title: 'Đăng ký thành công',
                    text: 'Bạn sẽ quay trở lại trang "Đăng nhập"',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => {
                    navigate('/user/login')
                })
            } else if (mode == 'forgot-password') {
                setStep(3)
                setCountdown(0)
            }
        } catch (error) {
            setAuthError(error.message)
            // Thêm class error vào các input
            inputRefs.current.forEach((input) => {
                input.classList.add('error')
                setTimeout(() => input.classList.remove('error'), 500)
            })
        }
    }

    const handleVerificationCodeChange = (e, index) => {
        const value = e.target.value
        if (value.length <= 1 && /^[0-9]*$/.test(value)) {
            const newCode = verificationCode.split('')
            newCode[index] = value
            setVerificationCode(newCode.join(''))

            // Tự động focus vào ô tiếp theo
            if (value && index < 5) {
                inputRefs.current[index + 1].focus()
            }
        }
    }

    // Xử lý khi nhấn phím
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            // Focus vào ô trước đó khi xóa
            inputRefs.current[index - 1].focus()
        }
    }

    const handleResendCode = async () => {
        if (countdown > 0) return
        setVerificationCode('')
        try {
            await dispatch(checkEmail(email)).unwrap()
            setCountdown(300)
            if (inputRefs.current[0]) {
                inputRefs.current[0].focus()
            }
        } catch (error) {
            setAuthError(error.message)
        }
    }

    useEffect(() => {
        if (email) {
            setError('')
        }
        if (password) {
            setError2('')
        }
    }, [email, password])

    return (
        <>
            <div
                className="d-flex w-100 align-items-center flex-column justify-content-start h-100"
                style={{ minHeight: '100vh' }}
            >
                <div className="w-100 bg-white header shadow-sm h-100">
                    <div
                        className="container max-md d-flex justify-content-between align-items-center"
                        style={{ height: 84 }}
                    >
                        <Link to={'/'} className="h-100">
                            <img src={shopInfo?.logo} alt="logo" className="h-100" />
                        </Link>
                        <Link to={'/support'} style={{ cursor: 'pointer' }}>
                            Bạn cần giúp đỡ?
                        </Link>
                    </div>
                </div>
                <div className="auth-content w-100 d-flex align-items-center justify-content-center">
                    <div className="auth-water-drops">
                        {[...Array(12)].map((_, index) => (
                            <div key={`drop-${index + 1}`} className={`auth-drop-${index + 1}`} />
                        ))}
                    </div>
                    <div
                        className=" d-flex align-items-center"
                        style={{
                            width: '800px',
                            backgroundColor: '#fff',
                            height: '500px',
                            boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.3)',
                            zIndex: 100,
                        }}
                    >
                        <div className=" w-50 h-100">
                            <Swiper
                                style={{
                                    '--swiper-pagination-color': '#fff',
                                }}
                                pagination={{
                                    clickable: true,
                                }}
                                modules={[Autoplay, Pagination]}
                                className="mySwiper"
                                autoplay={{
                                    delay: 1500,
                                    disableOnInteraction: false,
                                }}
                                loop={true}
                            >
                                <SwiperSlide>
                                    <img
                                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                        src={brand1}
                                        loading="lazy"
                                    />
                                    <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img
                                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                        src={brand2}
                                        loading="lazy"
                                    />
                                    <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                                </SwiperSlide>
                            </Swiper>
                        </div>
                        <div className="auth-container">
                            <div className="mb-3">
                                <p style={{ fontSize: '2.4rem', fontWeight: '500' }}>
                                    {mode == 'login'
                                        ? 'Welcome 👋'
                                        : mode == 'forgot-password'
                                        ? 'Quên mật khẩu'
                                        : 'Đăng ký'}
                                </p>
                            </div>
                            {authError && (
                                <div className="error-container d-flex mb-4">
                                    <svg viewBox="0 0 16 16" height={16}>
                                        <path
                                            fill="none"
                                            stroke="#FF424F"
                                            d="M8 15A7 7 0 108 1a7 7 0 000 14z"
                                            clipRule="evenodd"
                                        ></path>
                                        <rect
                                            stroke="none"
                                            width="7"
                                            height="1.5"
                                            x="6.061"
                                            y="5"
                                            fill="#FF424F"
                                            rx=".75"
                                            transform="rotate(45 6.06 5)"
                                        ></rect>
                                        <rect
                                            stroke="none"
                                            width="7"
                                            height="1.5"
                                            fill="#FF424F"
                                            rx=".75"
                                            transform="scale(-1 1) rotate(45 -11.01 -9.51)"
                                        ></rect>
                                    </svg>
                                    <p className="ms-3">{authError}</p>
                                </div>
                            )}
                            <div className="login-content">
                                {mode == 'signup' ? (
                                    <>
                                        {step === 1 ? (
                                            <>
                                                <div
                                                    className={`input-form d-flex align-items-center ${
                                                        error ? 'valid' : ''
                                                    }`}
                                                >
                                                    <input
                                                        autoComplete="off"
                                                        type="email"
                                                        className="input-text w-100"
                                                        placeholder="Email"
                                                        value={email}
                                                        onFocus={() => {
                                                            setError('')
                                                            setAuthError('')
                                                        }}
                                                        onChange={(e) => {
                                                            setEmail(e.target.value)
                                                        }}
                                                        onBlur={(e) => {
                                                            if (e.target.value.trim() == '') {
                                                                setError('Vui lòng điền vào mục này')
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <p className="error-message" style={{ height: '1.6rem' }}>
                                                    {error}
                                                </p>

                                                <div
                                                    className={`input-form d-flex align-items-center ${
                                                        error2 ? 'valid' : ''
                                                    }`}
                                                >
                                                    <input
                                                        autoComplete="off"
                                                        type={showPassword ? 'text' : 'password'}
                                                        className="input-text w-100"
                                                        placeholder="Mật khẩu"
                                                        value={password}
                                                        onFocus={() => {
                                                            setError2('')
                                                            setAuthError('')
                                                        }}
                                                        onChange={(e) => {
                                                            setPassword(e.target.value)
                                                        }}
                                                        onBlur={(e) => {
                                                            if (e.target.value.trim() == '') {
                                                                setError2('Vui lòng điền vào mục này')
                                                            }
                                                        }}
                                                    />
                                                    <svg
                                                        fill="none"
                                                        viewBox={`0 0 20 ${showPassword ? '12' : '10'}`}
                                                        width={20}
                                                        onClick={() => {
                                                            setShowPassword((prevState) => !prevState)
                                                        }}
                                                        className="eyes-icon"
                                                    >
                                                        {showPassword ? (
                                                            <path
                                                                stroke="none"
                                                                fill="#000"
                                                                fillOpacity=".54"
                                                                fillRule="evenodd"
                                                                d="M19.975 5.823V5.81 5.8l-.002-.008v-.011a.078.078 0 01-.002-.011v-.002a.791.791 0 00-.208-.43 13.829 13.829 0 00-1.595-1.64c-1.013-.918-2.123-1.736-3.312-2.368-.89-.474-1.832-.867-2.811-1.093l-.057-.014a2.405 2.405 0 01-.086-.02L11.884.2l-.018-.003A9.049 9.049 0 0010.089 0H9.89a9.094 9.094 0 00-1.78.197L8.094.2l-.016.003-.021.005a1.844 1.844 0 01-.075.017l-.054.012c-.976.226-1.92.619-2.806 1.09-1.189.635-2.3 1.45-3.31 2.371a13.828 13.828 0 00-1.595 1.64.792.792 0 00-.208.43v.002c-.002.007-.002.015-.002.022l-.002.01V5.824l-.002.014a.109.109 0 000 .013L0 5.871a.206.206 0 00.001.055c0 .01 0 .018.002.027 0 .005 0 .009.003.013l.001.011v.007l.002.01.001.013v.002a.8.8 0 00.208.429c.054.067.11.132.165.197a13.9 13.9 0 001.31 1.331c1.043.966 2.194 1.822 3.428 2.48.974.52 2.013.942 3.09 1.154a.947.947 0 01.08.016h.003a8.864 8.864 0 001.596.16h.2a8.836 8.836 0 001.585-.158l.006-.001a.015.015 0 01.005-.001h.005l.076-.016c1.079-.212 2.118-.632 3.095-1.153 1.235-.66 2.386-1.515 3.43-2.48a14.133 14.133 0 001.474-1.531.792.792 0 00.208-.43v-.002c.003-.006.003-.015.003-.022v-.01l.002-.008c0-.004 0-.009.002-.013l.001-.012.001-.015.001-.019.002-.019a.07.07 0 01-.01-.036c0-.009 0-.018-.002-.027zm-6.362.888a3.823 3.823 0 01-1.436 2.12l-.01-.006a3.683 3.683 0 01-2.178.721 3.67 3.67 0 01-2.177-.721l-.009.006a3.823 3.823 0 01-1.437-2.12l.014-.01a3.881 3.881 0 01-.127-.974c0-2.105 1.673-3.814 3.738-3.816 2.065.002 3.739 1.711 3.739 3.816 0 .338-.047.662-.128.975l.011.009zM8.145 5.678a1.84 1.84 0 113.679 0 1.84 1.84 0 01-3.679 0z"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        ) : (
                                                            <path
                                                                stroke="none"
                                                                fill="#000"
                                                                fillOpacity=".54"
                                                                d="M19.834 1.15a.768.768 0 00-.142-1c-.322-.25-.75-.178-1 .143-.035.036-3.997 4.712-8.709 4.712-4.569 0-8.71-4.712-8.745-4.748a.724.724 0 00-1-.071.724.724 0 00-.07 1c.07.106.927 1.07 2.283 2.141L.631 5.219a.69.69 0 00.036 1c.071.142.25.213.428.213a.705.705 0 00.5-.214l1.963-2.034A13.91 13.91 0 006.806 5.86l-.75 2.535a.714.714 0 00.5.892h.214a.688.688 0 00.679-.535l.75-2.535a9.758 9.758 0 001.784.179c.607 0 1.213-.072 1.785-.179l.75 2.499c.07.321.392.535.677.535.072 0 .143 0 .179-.035a.714.714 0 00.5-.893l-.75-2.498a13.914 13.914 0 003.248-1.678L18.3 6.147a.705.705 0 00.5.214.705.705 0 00.499-.214.723.723 0 00.036-1l-1.82-1.891c1.463-1.071 2.32-2.106 2.32-2.106z"
                                                            ></path>
                                                        )}
                                                    </svg>
                                                </div>
                                                <p className="error-message" style={{ height: '1.6rem' }}>
                                                    {error2}
                                                </p>
                                                <div
                                                    className={`input-form d-flex align-items-center ${
                                                        error3 ? 'valid' : ''
                                                    }`}
                                                >
                                                    <input
                                                        autoComplete="off"
                                                        type={showPassword2 ? 'text' : 'password'}
                                                        className="input-text w-100"
                                                        placeholder="Nhập lại mật khẩu"
                                                        value={confirmPassword}
                                                        onFocus={() => {
                                                            setError3('')
                                                            setAuthError('')
                                                        }}
                                                        onChange={(e) => {
                                                            setConfirmPassword(e.target.value)
                                                        }}
                                                        onBlur={(e) => {
                                                            if (e.target.value.trim() == '') {
                                                                setError3('Vui lòng điền vào mục này')
                                                            }
                                                        }}
                                                    />
                                                    <svg
                                                        fill="none"
                                                        viewBox={`0 0 20 ${showPassword2 ? '12' : '10'}`}
                                                        width={20}
                                                        onClick={() => {
                                                            setShowPassword2((prevState) => !prevState)
                                                        }}
                                                        className="eyes-icon"
                                                    >
                                                        {showPassword2 ? (
                                                            <path
                                                                stroke="none"
                                                                fill="#000"
                                                                fillOpacity=".54"
                                                                fillRule="evenodd"
                                                                d="M19.975 5.823V5.81 5.8l-.002-.008v-.011a.078.078 0 01-.002-.011v-.002a.791.791 0 00-.208-.43 13.829 13.829 0 00-1.595-1.64c-1.013-.918-2.123-1.736-3.312-2.368-.89-.474-1.832-.867-2.811-1.093l-.057-.014a2.405 2.405 0 01-.086-.02L11.884.2l-.018-.003A9.049 9.049 0 0010.089 0H9.89a9.094 9.094 0 00-1.78.197L8.094.2l-.016.003-.021.005a1.844 1.844 0 01-.075.017l-.054.012c-.976.226-1.92.619-2.806 1.09-1.189.635-2.3 1.45-3.31 2.371a13.828 13.828 0 00-1.595 1.64.792.792 0 00-.208.43v.002c-.002.007-.002.015-.002.022l-.002.01V5.824l-.002.014a.109.109 0 000 .013L0 5.871a.206.206 0 00.001.055c0 .01 0 .018.002.027 0 .005 0 .009.003.013l.001.011v.007l.002.01.001.013v.002a.8.8 0 00.208.429c.054.067.11.132.165.197a13.9 13.9 0 001.31 1.331c1.043.966 2.194 1.822 3.428 2.48.974.52 2.013.942 3.09 1.154a.947.947 0 01.08.016h.003a8.864 8.864 0 001.596.16h.2a8.836 8.836 0 001.585-.158l.006-.001a.015.015 0 01.005-.001h.005l.076-.016c1.079-.212 2.118-.632 3.095-1.153 1.235-.66 2.386-1.515 3.43-2.48a14.133 14.133 0 001.474-1.531.792.792 0 00.208-.43v-.002c.003-.006.003-.015.003-.022v-.01l.002-.008c0-.004 0-.009.002-.013l.001-.012.001-.015.001-.019.002-.019a.07.07 0 01-.01-.036c0-.009 0-.018-.002-.027zm-6.362.888a3.823 3.823 0 01-1.436 2.12l-.01-.006a3.683 3.683 0 01-2.178.721 3.67 3.67 0 01-2.177-.721l-.009.006a3.823 3.823 0 01-1.437-2.12l.014-.01a3.881 3.881 0 01-.127-.974c0-2.105 1.673-3.814 3.738-3.816 2.065.002 3.739 1.711 3.739 3.816 0 .338-.047.662-.128.975l.011.009zM8.145 5.678a1.84 1.84 0 113.679 0 1.84 1.84 0 01-3.679 0z"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        ) : (
                                                            <path
                                                                stroke="none"
                                                                fill="#000"
                                                                fillOpacity=".54"
                                                                d="M19.834 1.15a.768.768 0 00-.142-1c-.322-.25-.75-.178-1 .143-.035.036-3.997 4.712-8.709 4.712-4.569 0-8.71-4.712-8.745-4.748a.724.724 0 00-1-.071.724.724 0 00-.07 1c.07.106.927 1.07 2.283 2.141L.631 5.219a.69.69 0 00.036 1c.071.142.25.213.428.213a.705.705 0 00.5-.214l1.963-2.034A13.91 13.91 0 006.806 5.86l-.75 2.535a.714.714 0 00.5.892h.214a.688.688 0 00.679-.535l.75-2.535a9.758 9.758 0 001.784.179c.607 0 1.213-.072 1.785-.179l.75 2.499c.07.321.392.535.677.535.072 0 .143 0 .179-.035a.714.714 0 00.5-.893l-.75-2.498a13.914 13.914 0 003.248-1.678L18.3 6.147a.705.705 0 00.5.214.705.705 0 00.499-.214.723.723 0 00.036-1l-1.82-1.891c1.463-1.071 2.32-2.106 2.32-2.106z"
                                                            ></path>
                                                        )}
                                                    </svg>
                                                </div>
                                                <p className="error-message" style={{ height: '1.6rem' }}>
                                                    {error3}
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="verification-container">
                                                    <div className="verification-code-inputs">
                                                        {Array(6)
                                                            .fill()
                                                            .map((_, index) => (
                                                                <input
                                                                    key={index}
                                                                    type="text"
                                                                    maxLength="1"
                                                                    className="verification-input"
                                                                    value={verificationCode[index] || ''}
                                                                    onChange={(e) =>
                                                                        handleVerificationCodeChange(e, index)
                                                                    }
                                                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                                                    ref={(el) => (inputRefs.current[index] = el)}
                                                                />
                                                            ))}
                                                    </div>

                                                    <div className="verification-actions">
                                                        {countdown > 0 ? (
                                                            <p className="countdown-text mb-3">
                                                                Gửi lại mã sau {Math.floor(countdown / 60)}:
                                                                {countdown % 60 < 10 ? '0' : ''}
                                                                {countdown % 60}
                                                            </p>
                                                        ) : (
                                                            <button
                                                                className="resend-button"
                                                                onClick={handleResendCode}
                                                            >
                                                                Gửi lại mã
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : mode === 'login' ? (
                                    <>
                                        <div className={`input-form d-flex align-items-center ${error ? 'valid' : ''}`}>
                                            <input
                                                autoComplete="off"
                                                type="email"
                                                className="input-text w-100"
                                                placeholder="Email"
                                                value={email}
                                                onFocus={() => {
                                                    setError('')
                                                    setAuthError('')
                                                }}
                                                onChange={(e) => {
                                                    setEmail(e.target.value)
                                                }}
                                                onBlur={(e) => {
                                                    if (e.target.value.trim() == '') {
                                                        setError('Vui lòng điền vào mục này')
                                                    }
                                                }}
                                            />
                                        </div>
                                        <p className="error-message" style={{ height: '1.6rem' }}>
                                            {error}
                                        </p>

                                        <div
                                            className={`input-form d-flex align-items-center ${error2 ? 'valid' : ''}`}
                                        >
                                            <input
                                                autoComplete="off"
                                                type={showPassword ? 'text' : 'password'}
                                                className="input-text w-100"
                                                placeholder="Mật khẩu"
                                                value={password}
                                                onFocus={() => {
                                                    setError2('')
                                                    setAuthError('')
                                                }}
                                                onChange={(e) => {
                                                    setPassword(e.target.value)
                                                }}
                                                onBlur={(e) => {
                                                    if (e.target.value.trim() == '') {
                                                        setError2('Vui lòng điền vào mục này')
                                                    }
                                                }}
                                            />
                                            <svg
                                                fill="none"
                                                viewBox={`0 0 20 ${showPassword ? '12' : '10'}`}
                                                width={20}
                                                onClick={() => {
                                                    setShowPassword((prevState) => !prevState)
                                                }}
                                                className="eyes-icon"
                                            >
                                                {showPassword ? (
                                                    <path
                                                        stroke="none"
                                                        fill="#000"
                                                        fillOpacity=".54"
                                                        fillRule="evenodd"
                                                        d="M19.975 5.823V5.81 5.8l-.002-.008v-.011a.078.078 0 01-.002-.011v-.002a.791.791 0 00-.208-.43 13.829 13.829 0 00-1.595-1.64c-1.013-.918-2.123-1.736-3.312-2.368-.89-.474-1.832-.867-2.811-1.093l-.057-.014a2.405 2.405 0 01-.086-.02L11.884.2l-.018-.003A9.049 9.049 0 0010.089 0H9.89a9.094 9.094 0 00-1.78.197L8.094.2l-.016.003-.021.005a1.844 1.844 0 01-.075.017l-.054.012c-.976.226-1.92.619-2.806 1.09-1.189.635-2.3 1.45-3.31 2.371a13.828 13.828 0 00-1.595 1.64.792.792 0 00-.208.43v.002c-.002.007-.002.015-.002.022l-.002.01V5.824l-.002.014a.109.109 0 000 .013L0 5.871a.206.206 0 00.001.055c0 .01 0 .018.002.027 0 .005 0 .009.003.013l.001.011v.007l.002.01.001.013v.002a.8.8 0 00.208.429c.054.067.11.132.165.197a13.9 13.9 0 001.31 1.331c1.043.966 2.194 1.822 3.428 2.48.974.52 2.013.942 3.09 1.154a.947.947 0 01.08.016h.003a8.864 8.864 0 001.596.16h.2a8.836 8.836 0 001.585-.158l.006-.001a.015.015 0 01.005-.001h.005l.076-.016c1.079-.212 2.118-.632 3.095-1.153 1.235-.66 2.386-1.515 3.43-2.48a14.133 14.133 0 001.474-1.531.792.792 0 00.208-.43v-.002c.003-.006.003-.015.003-.022v-.01l.002-.008c0-.004 0-.009.002-.013l.001-.012.001-.015.001-.019.002-.019a.07.07 0 01-.01-.036c0-.009 0-.018-.002-.027zm-6.362.888a3.823 3.823 0 01-1.436 2.12l-.01-.006a3.683 3.683 0 01-2.178.721 3.67 3.67 0 01-2.177-.721l-.009.006a3.823 3.823 0 01-1.437-2.12l.014-.01a3.881 3.881 0 01-.127-.974c0-2.105 1.673-3.814 3.738-3.816 2.065.002 3.739 1.711 3.739 3.816 0 .338-.047.662-.128.975l.011.009zM8.145 5.678a1.84 1.84 0 113.679 0 1.84 1.84 0 01-3.679 0z"
                                                        clipRule="evenodd"
                                                    ></path>
                                                ) : (
                                                    <path
                                                        stroke="none"
                                                        fill="#000"
                                                        fillOpacity=".54"
                                                        d="M19.834 1.15a.768.768 0 00-.142-1c-.322-.25-.75-.178-1 .143-.035.036-3.997 4.712-8.709 4.712-4.569 0-8.71-4.712-8.745-4.748a.724.724 0 00-1-.071.724.724 0 00-.07 1c.07.106.927 1.07 2.283 2.141L.631 5.219a.69.69 0 00.036 1c.071.142.25.213.428.213a.705.705 0 00.5-.214l1.963-2.034A13.91 13.91 0 006.806 5.86l-.75 2.535a.714.714 0 00.5.892h.214a.688.688 0 00.679-.535l.75-2.535a9.758 9.758 0 001.784.179c.607 0 1.213-.072 1.785-.179l.75 2.499c.07.321.392.535.677.535.072 0 .143 0 .179-.035a.714.714 0 00.5-.893l-.75-2.498a13.914 13.914 0 003.248-1.678L18.3 6.147a.705.705 0 00.5.214.705.705 0 00.499-.214.723.723 0 00.036-1l-1.82-1.891c1.463-1.071 2.32-2.106 2.32-2.106z"
                                                    ></path>
                                                )}
                                            </svg>
                                        </div>
                                        <p className="error-message" style={{ height: '1.6rem' }}>
                                            {error2}
                                        </p>
                                        <p
                                            className="mb-3 text-end text-fogot-password"
                                            onClick={() => navigate('/user/forgot-password')}
                                        >
                                            Quên mật khẩu?
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        {step == 1 ? (
                                            <>
                                                <div
                                                    className={`input-form d-flex mb-4 align-items-center ${
                                                        error ? 'valid' : ''
                                                    }`}
                                                >
                                                    <input
                                                        autoComplete="off"
                                                        type="email"
                                                        className="input-text w-100"
                                                        placeholder="Email"
                                                        value={email}
                                                        onFocus={() => {
                                                            setError('')
                                                            setAuthError('')
                                                        }}
                                                        onChange={(e) => {
                                                            setEmail(e.target.value)
                                                        }}
                                                        onBlur={(e) => {
                                                            if (e.target.value.trim() == '') {
                                                                setError('Vui lòng điền vào mục này')
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        ) : step == 2 ? (
                                            <>
                                                <div className="verification-container">
                                                    <div className="verification-code-inputs">
                                                        {Array(6)
                                                            .fill()
                                                            .map((_, index) => (
                                                                <input
                                                                    key={index}
                                                                    type="text"
                                                                    maxLength="1"
                                                                    className="verification-input"
                                                                    value={verificationCode[index] || ''}
                                                                    onChange={(e) =>
                                                                        handleVerificationCodeChange(e, index)
                                                                    }
                                                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                                                    ref={(el) => (inputRefs.current[index] = el)}
                                                                />
                                                            ))}
                                                    </div>

                                                    <div className="verification-actions">
                                                        {countdown > 0 ? (
                                                            <p className="countdown-text mb-3">
                                                                Gửi lại mã sau {Math.floor(countdown / 60)}:
                                                                {countdown % 60 < 10 ? '0' : ''}
                                                                {countdown % 60}
                                                            </p>
                                                        ) : (
                                                            <button
                                                                className="resend-button"
                                                                onClick={handleResendCode}
                                                            >
                                                                Gửi lại mã
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div
                                                    className={`input-form d-flex align-items-center ${
                                                        error2 ? 'valid' : ''
                                                    }`}
                                                >
                                                    <input
                                                        autoComplete="off"
                                                        type={showPassword ? 'text' : 'password'}
                                                        className="input-text w-100"
                                                        placeholder="Mật khẩu"
                                                        value={password}
                                                        onFocus={() => {
                                                            setError2('')
                                                            setAuthError('')
                                                        }}
                                                        onChange={(e) => {
                                                            setPassword(e.target.value)
                                                        }}
                                                        onBlur={(e) => {
                                                            if (e.target.value.trim() == '') {
                                                                setError2('Vui lòng điền vào mục này')
                                                            }
                                                        }}
                                                    />
                                                    <svg
                                                        fill="none"
                                                        viewBox={`0 0 20 ${showPassword ? '12' : '10'}`}
                                                        width={20}
                                                        onClick={() => {
                                                            setShowPassword((prevState) => !prevState)
                                                        }}
                                                        className="eyes-icon"
                                                    >
                                                        {showPassword ? (
                                                            <path
                                                                stroke="none"
                                                                fill="#000"
                                                                fillOpacity=".54"
                                                                fillRule="evenodd"
                                                                d="M19.975 5.823V5.81 5.8l-.002-.008v-.011a.078.078 0 01-.002-.011v-.002a.791.791 0 00-.208-.43 13.829 13.829 0 00-1.595-1.64c-1.013-.918-2.123-1.736-3.312-2.368-.89-.474-1.832-.867-2.811-1.093l-.057-.014a2.405 2.405 0 01-.086-.02L11.884.2l-.018-.003A9.049 9.049 0 0010.089 0H9.89a9.094 9.094 0 00-1.78.197L8.094.2l-.016.003-.021.005a1.844 1.844 0 01-.075.017l-.054.012c-.976.226-1.92.619-2.806 1.09-1.189.635-2.3 1.45-3.31 2.371a13.828 13.828 0 00-1.595 1.64.792.792 0 00-.208.43v.002c-.002.007-.002.015-.002.022l-.002.01V5.824l-.002.014a.109.109 0 000 .013L0 5.871a.206.206 0 00.001.055c0 .01 0 .018.002.027 0 .005 0 .009.003.013l.001.011v.007l.002.01.001.013v.002a.8.8 0 00.208.429c.054.067.11.132.165.197a13.9 13.9 0 001.31 1.331c1.043.966 2.194 1.822 3.428 2.48.974.52 2.013.942 3.09 1.154a.947.947 0 01.08.016h.003a8.864 8.864 0 001.596.16h.2a8.836 8.836 0 001.585-.158l.006-.001a.015.015 0 01.005-.001h.005l.076-.016c1.079-.212 2.118-.632 3.095-1.153 1.235-.66 2.386-1.515 3.43-2.48a14.133 14.133 0 001.474-1.531.792.792 0 00.208-.43v-.002c.003-.006.003-.015.003-.022v-.01l.002-.008c0-.004 0-.009.002-.013l.001-.012.001-.015.001-.019.002-.019a.07.07 0 01-.01-.036c0-.009 0-.018-.002-.027zm-6.362.888a3.823 3.823 0 01-1.436 2.12l-.01-.006a3.683 3.683 0 01-2.178.721 3.67 3.67 0 01-2.177-.721l-.009.006a3.823 3.823 0 01-1.437-2.12l.014-.01a3.881 3.881 0 01-.127-.974c0-2.105 1.673-3.814 3.738-3.816 2.065.002 3.739 1.711 3.739 3.816 0 .338-.047.662-.128.975l.011.009zM8.145 5.678a1.84 1.84 0 113.679 0 1.84 1.84 0 01-3.679 0z"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        ) : (
                                                            <path
                                                                stroke="none"
                                                                fill="#000"
                                                                fillOpacity=".54"
                                                                d="M19.834 1.15a.768.768 0 00-.142-1c-.322-.25-.75-.178-1 .143-.035.036-3.997 4.712-8.709 4.712-4.569 0-8.71-4.712-8.745-4.748a.724.724 0 00-1-.071.724.724 0 00-.07 1c.07.106.927 1.07 2.283 2.141L.631 5.219a.69.69 0 00.036 1c.071.142.25.213.428.213a.705.705 0 00.5-.214l1.963-2.034A13.91 13.91 0 006.806 5.86l-.75 2.535a.714.714 0 00.5.892h.214a.688.688 0 00.679-.535l.75-2.535a9.758 9.758 0 001.784.179c.607 0 1.213-.072 1.785-.179l.75 2.499c.07.321.392.535.677.535.072 0 .143 0 .179-.035a.714.714 0 00.5-.893l-.75-2.498a13.914 13.914 0 003.248-1.678L18.3 6.147a.705.705 0 00.5.214.705.705 0 00.499-.214.723.723 0 00.036-1l-1.82-1.891c1.463-1.071 2.32-2.106 2.32-2.106z"
                                                            ></path>
                                                        )}
                                                    </svg>
                                                </div>
                                                <p className="error-message" style={{ height: '1.6rem' }}>
                                                    {error2}
                                                </p>
                                                <div
                                                    className={`input-form d-flex align-items-center ${
                                                        error3 ? 'valid' : ''
                                                    }`}
                                                >
                                                    <input
                                                        autoComplete="off"
                                                        type={showPassword2 ? 'text' : 'password'}
                                                        className="input-text w-100"
                                                        placeholder="Nhập lại mật khẩu"
                                                        value={confirmPassword}
                                                        onFocus={() => {
                                                            setError3('')
                                                            setAuthError('')
                                                        }}
                                                        onChange={(e) => {
                                                            setConfirmPassword(e.target.value)
                                                        }}
                                                        onBlur={(e) => {
                                                            if (e.target.value.trim() == '') {
                                                                setError3('Vui lòng điền vào mục này')
                                                            }
                                                        }}
                                                    />
                                                    <svg
                                                        fill="none"
                                                        viewBox={`0 0 20 ${showPassword2 ? '12' : '10'}`}
                                                        width={20}
                                                        onClick={() => {
                                                            setShowPassword2((prevState) => !prevState)
                                                        }}
                                                        className="eyes-icon"
                                                    >
                                                        {showPassword2 ? (
                                                            <path
                                                                stroke="none"
                                                                fill="#000"
                                                                fillOpacity=".54"
                                                                fillRule="evenodd"
                                                                d="M19.975 5.823V5.81 5.8l-.002-.008v-.011a.078.078 0 01-.002-.011v-.002a.791.791 0 00-.208-.43 13.829 13.829 0 00-1.595-1.64c-1.013-.918-2.123-1.736-3.312-2.368-.89-.474-1.832-.867-2.811-1.093l-.057-.014a2.405 2.405 0 01-.086-.02L11.884.2l-.018-.003A9.049 9.049 0 0010.089 0H9.89a9.094 9.094 0 00-1.78.197L8.094.2l-.016.003-.021.005a1.844 1.844 0 01-.075.017l-.054.012c-.976.226-1.92.619-2.806 1.09-1.189.635-2.3 1.45-3.31 2.371a13.828 13.828 0 00-1.595 1.64.792.792 0 00-.208.43v.002c-.002.007-.002.015-.002.022l-.002.01V5.824l-.002.014a.109.109 0 000 .013L0 5.871a.206.206 0 00.001.055c0 .01 0 .018.002.027 0 .005 0 .009.003.013l.001.011v.007l.002.01.001.013v.002a.8.8 0 00.208.429c.054.067.11.132.165.197a13.9 13.9 0 001.31 1.331c1.043.966 2.194 1.822 3.428 2.48.974.52 2.013.942 3.09 1.154a.947.947 0 01.08.016h.003a8.864 8.864 0 001.596.16h.2a8.836 8.836 0 001.585-.158l.006-.001a.015.015 0 01.005-.001h.005l.076-.016c1.079-.212 2.118-.632 3.095-1.153 1.235-.66 2.386-1.515 3.43-2.48a14.133 14.133 0 001.474-1.531.792.792 0 00.208-.43v-.002c.003-.006.003-.015.003-.022v-.01l.002-.008c0-.004 0-.009.002-.013l.001-.012.001-.015.001-.019.002-.019a.07.07 0 01-.01-.036c0-.009 0-.018-.002-.027zm-6.362.888a3.823 3.823 0 01-1.436 2.12l-.01-.006a3.683 3.683 0 01-2.178.721 3.67 3.67 0 01-2.177-.721l-.009.006a3.823 3.823 0 01-1.437-2.12l.014-.01a3.881 3.881 0 01-.127-.974c0-2.105 1.673-3.814 3.738-3.816 2.065.002 3.739 1.711 3.739 3.816 0 .338-.047.662-.128.975l.011.009zM8.145 5.678a1.84 1.84 0 113.679 0 1.84 1.84 0 01-3.679 0z"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        ) : (
                                                            <path
                                                                stroke="none"
                                                                fill="#000"
                                                                fillOpacity=".54"
                                                                d="M19.834 1.15a.768.768 0 00-.142-1c-.322-.25-.75-.178-1 .143-.035.036-3.997 4.712-8.709 4.712-4.569 0-8.71-4.712-8.745-4.748a.724.724 0 00-1-.071.724.724 0 00-.07 1c.07.106.927 1.07 2.283 2.141L.631 5.219a.69.69 0 00.036 1c.071.142.25.213.428.213a.705.705 0 00.5-.214l1.963-2.034A13.91 13.91 0 006.806 5.86l-.75 2.535a.714.714 0 00.5.892h.214a.688.688 0 00.679-.535l.75-2.535a9.758 9.758 0 001.784.179c.607 0 1.213-.072 1.785-.179l.75 2.499c.07.321.392.535.677.535.072 0 .143 0 .179-.035a.714.714 0 00.5-.893l-.75-2.498a13.914 13.914 0 003.248-1.678L18.3 6.147a.705.705 0 00.5.214.705.705 0 00.499-.214.723.723 0 00.036-1l-1.82-1.891c1.463-1.071 2.32-2.106 2.32-2.106z"
                                                            ></path>
                                                        )}
                                                    </svg>
                                                </div>
                                                <p className="error-message" style={{ height: '1.6rem' }}>
                                                    {error3}
                                                </p>
                                            </>
                                        )}
                                    </>
                                )}

                                <button
                                    className="button-submit d-flex align-items-center justify-content-center rounded-4"
                                    disabled={
                                        email.trim() == '' ||
                                        (mode !== 'forgot-password' && password.trim() == '') ||
                                        (mode === 'signup' && confirmPassword.trim() == '') ||
                                        (mode === 'forgot-password' && step === 3 && confirmPassword.trim() == '') ||
                                        isLoading
                                    }
                                    onClick={handleSubmit}
                                >
                                    {mode == 'signup'
                                        ? step == 1
                                            ? 'XÁC THỰC'
                                            : 'ĐĂNG KÝ'
                                        : mode == 'forgot-password'
                                        ? 'XÁC NHẬN'
                                        : 'ĐĂNG NHẬP'}
                                    {isLoading && (
                                        <div className="dot-spinner ms-4">
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                            <div className="dot-spinner__dot"></div>
                                        </div>
                                    )}
                                </button>
                                {mode == 'login' ? (
                                    <>
                                        <div className="d-flex w-100 my-3 align-items-center">
                                            <div
                                                className="flex-grow-1"
                                                style={{ height: '1px', backgroundColor: '#ccc' }}
                                            ></div>
                                            <span style={{ fontSize: '1.2rem', padding: '0 16px', color: '#ccc' }}>
                                                Hoặc
                                            </span>
                                            <div
                                                className="flex-grow-1"
                                                style={{ height: '1px', backgroundColor: '#ccc' }}
                                            ></div>
                                        </div>

                                        <div className="content-section d-flex flex-row align-items-center justify-content-between">
                                            <button
                                                disabled={isLoading}
                                                className="btn d-flex btn-google align-items-center justify-content-center  google"
                                                onClick={handleLoginWithGg}
                                            >
                                                <svg className="icon" viewBox="0 0 24 24" width={20}>
                                                    <path
                                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                        fill="#4285F4"
                                                    ></path>
                                                    <path
                                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                        fill="#34A853"
                                                    ></path>
                                                    <path
                                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                        fill="#FBBC05"
                                                    ></path>
                                                    <path
                                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                        fill="#EA4335"
                                                    ></path>
                                                    <path d="M1 1h22v22H1z" fill="none"></path>
                                                </svg>
                                                <p>Google</p>
                                            </button>
                                            <button
                                                disabled={isLoading}
                                                onClick={handleLoginWithFb}
                                                className="btn d-flex btn-facebook align-items-center justify-content-center  apple"
                                            >
                                                <svg viewBox="0 0 16 16" fill="#1877f2" width={20}>
                                                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"></path>
                                                </svg>
                                                <p>Facebook</p>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className="d-flex justify-content-center mt-4">
                                {mode == 'signup' || mode == 'forgot-password' ? (
                                    <>
                                        <p style={{ color: '#ccc' }}>Bạn đã có tài khoản?</p>
                                        <Link
                                            to={'/user/login'}
                                            className="ms-2"
                                            style={{ color: 'var(--primary-color)', fontWeight: '500' }}
                                        >
                                            Đăng nhập
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <p style={{ color: '#ccc' }}>Bạn chưa có tài khoản?</p>
                                        <Link
                                            to={'/user/signup'}
                                            className="ms-2"
                                            style={{ color: 'var(--primary-color)', fontWeight: '500' }}
                                        >
                                            Đăng ký
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Auth
