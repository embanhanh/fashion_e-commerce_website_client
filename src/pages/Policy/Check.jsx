import './Policy.scss'

function Check() {
    return <div className="policy-container lh-lg" >
        <h1 className="my-5 text-center text-capitalize">chính sách kiểm hàng</h1>
        <div className="policy-section">
            <p className="fs-4">Công ty thực hiện giao hàng trong tất cả mọi khung giờ, tùy thuộc vào yêu cầu của khách hàng.</p>
            <p className="fs-4">Quy trình nhận hàng - kiểm hàng:</p>
            <p className="fs-4"><span className="fw-bold fst-italic">Bước 1:</span> Khi nhận hàng, Quý khách vui lòng kiểm tra kỹ thông tin nhận hàng trên đơn hàng, cụ thể : Số lượng sản phẩm, Chủng loại sản phẩm, Quy cách đóng hàng.</p>
            <p className="fs-4"><span className="fw-bold fst-italic">Bước 2:</span> Quý khách sau khi kiểm hàng trên phương tiện vận chuyển đảm bảo chất lượng thì tiến hành thanh toán cho bên giao hàng. </p>
            <p className="fs-4"><span className="fw-bold fst-italic">Bước 3:</span> Bên giao hàng có trách nhiệm cho khách kiểm tra hàng trước khi thanh toán. Lưu ý giữ lại nguyên bill trong trường hợp Quý khách muốn đổi/trả hàng hoá.</p>
            <p className="fs-4">Nếu đơn hàng bị một trong các trường hợp sau:</p>
            <ul>
                <li className="fs-4 ms-5">Thừa/ thiếu sản phẩm</li>
                <li className="fs-4 ms-5">Sản phẩm không đúng với đơn hàng</li>
                <li className="fs-4 ms-5">Sản phẩm bị hư hỏng khi nhìn bằng mắt thường</li>
            </ul>
            <p className="fs-4">Quý khách hàng có quyền từ chối nhận hàng và gọi ngay đến Hotline 08.678.656.18 để được hỗ trợ nhanh nhất.</p>
        </div>
    </div>
}

export default Check
