import React from 'react'
import './Policy.scss'

function Policy() {
    return (
        <div className="policy-container">
            <h1>Chính Sách Đổi Trả</h1>

            <div className="policy-section">
                <h2>1. Điều kiện đổi trả</h2>
                <ul>
                    <li>Thời gian đổi trả: trong vòng 7 ngày kể từ ngày nhận hàng</li>
                    <li>Sản phẩm còn nguyên tem mác, chưa qua sử dụng</li>
                    <li>Sản phẩm không bị hư hỏng, không có dấu hiệu đã qua giặt ủi</li>
                    <li>Có đầy đủ hóa đơn mua hàng</li>
                </ul>
            </div>

            <div className="policy-section">
                <h2>2. Quy trình đổi trả</h2>
                <ul>
                    <li>Bước 1: Liên hệ với chúng tôi qua hotline hoặc email</li>
                    <li>Bước 2: Gửi hình ảnh sản phẩm và hóa đơn mua hàng</li>
                    <li>Bước 3: Chúng tôi sẽ kiểm tra và xác nhận đơn hàng</li>
                    <li>Bước 4: Hoàn tiền hoặc đổi sản phẩm khác cho khách hàng</li>
                </ul>
            </div>
        </div>
    )
}

export default Policy