import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBagShopping, faEnvelope, faLocationDot, faPhone, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faSquareFacebook } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Footer() {
    const { shopInfo } = useSelector((state) => state.shop)
    return (
        <>
            <footer className="main-footer">
                <div className="d-flex container p-5 max-md">
                    <div className="w-25">
                        <div style={{ height: 80 }}>
                            <Link to={'/'} className="d-flex h-100 align-items-center">
                                <img src={shopInfo?.logo} alt="Logo Shop" className="h-100" />
                            </Link>
                        </div>
                        <div className="d-flex p-3 align-items-center">
                            <FontAwesomeIcon className="me-4" size="xl" icon={faPhone} /> <p>(+84) 0123456789</p>
                        </div>
                        <div className="d-flex p-3 align-items-center">
                            <FontAwesomeIcon className="me-4" size="xl" icon={faEnvelope} /> <p>heartie@gmail.com</p>
                        </div>
                        <div className="d-flex p-3 align-items-center">
                            <FontAwesomeIcon className="me-4" size="xl" icon={faLocationDot} /> <p>VRC2+2MP, Phường Linh Trung, Thủ Đức, Hồ Chí Minh</p>
                        </div>
                    </div>
                    <div className="w-25 d-flex flex-column ms-2 text-center">
                        <p className="fw-bold fs-3">Thông tin</p>
                        <Link className="footer-link py-2" to={'/user/account/profile'}>Tài khoản cá nhân</Link>
                        <Link className="footer-link py-2" to={'user/login'}>Đăng nhập</Link>
                        <Link className="footer-link py-2" to={'/cart'}>Giỏ hàng</Link>
                        <Link className="footer-link py-2" to={'/products'}>Sản phẩm</Link>
                        <Link className="footer-link py-2" to={'#'}>Về chúng tôi</Link>
                        <Link className="footer-link py-2" to={'#'}>FAQ</Link>
                    </div>
                    <div className="w-25 d-flex flex-column ms-2 text-center">
                        <p className="fw-bold fs-3">Dịch vụ</p>
                        <Link className="footer-link py-2" to={'/policy/privacy'}>Chính sách bảo mật</Link>
                        <Link className="footer-link py-2" to={'/policy/terms'}>Điều khoản sử dụng</Link>
                        <Link className="footer-link py-2" to={'/policy/refund'}>Chính sách đổi trả</Link>
                        <Link className="footer-link py-2" to={'/policy/delivery'}>Chính sách giao hàng</Link>
                        <Link className="footer-link py-2" to={'/policy/payment'}>Chính sách thanh toán</Link>
                        <Link className="footer-link py-2" to={'/policy/check'}>Chính sách kiểm hàng</Link>
                    </div>
                    <div className="w-25 d-flex flex-column ms-2">
                        <p className="fw-bold fs-3">Theo dõi chúng tôi</p>
                        <p className=" py-2">Kết nối với chúng tôi trên các nền tảng xã hội để cập nhật xu hướng thời trang mới nhất và nhận ưu đãi độc quyền</p>
                        <div className="flex">
                            <Link to={'https://www.facebook.com/heartiefashion?mibextid=ZbWKwL'}>
                                <FontAwesomeIcon color="#1877f2" size="2xl" icon={faSquareFacebook} />
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer
