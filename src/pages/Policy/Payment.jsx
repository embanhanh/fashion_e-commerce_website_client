import './Policy.scss'

function Payment() {
    return <div className="policy-container lh-lg" >
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb d-flex align-items-center gap-3 fs-4">
                <li className="breadcrumb-item"><a href="/">Trang chủ</a></li>
                <li className="breadcrumb-item active" aria-current="page">Chính sách thanh toán</li>
            </ol>
        </nav>
        <h1 className="my-5 text-center text-capitalize">chính sách thanh toán</h1>
        <div className="policy-section">
            <p className="fs-3 fw-bold">1. Thanh toán cho nhân viên giao hàng (SHIPCOD)</p>
            <p className="fs-4">Khi nhận hàng và kiểm tra xong bao bì đóng gói sản phẩm, Quý khách hàng thanh toán bằng tiền mặt cho nhân viên giao hàng (shipper).</p>
            <p className="fs-3 fw-bold">2. Chuyển khoản ngân hàng</p>
            <p className="fs-4">Quý khách hàng có thể chọn hình thức thanh toán bằng chuyển khoản ngân hàng.</p>
        </div>
    </div>
}

export default Payment