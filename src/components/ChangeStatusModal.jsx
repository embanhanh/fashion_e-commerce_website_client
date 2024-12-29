import Modal from 'react-bootstrap/Modal'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { updateOrderStatusManyAction } from '../redux/slices/orderSilce'

export default function ChangeStatusModal({ show, onHide, originalStatus, orderId, setShowNotifyModal }) {
    const dispatch = useDispatch()
    const [status, setStatus] = useState(originalStatus)
    const [isPrinted, setIsPrinted] = useState(false)

    const handleSubmit = async () => {
        try {
            await dispatch(updateOrderStatusManyAction({ orderIds: [orderId], status }))
            // setShowNotifyModal({
            //     show: true,
            //     description: 'Cập nhật trạng thái đơn hàng thành công',
            //     title: 'Thành công',
            //     type: 'success',
            // })
            Swal.fire({
                title: 'Thành công',
                text: 'Cập nhật trạng thái đơn hàng thành công',
                icon: 'success',
                confirmButtonText: 'OK',
            })
        } catch (error) {
            // setShowNotifyModal({ show: true, description: error.message, title: 'Thất bại', type: 'error' })
            Swal.fire({
                title: 'Thất bại',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK',
            })
        } finally {
            onHide()
        }
    }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Xử lý trạng thái đơn hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex  justify-content-center gap-3">
                    <div className="d-flex align-items-center">
                        <div className="checkbox-cell">
                            <label className="d-flex align-items-center">
                                <input
                                    type="checkbox"
                                    className="input-checkbox"
                                    value={'processing'}
                                    checked={status === 'processing'}
                                    onChange={(e) => setStatus(e.target.value)}
                                />
                                <span className="custom-checkbox"></span>
                            </label>
                        </div>
                        <p className="fs-4 fw-medium ms-2">Xác nhận đơn hàng</p>
                    </div>
                    <div className="d-flex align-items-center">
                        <div className="checkbox-cell">
                            <label className="d-flex align-items-center">
                                <input
                                    type="checkbox"
                                    className="input-checkbox"
                                    value={'delivering'}
                                    checked={status === 'delivering'}
                                    onChange={(e) => setStatus(e.target.value)}
                                />
                                <span className="custom-checkbox"></span>
                            </label>
                        </div>
                        <p className="fs-4 fw-medium ms-2">Xác nhận giao hàng</p>
                    </div>
                    <div className="d-flex align-items-center">
                        <div className="checkbox-cell">
                            <label className="d-flex align-items-center">
                                <input
                                    type="checkbox"
                                    className="input-checkbox"
                                    value={'delivered'}
                                    checked={status === 'delivered'}
                                    onChange={(e) => setStatus(e.target.value)}
                                />
                                <span className="custom-checkbox"></span>
                            </label>
                        </div>
                        <p className="fs-4 fw-medium ms-2">Đã giao hàng</p>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="x-4 py-2 px-3  border" variant="secondary" onClick={onHide}>
                    <p className="fs-3">Đóng</p>
                </div>
                <button
                    disabled={status === originalStatus || status === ''}
                    className="primary-btn rounded-0 px-4 py-2 shadow-none"
                    onClick={handleSubmit}
                >
                    <p>Xác nhận</p>
                </button>
            </Modal.Footer>
        </Modal>
    )
}
