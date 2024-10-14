import './NotFound.scss'
import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div className="container text-center py-5 h-100">
            <h1 className="display-1">404</h1>
            <p className="fs-3 text-danger">Không tìm thấy trang</p>
            <p className="lead">Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
        </div>
    )
}

export default NotFound
