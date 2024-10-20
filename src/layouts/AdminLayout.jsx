import LogoShop from '../components/LogoShop'
import './MainLayout.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import Accordion from '../components/Accordion'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useLayoutEffect } from 'react'

function Adminlayout({ children }) {
    const navigate = useNavigate()
    useLayoutEffect(() => {
        window.scrollTo(0, 0)
    }, [navigate])
    return (
        <>
            <div className="position-fixed top-0 start-0 end-0 shadow header-admin">
                <div className="container d-flex align-items-center justify-content-between h-100">
                    <div className="h-100">
                        <LogoShop type={'dark'} />
                    </div>
                    <div className="user-actions-container position-relative d-flex align-items-center">
                        <img src="" alt="" className="rounded-circle shadow mx-3" style={{ height: 32, width: 32 }} />
                        <p className="fs-4 fw-medium me-5 ">Trần Trung Thông</p>
                        <div className="position-absolute py-3 px-3 user-actions shadow rounded-3">
                            <p className="user-action fs-4 fw-medium py-3 px-2 border-bottom">Tài khoản của tôi</p>
                            <p className="user-action fs-4 fw-medium py-3 px-2 border-bottom">Đơn mua</p>
                            <p className="user-action fs-4 fw-medium py-3 px-2 border-bottom" onClick={() => navigate('/system/products')}>
                                Quản lý cửa hàng
                            </p>
                            <p className="user-action fs-4 fw-medium py-3 px-2">
                                <FontAwesomeIcon icon={faRightFromBracket} className="fs-3 me-2" /> Đăng xuất
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-100 admin-body d-flex bg-body-tertiary">
                <div className="h-100 p-3 bg-white shadow position-fixed start-0 bottom-0" style={{ width: '20%', top: 'var(--header-admin-height)' }}>
                    <Accordion
                        data={[
                            {
                                title: 'Quản lý sản phẩm',
                            },
                        ]}
                        isOpen={true}
                    >
                        <Link className="fs-4 seller-option" to={'/seller/products'}>
                            Tất cả sản phẩm
                        </Link>
                        <Link className="fs-4 seller-option" to={'/seller/products/create'}>
                            Thêm sản phẩm
                        </Link>
                    </Accordion>
                    <Accordion
                        data={[
                            {
                                title: 'Quản lý đơn hàng',
                            },
                        ]}
                        isOpen={true}
                    >
                        <Link className="fs-4 seller-option" to={'/seller/orders'}>
                            Tất cả đơn hàng
                        </Link>
                        <Link className="fs-4 seller-option">Đơn hủy</Link>
                        <Link className="fs-4 seller-option">Trả hàng/hoàn tiền</Link>
                        <Link className="fs-4 seller-option">Cài đặt vận chuyển</Link>
                    </Accordion>
                    <Accordion
                        data={[
                            {
                                title: 'Quản lý Shop',
                            },
                        ]}
                        isOpen={true}
                    >
                        <Link className="fs-4 seller-option" to={'/seller/shop/infomation'}>
                            Hồ sơ Shop
                        </Link>
                        <Link className="fs-4 seller-option" to={'/seller/shop/banner'}>
                            Banner của Shop
                        </Link>
                        <Link className="fs-4 seller-option" to={'/seller/shop/banner/create'}>
                            Tạo banner
                        </Link>
                    </Accordion>
                    <Accordion
                        data={[
                            {
                                title: 'Quản lý khuyến mãi',
                            },
                        ]}
                        isOpen={true}
                    >
                        <Link className="fs-4 seller-option" to={'/seller/voucher'}>
                            Mã khuyến mãi của Shop
                        </Link>
                        <Link className="fs-4 seller-option" to={'/seller/voucher/create'}>
                            Tạo mã khuyến mãi
                        </Link>
                    </Accordion>
                </div>
                <div className="h-100 p-4 w-100" style={{ marginLeft: '20%', minHeight: '100vh' }}>
                    {children}
                </div>
            </div>
        </>
    )
}

export default Adminlayout
