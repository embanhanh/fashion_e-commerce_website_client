import React from 'react'
import './Policy.scss'

function Privacy() {
    return (
        <>
            <div className="policy-container lh-lg" >
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb d-flex align-items-center gap-3 fs-3">
                        <li className="breadcrumb-item"><a href="/">Trang chủ</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Chính sách bảo mật</li>
                    </ol>
                </nav>
                <h1 className="my-5 text-center text-capitalize">chính sách bảo mật</h1>
                <div className="policy-section">
                    <p className="fs-2">1. Mục đích và phạm vi thu thập</p>
                    <p className="fs-3">Chúng tôi sử dụng thông tin cá nhân của Quý khách để liên lạc khi cần thiết, liên quan đến việc Quý khách mua hàng trực tuyến tại Heartie.</p>
                    <p className="fs-3">Heartie thu thập thông tin cá nhân của Quý Khách nhằm mục đích:</p>
                    <ul>
                        <li className="fs-3 ms-5">Cung cấp sản phẩm theo đơn đặt hàng cho Quý Khách</li>
                        <li className="fs-3 ms-5">Liên hệ, xác nhận thông tin đơn đặt hàng và vận chuyển sản phẩm đến Quý Khách</li>
                        <li className="fs-3 ms-5">Liên lạc, hỗ trợ Quý Khách trong các trường hợp cần hỗ trợ</li>
                        <li className="fs-3 ms-5">Trả lời câu hỏi hoặc gửi thông tin theo yêu cầu của Quý khách</li>
                        <li className="fs-3 ms-5">Gửi đến Quý Khách những thông tin khuyến mãi, ưu đãi, tri ân</li>
                    </ul>
                    <p className="fs-2">2. Phạm vi sử dụng thông tin</p>
                    <p className="fs-3 lh-lg">Thông tin cá nhân của khách hàng chỉ được dùng trong nội bộ công ty, bao gồm việc bán hàng và chăm sóc khách hàng.</p>
                    <p className="fs-3 lh-lg">Khi cần thiết chúng tôi có thể sử dụng những thông tin này để liên hệ trực tiếp với Quý khách như gửi thư ngỏ, đơn đặt hàng, thư cảm ơn, thông tin về kỹ thuật và bảo mật, thông tin về khuyến mại, thông tin về sản phẩm dịch vụ mới….</p>
                    <p className="fs-2">3. Thời gian lưu trữ thông tin</p>
                    <p className="fs-3 lh-lg">Các thông tin của Quý khách hàng sẽ được lưu trữ  trong hệ thống nội bộ của công ty chúng tôi cho đến khi Quý khách có yêu cầu hủy bỏ các thông tin đã cung cấp.</p>
                    <p className="fs-2">6. Cam kết bảo mật thông tin cá nhân khách hàng</p>
                    <p className="fs-3 lh-lg">Chúng tôi cam kết bảo mật thông tin của Quý khách hàng bằng mọi hình thức có thể theo chính bảo vệ thông tin cá nhân của chúng tôi.</p>
                    <p className="fs-3 lh-lg">Chúng tôi tuyệt đối không chia sẻ thông tin của Quý khách cho bất cứ công ty hay bên thứ 3 nào khác ngoại trừ các đại lý và các nhà cung cấp liên quan đến việc cung cấp dịch vụ cho Quý khách hàng.</p>
                </div>
            </div>
        </>
    )
}

export default Privacy
