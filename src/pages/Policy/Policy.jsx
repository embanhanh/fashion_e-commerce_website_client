import React from 'react'
import './Policy.scss'

function Policy() {
    return (
        <>
            <div className="policy-container lh-lg" >
                <h1 className="my-5 text-center text-capitalize">chính sách bảo mật</h1>
                <div className="policy-section">
                    <p className="fs-2">1. Mục đích và phạm vi thu thập</p>
                    <p className="fs-4">Chúng tôi sử dụng thông tin cá nhân của Quý khách để liên lạc khi cần thiết, liên quan đến việc Quý khách mua hàng trực tuyến tại Heartie.</p>
                    <p className="fs-4">Heartie thu thập thông tin cá nhân của Quý Khách nhằm mục đích:</p>
                    <ul>
                        <li className="fs-4 ms-5">Cung cấp sản phẩm theo đơn đặt hàng cho Quý Khách</li>
                        <li className="fs-4 ms-5">Liên hệ, xác nhận thông tin đơn đặt hàng và vận chuyển sản phẩm đến Quý Khách</li>
                        <li className="fs-4 ms-5">Liên lạc, hỗ trợ Quý Khách trong các trường hợp cần hỗ trợ</li>
                        <li className="fs-4 ms-5">Trả lời câu hỏi hoặc gửi thông tin theo yêu cầu của Quý khách</li>
                        <li className="fs-4 ms-5">Gửi đến Quý Khách những thông tin khuyến mãi, ưu đãi, tri ân</li>
                    </ul>
                    <p className="fs-2">2. Phạm vi sử dụng thông tin</p>
                    <p className="fs-4 lh-lg">Thông tin cá nhân của khách hàng chỉ được dùng trong nội bộ công ty, bao gồm việc bán hàng và chăm sóc khách hàng.</p>
                    <p className="fs-4 lh-lg">Khi cần thiết chúng tôi có thể sử dụng những thông tin này để liên hệ trực tiếp với Quý khách như gửi thư ngỏ, đơn đặt hàng, thư cảm ơn, thông tin về kỹ thuật và bảo mật, thông tin về khuyến mại, thông tin về sản phẩm dịch vụ mới….</p>
                    <p className="fs-2">3. Thời gian lưu trữ thông tin</p>
                    <p className="fs-4 lh-lg">Các thông tin của Quý khách hàng sẽ được lưu trữ  trong hệ thống nội bộ của công ty chúng tôi cho đến khi Quý khách có yêu cầu hủy bỏ các thông tin đã cung cấp.</p>
                    <p className="fs-2">6. Cam kết bảo mật thông tin cá nhân khách hàng</p>
                    <p className="fs-4 lh-lg">Chúng tôi cam kết bảo mật thông tin của Quý khách hàng bằng mọi hình thức có thể theo chính bảo vệ thông tin cá nhân của chúng tôi.</p>
                    <p className="fs-4 lh-lg">Chúng tôi tuyệt đối không chia sẻ thông tin của Quý khách cho bất cứ công ty hay bên thứ 3 nào khác ngoại trừ các đại lý và các nhà cung cấp liên quan đến việc cung cấp dịch vụ cho Quý khách hàng.</p>
                </div>

                <div className="policy-container lh-lg" >
                    <h1 className="my-5 text-center text-capitalize">chính sách đổi trả</h1>
                    <div className="policy-section">
                        <p className="fs-4">Nhằm mang lại cho khách hàng trải nghiệm mua sắm tốt và sự hài lòng về chất lượng sản phẩm, Heartie xin thông báo đến quý khách CHÍNH SÁCH ĐỔI TRẢ SẢN PHẨM chi tiết như sau:</p>
                        <strong className="fs-3 text-uppercase">điều kiện đổi trả</strong>
                        <p className="fs-4">Heartie luôn hỗ trợ khách hàng đổi trả sản phẩm trong thời gian quy định và theo đúng quy trình.</p>
                        <p className="fs-4">1. Thời gian</p>
                        <p className="fs-4 my-3">Heartie hỗ trợ đổi trả sản phẩm trong thời gian là 7 ngày (tính từ ngày khách nhận được hàng).</p>
                        <p className="fs-4">2. Điều kiện</p>
                        <ul className="my-4">
                            <li className="fs-4 ms-5">Sản phẩm chưa qua sử dụng (còn nguyên tem mác)</li>
                            <li className="fs-4 ms-5">Sản phẩm lỗi do quá trình sản xuất</li>
                            <li className="fs-4 ms-5">Sản phẩm không thuộc chương trình sale</li>
                            <li className="fs-4 ms-5">Sản phẩm không thuộc nhóm đồ lót</li>
                        </ul>
                        <strong className="fs-3 text-uppercase">quy trình đổi trả</strong>
                        <ol className="my-4">
                            <li className="fs-4">Cùng mã sản phẩm (chỉ đổi size, đổi màu): Đổi miễn phí</li>
                            <li className="fs-4">Đổi khác mã sản phẩm (tính theo giá trị tại thời điểm đổi hàng)</li>
                            <ul>
                                <li className="fs-4 ms-5">Sản phẩm được đổi phải có giá trị ngang bằng hoặc cao hơn.</li>
                                <li className="fs-4 ms-5">Không hoàn lại tiền thừa trong trường hợp sản phẩm được chọn để đổi có giá trị thấp hơn sản phẩm đổi</li>
                            </ul>
                        </ol>
                        <strong className="fs-4">Lưu ý:</strong>
                        <ul className="my-4">
                            <li className="fs-4 ms-5">Sản phẩm do lỗi sản xuất, tư vấn: mọi chi phí vận chuyển do FAPAS chi trả</li>
                            <li className="fs-4 ms-5">Lý do khác: mọi chi phí vận chuyển do khách hàng chi trả</li>
                        </ul>
                        <p className="fs-4">(Lỗi sản xuất là lỗi xuất hiện trước khi dùng sản phẩm)</p>
                    </div>
                </div>
                <div className="policy-container lh-lg" >
                    <h1 className="my-5 text-center text-capitalize">chính sách thanh toán</h1>
                    <div className="policy-section">
                        <p className="fs-4">1. Thanh toán cho nhân viên giao hàng (SHIPCOD)</p>
                        <p className="fs-4">Khi nhận hàng và kiểm tra xong bao bì đóng gói sản phẩm, Quý khách hàng thanh toán bằng tiền mặt cho nhân viên giao hàng (shipper).</p>
                        <p className="fs-4">2. Chuyển khoản ngân hàng</p>
                        <p className="fs-4">Quý khách hàng có thể chọn hình thức thanh toán bằng chuyển khoản ngân hàng.</p>
                    </div>
                </div>
                <div className="policy-container lh-lg" >
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
                <div className="policy-container lh-lg" >
                    <h1 className="my-5 text-center text-capitalize">hướng dẫn chọn kích cỡ</h1>
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
                    </div>
                </div>
            </div>
        </>

    )
}

export default Policy