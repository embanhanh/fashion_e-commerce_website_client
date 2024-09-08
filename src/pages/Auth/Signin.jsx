import React, { useEffect, useState } from 'react'
import './Auth.css'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../../services/UserService'
import { FacebookAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth, fbProvider } from '../../firebase.config'

function Signin() {
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            navigate('/')
        }
    }, [navigate])

    const handleClick = () => {
        navigate('/')
    }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLoginWithFb = async (e) => {
        e.preventDefault()
        try {
            const result = await signInWithPopup(auth, fbProvider)
            const user = result.user

            // Lấy accessToken từ kết quả đăng nhập Facebook
            const credential = FacebookAuthProvider.credentialFromResult(result)
            const accessToken = credential.accessToken

            // Xử lý đăng nhập thành công, lưu token hoặc điều hướng người dùng
            localStorage.setItem('token', accessToken)
            handleClick()
        } catch (error) {
            const errorMessage = error.message
            setError(errorMessage)
        }
    }

    return (
        <>
            <div className="d-flex w-100 align-items-center" style={{ justifyContent: 'center', minHeight: '100vh' }}>
                <form action="" className="form">
                    <p>
                        Welcome,<span>sign in to continue</span>
                    </p>
                    <button className="oauthButton">
                        <svg className="icon" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                            <path d="M1 1h22v22H1z" fill="none"></path>
                        </svg>
                        Continue with Google
                    </button>
                    <button className="oauthButton" onClick={handleLoginWithFb}>
                        <svg className="icon" xmlnsXlink="http://www.w3.org/1999/xlink32" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 64 64" height="32px" width="24px">
                            <g fillRule="evenodd" fill="none" strokeWidth="1" stroke="none">
                                <g fillRule="nonzero" transform="translate(3.000000, 3.000000)">
                                    <circle r="29.4882047" cy="29.4927506" cx="29.5091719" fill="#3C5A9A"></circle>
                                    <path
                                        fill="#FFFFFF"
                                        d="M39.0974944,9.05587273 L32.5651312,9.05587273 C28.6886088,9.05587273 24.3768224,10.6862851 24.3768224,16.3054653 C24.395747,18.2634019 24.3768224,20.1385313 24.3768224,22.2488655 L19.8922122,22.2488655 L19.8922122,29.3852113 L24.5156022,29.3852113 L24.5156022,49.9295284 L33.0113092,49.9295284 L33.0113092,29.2496356 L38.6187742,29.2496356 L39.1261316,22.2288395 L32.8649196,22.2288395 C32.8649196,22.2288395 32.8789377,19.1056932 32.8649196,18.1987181 C32.8649196,15.9781412 35.1755132,16.1053059 35.3144932,16.1053059 C36.4140178,16.1053059 38.5518876,16.1085101 39.1006986,16.1053059 L39.1006986,9.05587273 L39.0974944,9.05587273 L39.0974944,9.05587273 Z"
                                    ></path>
                                </g>
                            </g>
                        </svg>
                        Continue with Facebook
                    </button>
                    <div className="separator">
                        <div></div>
                        <span>OR</span>
                        <div></div>
                    </div>
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                        onFocus={() => setError('')}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        onFocus={() => setError('')}
                    />
                    <p style={{ fontSize: '0.75rem', color: 'red', textAlign: 'center', minWidth: '100%', margin: 0 }}>{error}</p>
                    <button
                        className="oauthButton"
                        onClick={async (e) => {
                            e.preventDefault()
                            if (!password || !email) {
                                setError('Please fill in all information')
                            } else {
                                try {
                                    const response = await login({ email, password })
                                    localStorage.setItem('token', response.token)
                                    handleClick()
                                } catch (e) {
                                    setError(e.message)
                                }
                            }
                        }}
                    >
                        Sign in
                        <svg
                            className="icon"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m6 17 5-5-5-5"></path>
                            <path d="m13 17 5-5-5-5"></path>
                        </svg>
                    </button>
                </form>
            </div>
        </>
    )
}

export default Signin
