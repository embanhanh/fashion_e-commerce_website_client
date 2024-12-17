import './Policy.scss'

function Delivery() {
    return (
        <div className="policy-container lh-lg">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb d-flex align-items-center gap-3 fs-3">
                    <li className="breadcrumb-item"><a href="/">Trang chủ</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Chính sách giao hàng</li>
                </ol>
            </nav>
            <h1 className="my-5 text-center text-capitalize">chính sách giao hàng</h1>
            <div className="policy-section">
                <p className="fs-3 fw-normal">Sản phẩm sẽ được vận chuyển khi quý khách thực hiện đầy đủ các thủ tục đặt hàng và đơn hàng được xác nhận thành công. Thời gian vận chuyển hàng (không tính thứ bảy, chủ nhật hay các ngày lễ tết).</p>
                <p className="fs-3 fw-bold">1. Thời gian giao hàng:</p>
                <ul>
                    <li className="fs-3">Nội thành TP HCM, Hà Nội: 1-3 ngày</li>
                    <li className="fs-3">Ngoại thành: 3-5 ngày</li>
                    <li className="fs-3">Các khu vực còn lại: <span className="fw-bold">4-7 ngày (tùy khu vực)</span></li>
                </ul>
                <p className="fs-3 fw-bold">2. Phí vận chuyển:</p>
                <ul>
                    <li className="fs-3 fw-normal">Miễn phí cho đơn hàng từ 500.000VND trở lên</li>
                    <li className="fs-3 fw-normal">Phí vận chuyển: 30.000VND cho đơn hàng dưới 500.000VND</li>
                </ul>
            </div>
        </div>
    )
}

export default Delivery
