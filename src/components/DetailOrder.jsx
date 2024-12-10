import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { getOrderByIdAction } from '../redux/slices/orderSilce'
import './DetailOrder.scss'


function DetailOrder() {
    const { order_id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { status, error, currentOrder } = useSelector((state) => state.order)


    const handleBack = () => {
        navigate(`/user/account/orders`)
    }

    const handleUpdateOrder = (order_id) => {
        navigate(`/cart/edit/${order_id}`)
    }


    useEffect(() => {
        if (order_id) {
            dispatch(getOrderByIdAction(order_id))
        }
    }, [order_id])

    useEffect(() => {
        console.log('Current Order:', currentOrder)
    }, [currentOrder])


    if (status === 'loading') {
        return (<div className="text-center">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>)
    }
    if (error) {
        return <div>{error.message || 'An error occurred'}</div>
    }
    return (
        <div className="detail-order-container my-5 p-2">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <button className="back-section m-2" onClick={handleBack}>
                    <FontAwesomeIcon
                        className="fs-2"
                        icon={faArrowLeft}
                    />
                    <span className="fs-3 ms-3">Trở lại</span>
                </button>
                <div className="fs-4 ms-auto d-flex">
                    <span className="border-end border-2 pe-3">
                        Mã đơn hàng: {currentOrder?._id || 'Chưa có dữ liệu'}
                    </span>
                    <p className="text-uppercase mx-3 fs-4">
                        {currentOrder?.status === 'processing' ? (
                            <span className="text-warning">Đang xử lý</span>
                        ) : currentOrder?.status === 'pending' ? (
                            <span className="text-pending">Chờ xác nhận</span>
                        ) : currentOrder?.status === 'delivering' ? (
                            <span className="text-delivering">Đang giao hàng</span>
                        ) : currentOrder?.status === 'delivered' ? (
                            <span className="text-delivered">Đã giao</span>
                        ) : currentOrder?.status === 'cancelled' ? (
                            <span className="text-cancelled">Đã hủy</span>
                        ) : null}
                    </p>
                </div>

            </div>

            <div className="order-details m-2 p-2">
                <table className="page-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrder?.products?.map((product, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={product.product?.imageUrl}
                                            alt=""
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                        <span className="text-wrap fs-5">{product.product.product.name}</span>
                                    </div>
                                </td>
                                <td>{product.product.price.toLocaleString('vi-VN')}đ</td>
                                <td>{product.quantity}</td>
                                <td>{(product.product.price * product.quantity).toLocaleString('vi-VN')}đ</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-between mt-3">
                <div className="d-flex flex-column align-items-start gap-2 ms-3">
                    <p className="fs-4 fw-bold">Thông tin giao hàng:</p>
                    <p className="fs-4">Tên khách hàng: {currentOrder?.shippingAddress?.name}</p>
                    <p className="fs-4">Email: {currentOrder?.user?.email}</p>
                    <p className="fs-4 text-wrap" style={{ maxWidth: '400px' }}>Địa chỉ nhận hàng: {currentOrder?.shippingAddress?.location}</p>
                </div>


                <div className="d-flex align-items-center mx-5 gap-3">
                    <p className="mb-0 fs-4">Tổng tiền thanh toán:</p>
                    <p className="mb-0 fs-3 fw-bold">
                        {(currentOrder?.totalPrice || 0).toLocaleString('vi-VN')}đ
                    </p>
                </div>

            </div>
        </div>
    )
}

export default DetailOrder