import Modal from 'react-bootstrap/Modal'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderByIdAction } from '../redux/slices/orderSilce'

export default function DetailModal({ show, onHide, orderId }) {
    const dispatch = useDispatch()
    const { currentOrder } = useSelector((state) => state.order)

    useEffect(() => {
        dispatch(getOrderByIdAction(orderId))
    }, [orderId])

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <p className="fs-2 fw-bold">Chi tiết đơn hàng</p>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-between">
                    <div className="col-8 pe-4">
                        <div className="d-flex justify-content-between align-items-center shadow-none p-3 mb-3 bg-light rounded border">
                            <div className="text-start">
                                <span className="fs-3 fw-semibold">
                                    Đơn hàng:{' '}
                                    <span className="text-primary fs-4 fw-normal text-nowrap">{currentOrder?._id}</span>
                                </span>
                                <div className="fs-5">
                                    <span className="me-2">
                                        {new Date(currentOrder?.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                    <span className="ms-2">
                                        {new Date(currentOrder?.createdAt).toLocaleTimeString('vi-VN')}
                                    </span>
                                </div>
                            </div>
                            <div className="text-center">
                                <p
                                    className={`text-center ${
                                        currentOrder?.status === 'cancelled'
                                            ? 'text-danger'
                                            : currentOrder?.status === 'delivered'
                                            ? 'text-success'
                                            : 'text-warning'
                                    } text-uppercase fs-4`}
                                >
                                    {currentOrder?.status === 'pending'
                                        ? 'Chờ xác nhận'
                                        : currentOrder?.status === 'processing'
                                        ? 'Đang xử lý'
                                        : currentOrder?.status === 'delivering'
                                        ? 'Đang giao'
                                        : currentOrder?.status === 'delivered'
                                        ? 'Đã giao'
                                        : currentOrder?.status === 'returned'
                                        ? 'Yêu cầu trả hàng'
                                        : 'Đã hủy'}
                                </p>
                                {currentOrder?.status === 'returned' && (
                                    <p
                                        className={`text-center ${
                                            currentOrder?.statusReason === 'pending'
                                                ? 'text-warning'
                                                : currentOrder?.statusReason === 'approved'
                                                ? 'text-success'
                                                : 'text-danger'
                                        } text-uppercase fs-4`}
                                    >
                                        {currentOrder?.statusReason === 'pending'
                                            ? 'Chờ xác nhận'
                                            : currentOrder?.statusReason === 'approved'
                                            ? 'Đã xác nhận'
                                            : 'Đã từ chối'}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="d-flex">
                            <div
                                className="shadow-none p-3 mb-3 bg-white rounded border me-4"
                                style={{ minWidth: '200px' }}
                            >
                                <p className="fs-4 fw-semibold bg-light info-title">KHÁCH HÀNG</p>
                                <p className="fs-5 fw-normal text-nowrap my-2">{currentOrder?.user?.name}</p>
                                <p className="fs-5 fw-normal">{currentOrder?.user?.phone}</p>
                            </div>
                            <div className="shadow-none p-3 mb-3 bg-white rounded border" style={{ flexGrow: 1 }}>
                                <p className="fs-4 fw-semibold bg-light info-title">NGƯỜI NHẬN</p>
                                <p className="fs-5 fw-normal text-nowrap my-2">{currentOrder?.user?.name}</p>
                                <p className="fs-5 fw-normal">{currentOrder?.user?.phone}</p>
                                <p className="fs-5 fw-normal">{currentOrder?.shippingAddress?.location}</p>
                            </div>
                        </div>

                        <div className="d-flex py-3 border-bottom">
                            <div className="fs-4 fw-medium text-center" style={{ width: '5%' }}>
                                STT
                            </div>
                            <div className="fs-4 fw-medium text-start ms-3" style={{ width: '40%' }}>
                                Tên sản phẩm
                            </div>
                            <div className="fs-4 fw-medium text-center" style={{ width: '20%' }}>
                                Giá
                            </div>
                            <div className="fs-4 fw-medium text-center" style={{ width: '15%' }}>
                                Số lượng
                            </div>
                            <div className="fs-4 fw-medium text-center" style={{ width: '20%' }}>
                                Tổng tiền
                            </div>
                        </div>

                        <div className="overflow-y-auto" style={{ maxHeight: '150px' }}>
                            {currentOrder?.products?.map((product, index) => (
                                <div key={index} className="d-flex align-items-center py-2 border-bottom">
                                    <div className="text-center" style={{ width: '5%' }}>
                                        {index + 1}
                                    </div>
                                    <div className="text-start" style={{ width: '40%' }}>
                                        <div className="ms-3 d-flex align-items-center">
                                            <img
                                                src={product.product?.imageUrl}
                                                alt=""
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            />
                                            <p
                                                className="fs-5 fw-medium overflow-hidden d-flex aglin-items-center ms-2"
                                                style={{ maxWidth: '100%' }}
                                            >
                                                {product.product?.product?.name}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-center fs-5 d-flex flex-column" style={{ width: '20%' }}>
                                        <span>{product?.product?.price.toLocaleString('vi-VN')}đ</span>
                                        {product?.product?.product?.originalPrice && (
                                            <span
                                                style={{
                                                    textDecoration: 'line-through',
                                                    color: 'gray',
                                                    fontSize: '0.9em',
                                                    marginLeft: '5px',
                                                }}
                                            >
                                                {product?.product?.product?.originalPrice?.toLocaleString('vi-VN')}đ
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-center fs-5" style={{ width: '15%' }}>
                                        {product.quantity}
                                    </div>

                                    <div className="text-center fs-5" style={{ width: '20%' }}>
                                        <span>
                                            {(product?.product?.price * product?.quantity).toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {currentOrder?.reason && currentOrder?.status === 'returned' && (
                            <div className="d-flex justify-content-between align-items-center mt-5">
                                <p className="fs-4 fw-semibold">Lý do trả hàng:</p>
                                <span className="fs-3 fw-normal ms-2">
                                    {currentOrder?.reason === 'product_defective'
                                        ? 'Hàng lỗi.'
                                        : currentOrder?.reason === 'product_not_match_description'
                                        ? 'Sản phẩm không khớp với mô tả.'
                                        : currentOrder?.reason === 'product_not_match'
                                        ? 'Hàng không đúng màu, kích cỡ, phân loại hàng.'
                                        : currentOrder?.reason === 'product_used'
                                        ? 'Hàng đã qua sử dụng.'
                                        : currentOrder?.reason === 'product_fake'
                                        ? 'Hàng giả, nhái.'
                                        : currentOrder?.reason === 'product_not_use'
                                        ? 'Hàng nguyên vẹn nhưng không còn nhu cầu sử dụng.'
                                        : 'Không có lý do'}
                                </span>
                            </div>
                        )}
                        {currentOrder?.reason && currentOrder?.status === 'cancelled' && (
                            <div className="d-flex justify-content-between align-items-center mt-5">
                                <p className="fs-4 fw-semibold">Lý do hủy:</p>
                                <p className="fs-4 fw-normal">
                                    {currentOrder?.reason === 'change_address'
                                        ? 'Muốn thay đổi địa chỉ giao hàng.'
                                        : currentOrder?.reason === 'change_voucher'
                                        ? 'Muốn nhập/thay đổi voucher.'
                                        : currentOrder?.reason === 'change_product'
                                        ? 'Muốn thay đổi sản phẩm(số lượng, màu sắc, phân loại hàng,...).'
                                        : currentOrder?.reason === 'find_cheaper'
                                        ? 'Tìm thấy giá rẻ ở chỗ khác.'
                                        : currentOrder?.reason === 'cancel_purchase'
                                        ? 'Đổi ý, không muốn mua nữa.'
                                        : 'Không có lý do'}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="col-4">
                        <div className="shadow-none p-3 mb-3 bg-white rounded border " style={{ minWidth: '200px' }}>
                            <p className="fs-4 fw-semibold bg-light info-title text-uppercase">Thông tin khác</p>
                            <div className="d-flex justify-content-between mt-3">
                                <p className="fs-5 fw-normal">
                                    {currentOrder?.paymentMethod === 'paymentUponReceipt'
                                        ? 'Thanh toán khi nhận hàng:'
                                        : 'Thanh toán chuyển khoản:'}
                                </p>
                                <p className="fs-5 fw-normal">{currentOrder?.totalPrice.toLocaleString('vi-VN')} đ</p>
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                                <p className="fs-5 fw-normal">Phương thức vận chuyển:</p>
                                <p className="fs-5 fw-normal">
                                    {currentOrder?.shippingMethod === 'basic'
                                        ? 'Cơ bản'
                                        : currentOrder?.shippingMethod === 'fast'
                                        ? 'Nhanh'
                                        : 'Hỏa tốc'}
                                </p>
                            </div>
                        </div>
                        <div
                            className="shadow-none p-3 mb-3 bg-white rounded border d-flex flex-column"
                            style={{ minWidth: '200px', minHeight: '250px' }}
                        >
                            {/* Phần trên */}
                            <div>
                                <div className="d-flex justify-content-between">
                                    <p className="fs-5 fw-normal">Tạm tính</p>
                                    <p className="fs-5 fw-normal">
                                        {currentOrder?.productsPrice.toLocaleString('vi-VN')} đ
                                    </p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="fs-5 fw-normal">Khuyến mãi</p>
                                    <p className="fs-5 fw-normal">
                                        {currentOrder?.products
                                            .reduce((total, item) => total + (item.product.product.discount || 0), 0)
                                            .toLocaleString('vi-VN')}
                                        đ
                                    </p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="fs-5 fw-normal">Phí vận chuyển</p>
                                    <p className="fs-5 fw-normal">
                                        {currentOrder?.shippingPrice.toLocaleString('vi-VN')}đ
                                    </p>
                                </div>
                            </div>

                            {/* Phần tổng tiền */}
                            <div className="mt-auto">
                                <div className="d-flex justify-content-between">
                                    <p className="fs-3 fw-normal">Tổng tiền</p>
                                    <p className="fs-4 fw-normal text-center">
                                        {currentOrder?.totalPrice.toLocaleString('vi-VN')}đ
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div
                    className="primary-btn px-4 py-2 shadow-none light border rounded-3"
                    variant="secondary"
                    onClick={onHide}
                >
                    <p>Đóng</p>
                </div>
            </Modal.Footer>
        </Modal>
    )
}
