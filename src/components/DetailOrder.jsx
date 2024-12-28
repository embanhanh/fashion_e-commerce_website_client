import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { fetchOrderDetail } from '../redux/slices/userSlice'

import './DetailOrder.scss'

function DetailOrder() {
    const { order_id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { orderDetail, loading, error } = useSelector((state) => state.user)

    const handleBack = () => {
        navigate(`/user/account/orders`)
    }

    useEffect(() => {
        if (order_id) {
            dispatch(fetchOrderDetail(order_id))
        }
    }, [order_id])

    useEffect(() => {
        console.log('Order Detail:', orderDetail)
    }, [orderDetail])

    if (loading) {
        return (
            <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    if (error) {
        return <div>{error.message || 'An error occurred'}</div>
    }
    return (
        <>
            <div className="bg-white rounded-4 shadow-sm my-4 p-3">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <button className="back-section m-2" onClick={handleBack}>
                        <FontAwesomeIcon className="fs-2" icon={faArrowLeft} />
                        <span className="fs-3 ms-3">Trở lại</span>
                    </button>
                    <div className="fs-4 ms-auto d-flex">
                        <span className="border-end border-2 pe-3">
                            Mã đơn hàng: {orderDetail?._id || 'Chưa có dữ liệu'}
                        </span>
                        <p className="text-uppercase mx-3 fs-4">
                            {orderDetail?.status === 'processing' ? (
                                <span className="text-warning">Đang xử lý</span>
                            ) : orderDetail?.status === 'pending' ? (
                                <span className="text-pending">Chờ xác nhận</span>
                            ) : orderDetail?.status === 'delivering' ? (
                                <span className="text-delivering">Đang giao hàng</span>
                            ) : orderDetail?.status === 'delivered' ? (
                                <span className="text-delivered">Đã giao</span>
                            ) : orderDetail?.status === 'cancelled' ? (
                                <span className="text-cancelled">Đã hủy</span>
                            ) : orderDetail?.status === 'returned' ? (
                                <span className="text-cancelled">Yêu cầu trả hàng</span>
                            ) : null}
                        </p>
                    </div>
                </div>

                <div className="d-flex justify-content-between my-3">
                    <div className="d-flex flex-column align-items-start gap-2 ms-3">
                        <p className="fs-4 fw-normal mb-0 fw-semibold ms-3">
                            Thời gian đặt hàng:{' '}
                            <span className="fw-normal">
                                {new Date(orderDetail?.createdAt).toLocaleTimeString('vi-VN')}{' '}
                                {new Date(orderDetail?.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                        </p>
                        {orderDetail?.deliveredAt && (
                            <p className="fs-4 fw-semibold me-3 ms-3">
                                Thời gian nhận hàng:
                                <span className="fs-4 fw-normal ms-2">
                                    {new Date(orderDetail?.deliveredAt).toLocaleTimeString('vi-VN')}{' '}
                                    {new Date(orderDetail?.deliveredAt).toLocaleDateString('vi-VN')}
                                </span>
                            </p>
                        )}
                    </div>
                    {orderDetail?.status === 'cancelled' && (
                        <p className="fs-4 fw-semibold me-3">
                            Thời gian hủy đơn hàng:
                            <span className="fs-4 fw-normal ms-2">
                                {new Date(orderDetail?.reasonAt).toLocaleTimeString('vi-VN')}{' '}
                                {new Date(orderDetail?.reasonAt).toLocaleDateString('vi-VN')}
                            </span>
                        </p>
                    )}
                    {orderDetail?.status === 'returned' && (
                        <p className="fs-4 fw-semibold me-3">
                            Thời gian yêu cầu trả hàng:
                            <span className="fs-4 fw-normal ms-2">
                                {new Date(orderDetail?.reasonAt).toLocaleTimeString('vi-VN')}{' '}
                                {new Date(orderDetail?.reasonAt).toLocaleDateString('vi-VN')}
                            </span>
                        </p>
                    )}

                    {orderDetail?.status === 'delivered' && (
                        <p className="fs-4 fw-semibold me-3">
                            Thời gian nhận hàng:
                            <span className="fs-4 fw-normal ms-2">
                                {new Date(orderDetail?.deliveredAt).toLocaleTimeString('vi-VN')}{' '}
                                {new Date(orderDetail?.deliveredAt).toLocaleDateString('vi-VN')}
                            </span>
                        </p>
                    )}
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
                            {orderDetail?.products?.map((product, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={product.product?.imageUrl}
                                                alt=""
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            />
                                            <span className="text-wrap fs-4 ms-2">{product.product.product.name}</span>
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
                        <p className="fs-4">Tên khách hàng: {orderDetail?.shippingAddress?.name}</p>
                        <p className="fs-4">Email: {orderDetail?.user?.email}</p>
                        <p className="fs-4 text-wrap" style={{ maxWidth: '400px' }}>
                            Địa chỉ nhận hàng: {orderDetail?.shippingAddress?.location}
                        </p>
                    </div>

                    <div className="d-flex align-items-center justify-content-between mx-5 gap-3">
                        <p className="mb-0 fs-4">Tổng tiền thanh toán:</p>
                        <p className="mb-0 fs-3 fw-bold">{(orderDetail?.totalPrice || 0).toLocaleString('vi-VN')}đ</p>
                    </div>
                </div>
            </div>

            {orderDetail?.status === 'cancelled' && (
                <>
                    <div className="d-flex justify-content-start bg-white p-3 shadow-sm rounded-3 mt-2">
                        <p className="fs-4 fw-semibold">
                            Lý do hủy đơn hàng:
                            <span className="fs-4 fw-normal ms-2">
                                {orderDetail?.reason === 'change_address'
                                    ? 'Muốn thay đổi địa chỉ giao hàng.'
                                    : orderDetail?.reason === 'change_voucher'
                                    ? 'Muốn nhập/thay đổi voucher.'
                                    : orderDetail?.reason === 'change_product'
                                    ? 'Muốn thay đổi sản phẩm(số lượng, màu sắc, phân loại hàng,...).'
                                    : orderDetail?.reason === 'find_cheaper'
                                    ? 'Tìm thấy giá rẻ ở chỗ khác.'
                                    : orderDetail?.reason === 'cancel_purchase'
                                    ? 'Đổi ý, không muốn mua nữa.'
                                    : 'Không có lý do'}
                            </span>
                        </p>
                    </div>
                </>
            )}

            {orderDetail?.status === 'returned' && (
                <div>
                    <div className="d-flex justify-content-start bg-white p-3 shadow-sm rounded-3 mt-2">
                        <p className="fs-3 fw-semibold">
                            Lý do trả hàng:{' '}
                            <span className="fs-3 fw-normal ms-2">
                                {orderDetail?.reason === 'product_defective'
                                    ? 'Hàng lỗi.'
                                    : orderDetail?.reason === 'product_not_match_description'
                                    ? 'Sản phẩm không khớp với mô tả.'
                                    : orderDetail?.reason === 'product_not_match'
                                    ? 'Hàng không đúng màu, kích cỡ, phân loại hàng.'
                                    : orderDetail?.reason === 'product_used'
                                    ? 'Hàng đã qua sử dụng.'
                                    : orderDetail?.reason === 'product_fake'
                                    ? 'Hàng giả, nhái.'
                                    : orderDetail?.reason === 'product_not_use'
                                    ? 'Hàng nguyên vẹn nhưng không còn nhu cầu sử dụng.'
                                    : 'Không có lý do'}
                            </span>
                        </p>
                    </div>
                    <div className="d-flex justify-content-start bg-white p-3 shadow-sm rounded-3 mt-2">
                        <p className="fs-3 fw-semibold">
                            Trạng thái xác nhận trả hàng:
                            <span className="fs-3 fw-normal ms-2">
                                {orderDetail?.statusReason === 'pending'
                                    ? 'Chờ xác nhận'
                                    : orderDetail?.statusReason === 'approved'
                                    ? 'Chấp nhận trả hàng'
                                    : 'Từ chối trả hàng'}
                            </span>
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}

export default DetailOrder
