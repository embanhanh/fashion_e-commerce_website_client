import './Policy.scss'

function Payment() {
    return <div className="policy-container lh-lg" >
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