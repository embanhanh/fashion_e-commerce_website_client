import './Orders.scss'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrderUser, setOrderFilters } from '../../redux/slices/userSlice'
import OrderCard from '../../components/OrderCard.jsx'

function Orders() {
    const dispatch = useDispatch()
    const { orders, loading, error } = useSelector((state) => state.user)

    const [filterStatus, setFilterStatus] = useState('')

    useEffect(() => {
        dispatch(fetchOrderUser())
    }, [dispatch])

    useEffect(() => {
        dispatch(setOrderFilters({ status: filterStatus }))
        dispatch(fetchOrderUser())
    }, [filterStatus, dispatch])

    useEffect(() => {
        if (orders) {
            // console.log(orders)
        }
    }, [orders])

    return (
        <div className="container mb-4">
            {/* Tabs điều hướng */}
            <div className="order-tabs mt-4 z-0 position-sticky bg-white">
                <div className="border-bottom d-flex">
                    <p className={`fs-4 py-3 px-4 order-tab-item ${filterStatus === '' ? 'active' : ''}`} onClick={() => setFilterStatus('')}>
                        Tất cả
                    </p>
                    <p className={`fs-4 py-3 px-4 order-tab-item ${filterStatus === 'pending' ? 'active' : ''}`} onClick={() => setFilterStatus('pending')}>
                        Chờ xác nhận
                    </p>
                    <p className={`fs-4 py-3 px-4 order-tab-item ${filterStatus === 'processing' ? 'active' : ''}`} onClick={() => setFilterStatus('processing')}>
                        Đang xử lý
                    </p>
                    <p className={`fs-4 py-3 px-4 order-tab-item ${filterStatus === 'delivering' ? 'active' : ''}`} onClick={() => setFilterStatus('delivering')}>
                        Đang giao
                    </p>
                    <p className={`fs-4 py-3 px-4 order-tab-item ${filterStatus === 'delivered' ? 'active' : ''}`} onClick={() => setFilterStatus('delivered')}>
                        Đã giao
                    </p>
                    <p className={`fs-4 py-3 px-4 order-tab-item ${filterStatus === 'cancelled' ? 'active' : ''}`} onClick={() => setFilterStatus('cancelled')}>
                        Đã hủy
                    </p>
                </div>
            </div>

            {/* Danh sách đơn hàng */}
            {loading ? (
                <p>Đang tải...</p>
            ) : error ? (
                <p>{error}</p>
            ) : !orders || orders.length === 0 ? (
                <p className="fs-3 fw-medium text-center">Không có đơn hàng nào</p>
            ) : (
                orders.map((order) => (
                    <OrderCard key={order._id} order={order}></OrderCard>
                ))
            )}
        </div>
    )
}

export default Orders
