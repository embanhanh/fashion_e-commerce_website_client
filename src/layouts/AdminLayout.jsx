import './MainLayout.scss'
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
                            <Link className={`fs-4 seller-option ${location.pathname === '/seller/products' ? 'active' : ''}`} to={'/seller/products'}>
                                Tất cả sản phẩm
                            </Link>
                            <Link className={`fs-4 seller-option ${location.pathname === '/seller/products/create' ? 'active' : ''}`} to={'/seller/products/create'}>
                                Thêm sản phẩm
                            </Link>
                        </Accordion>
                        <Accordion data={[{ title: 'Quản lý đơn hàng' }]} isOpen={true}>
                            <Link className={`fs-4 seller-option ${location.pathname === '/seller/orders' ? 'active' : ''}`} to={'/seller/orders'}>
                                Tất cả đơn hàng
                            </Link>
                            <Link className="fs-4 seller-option">Đơn hủy</Link>
                            <Link className={`fs-4 seller-option ${location.pathname === '/seller/orders/refund' ? 'active' : ''}`} to={'/seller/orders/refund'}>
                                Trả hàng/hoàn tiền
                            </Link>
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
                            <Link className={`fs-4 seller-option ${location.pathname === '/seller/shop/infomation' ? 'active' : ''}`} to={'/seller/shop/infomation'}>
                                Hồ sơ Shop
                            </Link>
                            <Link className={`fs-4 seller-option ${location.pathname === '/seller/shop/banner' ? 'active' : ''}`} to={'/seller/shop/banner'}>
                                Banner của Shop
                            </Link>
                            <Link className={`fs-4 seller-option ${location.pathname === '/seller/shop/banner/create' ? 'active' : ''}`} to={'/seller/shop/banner/create'}>
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
                            <Link className={`fs-4 seller-option ${location.pathname === '/seller/voucher' ? 'active' : ''}`} to={'/seller/voucher'}>
                                Mã khuyến mãi của Shop
                            </Link>
                            <Link className={`fs-4 seller-option ${location.pathname === '/seller/voucher/create' ? 'active' : ''}`} to={'/seller/voucher/create'}>
                                Tạo mã khuyến mãi
                            </Link>
                            <Link className={`fs-4 seller-option ${location.pathname === '/seller/combo' ? 'active' : ''}`} to={'/seller/combo'}>
                                Combo khuyến mãi
                            </Link>
                            <Link className={`fs-4 seller-option ${location.pathname === '/seller/combo/create' ? 'active' : ''}`} to={'/seller/combo/create'}>
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
                            <Link className={`fs-4 seller-option ${location.pathname === '/seller/customers' ? 'active' : ''}`} to={'/seller/customers'}>
                                Tất cả khách hàng
                            </Link>
                            <Link className={`fs-4 seller-option ${location.pathname.includes('/seller/chat') ? 'active' : ''}`} to={'/seller/chat'}>
                                Chat với khách hàng
                            </Link>
                        </Accordion>
                        <Accordion
                            data={[
                                {
                                    title: 'Dữ liệu thống kê',
                                },
                            ]}
                            isOpen={true}
                        >
                            <Link className={`fs-4 seller-option ${location.pathname === '/seller/statistic' ? 'active' : ''}`} to={'/seller/statistic'}>
                                Phân tích doanh thu
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
