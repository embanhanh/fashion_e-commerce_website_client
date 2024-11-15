import LogoShop from '../components/LogoShop'
import './MainLayout.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import Accordion from '../components/Accordion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useLayoutEffect } from 'react'
import Header from './Header/Header'

function Adminlayout({ children }) {
    const navigate = useNavigate()
    const location = useLocation()
    useLayoutEffect(() => {
        window.scrollTo(0, 0)
    }, [navigate])
    return (
        <>
            <div className="admin-layout">
                <Header location={location} />
                <div className="admin-body d-flex bg-body-tertiary">
                    <div className="p-3 bg-white shadow position-fixed start-0 bottom-0 admin-sidebar">
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
                            <Link className="fs-4 seller-option" to={'/seller/combo'}>
                                Combo khuyến mãi
                            </Link>
                            <Link className="fs-4 seller-option" to={'/seller/combo/create'}>
                                Tạo combo khuyến mãi
                            </Link>
                        </Accordion>
                        <Accordion
                            data={[
                                {
                                    title: 'Chăm sóc khách hàng',
                                },
                            ]}
                            isOpen={true}
                        >
                            <Link className="fs-4 seller-option" to={'/seller/customers'}>
                                Tất cả khách hàng
                            </Link>
                            <Link className="fs-4 seller-option" to={'/seller/chat'}>
                                Chat với khách hàng
                            </Link>
                        </Accordion>
                    </div>
                    <div className="h-100 p-4 w-100 admin-content">{children}</div>
                </div>
            </div>
        </>
    )
}

export default Adminlayout
