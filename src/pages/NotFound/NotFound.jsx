import './NotFound.scss'
import React from 'react'
import { Link } from 'react-router-dom'
import notFound from '../../assets/image/default/404-not-found.png'

function NotFound() {
    return (
        <div className="not-found-container text-center py-5 h-100 d-flex">
            <img src={notFound} alt="Not Found" className="not-found-image" />
            <div>
                <h1 className="not-found-title">404</h1>
                <p className="not-found-description">Không tìm thấy trang</p>
                <Link to="/" className="not-found-link">
                    Trở về trang chủ
                </Link>
            </div>
        </div>
    )
}

export default NotFound
