import './OrderCard.scss'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { cancelOrderUser, fetchOrderUser } from '../redux/slices/userSlice'

import Swal from 'sweetalert2'

function OrderCard({ order }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showCancelOrderModal, setShowCancelOrderModal] = useState(false)
    const [reason, setReason] = useState('')
    const { error } = useSelector(state => state.user)

    const handleDetailOrder = (order_id) => {
        navigate(`/user/account/orders/${order._id}`)
    }

    const handleProductDetail = (productId) => {
        navigate(`/products/${productId}`)
    }

    const handleCancelOrder = (orderId) => {
        setShowCancelOrderModal(true)
    }

    const handleConfirmCancelOrder = async () => {
        try {
            if (!reasonValid()) {
                Swal.fire({
                    title: 'Thất bại',
                    text: 'Bạn chưa chọn lý do hủy đơn hàng',
                    icon: 'warning',
                })
                return
            }

            const result = await Swal.fire({
                title: 'Xác nhận',
                text: 'Bạn có chắc chắn muốn hủy đơn hàng này không?',
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: 'Đóng',
                confirmButtonText: 'Hủy đơn hàng',
            })

            if (result.isConfirmed) {

                await dispatch(cancelOrderUser({ orderId: order._id, reason })).unwrap()

                dispatch(fetchOrderUser())

                Swal.fire({
                    title: 'Thành công',
                    text: 'Đơn hàng đã được hủy thành công',
                    icon: 'success'
                })
                setShowCancelOrderModal(false)
                setReason('')
            }
        } catch (error) {
            Swal.fire({
                title: 'Thất bại',
                text: error.response?.data?.message || 'Có lỗi xảy ra',
                icon: 'error'
            })
        }
    }

    const handleBuyAgain = (order) => {
        order.products.forEach(async (product) => {
            console.log(product)
        })
    }



    return (
        <div className="d-flex flex-column justify-content-between bg-white my-5">
            <div className="d-flex justify-content-between my-4">
                <p className="fs-4 fw-normal ms-3">Mã đơn hàng: <span className="fs-3">{order._id}</span></p>
                <p className="text-uppercase me-3 fs-4">
                    {order.status === 'processing'
                        ? <span className="text-warning">Đang xử lý</span>
                        : order.status === 'pending'
                            ? <span className="text-pending">Chờ xác nhận</span>
                            : order.status === 'delivering'
                                ? <span className="text-delivering">Đang giao hàng</span>
                                : order.status === 'delivered' ?
                                    <span className="text-delivered">Đã giao</span>
                                    : order.status === 'cancelled' ?
                                        <span className="text-cancelled">Đã hủy</span> : null} </p>
            </div>
            <div className="d-flex flex-column border-top">
                {order?.products.map((product, index) => (
                    <div key={index} className="d-flex justify-content-between border-bottom p-4">
                        <div className="d-flex">
                            <img src={product.product.imageUrl} alt="error" style={{ width: "50px", height: "50px" }} />
                            <div className="d-flex flex-column ms-4">
                                <p className="fs-4 text-wrap" onClick={() => handleProductDetail(product.product._id)}>
                                    Tên sản phẩm: {product.product.product.name}
                                </p>
                                <p>Số lượng: {product.quantity}</p>
                                <div className="d-flex">
                                    <p>Phân loại hàng: </p>
                                    {product.product.product.categories.map((categorie, index) => (
                                        <p key={index} className="ms-2">{categorie.name}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <span className="fs-5 text-decoration-line-through text-secondary mx-2">{product.product.product.originalPrice.toLocaleString('vi-VN')}đ</span>
                            <span className="fs-4 text-body">{product.product.price.toLocaleString('vi-VN')}đ</span>
                        </div>

                    </div>
                ))}
            </div>
            <div className=" p-5 d-flex flex-row-reverse">
                <p className="fs-3 fw-normal text-center p-1 ms-3 d-flex align-items-center">{order.totalPrice.toLocaleString('vi-VN')}đ</p>
                <p className="fs-4 fw-normal d-flex align-items-center">Thành tiền:</p>
            </div>

            <div className="order-actions p-4 border-top">
                <div className="d-flex justify-content-end gap-3">
                    {(order.status === 'pending' || order.status === 'processing') && (
                        <>
                            <button className="btn-detail-order" onClick={() => handleDetailOrder(order._id)}>
                                Xem chi tiết đơn hàng
                            </button>
                            <button className="btn-cancel-order" onClick={() => handleCancelOrder(order._id)}>
                                Hủy đơn hàng
                            </button>
                            <button className="btn-return-order">
                                Yêu cầu trả hàng
                            </button>
                        </>
                    )}
                    {order.status === 'delivering' && (
                        <button className="btn-detail-order" onClick={handleDetailOrder}>
                            Xem chi tiết đơn hàng
                        </button>
                    )}
                    {order.status === 'delivered' && (
                        <>
                            <button className="btn-detail-order" onClick={handleDetailOrder}>
                                Xem chi tiết đơn hàng
                            </button>
                        </>
                    )}
                    {order.status === 'cancelled' && (
                        <>
                            <button className="btn-detail-order" onClick={() => handleDetailOrder(order._id)}>
                                Xem chi tiết đơn hủy
                            </button>
                            <button className="btn-detail-order" onClick={() => handleBuyAgain(order)}>
                                Mua lại
                            </button>
                        </>
                    )}
                </div>
            </div>
            {showCancelOrderModal && (
                <Modal
                    show={showCancelOrderModal}
                    onHide={() => setShowCancelOrderModal(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <h1 className="fs-2">Hủy đơn hàng</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="fs-3">Lý do hủy đơn hàng:</p>
                        <div>
                            <label className="d-flex align-items-center">
                                <input
                                    type="radio"
                                    className="input-radio"
                                    name="changeAddress"
                                    value="change_address"
                                    checked={reason === 'change_address'}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                <span className="ms-2 fs-4 my-2">Muốn thay đổi địa chỉ nhận hàng.</span>
                            </label>
                        </div>
                        <div>
                            <label className="d-flex align-items-center">
                                <input
                                    type="radio"
                                    className="input-radio"
                                    name="changeVoucher"
                                    value="change_voucher"
                                    checked={reason === 'change_voucher'}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                <span className="ms-2 fs-4 my-2">Muốn nhập/thay đổi voucher.</span>
                            </label>
                        </div>
                        <div>
                            <label className="d-flex align-items-center">
                                <input
                                    type="radio"
                                    className="input-radio"
                                    name="changeProduct"
                                    value="change_product"
                                    checked={reason === 'change_product'}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                <span className="ms-2 fs-4 my-2">Muốn thay đổi sản phẩm(số lượng, màu sắc, phân loại hàng,...).</span>
                            </label>
                        </div>
                        <div>
                            <label className="d-flex align-items-center">
                                <input
                                    type="radio"
                                    className="input-radio"
                                    name="findCheaper"
                                    value="find_cheaper"
                                    checked={reason === 'find_cheaper'}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                <span className="ms-2 fs-4 my-2">Tìm thấy giá rẻ ở chỗ khác.</span>
                            </label>
                        </div>
                        <div>
                            <label className="d-flex align-items-center">
                                <input
                                    type="radio"
                                    className="input-radio"
                                    name="cancelPurchase"
                                    value="cancel_purchase"
                                    checked={reason === 'cancel_purchase'}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                <span className="ms-2 fs-4 my-2">Đổi ý, không muốn mua nữa.</span>
                            </label>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn-cancel-order" onClick={() => {

                        }}>Hủy</button>
                        <button className="btn-confirm-cancel" onClick={handleConfirmCancelOrder}>Xác nhận</button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    )
}

export default OrderCard
