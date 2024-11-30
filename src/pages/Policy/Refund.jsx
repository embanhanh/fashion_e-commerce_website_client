import React from 'react'
import './Policy.scss'

function Refund() {
    return <div className="policy-container lh-lg" >
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
}

export default Refund
