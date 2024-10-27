import Modal from 'react-bootstrap/Modal'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateOrderStatusManyAction } from '../redux/slices/orderSilce'

export default function ChangeStatusModal({ show, onHide, originalStatus, orderId, setShowNotifyModal }) {
    const dispatch = useDispatch()
    const [status, setStatus] = useState(originalStatus)
    const [isPrinted, setIsPrinted] = useState(false)

    const handleSubmit = async () => {
        try {
            await dispatch(updateOrderStatusManyAction({ orderIds: [orderId], status }))
            setShowNotifyModal({ show: true, description: 'Cập nhật trạng thái đơn hàng thành công', title: 'Thành công', type: 'success' })
        } catch (error) {
            setShowNotifyModal({ show: true, description: error.message, title: 'Thất bại', type: 'error' })
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
                <div className="d-flex  justify-content-center">
                    <div className="d-flex align-items-center">
                        <div className="checkbox-cell">
                            <label className="d-flex align-items-center">
                                <input type="checkbox" className="input-checkbox" value={'processing'} checked={status === 'processing'} onChange={(e) => setStatus(e.target.value)} />
                                <span className="custom-checkbox"></span>
                            </label>
                        </div>
                        <p className="fs-4 fw-medium ms-2">Xác nhận đơn hàng</p>
                    </div>
                    <div className="d-flex align-items-center ms-3">
                        <div className="checkbox-cell">
                            <label className="d-flex align-items-center">
                                <input type="checkbox" className="input-checkbox" value={'delivering'} checked={status === 'delivering'} onChange={(e) => setStatus(e.target.value)} />
                                <span className="custom-checkbox"></span>
                            </label>
                        </div>
                        <p className="fs-4 fw-medium ms-2">Xác nhận giao hàng</p>
                    </div>
                </div>
                <div className="d-flex align-items-center mt-3">
                    <div className="checkbox-cell">
                        <label className="d-flex align-items-center">
                            <input type="checkbox" className="input-checkbox" checked={isPrinted} onChange={(e) => setIsPrinted(e.target.checked)} />
                            <span className="custom-checkbox"></span>
                        </label>
                    </div>
                    <p className="fs-4 fw-medium ms-2">In phiếu</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="x-4 py-2 px-3  border" variant="secondary" onClick={onHide}>
                    <p className="fs-3">Đóng</p>
                </div>
                <button disabled={status === originalStatus} className="primary-btn rounded-0 px-4 py-2 shadow-none" onClick={handleSubmit}>
                    <p>Xác nhận</p>
                </button>
            </Modal.Footer>
        </Modal>
    )
}
