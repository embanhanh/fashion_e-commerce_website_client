import Modal from 'react-bootstrap/Modal'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderByIdAction, confirmReturnOrderAction } from '../redux/slices/orderSilce'
import Swal from 'sweetalert2'

export default function ReturnModal({ show, onHide, orderId }) {
    const dispatch = useDispatch()
    const { currentOrder } = useSelector((state) => state.order)
    const [reasonStatus, setReasonStatus] = useState('')
    const [isOptionsVisible, setIsOptionsVisible] = useState(false)

    useEffect(() => {
        dispatch(getOrderByIdAction(orderId))
    }, [orderId])

    useEffect(() => {
        setReasonStatus(currentOrder?.statusReason)
    }, [currentOrder])

    const handleSelectClick = () => {
        setIsOptionsVisible(!isOptionsVisible)
    }

    const handleOptionSelect = (value) => {
        setReasonStatus(value)
        setIsOptionsVisible(false)
    }

    const handleConfirmReturn = (reasonStatus) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xác nhận trả hàng?',
            text: 'Bạn sẽ không thể hoàn tác sau khi đã xác nhận',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(confirmReturnOrderAction({ orderId, reasonStatus }))
                Swal.fire({
                    title: 'Xác nhận trả hàng thành công',
                    icon: 'success',
                    text: 'Đơn hàng đã được xác nhận trả hàng',
                }).then(() => {
                    onHide()
                })
            }
        })
    }

    useEffect(() => {
        console.log(currentOrder)
    }, [currentOrder])

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <p className="fs-2 fw-bold">Chi tiết đơn hàng yêu cầu trả hàng</p>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column gap-3 justify-content-start" style={{ minHeight: '400px' }}>
                    <div className="">
                        <p className="fs-3 fw-semibold">Mã đơn hàng: {currentOrder?._id}</p>
                        <div className="d-flex gap-2 justify-content-between">
                            <p className="fs-3 fw-semibold">Thời gian đặt hàng:</p>
                            <p className="fs-3 fw-normal ms-2">
                                {new Date(currentOrder?.createdAt).toLocaleTimeString('vi-VN')}{' '}
                                {new Date(currentOrder?.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                        </div>

                        <div className="d-flex gap-2 justify-content-between">
                            <p className="fs-3 fw-semibold">Thời gian nhận hàng:</p>
                            <p className="fs-3 fw-normal ms-2">
                                {new Date(currentOrder?.deliveredAt).toLocaleTimeString('vi-VN')}{' '}
                                {new Date(currentOrder?.deliveredAt).toLocaleDateString('vi-VN')}
                            </p>
                        </div>

                        <div className="d-flex gap-2 justify-content-between">
                            <p className="fs-3 fw-semibold">Thời gian yêu cầu trả hàng:</p>
                            <p className="fs-3 fw-normal ms-2">
                                {new Date(currentOrder?.reasonAt).toLocaleTimeString('vi-VN')}{' '}
                                {new Date(currentOrder?.reasonAt).toLocaleDateString('vi-VN')}
                            </p>
                        </div>

                        <p className="fs-4 fw-semibold">
                            Lý do trả hàng:
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
                        </p>
                    </div>
                    <div className="d-flex justify-content-start gap-3" style={{ maxHeight: '150px' }}>
                        <p className="fs-4 fw-semibold d-flex align-items-center">Minh chứng:</p>
                        {currentOrder?.evidences?.map((image, index) => (
                            <img
                                src={image}
                                alt="Ảnh lỗi"
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                key={index}
                            />
                        ))}
                    </div>

                    <div className="d-flex">
                        <p className="fs-3 fw-semibold">Trạng thái: </p>
                        <div className="d-flex align-items-center ms-2">
                            <div className={`select ${isOptionsVisible ? 'active' : ''}`}>
                                <div
                                    className="selected"
                                    onClick={handleSelectClick}
                                    data-default="Đang xử lí"
                                    data-one="Đồng ý"
                                    data-two="Không đồng ý"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="1em"
                                        viewBox="0 0 512 512"
                                        className="arrow"
                                    >
                                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                    </svg>
                                </div>
                                <div className="options">
                                    <div title="all" onClick={() => handleOptionSelect('pending')}>
                                        <input
                                            id="all-v2"
                                            name="option-v2"
                                            type="radio"
                                            checked={reasonStatus === 'pending'}
                                            value="pending"
                                            readOnly
                                        />
                                        <label className="option" htmlFor="all-v2" data-txt="Đang xử lí" />
                                    </div>
                                    <div title="option-1" onClick={() => handleOptionSelect('approved')}>
                                        <input
                                            id="option-1-v2"
                                            name="option-v2"
                                            type="radio"
                                            checked={reasonStatus === 'approved'}
                                            value="approved"
                                            readOnly
                                        />
                                        <label className="option" htmlFor="option-1-v2" data-txt="Đồng ý" />
                                    </div>
                                    <div title="option-2" onClick={() => handleOptionSelect('rejected')}>
                                        <input
                                            id="option-2-v2"
                                            name="option-v2"
                                            type="radio"
                                            checked={reasonStatus === 'rejected'}
                                            value="rejected"
                                            readOnly
                                        />
                                        <label className="option" htmlFor="option-2-v2" data-txt="Không đồng ý" />
                                    </div>
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
                <div
                    className="primary-btn px-4 py-2 shadow-none light border rounded-3"
                    onClick={() => handleConfirmReturn(reasonStatus)}
                >
                    <p>Đồng ý</p>
                </div>
            </Modal.Footer>
        </Modal>
    )
}
